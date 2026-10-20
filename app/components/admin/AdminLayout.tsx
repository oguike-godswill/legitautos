"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Car,
  Plus,
  Menu,
  X,
  LogOut,
  ClipboardList,
  Eye,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/cars", label: "All Cars", icon: Car },
  { href: "/admin/cars/new", label: "Add Car", icon: Plus },
  { href: "/admin/requests", label: "Car Requests", icon: ClipboardList },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      router.replace("/admin/login");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <Link href="/admin" className="flex items-center gap-2">
          <Image
            src="/logo-blue.png"
            alt="LegitAutos logo"
            width={279}
            height={156}
            className="h-9 w-auto object-contain"
          />
          <span className="font-bold text-dark-900">
            Legit<span className="text-primary-600">Autos</span>
          </span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100"
          aria-label={sidebarOpen ? "Close menu" : "Open menu"}
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:sticky top-0 left-0 z-20 h-screen w-64 bg-white border-r border-gray-200
            transform transition-transform duration-300 lg:transform-none
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
        >
          <div className="p-6">
            <Link href="/admin" className="hidden lg:flex items-center gap-2 mb-8">
              <Image
                src="/logo-blue.png"
                alt="LegitAutos logo"
                width={279}
                height={156}
                className="h-10 w-auto object-contain"
              />
              <span className="font-bold text-dark-900">
                Legit<span className="text-primary-600">Autos</span>
              </span>
            </Link>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "bg-primary-50 text-primary-700"
                        : "text-dark-600 hover:bg-gray-50 hover:text-dark-900"
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${isActive ? "text-primary-600" : "text-dark-400"}`} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 space-y-1">
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-dark-600 hover:bg-gray-50 transition-colors"
            >
              <Eye className="w-5 h-5 text-dark-400" />
              View Website
            </Link>
            <button
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-dark-600 hover:bg-gray-50 disabled:opacity-60 transition-colors"
            >
              <LogOut className="w-5 h-5 text-dark-400" />
              {isSigningOut ? "Signing out..." : "Sign Out"}
            </button>
          </div>
        </aside>

        {/* Mobile Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-10 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

