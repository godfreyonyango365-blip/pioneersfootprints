"use client";

import AddMember from "@/components/admin/AddMember";

export default function AddMemberPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-slate-900 px-4 py-10">
      <div className="max-w-3xl mx-auto">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            Add New Member
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Create a ministry team member profile
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow border">
          <AddMember />
        </div>

      </div>
    </main>
  );
}
