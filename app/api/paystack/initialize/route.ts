import { initializeDonation } from '@/lib/donations/payments';
import { json, jsonBody, rateLimit, safeRoute } from '@/lib/donations/http';
export const runtime = 'nodejs';
export async function POST(request: Request) { return safeRoute(async () => { await rateLimit(request,'initialize',10); return json(await initializeDonation(await jsonBody(request)),201); }); }
