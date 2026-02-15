import { currentUser } from "@clerk/nextjs/server";
import { getRecipes } from "@/lib/storage";
import RecipeCard from "@/components/RecipeCard";
import Link from "next/link";
import { Recipe } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await currentUser();
  let recipes: Recipe[] = [];

  if (user) {
    recipes = getRecipes(user.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">{user ? "Your Recipes" : "Recipe Book"}</h1>
          <p className="text-zinc-400 mt-1">{user ? `${recipes.length} recipe${recipes.length !== 1 ? "s" : ""} saved` : "Sign in to get started"}</p>
        </div>
        {user ? (
          <Link href="/import" className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            + Import URL
          </Link>
        ) : (
          <Link href="/sign-in" className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Sign In
          </Link>
        )}
      </div>

      {recipes.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">🍳</p>
          {user ? (
            <>
              <p className="text-zinc-400 mb-2">No recipes yet</p>
              <p className="text-zinc-600 text-sm">Import a recipe URL or add one manually to get started.</p>
            </>
          ) : (
            <>
              <p className="text-zinc-400 mb-2">No recipes to show</p>
              <p className="text-zinc-600 text-sm">Sign in to parse and track your favorites.</p>
            </>
          )}
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
