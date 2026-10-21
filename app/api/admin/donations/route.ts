import { AggregateField } from "firebase-admin/firestore";

import {
  donationDb,
  HttpError,
  requireDonationAdmin,
  withDonationDatabaseTimeout,
} from "@/lib/donations/admin";
import { json, jsonBody, rateLimit, safeRoute } from "@/lib/donations/http";
import { reconcileDonation, validReference } from "@/lib/donations/payments";

export const runtime = "nodejs";

const PAGE_SIZE = 25;

function isoDate(value: unknown) {
  if (!value || typeof value !== "object" || !("toDate" in value)) return null;
  const date = (value as { toDate: () => Date }).toDate();
  return Number.isFinite(date.getTime()) ? date.toISOString() : null;
}

export async function GET(request: Request) {
  return safeRoute(async () => {
    await requireDonationAdmin(request);

    const db = donationDb();
    const donationsRef = db.collection("donations");
    const cursor = new URL(request.url).searchParams.get("cursor");
    let query = donationsRef.orderBy("initializedAt", "desc").limit(PAGE_SIZE);

    if (cursor) {
      if (!validReference(cursor)) throw new HttpError(400, "Invalid page cursor.");
      const cursorDocument = await withDonationDatabaseTimeout(
        donationsRef.doc(cursor).get(),
      );
      if (!cursorDocument.exists) {
        throw new HttpError(400, "This page is no longer available. Refresh the list.");
      }
      query = query.startAfter(cursorDocument);
    }

    const successful = donationsRef.where("status", "==", "success");
    const pending = donationsRef.where("status", "==", "pending");
    const failed = donationsRef.where("status", "==", "failed");

    const [page, successfulSummary, pendingSummary, failedSummary, allSummary] =
      await withDonationDatabaseTimeout(
        Promise.all([
          query.get(),
          successful
            .aggregate({
              amount: AggregateField.sum("amountSubunit"),
              count: AggregateField.count(),
            })
            .get(),
          pending.count().get(),
          failed.count().get(),
          donationsRef.count().get(),
        ]),
      );

    const donations = page.docs.map((document) => {
      const donation = document.data();
      return {
        reference: document.id,
        status: donation.status,
        donorEmail: donation.donorEmail,
        donorName: donation.donorName,
        purpose: donation.purpose,
        amountSubunit: donation.amountSubunit,
        currency: donation.currency,
        donorInputAmountSubunit: donation.donorInputAmountSubunit ?? null,
        donorInputCurrency: donation.donorInputCurrency ?? null,
        channel: donation.channel ?? null,
        reason: donation.reason,
        initializedAt: isoDate(donation.initializedAt),
        paidAt: isoDate(donation.paidAt),
        updatedAt: isoDate(donation.updatedAt),
      };
    });

    const success = successfulSummary.data();
    return json({
      donations,
      nextCursor:
        page.size === PAGE_SIZE ? page.docs[page.docs.length - 1].id : null,
      summary: {
        totalSubunit: Number(success.amount) || 0,
        successfulCount: Number(success.count) || 0,
        pendingCount: Number(pendingSummary.data().count) || 0,
        failedCount: Number(failedSummary.data().count) || 0,
        totalCount: Number(allSummary.data().count) || 0,
      },
    });
  });
}

export async function POST(request: Request) {
  return safeRoute(async () => {
    await requireDonationAdmin(request);
    await rateLimit(request, "admin-reconcile", 30);
    const body = await jsonBody(request);
    return json(await reconcileDonation(body.reference));
  });
}
