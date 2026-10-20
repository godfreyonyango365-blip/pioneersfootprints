import { createQuote } from '@/lib/donations/quotes';
import { json, jsonBody, rateLimit, safeRoute } from '@/lib/donations/http';
export const runtime = 'nodejs';
export async function POST(request: Request) { return safeRoute(async () => { await rateLimit(request,'quote',60); const body = await jsonBody(request); return json(await createQuote(body.amount,body.currency)); }); }
