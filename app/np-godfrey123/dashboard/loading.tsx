import { LoaderCircle } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-live="polite">
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-700 shadow-sm">
        <LoaderCircle className="size-5 animate-spin text-blue-700" />
        <span className="font-medium">Loading dashboard…</span>
      </div>
    </div>
  );
}
