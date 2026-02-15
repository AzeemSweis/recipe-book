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
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{user ? "Your Recipes" : "Recipe Book"}</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-lg">{user ? `${recipes.length} recipe${recipes.length !== 1 ? "s" : ""} saved` : "Sign in to get started"}</p>
        </div>
        {user ? (
          <Link href="/import" className="bg-rose-500 hover:bg-rose-600 text-white px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all hover:shadow-lg hover:shadow-rose-500/25">
            + Import URL
          </Link>
        ) : (
          <Link href="/sign-in" className="bg-rose-500 hover:bg-rose-600 text-white px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all hover:shadow-lg hover:shadow-rose-500/25">
            Sign In
          </Link>
        )}
      </div>

      {recipes.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-5xl mb-6">🍳</p>
          {user ? (
            <>
              <p className="text-zinc-500 dark:text-zinc-400 text-lg mb-2">No recipes yet</p>
              <p className="text-zinc-400 dark:text-zinc-600 text-sm">Import a recipe URL or add one manually to get started.</p>
            </>
          ) : (
            <>
              <p className="text-zinc-500 dark:text-zinc-400 text-lg mb-2">No recipes to show</p>
              <p className="text-zinc-400 dark:text-zinc-600 text-sm">Sign in to parse and track your favorites.</p>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((r) => (
            <RecipeCard key={r.id} recipe={r} />
          ))}
        </div>
      )}
    </div>
  );
}
