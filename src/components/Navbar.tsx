"use client";

import Link from "next/link";
import { useAuth, UserButton } from "@clerk/nextjs";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const { isLoaded, isSignedIn } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-surface/80 dark:bg-surface-dark/80 backdrop-blur-md border-b border-outline-variant/30 dark:border-outline-variant/20">
      <div className="max-w-7xl mx-auto px-4 md:px-10 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="flex items-center justify-center bg-primary rounded-lg p-1.5 text-white">
            <span className="material-symbols-outlined text-xl leading-none">restaurant_menu</span>
          </div>
          <span className="text-on-surface font-bold text-lg tracking-tight hidden sm:block">Recipe Book</span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {!isLoaded ? null : isSignedIn ? (
            <>
              <Link
                href="/import"
                className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors px-3 py-2"
              >
                <span className="material-symbols-outlined text-lg">link</span>
                Import
              </Link>
              <ThemeToggle />
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors px-3 py-2"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="text-sm font-bold bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-xl transition-all shadow-sm"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
