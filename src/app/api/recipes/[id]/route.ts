import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { deleteRecipe, getRecipe, saveRecipe } from "@/lib/storage";

type Props = { params: Promise<{ id: string }> };

export async function DELETE(req: Request, { params }: Props) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const recipe = await getRecipe(id, userId);
  if (!recipe) {
    return NextResponse.json({ error: "Not found or not yours" }, { status: 403 });
  }
  await deleteRecipe(id, userId);
  return NextResponse.json({ ok: true });
}

export async function PUT(req: Request, { params }: Props) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const recipe = await getRecipe(id, userId);
  if (!recipe) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const data = await req.json();
  const { id: _, userId: __, createdAt: ___, timesMade: ____, ...updates } = data;
  Object.assign(recipe, updates);
  recipe.updatedAt = new Date().toISOString();
  await saveRecipe(recipe, userId);
  return NextResponse.json({ ok: true });
}