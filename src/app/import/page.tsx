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
    <div className="max-w-5xl mx-auto px-6 py-16 pb-24">
      {/* Header */}
      <header className="text-center mb-14">
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="material-symbols-outlined text-primary text-4xl">auto_awesome</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface mb-4">
          Import Your Next Masterpiece
        </h1>
        <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
          Turn any cooking blog, news article, or website into a clean, structured recipe in seconds.
        </p>
      </header>

      {/* URL input */}
      <section className="mb-16">
        <div className="bg-surface dark:bg-surface-dark rounded-2xl p-2 md:p-3 shadow-md flex flex-col md:flex-row gap-3 items-center border border-outline-variant/50 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <div className="flex items-center w-full px-4 gap-3">
            <span className="material-symbols-outlined text-primary shrink-0">link</span>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleImport()}
              placeholder="Paste recipe URL here (e.g., nytcooking.com/recipe/...)"
              className="w-full bg-transparent border-none outline-none text-on-surface placeholder-on-surface-variant/50 py-4 text-base"
            />
          </div>
          <button
            onClick={handleImport}
            disabled={loading || !url.trim()}
            className="w-full md:w-auto px-8 py-4 bg-primary hover:bg-primary/90 disabled:bg-outline-variant disabled:text-on-surface-variant text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap"
          >
            {loading ? "Fetching..." : "Fetch Recipe"}
          </button>
        </div>
        {error && (
          <p className="mt-3 text-error text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-base">error</span>
            {error}
          </p>
        )}
      </section>

      {/* Feature cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="bg-surface dark:bg-surface-dark p-8 rounded-xl shadow-sm border border-outline-variant/50 border-t-4 border-t-primary/20 text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <span className="material-symbols-outlined text-primary">auto_awesome</span>
          </div>
          <h3 className="text-on-surface text-lg font-bold mb-3">Smart Extraction</h3>
          <p className="text-on-surface-variant text-sm leading-relaxed">
            AI-powered parsing automatically filters out ads and life stories, focusing only on ingredients and instructions.
          </p>
        </div>
        <div className="bg-surface dark:bg-surface-dark p-8 rounded-xl shadow-sm border border-outline-variant/50 border-t-4 border-t-primary/20 text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <span className="material-symbols-outlined text-primary">swap_horiz</span>
          </div>
          <h3 className="text-on-surface text-lg font-bold mb-3">Unit Conversion</h3>
          <p className="text-on-surface-variant text-sm leading-relaxed">
            Ingredients are automatically parsed and can be toggled between metric and imperial measurements instantly.
          </p>
        </div>
        <div className="bg-surface dark:bg-surface-dark p-8 rounded-xl shadow-sm border border-outline-variant/50 border-t-4 border-t-primary/20 text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <span className="material-symbols-outlined text-primary">cloud_done</span>
          </div>
          <h3 className="text-on-surface text-lg font-bold mb-3">Save Forever</h3>
          <p className="text-on-surface-variant text-sm leading-relaxed">
            Imported recipes are saved to your personal vault, always accessible and formatted beautifully.
          </p>
        </div>
      </section>

      {/* Preview area */}
      <section className="bg-surface dark:bg-surface-dark rounded-2xl p-8 border-2 border-dashed border-outline-variant relative overflow-hidden">
        <div className="flex flex-col items-center justify-center py-16 text-center opacity-40">
          <span className="material-symbols-outlined text-6xl mb-4">description</span>
          <p className="text-lg font-medium text-on-surface">Your imported recipe will appear here.</p>
          <p className="text-sm text-on-surface-variant mt-1">
            Ingredients, steps, and imagery will be beautifully formatted.
          </p>
        </div>
        {/* Decorative elements */}
        <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 left-10 w-24 h-24 bg-outline-variant/10 rounded-xl pointer-events-none" />
      </section>

      {/* Supported sites note */}
      <div className="mt-8 bg-primary-container/30 dark:bg-primary/10 border border-primary/20 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-on-surface mb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-base">info</span>
          Supported Sites
        </h3>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          Works with any site that uses schema.org Recipe structured data — most major recipe sites including
          AllRecipes, Serious Eats, NYT Cooking, Budget Bytes, Bon Appétit, Food Network, and many more.
        </p>
      </div>
    </div>
  );
}
