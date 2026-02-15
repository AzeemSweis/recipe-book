import { getRecipes } from "@/lib/storage";
import RecipeCard from "@/components/RecipeCard";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const recipes = getRecipes().sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Your Recipes</h1>
          <p className="text-zinc-400 mt-1">{recipes.length} recipe{recipes.length !== 1 ? "s" : ""} saved</p>
        </div>
        <Link href="/import" className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          + Import URL
        </Link>
      </div>

      {recipes.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">🍳</p>
          <p className="text-zinc-400 mb-2">No recipes yet</p>
          <p className="text-zinc-600 text-sm">Import a recipe URL or add one manually to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {recipes.map((r) => (
            <RecipeCard key={r.id} recipe={r} />
          ))}
        </div>
      )}
    </div>
  );
}
