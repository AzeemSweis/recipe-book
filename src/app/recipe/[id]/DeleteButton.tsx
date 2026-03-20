"use client";

import { useRouter } from "next/navigation";

export default function DeleteButton({ id }: { id: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Delete this recipe?")) return;
    try {
      const res = await fetch(`/api/recipes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      router.push("/");
    } catch {
      alert("Failed to delete recipe. Please try again.");
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 h-12 rounded-xl border border-error/30 text-error hover:bg-error/10 font-bold transition-all"
    >
      <span className="material-symbols-outlined text-lg">delete</span>
      <span>Delete</span>
    </button>
  );
}
