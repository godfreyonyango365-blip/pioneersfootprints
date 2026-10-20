"use client";

import Link from "next/link";

import {
  BookOpen,
  Newspaper,
  Users,
  Upload,
  PlusCircle,
  UserPlus,
  ArrowRight,
  Library,
  Images,
  Globe,
  LayoutDashboard,
} from "lucide-react";

const BASE = "/np-godfrey123/dashboard";

const statistics = [
  {
    title: "Total Publications",
    value: "—",
    icon: BookOpen,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Website Updates",
    value: "—",
    icon: Newspaper,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Team Members",
    value: "—",
    icon: Users,
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "Media Files",
    value: "—",
    icon: Images,
    color: "bg-orange-100 text-orange-600",
  },
];

const actions = [
  {
    title: "Upload Publication",
    description:
      "Upload new books, PDFs, covers and missionary literature.",
    href: `${BASE}/publications/upload`,
    icon: Upload,
    color: "bg-blue-600",
  },
  {
    title: "Manage Publications",
    description:
      "View, edit and manage existing publications.",
    href: "/publications",
    icon: Library,
    color: "bg-indigo-600",
  },
  {
    title: "Add Website Update",
    description:
      "Publish ministry news, announcements and updates.",
    href: `${BASE}/updates/add`,
    icon: PlusCircle,
    color: "bg-green-600",
  },
  {
    title: "Manage Updates",
    description:
      "Edit or remove previously published updates.",
    href: `${BASE}/updates`,
    icon: Newspaper,
    color: "bg-teal-600",
  },
  {
    title: "Add Team Member",
    description:
      "Register new ministry team members and their responsibilities.",
    href: `${BASE}/team/add`,
    icon: UserPlus,
    color: "bg-purple-600",
  },
  {
    title: "Manage Team",
    description:
      "Update team profiles, photographs and positions.",
    href: `${BASE}/team`,
    icon: Users,
    color: "bg-orange-600",
  },
];

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">

      {/* Welcome */}
      <div className="rounded-2xl bg-gradient-to-r from-[#07152e] to-[#123b80] p-8 text-white shadow-lg">

        <div className="flex flex-wrap items-center justify-between gap-6">

          <div>
            <div className="mb-3 flex items-center gap-2 text-blue-300">
              <LayoutDashboard size={18} />
              <span className="text-sm font-medium">
                Administration Overview
              </span>
            </div>

            <h1 className="text-3xl font-bold md:text-4xl">
              Welcome to Pioneers Footprints
            </h1>

            <p className="mt-3 max-w-2xl text-blue-100">
              Manage publications, ministry updates,
              team members and website content from
              one central dashboard.
            </p>
          </div>

          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-blue-900 transition hover:bg-blue-50"
          >
            <Globe size={18} />
            View Website
          </Link>

        </div>

      </div>

      {/* Statistics */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

        {statistics.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm text-gray-500">
                    {stat.title}
                  </p>

                  <h3 className="mt-3 text-3xl font-bold text-gray-900">
                    {stat.value}
                  </h3>
                </div>

                <div className={`rounded-xl p-4 ${stat.color}`}>
                  <Icon size={24} />
                </div>

              </div>
            </div>
          );
        })}

      </div>

      {/* Quick Actions */}
      <section>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Quick Actions
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Select an activity to manage your ministry website.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {actions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.title}
                href={action.href}
                className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg"
              >

                <div
                  className={`mb-5 flex h-14 w-14 items-center justify-center rounded-xl text-white ${action.color}`}
                >
                  <Icon size={25} />
                </div>

                <h3 className="text-lg font-bold text-gray-900">
                  {action.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {action.description}
                </p>

                <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-blue-600 transition group-hover:gap-3">
                  Open Management
                  <ArrowRight size={16} />
                </div>

              </Link>
            );
          })}

        </div>

      </section>

      {/* Ministry Information */}
      <section className="rounded-2xl border border-blue-100 bg-blue-50 p-7">

        <h3 className="text-xl font-bold text-blue-950">
          Pioneers Footprints Publications
        </h3>

        <p className="mt-3 max-w-4xl leading-7 text-gray-700">
          Preserving the Adventist pioneer legacy and advancing
          the everlasting gospel through publishing,
          medical missionary work, colporteur ministry
          and digital media.
        </p>

      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-5 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Pioneers Footprints Publications.
        All Rights Reserved.
      </footer>

    </div>
  );
}
