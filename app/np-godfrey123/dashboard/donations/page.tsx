"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Banknote,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Copy,
  ExternalLink,
  HeartHandshake,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "@/lib/firebase";
import { readDonationResponse } from "@/lib/donations/client";
import { formatDonationAmount } from "@/lib/donations/config";

type DonationStatus = "success" | "pending" | "failed";

type Donation = {
  reference: string;
  status: DonationStatus;
  donorEmail: string;
  donorName: string;
  purpose: string;
  amountSubunit: number;
  currency: "KES";
  donorInputAmountSubunit: number | null;
  donorInputCurrency: "KES" | "USD" | null;
  channel: string | null;
  reason: string;
  initializedAt: string | null;
  paidAt: string | null;
  updatedAt: string | null;
};

type DonationPage = {
  donations: Donation[];
  nextCursor: string | null;
  summary: {
    totalSubunit: number;
    successfulCount: number;
    pendingCount: number;
    failedCount: number;
    totalCount: number;
  };
};

const statusDetails = {
  success: {
    label: "Successful",
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
  },
  pending: {
    label: "Pending",
    badge: "border-amber-200 bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
  },
  failed: {
    label: "Failed",
    badge: "border-rose-200 bg-rose-50 text-rose-700",
    dot: "bg-rose-500",
  },
} satisfies Record<DonationStatus, { label: string; badge: string; dot: string }>;

function formatDate(value: string | null) {
  if (!value) return "Not available";
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "Not available";
  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Nairobi",
  }).format(date);
}

function safeAmount(amount: number) {
  try {
    return formatDonationAmount(amount, "KES");
  } catch {
    return "Amount unavailable";
  }
}

