"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [servings, setServings] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [tags, setTags] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) return;
    setLoading(true);
    const res = await fetch("/api/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title.trim(),
        servings: servings.trim() || undefined,
        prepTime: prepTime.trim() || undefined,
        cookTime: cookTime.trim() || undefined,
        cuisine: cuisine.trim() || undefined,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        ingredients: ingredients.split("\n").filter(Boolean).map((line) => {
          const match = line.match(/^([\d\s\/¼½¾⅓⅔.,-]*)\s*(cups?|tbsp|tsp|oz|lbs?|g|ml|cloves?)?\s*(.+)$/i);
          if (match) return { amount: match[1].trim(), unit: (match[2] || "").trim(), name: match[3].trim() };
          return { amount: "", unit: "", name: line.trim() };
        }),
        instructions: instructions.split("\n").filter(Boolean).map((s) => s.trim()),
        notes: notes.trim() || undefined,
      }),
    });
    const data = await res.json();
    router.push(`/recipe/${data.id}`);
  };

  const inputCls = "w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-200 outline-none focus:border-rose-400 dark:focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all";

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Add Recipe</h1>
      <p className="text-zinc-500 dark:text-zinc-400 mb-8 text-lg">Manually add a recipe</p>

      <div className="space-y-5">
        <div>
          <label className="text-xs font-medium text-zinc-500 dark:text-zinc-500 mb-1.5 block">Title *</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} placeholder="Recipe name" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-500 mb-1.5 block">Servings</label>
            <input value={servings} onChange={(e) => setServings(e.target.value)} className={inputCls} placeholder="4" />
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-500 mb-1.5 block">Cuisine</label>
            <input value={cuisine} onChange={(e) => setCuisine(e.target.value)} className={inputCls} placeholder="Italian" />
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-500 mb-1.5 block">Prep Time</label>
            <input value={prepTime} onChange={(e) => setPrepTime(e.target.value)} className={inputCls} placeholder="15m" />
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-500 mb-1.5 block">Cook Time</label>
            <input value={cookTime} onChange={(e) => setCookTime(e.target.value)} className={inputCls} placeholder="30m" />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-zinc-500 dark:text-zinc-500 mb-1.5 block">Tags (comma-separated)</label>
          <input value={tags} onChange={(e) => setTags(e.target.value)} className={inputCls} placeholder="dinner, quick, healthy" />
        </div>
        <div>
          <label className="text-xs font-medium text-zinc-500 dark:text-zinc-500 mb-1.5 block">Ingredients (one per line)</label>
          <textarea value={ingredients} onChange={(e) => setIngredients(e.target.value)} className={`${inputCls} h-32`} placeholder={"2 cups flour\n1 tsp salt\n3 cloves garlic"} />
        </div>
        <div>
          <label className="text-xs font-medium text-zinc-500 dark:text-zinc-500 mb-1.5 block">Instructions (one step per line)</label>
          <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} className={`${inputCls} h-32`} placeholder={"Preheat oven to 375°F\nMix dry ingredients..."} />
        </div>
        <div>
          <label className="text-xs font-medium text-zinc-500 dark:text-zinc-500 mb-1.5 block">Notes</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className={`${inputCls} h-20`} placeholder="Optional notes..." />
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading || !title.trim()}
          className="bg-rose-500 hover:bg-rose-600 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 text-white px-6 py-3.5 rounded-2xl text-sm font-semibold transition-all hover:shadow-lg hover:shadow-rose-500/25 w-full"
        >
          {loading ? "Saving..." : "Save Recipe"}
        </button>
      </div>
    </div>
  );
}
