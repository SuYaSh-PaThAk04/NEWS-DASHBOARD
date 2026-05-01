"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "📰 Home", icon: "home" },
  { href: "/global", label: "🌍 Global", icon: "globe" },
  { href: "/commodities", label: "🛢 Commodities", icon: "oil" },
  { href: "/sectors", label: "📊 Sectors", icon: "chart" },
  { href: "/sentiment", label: "😊 Sentiment", icon: "mood" },
  { href: "/search", label: "🔍 Search", icon: "search" },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-white hover:text-slate-300"
          >
            📈 News Dashboard
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile menu */}
          <div className="md:hidden flex gap-1 overflow-x-auto">
            {navItems.slice(0, 3).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-2 py-2 text-xs rounded transition-colors ${
                  pathname === item.href
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-700"
                }`}
              >
                {item.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
