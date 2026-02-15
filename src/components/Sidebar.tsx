"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, SignInButton, SignOutButton } from "@clerk/nextjs";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

const nav = [
  { href: "/", label: "Recipes", icon: "📖" },
  { href: "/add", label: "Add Recipe", icon: "➕" },
  { href: "/import", label: "Import URL", icon: "🔗" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isLoaded, isSignedIn, user } = useUser();
  const [open, setOpen] = useState(false);

  if (!isLoaded) return null;

  return (
    <>
      {/* Mobile top bar */}
      <div className="fixed top-0 left-0 right-0 z-30 md:hidden bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between h-14 px-4 transition-colors">
        <div className="flex items-center">
          <button
            onClick={() => setOpen(true)}
            className="text-zinc-600 dark:text-zinc-300 p-1 -ml-1"
            aria-label="Open menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="ml-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">🍳 Recipe Book</span>
        </div>
        <ThemeToggle />
      </div>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-dvh w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col z-50 transition-all duration-200 overflow-y-auto ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Close button on mobile */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 md:hidden"
          aria-label="Close menu"
        >
          ✕
        </button>

        <div className="p-6 pb-2">
          <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">🍳 Recipe Book</h1>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">Parse · Organize · Cook</p>
        </div>

        {!isSignedIn ? (
          <div className="flex-1 flex items-center justify-center px-6">
            <SignInButton mode="modal">
              <button className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-2xl text-sm font-semibold transition-all hover:shadow-lg hover:shadow-rose-500/25 w-full">
                Sign In
              </button>
            </SignInButton>
          </div>
        ) : (
          <>
            <nav className="flex flex-col gap-1 px-4 mt-4 flex-1">
              {nav.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                      active
                        ? "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold"
                        : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Bottom section - always visible including mobile */}
            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-3 px-2 mb-3">
                <img
                  src={user?.imageUrl}
                  alt=""
                  className="w-8 h-8 rounded-full ring-2 ring-zinc-200 dark:ring-zinc-700"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                    {user?.firstName || user?.username || "User"}
                  </p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 truncate">
                    {user?.emailAddresses[0]?.emailAddress}
                  </p>
                </div>
                <ThemeToggle className="hidden md:flex" />
              </div>
              <SignOutButton redirectUrl="/">
                <button className="w-full text-center text-sm font-medium text-rose-500 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30 px-3 py-2.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all active:scale-95">
                  Sign out
                </button>
              </SignOutButton>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
