"use client";

import { useTheme } from "./ThemeProvider";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className={`p-2 rounded-xl transition-colors hover:bg-primary/10 text-on-surface-variant ${className}`}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <span className="material-symbols-outlined text-xl leading-none">light_mode</span>
      ) : (
        <span className="material-symbols-outlined text-xl leading-none">dark_mode</span>
      )}
    </button>
  );
}
