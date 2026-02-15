import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { deleteRecipe, getRecipe } from "@/lib/storage";

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
