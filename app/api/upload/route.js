import { Buffer } from "node:buffer";
import { v2 as cloudinary } from "cloudinary";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const cloudinaryCloudName =
  process.env.CLOUDINARY_CLOUD_NAME ||
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
  process.env.CLOUDINARY_NAME;

cloudinary.config({
  cloud_name: cloudinaryCloudName,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_SECRET,
});

function jsonError(message, status = 400) {
  return Response.json({ error: message }, { status });
}

function isUploadFile(value) {
  return (
    value &&
    typeof value === "object" &&
    typeof value.arrayBuffer === "function" &&
    typeof value.name === "string" &&
    typeof value.size === "number"
  );
}

function uploadBuffer(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        folder: "footprints",
        ...options,
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Cloudinary upload failed"));
          return;
        }

        resolve(result);
      }
    );

    stream.on("error", reject);
    stream.end(buffer);
  });
}

export async function POST(req) {
  try {
    if (
      !cloudinaryCloudName ||
      !process.env.CLOUDINARY_API_KEY ||
      !(process.env.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_SECRET)
    ) {
      return jsonError("Cloudinary server credentials are not configured", 500);
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!isUploadFile(file)) {
      return jsonError('Missing upload file. Send it as FormData key "file".');
    }

    if (file.size === 0) {
      return jsonError("Uploaded file is empty");
    }

    if (file.size > MAX_FILE_SIZE) {
      return jsonError("File must be 10MB or smaller", 413);
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await uploadBuffer(buffer, {
      filename_override: file.name,
      use_filename: true,
      unique_filename: true,
    });

    return Response.json({
      secure_url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error("Upload failed:", error);

    return jsonError("Upload failed. Please try again.", 500);
  }
}
