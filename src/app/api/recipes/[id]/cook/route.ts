import { NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/auth";
import { getRecipe, saveRecipe } from "@/lib/storage";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getAuthenticatedUserId(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const recipe = await getRecipe(id, userId);
  if (!recipe) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  recipe.timesMade += 1;
  await saveRecipe(recipe, userId);
  return NextResponse.json({ timesMade: recipe.timesMade });
}