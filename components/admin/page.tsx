"use client";

import Link from "next/link";
import {
  FaUsers,
  FaBookOpen,
  FaNewspaper,
  FaPrint,
  FaPlus,
  FaArrowRight,
  FaFileAlt,
  FaGlobe,
  FaClock,
  FaChartLine,
  FaImages,
} from "react-icons/fa";

const managementCards = [
  {
    title: "Members",
    description: "Register new members and manage existing member records.",
    href: "/admin/members/add-member",
    manageHref: "/admin/members/edit-member",
    action: "Add Member",
    manageAction: "Manage Members",
    icon: FaUsers,
  },
  {
    title: "Publications",
    description: "Upload books, booklets, study materials, and other publications.",
    href: "/admin/publications/add-publication",
    manageHref: "/admin/publications/edit-publication",
    action: "Add Publication",
    manageAction: "Manage Publications",
    icon: FaBookOpen,
  },
  {
    title: "Blog Articles",
    description: "Write articles, share research, and publish ministry updates.",
    href: "/admin/blog/post",
    manageHref: "/admin/blog/blog-delete",
    action: "Write Article",
    manageAction: "Manage Articles",
    icon: FaNewspaper,
  },
  {
    title: "Printing Press Updates",
    description:
      "Share printing press progress, explain projects, and upload photographs.",
    href: "/admin/press-updates/add",
    manageHref: "/admin/press-updates/manage",
    action: "Add Update",
    manageAction: "Manage Updates",
    icon: FaPrint,
  },
];

const quickActions = [
  {
    title: "Register a Member",
    description: "Add a person to your membership records.",
    href: "/admin/members/add-member",
    icon: FaUsers,
  },
  {
    title: "Upload a Publication",
    description: "Add a book or other publishing resource.",
    href: "/admin/publications/add-publication",
    icon: FaBookOpen,
  },
  {
    title: "Write a Blog Article",
    description: "Prepare and publish an article.",
    href: "/admin/blog/post",
    icon: FaNewspaper,
  },
  {
    title: "Post Press Update",
    description: "Share an explanation and photographs.",
    href: "/admin/press-updates/add",
    icon: FaImages,
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Dashboard heading */}
        <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
              Pioneers Footprints Administration
            </p>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Dashboard Overview
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Manage your members, publications, blog articles, and printing
              press updates from one central place.
            </p>
          </div>

          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-700"
          >
            <FaGlobe />
            View Website
            <FaArrowRight className="text-xs" />
          </Link>
        </section>

        {/* Welcome banner */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-blue-950 to-blue-800 p-6 text-white shadow-lg sm:p-8">
          <div className="pointer-events-none absolute -right-12 -top-16 h-64 w-64 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-2 -top-8 h-44 w-44 rounded-full border border-white/10" />

          <div className="relative z-10 max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-blue-100">
              <FaChartLine />
              Administration Centre
            </div>

            <h2 className="text-xl font-bold sm:text-2xl">
              Welcome to Pioneers Footprints
            </h2>

            <p className="mt-3 text-sm leading-6 text-blue-100 sm:text-base">
              Your central workspace for preserving the Adventist pioneer
              legacy through publishing, historical research, literature, and
              digital ministry.
            </p>
          </div>
        </section>

        {/* Main management cards */}
        <section>
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Content & Management
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Choose a department to manage its records and content.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {managementCards.map((card) => {
              const Icon = card.icon;

              return (
                <article
                  key={card.title}
                  className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-800 transition group-hover:bg-blue-800 group-hover:text-white">
                    <Icon />
                  </div>

                  <h3 className="text-base font-bold text-slate-900">
                    {card.title}
                  </h3>

                  <p className="mt-2 min-h-[60px] text-sm leading-5 text-slate-500">
                    {card.description}
                  </p>

                  <div className="mt-5 flex flex-col gap-2">
                    <Link
                      href={card.href}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-800 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-900"
                    >
                      <FaPlus className="text-xs" />
                      {card.action}
                    </Link>

                    <Link
                      href={card.manageHref}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800"
                    >
                      {card.manageAction}
                      <FaArrowRight className="text-xs" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Quick actions */}
        <section>
          <div className="mb-5">
            <h2 className="text-lg font-bold text-slate-900">
              Quick Actions
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Start your most common administrative tasks quickly.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  key={action.title}
                  href={action.href}
                  className="group flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-blue-300 hover:shadow-sm"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-lg text-blue-800 transition group-hover:bg-blue-800 group-hover:text-white">
                    <Icon />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-slate-900">
                      {action.title}
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {action.description}
                    </p>
                  </div>

                  <FaArrowRight className="mt-1 shrink-0 text-xs text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-800" />
                </Link>
              );
            })}
          </div>
        </section>

        {/* Information panel */}
        <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-lg text-blue-800">
                <FaFileAlt />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Publishing & Digital Ministry
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Use the publication and blog management tools to share
                  historical resources, research, books, and articles with
                  readers visiting the Pioneers Footprints website.
                </p>

                <Link
                  href="/admin/publications/add-publication"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-blue-800 hover:text-blue-950"
                >
                  Go to Publications
                  <FaArrowRight className="text-xs" />
                </Link>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-lg text-amber-700">
                <FaClock />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Printing Press News
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Document the progress of your printing press with written
                  explanations, photographs, equipment updates, and reports
                  about completed publishing projects.
                </p>

                <Link
                  href="/admin/press-updates/add"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-blue-800 hover:text-blue-950"
                >
                  Create a Press Update
                  <FaArrowRight className="text-xs" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-200 py-5">
          <div className="flex flex-col gap-2 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} Pioneers Footprints.
              All rights reserved.
            </p>

            <p>Administration Dashboard</p>
          </div>
        </footer>
      </div>
    </div>
  );
}