import { requireDonationAdmin } from "@/lib/donations/admin";
import { json, safeRoute } from "@/lib/donations/http";

export const runtime = "nodejs";

export async function GET(request: Request) {
  return safeRoute(async () => {
    const uid = await requireDonationAdmin(request);
    return json({ authorized: true, uid });
  });
}
