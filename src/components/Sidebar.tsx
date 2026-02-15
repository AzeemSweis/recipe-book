"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, SignInButton } from "@clerk/nextjs";

const nav = [
  { href: "/", label: "Recipes", icon: "📖" },
  { href: "/add", label: "Add Recipe", icon: "➕" },
  { href: "/import", label: "Import URL", icon: "🔗" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return (
      <aside className="fixed left-0 top-0 h-screen w-56 bg-zinc-900 border-r border-zinc-800 flex flex-col p-5 z-50">
        <div className="mb-8">
          <h1 className="text-lg font-bold text-zinc-100">🍳 Recipe Book</h1>
          <p className="text-xs text-zinc-500 mt-1">Loading...</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-56 bg-zinc-900 border-r border-zinc-800 flex flex-col p-5 z-50">
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
          <div className="pt-6 border-t border-zinc-800">
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800/50 transition-colors cursor-pointer">
              <img 
                src={user?.imageUrl} 
                alt="" 
                className="w-8 h-8 rounded-full" 
              />
              <div>
                <p className="text-sm font-medium text-zinc-100 truncate">{user?.firstName || user?.username || "User"}</p>
                <p className="text-xs text-zinc-500 truncate">{user?.emailAddresses[0]?.emailAddress}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </aside>
  );
}
