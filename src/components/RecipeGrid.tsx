"use client";

import { useState, useMemo } from "react";
import { Recipe } from "@/lib/types";
import RecipeCard from "./RecipeCard";

export default function RecipeGrid({ recipes }: { recipes: Recipe[] }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const CATEGORIES = [
    "Breakfast", "Lunch", "Dinner", "Appetizer",
    "Dessert", "Snack", "Beverage", "Main Course", "Side Dish",
  ];

  // Only show categories that have at least one recipe
  const availableCategories = useMemo(() => {
    const found = new Set(recipes.map(r => r.category).filter(Boolean));
    return CATEGORIES.filter(c => found.has(c));
  }, [recipes]);

  const filtered = useMemo(() => {
    let result = recipes;

    if (activeCategory) {
      result = result.filter((r) => r.category === activeCategory);
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
  }, [recipes, search, activeCategory]);

  return (
    <div>
      {/* Search bar — Stitch-style prominent placement */}
      <div className="relative mb-5 group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <span className="material-symbols-outlined text-on-surface-variant group-focus-within:text-primary transition-colors">
            search
          </span>
        </div>
        <input
          type="text"
          placeholder="Search recipes, ingredients, or cuisines..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-10 py-3.5 rounded-xl bg-primary/5 dark:bg-primary/10 border-transparent focus:border-primary focus:ring-0 text-sm text-on-surface placeholder-on-surface-variant/50 transition-all"
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

      {/* Category filter chips */}
      {availableCategories.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 flex-nowrap">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all shrink-0 ${
              activeCategory === null
                ? "bg-primary text-white shadow-sm shadow-primary/20"
                : "bg-primary-container text-on-surface hover:bg-primary/10"
            }`}
          >
            All Recipes
          </button>
          {availableCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all shrink-0 ${
                activeCategory === cat
                  ? "bg-primary text-white shadow-sm shadow-primary/20"
                  : "bg-surface dark:bg-surface-dark border border-outline-variant/50 text-on-surface-variant hover:border-primary transition-colors"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Results count */}
      {(search || activeCategory) && (
        <p className="text-sm text-on-surface-variant mb-4">
          {filtered.length} recipe{filtered.length !== 1 ? "s" : ""} found
          {activeCategory && (
            <span>
              {" "}in{" "}
              <span className="text-primary font-medium">{activeCategory}</span>
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
              setActiveCategory(null);
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
