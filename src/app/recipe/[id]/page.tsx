import { currentUser } from "@clerk/nextjs/server";
import { getRecipe } from "@/lib/storage";
import Link from "next/link";
import DeleteButton from "./DeleteButton";
import CookCounter from "./CookCounter";
import EditButton from "./EditButton";
import IngredientList from "@/components/IngredientList";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function RecipePage({ params }: Props) {
  const { id } = await params;
  const user = await currentUser();

  if (!user) {
    notFound();
  }

  const recipe = await getRecipe(id, user.id);

  if (!recipe) {
    notFound();
  }

  const totalTimeMins = recipe.prepTime && recipe.cookTime
    ? `${recipe.prepTime} + ${recipe.cookTime}`
    : recipe.totalTime || null;

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-10 py-8 pb-16">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-on-surface-variant hover:text-primary font-semibold text-sm transition-colors"
        >
          <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">
            arrow_back
          </span>
          Back to recipes
        </Link>
      </div>

      {/* Hero image */}
      {recipe.image ? (
        <div className="relative w-full aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden shadow-xl mb-8 group">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 md:p-10">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow-md">
              {recipe.title}
            </h1>
            {recipe.description && (
              <p className="text-white/80 text-base md:text-lg max-w-2xl">{recipe.description}</p>
            )}
          </div>
        </div>
      ) : (
        <div className="mb-8">
          <div className="w-full bg-primary-container rounded-2xl px-8 py-10 mb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-on-surface tracking-tight">
              {recipe.title}
            </h1>
            {recipe.description && (
              <p className="text-on-surface-variant text-lg mt-3 max-w-2xl">{recipe.description}</p>
            )}
          </div>
        </div>
      )}

      {/* Metadata cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-8">
        {recipe.prepTime && (
          <div className="flex flex-col items-center gap-1 bg-surface dark:bg-surface-dark rounded-xl p-4 text-center border border-outline-variant/50">
            <span className="material-symbols-outlined text-primary text-xl">timer</span>
            <span className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider">Prep</span>
            <span className="text-on-surface font-bold">{recipe.prepTime}</span>
          </div>
        )}
        {recipe.cookTime && (
          <div className="flex flex-col items-center gap-1 bg-surface dark:bg-surface-dark rounded-xl p-4 text-center border border-outline-variant/50">
            <span className="material-symbols-outlined text-primary text-xl">skillet</span>
            <span className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider">Cook</span>
            <span className="text-on-surface font-bold">{recipe.cookTime}</span>
          </div>
        )}
        {(recipe.totalTime || totalTimeMins) && (
          <div className="flex flex-col items-center gap-1 bg-surface dark:bg-surface-dark rounded-xl p-4 text-center border border-outline-variant/50">
            <span className="material-symbols-outlined text-primary text-xl">schedule</span>
            <span className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider">Total</span>
            <span className="text-on-surface font-bold">{recipe.totalTime || totalTimeMins}</span>
          </div>
        )}
        {recipe.servings && (
          <div className="flex flex-col items-center gap-1 bg-surface dark:bg-surface-dark rounded-xl p-4 text-center border border-outline-variant/50">
            <span className="material-symbols-outlined text-primary text-xl">groups</span>
            <span className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider">Serves</span>
            <span className="text-on-surface font-bold">{recipe.servings}</span>
          </div>
        )}
        {recipe.cuisine && (
          <div className="flex flex-col items-center gap-1 bg-surface dark:bg-surface-dark rounded-xl p-4 text-center border border-outline-variant/50">
            <span className="material-symbols-outlined text-primary text-xl">public</span>
            <span className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider">Cuisine</span>
            <span className="text-on-surface font-bold">{recipe.cuisine}</span>
          </div>
        )}
        {recipe.timesMade > 0 && (
          <div className="flex flex-col items-center gap-1 bg-primary-container rounded-xl p-4 text-center border border-primary/20">
            <span className="material-symbols-outlined text-primary text-xl">skillet</span>
            <span className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider">Made</span>
            <span className="text-on-surface font-bold">{recipe.timesMade}x</span>
          </div>
        )}
      </div>

      {/* Action bar */}
      <div className="flex flex-wrap items-center gap-3 mb-10 pb-8 border-b border-outline-variant/30">
        <CookCounter id={recipe.id} timesMade={recipe.timesMade} />
        <EditButton id={recipe.id} />
        <DeleteButton id={recipe.id} />
      </div>

      {/* Tags */}
      {recipe.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {recipe.tags.map((t) => (
            <span
              key={t}
              className="text-xs px-3 py-1 bg-primary-container text-primary rounded-full font-medium"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      {/* Two-column: Ingredients + Instructions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Ingredients */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-3 mb-5">
            <span className="material-symbols-outlined text-primary">shopping_basket</span>
            <h2 className="text-xl font-bold text-on-surface">Ingredients</h2>
          </div>
          <div className="bg-surface dark:bg-surface-dark border border-outline-variant/50 rounded-2xl p-5">
            <IngredientList ingredients={recipe.ingredients} />
          </div>
        </div>

        {/* Instructions */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-5">
            <span className="material-symbols-outlined text-primary">format_list_numbered</span>
            <h2 className="text-xl font-bold text-on-surface">Instructions</h2>
          </div>

          {recipe.instructions.length === 0 ? (
            <p className="text-on-surface-variant text-sm">No instructions parsed.</p>
          ) : (
            <div className="space-y-6">
              {recipe.instructions.map((step, i) => (
                <div key={i} className="flex gap-5">
                  <span className="flex-none w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-base shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-on-surface leading-relaxed pt-1.5">{step}</p>
                </div>
              ))}
            </div>
          )}

          {/* Chef's Notes */}
          {recipe.notes && (
            <div className="mt-10 border-l-4 border-primary bg-primary-container/30 dark:bg-primary/10 rounded-r-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-primary">note</span>
                <h3 className="font-bold text-primary">Chef&apos;s Notes</h3>
              </div>
              <p className="text-on-surface-variant leading-relaxed italic">{recipe.notes}</p>
            </div>
          )}

          {/* Source link */}
          {recipe.sourceUrl && /^https?:\/\//i.test(recipe.sourceUrl) && (
            <div className="mt-6 flex items-center gap-2 text-sm">
              <span className="material-symbols-outlined text-tertiary text-base">link</span>
              <a
                href={recipe.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-tertiary hover:underline font-medium transition-colors"
              >
                View Original Recipe
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
