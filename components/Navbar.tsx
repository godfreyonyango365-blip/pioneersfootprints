"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, Briefcase, BookOpen, House, Users } from "lucide-react";
import Sidebar from "./sidebar";

const navItems = [
  { name: "Home", href: "/", icon: House },
  { name: "Services", href: "/services", icon: Briefcase },
  { name: "Publications", href: "/publications", icon: BookOpen },
  { name: "Team", href: "/team", icon: Users },

];

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-700/95 via-blue-600/95 to-blue-800/95 backdrop-blur-md text-white shadow-md">
        
        {/* Top Bar */}
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/assets/logo.jpg"
              alt="Pioneers Footprints Logo"
              width={60}
              height={60}
              className="rounded-full"
            />
           <div className="flex flex-col">
  <span className="font-bold Times-New Romans text-lg text-white">
    PIONEERS FOOTPRINTS
  </span>
  <span className="text-xs text-white/80">
          Publications, Medical & Digital Ministry 
  </span>
</div>

          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                    isActive
                      ? "bg-white text-blue-900"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Toggle */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 rounded-lg border border-white/30 text-white hover:bg-white/10 transition"
          >
            {<Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Sidebar Component */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}
