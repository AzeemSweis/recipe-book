import { currentUser } from "@clerk/nextjs/server";
import { getRecipes } from "@/lib/storage";
import Link from "next/link";
import { Recipe } from "@/lib/types";
import RecipeGrid from "@/components/RecipeGrid";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await currentUser();
  let recipes: Recipe[] = [];

  if (user) {
    recipes = (await getRecipes(user.id)).sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt)
    );
  }

  // Authenticated view
  if (user) {
    return (
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-8">
          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-on-surface tracking-tight">
              Your Recipes
            </h1>
            <p className="text-on-surface-variant mt-1">
              {recipes.length} recipe{recipes.length !== 1 ? "s" : ""} saved
            </p>
          </div>

          {recipes.length === 0 ? (
            <div className="text-center py-24">
              <span className="material-symbols-outlined text-6xl text-on-surface-variant/30 mb-4 block">
                restaurant_menu
              </span>
              <p className="text-on-surface-variant text-lg mb-2">No recipes yet</p>
              <p className="text-on-surface-variant/60 text-sm mb-6">
                Import a recipe URL or add one manually to get started.
              </p>
              <div className="flex items-center justify-center gap-3">
                <Link
                  href="/import"
                  className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm"
                >
                  Import URL
                </Link>
                <Link
                  href="/add"
                  className="border border-outline-variant text-on-surface hover:bg-primary-container px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
                >
                  Add Manually
                </Link>
              </div>
            </div>
          ) : (
            <RecipeGrid recipes={recipes} />
          )}
        </div>

        {/* Floating Action Button */}
        <Link
          href="/add"
          className="fixed bottom-8 right-8 w-14 h-14 bg-primary hover:bg-primary/90 text-white rounded-full shadow-2xl shadow-primary/30 hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center z-50 group"
          aria-label="Add recipe"
        >
          <span className="material-symbols-outlined text-2xl">add</span>
          <span className="absolute right-full mr-4 px-3 py-1 bg-on-surface text-surface text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Add Recipe
          </span>
        </Link>
      </div>
    );
  }

  // Landing page — unauthenticated
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-20 py-16 lg:py-28 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: text */}
          <div className="flex flex-col gap-8 order-2 lg:order-1">
            <div className="flex flex-col gap-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider w-fit">
                <span className="material-symbols-outlined text-sm leading-none">auto_awesome</span>
                Your Personal Kitchen Assistant
              </span>
              <h1 className="text-on-surface text-4xl lg:text-6xl font-black leading-[1.1] tracking-tight">
                Your recipes, all in{" "}
                <span className="text-primary">one place.</span>
              </h1>
              <p className="text-on-surface-variant text-lg lg:text-xl leading-relaxed max-w-[540px]">
                Save, organize, and cook from your personal collection. No more messy bookmarks or lost index cards.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/sign-up"
                className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 text-center"
              >
                Get Started for Free
              </Link>
              <Link
                href="/sign-in"
                className="flex items-center justify-center gap-2 border border-outline-variant bg-surface dark:bg-surface-dark px-8 py-4 rounded-xl text-lg font-bold hover:bg-primary-container transition-colors text-on-surface"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Right: illustration */}
          <div className="order-1 lg:order-2">
            <div className="relative group">
              <div className="absolute -inset-4 bg-primary/20 rounded-[2.5rem] blur-2xl group-hover:bg-primary/30 transition-all duration-500" />
              <div className="relative rounded-2xl overflow-hidden border-8 border-surface dark:border-surface-dark shadow-2xl rotate-2 group-hover:rotate-0 transition-transform duration-500 bg-primary-container aspect-[4/5] flex items-center justify-center">
                <div className="text-center px-8">
                  <span className="material-symbols-outlined text-[8rem] text-primary/30">restaurant_menu</span>
                  <p className="text-on-surface-variant text-sm font-medium mt-4">Your recipe collection</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="bg-surface dark:bg-surface-dark py-24 px-6 lg:px-20" id="features">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-4 text-center mb-16">
            <h2 className="text-on-surface text-3xl lg:text-4xl font-black tracking-tight">
              Simplify Your Cooking Experience
            </h2>
            <p className="text-on-surface-variant text-lg max-w-[700px] mx-auto">
              Everything you need to manage your personal recipe collection with ease.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-background dark:bg-background-dark p-8 rounded-2xl border border-outline-variant/50 shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl">language</span>
              </div>
              <h3 className="text-on-surface text-xl font-bold mb-3">Import from any website</h3>
              <p className="text-on-surface-variant leading-relaxed">
                Found a recipe on a blog or news site? Just paste the URL and we&apos;ll extract the ingredients and steps instantly.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="bg-background dark:bg-background-dark p-8 rounded-2xl border border-outline-variant/50 shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl">label</span>
              </div>
              <h3 className="text-on-surface text-xl font-bold mb-3">Organize with tags</h3>
              <p className="text-on-surface-variant leading-relaxed">
                Categorize your meals with custom tags. Filter by &ldquo;Quick Dinners&rdquo;, &ldquo;Gluten-Free&rdquo;, or &ldquo;Kid-Friendly&rdquo; in a tap.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="bg-background dark:bg-background-dark p-8 rounded-2xl border border-outline-variant/50 shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl">skillet</span>
              </div>
              <h3 className="text-on-surface text-xl font-bold mb-3">Track what you cook</h3>
              <p className="text-on-surface-variant leading-relaxed">
                Keep a history of your culinary adventures. See which recipes you cook the most and add personal notes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 px-6 lg:px-20">
        <div className="max-w-7xl mx-auto bg-primary rounded-3xl p-12 lg:p-20 text-center overflow-hidden relative">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 opacity-10">
            <span className="material-symbols-outlined text-[16rem]">restaurant</span>
          </div>
          <div className="relative z-10 flex flex-col items-center gap-8">
            <h2 className="text-white text-4xl lg:text-5xl font-black leading-tight max-w-[800px]">
              Ready to build your digital cookbook?
            </h2>
            <p className="text-white/80 text-lg font-medium max-w-[600px]">
              Join home cooks who have organized their kitchen life. Start your journey today for free.
            </p>
            <Link
              href="/sign-up"
              className="bg-white text-primary px-10 py-5 rounded-2xl text-xl font-bold shadow-2xl transition-all hover:scale-105 active:scale-95"
            >
              Get Started for Free
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface dark:bg-surface-dark border-t border-outline-variant/30 py-12 px-6 lg:px-20 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center bg-primary rounded-lg p-1.5 text-white">
              <span className="material-symbols-outlined text-xl leading-none">restaurant_menu</span>
            </div>
            <span className="text-on-surface font-bold text-lg">Recipe Book</span>
          </div>
          <p className="text-on-surface-variant text-sm">
            &copy; {new Date().getFullYear()} Recipe Book. Made for home cooks.
          </p>
        </div>
      </footer>
    </div>
  );
}
