"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/", label: "All Recipes", icon: "📖" },
  { href: "/add", label: "Add Recipe", icon: "➕" },
  { href: "/import", label: "Import URL", icon: "🔗" },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed left-0 top-0 h-screen w-56 bg-zinc-900 border-r border-zinc-800 flex flex-col p-5 z-50">
      <div className="mb-8">
        <h1 className="text-lg font-bold text-zinc-100">🍳 Recipe Book</h1>
        <p className="text-xs text-zinc-500 mt-1">Parse · Organize · Cook</p>
      </div>
      <nav className="flex flex-col gap-1">
        {nav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active ? "bg-zinc-800 text-zinc-100 font-medium" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto pt-6 border-t border-zinc-800">
        <p className="text-xs text-zinc-600">Azeem&apos;s Recipes</p>
      </div>
    </aside>
  );
}
