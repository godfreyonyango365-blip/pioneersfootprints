"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { signOut, type User } from "firebase/auth";
import Link from "next/link";
import { LogOut, FileText, Upload } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser: User | null) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/np-godfrey123/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/np-godfrey123/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-800">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-blue-100">Welcome, {user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>

        {/* Dashboard Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Publications Upload */}
          <Link href="/np-godfrey123/dashboard/publications/upload">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-blue-600 rounded-lg">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Upload Publications</h2>
              </div>
              <p className="text-gray-600">Add new publications, books, and resources to the library.</p>
            </div>
          </Link>

          {/* Publications List */}
          <Link href="/publications">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-green-600 rounded-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">View Publications</h2>
              </div>
              <p className="text-gray-600">Browse and manage all published resources.</p>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
