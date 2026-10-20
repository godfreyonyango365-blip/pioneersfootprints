export async function readDonationResponse<T extends Record<string, unknown>>(
  response: Response,
  fallback: string,
): Promise<T> {
  const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";

  if (!contentType.includes("application/json")) {
    throw new Error(fallback);
  }

  let data: Record<string, unknown>;
  try {
    data = await response.json();
  } catch {
    throw new Error(fallback);
  }

  if (!response.ok) {
    throw new Error(typeof data.error === "string" ? data.error : fallback);
  }

  return data as T;
}
