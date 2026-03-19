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
      <div className="relative mb-5 group">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <span className="material-symbols-outlined text-on-surface-variant group-focus-within:text-primary transition-colors text-xl">
            search
          </span>
        </div>
        <input
          type="text"
          placeholder="Search recipes, ingredients, cuisines..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-10 py-3 rounded-xl bg-surface dark:bg-surface-dark border border-outline-variant/50 dark:border-outline-variant/30 text-sm text-on-surface placeholder-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
            aria-label="Clear search"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        )}
      </div>

      {/* Tag filter chips */}
      {allTags.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 flex-nowrap">
          <button
            onClick={() => setActiveTag(null)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all shrink-0 ${
              activeTag === null
                ? "bg-primary text-white shadow-sm shadow-primary/20"
                : "bg-primary-container text-on-surface hover:bg-primary/10"
            }`}
          >
            All Recipes
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all shrink-0 ${
                activeTag === tag
                  ? "bg-primary text-white shadow-sm shadow-primary/20"
                  : "bg-surface dark:bg-surface-dark border border-outline-variant/50 text-on-surface-variant hover:border-primary transition-colors"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Results count */}
      {(search || activeTag) && (
        <p className="text-sm text-on-surface-variant mb-4">
          {filtered.length} recipe{filtered.length !== 1 ? "s" : ""} found
          {activeTag && (
            <span>
              {" "}in{" "}
              <span className="text-primary font-medium">{activeTag}</span>
            </span>
          )}
          {search && (
            <span>
              {" "}matching &ldquo;<span className="text-on-surface">{search}</span>&rdquo;
            </span>
          )}
        </p>
      )}

      {/* Grid or Empty State */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <span className="material-symbols-outlined text-6xl text-on-surface-variant/30 mb-4 block">search</span>
          <p className="text-on-surface-variant mb-1 text-base">No recipes match your search</p>
          <button
            onClick={() => {
              setSearch("");
              setActiveTag(null);
            }}
            className="text-sm text-primary hover:text-primary/80 font-medium mt-2 transition-colors"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((r) => (
            <RecipeCard key={r.id} recipe={r} />
          ))}
        </div>
      )}
    </div>
  );
}
