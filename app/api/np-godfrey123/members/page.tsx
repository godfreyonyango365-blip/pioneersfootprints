"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";

interface Member {
  id: string;
  name: string;
  imageUrl: string;
  metadata: string;
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "members"), orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snap) => {
      const data: Member[] = snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Member, "id">),
      }));

      setMembers(data);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-slate-900 px-4 py-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              Members
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage ministry members
            </p>
          </div>

          {/* IMPORTANT: your custom route */}
          <Link
            href="/np-godfrey123/members/add-member"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            + Add Member
          </Link>
        </div>

        {/* List */}
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : members.length === 0 ? (
          <p className="text-gray-500">No members found</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((m) => (
              <div
                key={m.id}
                className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow border border-gray-200 dark:border-slate-700"
              >
                <div className="w-20 h-20 mx-auto rounded-full overflow-hidden mb-4">
                  <img src={m.imageUrl} alt={m.name} className="w-full h-full object-cover" />
                </div>

                <h3 className="text-center font-bold text-gray-900 dark:text-white">
                  {m.name}
                </h3>

                <p className="text-center text-xs text-gray-500 mt-2">
                  Click edit (you can extend later)
                </p>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}
