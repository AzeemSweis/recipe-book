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
    <div className="max-w-xl">
      <h1 className="text-3xl font-bold mb-2">Import Recipe</h1>
      <p className="text-zinc-400 mb-8">Paste a recipe URL and we&apos;ll parse it into a clean format</p>

      <div className="space-y-4">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleImport()}
          placeholder="https://www.example.com/recipe/..."
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-200 outline-none focus:border-zinc-600 text-sm"
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          onClick={handleImport}
          disabled={loading || !url.trim()}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white px-6 py-3 rounded-xl text-sm font-medium transition-colors w-full"
        >
          {loading ? "Parsing recipe..." : "Import Recipe"}
        </button>
      </div>

      <div className="mt-10 bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h3 className="text-sm font-medium text-zinc-300 mb-2">Supported sites</h3>
        <p className="text-xs text-zinc-500">
          Works with any site that uses schema.org Recipe structured data — most major recipe sites including
          AllRecipes, Serious Eats, NYT Cooking, Budget Bytes, Bon Appétit, Food Network, and many more.
        </p>
      </div>
    </div>
  );
}
