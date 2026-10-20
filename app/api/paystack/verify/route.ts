import { reconcileDonation } from '@/lib/donations/payments';
import { json, jsonBody, rateLimit, safeRoute } from '@/lib/donations/http';
export const runtime = 'nodejs';
export async function POST(request: Request) { return safeRoute(async () => { await rateLimit(request,'verify',20); const body = await jsonBody(request); return json(await reconcileDonation(body.reference)); }); }