function StatusBadge({ status }: { status: DonationStatus }) {
  const details = statusDetails[status] ?? statusDetails.pending;
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${details.badge}`}
    >
      <span className={`size-1.5 rounded-full ${details.dot}`} />
      {details.label}
    </span>
  );
}

export default function AdminDonationsPage() {
  const [data, setData] = useState<DonationPage | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [history, setHistory] = useState<Array<string | null>>([]);
  const [reload, setReload] = useState(0);
  const [reference, setReference] = useState("");
  const [reconciling, setReconciling] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | DonationStatus>("all");
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(
    () =>
      onAuthStateChanged(auth, (user) => {
        setSignedIn(Boolean(user));
        if (!user) setLoading(false);
      }),
    [],
  );

  useEffect(() => {
    if (!signedIn) return;
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError("");
      try {
        const token = await auth.currentUser?.getIdToken();
        if (!token) throw new Error("Please sign in again.");
        const search = cursor ? `?cursor=${encodeURIComponent(cursor)}` : "";
        const response = await fetch(`/api/admin/donations${search}`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
          signal: controller.signal,
        });
        const result = await readDonationResponse<DonationPage>(
          response,
          "Unable to load donation records.",
        );
        if (!controller.signal.aborted) setData(result);
      } catch (loadError) {
        if (!controller.signal.aborted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load donation records.",
          );
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void load();
    return () => controller.abort();
  }, [signedIn, cursor, reload]);

  const filteredDonations = useMemo(() => {
    if (!data) return [];
    const search = query.trim().toLocaleLowerCase();
    return data.donations.filter((donation) => {
      if (status !== "all" && donation.status !== status) return false;
      if (!search) return true;
      return [
        donation.donorName,
        donation.donorEmail,
        donation.reference,
        donation.purpose,
      ].some((value) => value?.toLocaleLowerCase().includes(search));
    });
  }, [data, query, status]);

  async function reconcile(donationReference: string) {
    setReconciling(donationReference);
    setError("");
    setNotice("");
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error("Please sign in again.");
      const response = await fetch("/api/admin/donations", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reference: donationReference.trim() }),
      });
      const result = await readDonationResponse<{ status: DonationStatus }>(
        response,
        "Unable to verify this donation.",
      );
      setReference("");
      setNotice(
        `Payment ${donationReference} is ${statusDetails[result.status].label.toLowerCase()}.`,
      );
      setReload((value) => value + 1);
    } catch (reconcileError) {
      setError(
        reconcileError instanceof Error
          ? reconcileError.message
          : "Unable to verify this donation.",
      );
    } finally {
      setReconciling(null);
    }
  }

  async function copyReference(donationReference: string) {
    try {
      await navigator.clipboard.writeText(donationReference);
      setCopied(donationReference);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      setError("The reference could not be copied. Select and copy it manually.");
    }
  }

  function goToNextPage() {
    if (!data?.nextCursor) return;
    setHistory((current) => [...current, cursor]);
    setCursor(data.nextCursor);
    setQuery("");
    setStatus("all");
  }

  function goToPreviousPage() {
    if (history.length === 0) return;
    setCursor(history[history.length - 1]);
    setHistory((current) => current.slice(0, -1));
    setQuery("");
    setStatus("all");
  }

  const summary = data?.summary;
  const cards = [
    {
      label: "Verified donations",
      value: safeAmount(summary?.totalSubunit ?? 0),
      detail: "Successfully received",
      icon: Banknote,
      color: "bg-blue-50 text-blue-700",
    },
    {
      label: "Successful",
      value: String(summary?.successfulCount ?? 0),
      detail: "Independently verified",
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Pending",
      value: String(summary?.pendingCount ?? 0),
      detail: "Awaiting confirmation",
      icon: Clock3,
      color: "bg-amber-50 text-amber-700",
    },
    {
      label: "Failed",
      value: String(summary?.failedCount ?? 0),
      detail: `${summary?.totalCount ?? 0} total records`,
      icon: XCircle,
      color: "bg-rose-50 text-rose-700",
    },
  ];

  return (
    <section className="mx-auto min-w-0 max-w-7xl space-y-7 text-slate-950">
      <header className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#07152e] via-[#0d2f68] to-[#0b5d67] p-6 text-white shadow-lg sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-sm text-blue-100">
              <HeartHandshake className="size-4" />
              Ministry support
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Donation management
            </h1>
            <p className="mt-3 max-w-xl leading-7 text-blue-100">
              Monitor payment outcomes, confirm transactions directly with Paystack,
              and keep an auditable view of every donation attempt.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setReload((value) => value + 1)}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold transition hover:bg-white/20 disabled:opacity-50"
            >
              <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <Link
              href="/donate"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-blue-950 transition hover:bg-blue-50"
            >
              View donation page
              <ExternalLink className="size-4" />
            </Link>
          </div>
        </div>
        <div className="mt-7 flex items-center gap-2 border-t border-white/15 pt-5 text-sm text-blue-100">
          <ShieldCheck className="size-5 text-emerald-300" />
          Only server-verified successful payments are included in the received total.
        </div>
      </header>

      {!signedIn && !loading && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900">
          Your session has ended. <Link className="font-semibold underline" href="/np-godfrey123/login">Sign in again</Link>.
        </div>
      )}

      <div aria-live="polite" className="space-y-3">
        {error && (
          <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-800">
            {error}
          </div>
        )}
        {notice && (
          <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
            <CheckCircle2 className="size-5 shrink-0" />
            {notice}
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-busy={loading}>
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <article key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">{card.label}</p>
                  <p className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
                    {loading && !data ? "—" : card.value}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{card.detail}</p>
                </div>
                <span className={`rounded-xl p-3 ${card.color}`}><Icon className="size-5" /></span>
              </div>
            </article>
          );
        })}
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold">Verify a payment reference</h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Use this after a delayed callback, provider outage, or missing webhook.
            </p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            Checks Paystack directly
          </span>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void reconcile(reference);
          }}
          className="mt-5 flex min-w-0 flex-col gap-3 sm:flex-row"
        >
          <label className="min-w-0 flex-1">
            <span className="sr-only">Payment reference</span>
            <input
              value={reference}
              onChange={(event) => setReference(event.target.value)}
              maxLength={100}
              required
              placeholder="pff-don-…"
              className="block w-full min-w-0 rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <button
            disabled={Boolean(reconciling)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-800 px-5 py-3 font-semibold text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RotateCcw className={`size-4 ${reconciling === reference ? "animate-spin" : ""}`} />
            Verify reference
          </button>
        </form>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5 sm:p-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">Donation records</h2>
              <p className="mt-1 text-sm text-slate-500">
                Newest first · page {history.length + 1} · {data?.donations.length ?? 0} records on this page
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <label className="relative min-w-0 sm:w-72">
                <span className="sr-only">Search this page</span>
                <Search className="pointer-events-none absolute left-3 top-3.5 size-4 text-slate-400" />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search this page"
                  className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </label>
              <label>
                <span className="sr-only">Filter by status</span>
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value as "all" | DonationStatus)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="all">All statuses</option>
                  <option value="success">Successful</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </label>
            </div>
          </div>
        </div>

        {loading && !data ? (
          <div role="status" className="flex items-center justify-center gap-3 p-14 text-slate-600">
            <RefreshCw className="size-5 animate-spin text-blue-700" />
            Loading donation records…
          </div>
        ) : filteredDonations.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <HeartHandshake className="mx-auto size-10 text-slate-300" />
            <h3 className="mt-4 font-semibold">No matching donations</h3>
            <p className="mt-1 text-sm text-slate-500">
              {data?.donations.length ? "Try a different search or status." : "Donation attempts will appear here."}
            </p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[960px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Donor</th>
                    <th className="px-6 py-4 font-semibold">Amount</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Date</th>
                    <th className="px-6 py-4 font-semibold">Reference</th>
                    <th className="px-6 py-4 text-right font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDonations.map((donation) => (
                    <tr key={donation.reference} className="align-top transition hover:bg-slate-50/70">
                      <td className="px-6 py-5">
                        <p className="font-semibold text-slate-900">{donation.donorName || "Anonymous"}</p>
                        <p className="mt-1 max-w-52 truncate text-xs text-slate-500" title={donation.donorEmail}>{donation.donorEmail}</p>
                        <p className="mt-2 max-w-52 truncate text-xs text-slate-600" title={donation.purpose}>{donation.purpose}</p>
                      </td>
                      <td className="px-6 py-5">
                        <p className="font-semibold">{safeAmount(donation.amountSubunit)}</p>
                        {donation.donorInputCurrency === "USD" && donation.donorInputAmountSubunit !== null && (
                          <p className="mt-1 text-xs text-slate-500">Donor entered {formatDonationAmount(donation.donorInputAmountSubunit, "USD")}</p>
                        )}
                        {donation.channel && <p className="mt-1 capitalize text-xs text-slate-500">{donation.channel}</p>}
                      </td>
                      <td className="px-6 py-5">
                        <StatusBadge status={donation.status} />
                        <p className="mt-2 max-w-48 text-xs leading-5 text-slate-500">{donation.reason}</p>
                      </td>
                      <td className="whitespace-nowrap px-6 py-5 text-slate-600">
                        {formatDate(donation.paidAt ?? donation.initializedAt)}
                      </td>
                      <td className="px-6 py-5">
                        <button
                          type="button"
                          onClick={() => void copyReference(donation.reference)}
                          className="inline-flex max-w-48 items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 font-mono text-xs text-slate-700 hover:bg-slate-200"
                          title={donation.reference}
                        >
                          <span className="truncate">{donation.reference}</span>
                          {copied === donation.reference ? <Check className="size-3.5 shrink-0 text-emerald-600" /> : <Copy className="size-3.5 shrink-0" />}
                        </button>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button
                          type="button"
                          disabled={Boolean(reconciling)}
                          onClick={() => void reconcile(donation.reference)}
                          className="inline-flex items-center gap-2 rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-800 hover:bg-blue-50 disabled:opacity-50"
                        >
                          <RotateCcw className={`size-3.5 ${reconciling === donation.reference ? "animate-spin" : ""}`} />
                          Reconcile
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-slate-100 lg:hidden">
              {filteredDonations.map((donation) => (
                <article key={donation.reference} className="space-y-4 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-bold">{donation.donorName || "Anonymous"}</h3>
                      <p className="mt-1 break-all text-xs text-slate-500">{donation.donorEmail}</p>
                    </div>
                    <StatusBadge status={donation.status} />
                  </div>
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-lg font-bold">{safeAmount(donation.amountSubunit)}</p>
                    <p className="mt-1 text-xs text-slate-500">{formatDate(donation.paidAt ?? donation.initializedAt)}</p>
                    <p className="mt-3 text-sm text-slate-700">{donation.purpose}</p>
                  </div>
                  <p className="text-sm leading-6 text-slate-600">{donation.reason}</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => void copyReference(donation.reference)}
                      className="inline-flex min-w-0 flex-1 items-center justify-center gap-2 rounded-lg bg-slate-100 px-3 py-2 font-mono text-xs"
                    >
                      {copied === donation.reference ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
                      <span className="truncate">{donation.reference}</span>
                    </button>
                    <button
                      type="button"
                      disabled={Boolean(reconciling)}
                      onClick={() => void reconcile(donation.reference)}
                      className="inline-flex items-center gap-2 rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-800 disabled:opacity-50"
                    >
                      <RotateCcw className={`size-3.5 ${reconciling === donation.reference ? "animate-spin" : ""}`} />
                      Reconcile
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}

        <div className="flex items-center justify-between gap-4 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={goToPreviousPage}
            disabled={history.length === 0 || loading}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="size-4" />
            Previous
          </button>
          <span className="text-sm font-medium text-slate-500">Page {history.length + 1}</span>
          <button
            type="button"
            onClick={goToNextPage}
            disabled={!data?.nextCursor || loading}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
            <ChevronRight className="size-4" />
          </button>
        </div>
      </section>
    </section>
  );
}
