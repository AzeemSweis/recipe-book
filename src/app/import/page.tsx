"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ImportPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleImport = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Import failed");
      router.push(`/recipe/${data.id}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Import failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Import Recipe</h1>
      <p className="text-zinc-500 dark:text-zinc-400 mb-8 text-lg">Paste a recipe URL and we&apos;ll parse it into a clean format</p>

      <div className="space-y-4">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleImport()}
          placeholder="https://www.example.com/recipe/..."
          className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-3.5 text-zinc-900 dark:text-zinc-200 outline-none focus:border-rose-400 dark:focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 text-sm transition-all"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          onClick={handleImport}
          disabled={loading || !url.trim()}
          className="bg-rose-500 hover:bg-rose-600 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 disabled:text-zinc-500 text-white px-6 py-3.5 rounded-2xl text-sm font-semibold transition-all hover:shadow-lg hover:shadow-rose-500/25 w-full"
        >
          {loading ? "Parsing recipe..." : "Import Recipe"}
        </button>
      </div>

      <div className="mt-12 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Supported sites</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-500 leading-relaxed">
          Works with any site that uses schema.org Recipe structured data — most major recipe sites including
          AllRecipes, Serious Eats, NYT Cooking, Budget Bytes, Bon Appétit, Food Network, and many more.
        </p>
      </div>
    </div>
  );
}
