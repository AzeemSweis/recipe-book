import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getRecipes, saveRecipe } from "@/lib/storage";
import { Recipe } from "@/lib/types";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await getRecipes(userId));
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await req.json();
  const now = new Date().toISOString();
  const recipe: Omit<Recipe, "id" | "userId" | "createdAt" | "updatedAt" | "timesMade"> = {
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
    sourceUrl: data.sourceUrl,
  };
  const fullRecipe: Recipe = {
    ...recipe,
    timesMade: 0,
    id: crypto.randomUUID(),
    userId,
    createdAt: now,
    updatedAt: now,
  };
  await saveRecipe(fullRecipe, userId);
  return NextResponse.json({ id: fullRecipe.id });
}
