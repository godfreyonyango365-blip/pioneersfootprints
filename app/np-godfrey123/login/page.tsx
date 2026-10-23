"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { sendEmailVerification, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { LoaderCircle } from "lucide-react";
import { auth } from "@/lib/firebase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [openingDashboard, setOpeningDashboard] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setNotice("");

    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const token = await credential.user.getIdToken(true);
      const response = await fetch("/api/admin/session", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      const result = response.ok
        ? null
        : ((await response.json().catch(() => null)) as { error?: string } | null);

      if (
        response.status === 403 &&
        !credential.user.emailVerified &&
        result?.error === "Verify your administrator email before continuing."
      ) {
        await sendEmailVerification(credential.user);
        await signOut(auth);
        setNotice(
          "We sent a verification link to your email. Open it, then return here and sign in again.",
        );
        setLoading(false);
        return;
      }

      if (!response.ok) {
        await signOut(auth);
        throw new Error(
          response.status === 403
            ? "This email is not on the administrator allowlist. Add it to ADMIN_EMAILS in the deployed environment, then redeploy."
            : result?.error || "Unable to confirm administrator access.",
        );
      }

      setOpeningDashboard(true);
      router.replace("/np-godfrey123/dashboard");
    } catch (loginError: unknown) {
      setError(loginError instanceof Error ? loginError.message : "Invalid email or password.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-700 bg-slate-900/80 backdrop-blur-xl shadow-2xl p-6 sm:p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-full bg-blue-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
              PF
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-center text-3xl font-bold text-white">
            Admin Login
          </h1>

          <p className="text-center text-slate-400 mt-2 mb-8">
            Sign in to access the Pioneers Footprints Dashboard
          </p>

          <form onSubmit={handleLogin} className="space-y-5" aria-busy={loading}>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>

              <input
                type="email"
                required
                disabled={loading}
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>

              <input
                type="password"
                required
                disabled={loading}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg border border-red-700 bg-red-900/20 p-3 text-sm text-red-300">
                {error}
              </div>
            )}
            {notice && (
              <div role="status" className="rounded-lg border border-blue-700 bg-blue-900/20 p-3 text-sm text-blue-200">
                {notice}
              </div>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="flex items-center justify-center gap-2">
                {loading && <LoaderCircle className="size-4 animate-spin" />}
                {openingDashboard ? "Opening dashboard…" : loading ? "Signing in…" : "Login"}
              </span>
            </button>
            {openingDashboard && (
              <p role="status" className="text-center text-sm text-blue-200">
                Login successful. Loading your administration dashboard…
              </p>
            )}
          </form>

          <div className="mt-8 border-t border-slate-700 pt-5 text-center text-sm text-slate-500">
            © {new Date().getFullYear()} Pioneers Footprints
          </div>
        </div>
      </div>
    </main>
  );
}
