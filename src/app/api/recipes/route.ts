import { NextResponse } from "next/server";
import { getRecipes, saveRecipe } from "@/lib/storage";
import { Recipe } from "@/lib/types";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getRecipes());
}

export async function POST(req: Request) {
  const data = await req.json();
  const now = new Date().toISOString();
  const recipe: Recipe = {
    id: crypto.randomUUID(),
    title: data.title || "Untitled",
    description: data.description,
    servings: data.servings,
    prepTime: data.prepTime,
    cookTime: data.cookTime,
    totalTime: data.totalTime,
    cuisine: data.cuisine,
    category: data.category,
    tags: data.tags || [],
    ingredients: data.ingredients || [],
    instructions: data.instructions || [],
    notes: data.notes,
    image: data.image,
    createdAt: now,
    updatedAt: now,
  };
  saveRecipe(recipe);
  return NextResponse.json({ id: recipe.id });
}
