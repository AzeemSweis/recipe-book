import { NextResponse } from "next/server";
import { deleteRecipe } from "@/lib/storage";

type Props = { params: Promise<{ id: string }> };

export async function DELETE(_req: Request, { params }: Props) {
  const { id } = await params;
  deleteRecipe(id);
  return NextResponse.json({ ok: true });
}
