"use client";

import { useEffect, useRef, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Bell, LoaderCircle, Menu, UserCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import AdminSidebar from "@/components/admin/AdminSidebar";
import { readDonationResponse } from "@/lib/donations/client";
import { auth } from "@/lib/firebase";

type AccessState = "checking" | "authorized" | "signed-out" | "forbidden" | "error";

function FullPageStatus({ message }: { message: string }) {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-slate-100 px-6 text-slate-700"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
        <LoaderCircle className="size-5 animate-spin text-blue-700" />
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const authorizationRequest = useRef<AbortController | null>(null);
  const [access, setAccess] = useState<AccessState>("checking");
  const [accessError, setAccessError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [navigationTarget, setNavigationTarget] = useState<string | null>(null);
  const navigating = navigationTarget !== null && navigationTarget !== pathname;

  useEffect(() => {
    let active = true;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      authorizationRequest.current?.abort();
      setAccessError("");

      if (!user) {
        setAccess("signed-out");
        router.replace("/np-godfrey123/login");
        return;
      }

      const controller = new AbortController();
      authorizationRequest.current = controller;
      setAccess("checking");

      void (async () => {
        try {
          const token = await user.getIdToken();
          const response = await fetch("/api/admin/session", {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
            signal: controller.signal,
          });
          if (response.status === 403) {
            if (active && !controller.signal.aborted) {
              setAccess("forbidden");
              setAccessError("This account is signed in but has not been granted administrator access.");
            }
            return;
          }
          await readDonationResponse<{ authorized: true; uid: string }>(
            response,
            "Unable to confirm administrator access.",
          );
          if (active && !controller.signal.aborted && auth.currentUser?.uid === user.uid) {
            setAccess("authorized");
          }
        } catch (error) {
          if (!active || controller.signal.aborted) return;
          const message = error instanceof Error ? error.message : "Unable to confirm administrator access.";
          if (message === "Please sign in again." || message === "Sign in to continue.") {
            setAccess("signed-out");
            router.replace("/np-godfrey123/login");
          } else {
            setAccess("error");
            setAccessError(message);
          }
        }
      })();
    });

    return () => {
      active = false;
      authorizationRequest.current?.abort();
      unsubscribe();
    };
  }, [router]);

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    setNavigationTarget(null);
    authorizationRequest.current?.abort();
    try {
      await signOut(auth);
      router.replace("/np-godfrey123/login");
    } catch {
      setLoggingOut(false);
      setAccessError("Unable to log out. Please try again.");
    }
  }

  if (loggingOut) return <FullPageStatus message="Logging out…" />;
  if (navigating) return <FullPageStatus message="Loading dashboard…" />;
  if (access === "checking") return <FullPageStatus message="Confirming administrator access…" />;
  if (access === "signed-out") return <FullPageStatus message="Opening admin login…" />;

  if (access === "forbidden" || access === "error") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-5 py-10">
        <section className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-lg sm:p-9">
          <UserCircle className="mx-auto size-12 text-amber-600" />
          <h1 className="mt-5 text-2xl font-bold text-slate-950">
            {access === "forbidden" ? "Administrator access needed" : "Access check unavailable"}
          </h1>
          <p className="mt-3 leading-7 text-slate-600">{accessError}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            {access === "error" && (
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="rounded-xl border border-blue-200 px-5 py-3 font-semibold text-blue-800"
              >
                Try again
              </button>
            )}
            <button
              type="button"
              onClick={() => void handleLogout()}
              className="rounded-xl bg-blue-800 px-5 py-3 font-semibold text-white"
            >
              Sign out
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7fc]">
      <AdminSidebar
        isOpen={sidebarOpen}
        isLoggingOut={loggingOut}
        onClose={() => setSidebarOpen(false)}
        onLogout={() => void handleLogout()}
        onNavigate={setNavigationTarget}
      />

      <div className="min-h-screen md:ml-72">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm sm:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
              className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 md:hidden"
            >
              <Menu size={24} />
            </button>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Administration</h2>
              <p className="hidden text-xs text-gray-500 sm:block">
                Pioneers Footprints Management System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <Bell size={20} className="text-gray-500" aria-hidden="true" />
            <div className="flex items-center gap-2 border-l pl-3 sm:pl-5">
              <UserCircle size={30} className="text-blue-600" />
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-gray-800">Administrator</p>
                <p className="text-xs text-gray-500">Pioneers Footprints</p>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
