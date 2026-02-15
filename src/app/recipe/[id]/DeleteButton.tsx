"use client";

import { useRouter } from "next/navigation";

export default function DeleteButton({ id }: { id: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Delete this recipe?")) return;
    await fetch(`/api/recipes/${id}`, { method: "DELETE" });
    router.push("/");
  };

  return (
    <button onClick={handleDelete} className="text-sm text-zinc-400 hover:text-red-500 dark:text-zinc-600 dark:hover:text-red-400 transition-colors">
      Delete recipe
    </button>
  );
}
