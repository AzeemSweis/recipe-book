import { NextResponse } from "next/server";
import { parseRecipeFromHtml } from "@/lib/parser";
import { saveRecipe } from "@/lib/storage";
import { Recipe } from "@/lib/types";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: "URL required" }, { status: 400 });

    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml",
      },
    });

    if (!res.ok) return NextResponse.json({ error: `Failed to fetch URL (${res.status})` }, { status: 400 });

    const html = await res.text();
    const parsed = parseRecipeFromHtml(html, url);
    const now = new Date().toISOString();

    const recipe: Recipe = {
      id: crypto.randomUUID(),
      title: parsed.title || "Untitled Recipe",
      sourceUrl: url,
      description: parsed.description,
      servings: parsed.servings,
      prepTime: parsed.prepTime,
      cookTime: parsed.cookTime,
      totalTime: parsed.totalTime,
      cuisine: parsed.cuisine,
      category: parsed.category,
      tags: parsed.tags || [],
      ingredients: parsed.ingredients || [],
      instructions: parsed.instructions || [],
      notes: parsed.notes,
      image: parsed.image,
      createdAt: now,
      updatedAt: now,
    };

    saveRecipe(recipe);
    return NextResponse.json({ id: recipe.id, title: recipe.title });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Import failed" }, { status: 500 });
  }
}
