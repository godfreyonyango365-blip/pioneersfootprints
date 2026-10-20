"use client";

import { useState } from "react";

import AdminSidebar from "@/components/admin/AdminSidebar";

import { Menu, Bell, UserCircle } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f4f7fc]">

      {/* Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="min-h-screen md:ml-72">

        {/* Top Navigation */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm">

          <div className="flex items-center gap-4">

            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
              className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 md:hidden"
            >
              <Menu size={24} />
            </button>

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Administration
              </h2>

              <p className="text-xs text-gray-500">
                Pioneers Footprints Management System
              </p>
            </div>

          </div>

          <div className="flex items-center gap-5">

            <Bell
              size={20}
              className="cursor-pointer text-gray-500"
            />

            <div className="flex items-center gap-2 border-l pl-5">

              <UserCircle
                size={30}
                className="text-blue-600"
              />

              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-gray-800">
                  Administrator
                </p>

                <p className="text-xs text-gray-500">
                  Pioneers Footprints
                </p>
              </div>

            </div>

          </div>

        </header>

        {/* Page Content */}
        <main className="p-6 md:p-8">
          {children}
        </main>

      </div>

    </div>
  );
}