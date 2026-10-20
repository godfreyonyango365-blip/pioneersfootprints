"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Upload,
  Library,
  Newspaper,
  PlusCircle,
  Users,
  UserPlus,
  Images,
  Settings,
  Globe,
  LogOut,
  X,
  Layers,
  Home,
  HeartHandshake,
  ChevronRight,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const BASE = "/np-godfrey123/dashboard";

const sections = [
  {
    title: "OVERVIEW",
    items: [
      {
        label: "Dashboard",
        href: BASE,
        icon: LayoutDashboard,
      },
    ],
  },

  {
    title: "PUBLICATIONS",
    items: [
      {
        label: "Upload Publication",
        href: `${BASE}/publications/upload`,
        icon: Upload,
      },
      {
        label: "Manage Publications",
        href: `${BASE}/publications`,
        icon: Library,
      },
      {
        label: "Publication Categories",
        href: `${BASE}/publications/categories`,
        icon: Layers,
      },
    ],
  },

  {
    title: "WEBSITE UPDATES",
    items: [
      {
        label: "Add Update",
        href: `${BASE}/updates/add`,
        icon: PlusCircle,
      },
      {
        label: "Manage Updates",
        href: `${BASE}/updates`,
        icon: Newspaper,
      },
    ],
  },

  {
    title: "TEAM MANAGEMENT",
    items: [
      {
        label: "Add Team Member",
        href: `${BASE}/team/add`,
        icon: UserPlus,
      },
      {
        label: "Manage Team",
        href: `${BASE}/team`,
        icon: Users,
      },
    ],
  },

  {
    title: "MEDIA MANAGEMENT",
    items: [
      {
        label: "Media Library",
        href: `${BASE}/media`,
        icon: Images,
      },
    ],
  },

  {
    title: "WEBSITE MANAGEMENT",
    items: [
      {
        label: "Homepage Content",
        href: `${BASE}/homepage`,
        icon: Home,
      },
      {
        label: "Ministry Support",
        href: `${BASE}/donations`,
        icon: HeartHandshake,
      },
    ],
  },

  {
    title: "ADMINISTRATION",
    items: [
      {
        label: "Settings",
        href: `${BASE}/settings`,
        icon: Settings,
      },
    ],
  },
];

export default function AdminSidebar({
  isOpen,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-50
          flex h-screen w-72 flex-col
          bg-[#07152e] text-white
          border-r border-blue-900/40
          shadow-2xl
          transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Header */}
        <div className="border-b border-white/10 p-6">
          <div className="flex items-center justify-between">

            <div>
              <h1 className="text-xl font-bold">
                <span className="text-blue-400">
                  Pioneers
                </span>{" "}
                Footprints
              </h1>

              <p className="mt-1 text-xs text-gray-400">
                Administration Dashboard
              </p>
            </div>

            <button
              onClick={onClose}
              aria-label="Close sidebar"
              className="md:hidden text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>

          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-5">

          {sections.map((section) => (
            <div key={section.title} className="mb-6">

              <h3 className="mb-3 px-4 text-[10px] font-bold tracking-widest text-blue-400">
                {section.title}
              </h3>

              <nav className="space-y-1">

                {section.items.map((item) => {
                  const Icon = item.icon;

                  const active = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={`
                        flex items-center gap-3
                        rounded-xl px-4 py-3
                        transition-all duration-200
                        ${
                          active
                            ? "bg-blue-600 text-white shadow-lg"
                            : "text-gray-300 hover:bg-white/10 hover:text-white"
                        }
                      `}
                    >
                      <Icon size={18} />

                      <span className="flex-1 text-sm font-medium">
                        {item.label}
                      </span>

                      {active && (
                        <ChevronRight size={14} />
                      )}

                    </Link>
                  );
                })}

              </nav>

            </div>
          ))}

        </div>

        {/* Footer */}
        <div className="border-t border-white/10 p-4">

          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="mb-3 flex items-center justify-center gap-2 rounded-xl bg-blue-500/10 py-3 text-sm text-blue-300 hover:bg-blue-500/20"
          >
            <Globe size={17} />
            View Website
          </Link>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-sm font-semibold hover:bg-red-700"
          >
            <LogOut size={17} />
            Exit Dashboard
          </Link>

          <p className="mt-4 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} Pioneers Footprints
          </p>

        </div>

      </aside>
    </>
  );
}
