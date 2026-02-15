"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, SignInButton, SignOutButton } from "@clerk/nextjs";
import { useState } from "react";

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
      {/* Mobile hamburger */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 left-4 z-50 md:hidden bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-300"
        aria-label="Open menu"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-60 bg-zinc-900 border-r border-zinc-800 flex flex-col p-5 z-50 transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Close button on mobile */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 md:hidden"
          aria-label="Close menu"
        >
          ✕
        </button>

        <div className="mb-8">
          <h1 className="text-lg font-bold text-zinc-100">🍳 Recipe Book</h1>
          <p className="text-xs text-zinc-500 mt-1">Parse · Organize · Cook</p>
        </div>

        {!isSignedIn ? (
          <div className="flex-1 flex items-center justify-center">
            <SignInButton mode="modal">
              <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors">
                Sign In
              </button>
            </SignInButton>
          </div>
        ) : (
          <>
            <nav className="flex flex-col gap-1 mb-auto">
              {nav.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      active
                        ? "bg-zinc-800 text-zinc-100 font-medium"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="pt-6 border-t border-zinc-800">
              <div className="flex items-center gap-3 p-2">
                <img
                  src={user?.imageUrl}
                  alt=""
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-100 truncate">
                    {user?.firstName || user?.username || "User"}
                  </p>
                  <p className="text-xs text-zinc-500 truncate">
                    {user?.emailAddresses[0]?.emailAddress}
                  </p>
                </div>
              </div>
              <SignOutButton>
                <button className="mt-2 w-full text-left text-xs text-zinc-500 hover:text-zinc-300 px-2 py-1 transition-colors">
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
