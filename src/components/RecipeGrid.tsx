"use client";

import { useState, useMemo } from "react";
import { Recipe } from "@/lib/types";
import RecipeCard from "./RecipeCard";

export default function RecipeGrid({ recipes }: { recipes: Recipe[] }) {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  // Collect all unique tags sorted by frequency
  const allTags = useMemo(() => {
    const counts: Record<string, number> = {};
    recipes.forEach((r) =>
      r.tags.forEach((t) => {
        counts[t] = (counts[t] || 0) + 1;
      })
    );
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag);
  }, [recipes]);

  const filtered = useMemo(() => {
    let result = recipes;

    if (activeTag) {
      result = result.filter((r) => r.tags.includes(activeTag));
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description?.toLowerCase().includes(q) ||
          r.cuisine?.toLowerCase().includes(q) ||
          r.category?.toLowerCase().includes(q) ||
          r.tags.some((t) => t.toLowerCase().includes(q)) ||
          r.ingredients.some((ing) => ing.name.toLowerCase().includes(q))
      );
    }

    return result;
  }, [recipes, search, activeTag]);

  return (
    <div>
      {/* Search bar */}
      <div className="relative mb-6">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search recipes, ingredients, cuisines..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-rose-500/40 focus:border-rose-500 transition-all"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 text-sm"
          >
            ✕
          </button>
        )}
      </div>

      {/* Tags */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveTag(null)}
            className={`text-xs px-3.5 py-1.5 rounded-full font-medium transition-all ${
              activeTag === null
                ? "bg-rose-500 text-white shadow-sm"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`text-xs px-3.5 py-1.5 rounded-full font-medium transition-all ${
                activeTag === tag
                  ? "bg-rose-500 text-white shadow-sm"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Results count */}
      {(search || activeTag) && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
          {filtered.length} recipe{filtered.length !== 1 ? "s" : ""} found
          {activeTag && <span> in <span className="text-rose-500 font-medium">{activeTag}</span></span>}
          {search && <span> matching &ldquo;<span className="text-zinc-700 dark:text-zinc-300">{search}</span>&rdquo;</span>}
        </p>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-zinc-500 dark:text-zinc-400 mb-1">No recipes match your search</p>
          <button
            onClick={() => {
              setSearch("");
              setActiveTag(null);
            }}
            className="text-sm text-rose-500 hover:text-rose-600 font-medium mt-2 transition-colors"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((r) => (
            <RecipeCard key={r.id} recipe={r} />
          ))}
        </div>
      )}
    </div>
  );
}
