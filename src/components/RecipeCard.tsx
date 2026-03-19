import Link from "next/link";
import { Recipe } from "@/lib/types";

const CATEGORY_FALLBACKS: Record<string, { icon: string; gradient: string }> = {
  "Breakfast":    { icon: "egg_alt",         gradient: "from-amber-100 to-orange-200 dark:from-amber-900/40 dark:to-orange-900/40" },
  "Lunch":        { icon: "lunch_dining",    gradient: "from-green-100 to-emerald-200 dark:from-green-900/40 dark:to-emerald-900/40" },
  "Dinner":       { icon: "dinner_dining",   gradient: "from-indigo-100 to-purple-200 dark:from-indigo-900/40 dark:to-purple-900/40" },
  "Main Course":  { icon: "dinner_dining",   gradient: "from-rose-100 to-pink-200 dark:from-rose-900/40 dark:to-pink-900/40" },
  "Appetizer":    { icon: "tapas",           gradient: "from-orange-100 to-red-200 dark:from-orange-900/40 dark:to-red-900/40" },
  "Dessert":      { icon: "cake",            gradient: "from-pink-100 to-fuchsia-200 dark:from-pink-900/40 dark:to-fuchsia-900/40" },
  "Snack":        { icon: "cookie",          gradient: "from-yellow-100 to-amber-200 dark:from-yellow-900/40 dark:to-amber-900/40" },
  "Beverage":     { icon: "local_cafe",      gradient: "from-cyan-100 to-teal-200 dark:from-cyan-900/40 dark:to-teal-900/40" },
  "Side Dish":    { icon: "set_meal",        gradient: "from-lime-100 to-green-200 dark:from-lime-900/40 dark:to-green-900/40" },
};
const DEFAULT_FALLBACK = { icon: "restaurant_menu", gradient: "from-primary-container to-primary/20 dark:from-primary/10 dark:to-primary/20" };

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  const fallback = CATEGORY_FALLBACKS[recipe.category || ""] || DEFAULT_FALLBACK;

  return (
    <Link
      href={`/recipe/${recipe.id}`}
      className="group block bg-surface dark:bg-surface-dark rounded-xl overflow-hidden shadow-sm hover:shadow-lg border border-outline-variant/50 dark:border-outline-variant-dark/50 transition-all duration-300"
    >
      {/* Image area */}
      <div className="relative aspect-video overflow-hidden">
        {recipe.image ? (
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${fallback.gradient}`}>
            <span className="material-symbols-outlined text-6xl text-on-surface-variant/25 dark:text-on-surface-variant-dark/30 group-hover:scale-110 transition-transform duration-500">
              {fallback.icon}
            </span>
          </div>
        )}

        {/* Cook counter badge — top-right */}
        {recipe.timesMade > 0 && (
          <div className="absolute top-3 right-3 bg-primary text-white rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-sm">
            Made {recipe.timesMade}x
          </div>
        )}

        {/* Category badge — bottom-left */}
        {recipe.category && (
          <div className="absolute bottom-3 left-3 bg-black/60 text-white rounded-full px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide">
            {recipe.category}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-semibold text-on-surface group-hover:text-primary transition-colors mb-1.5 text-base leading-snug">
          {recipe.title}
        </h3>
        {recipe.description && (
          <p className="text-on-surface-variant text-sm line-clamp-2 mb-4 leading-relaxed">
            {recipe.description}
          </p>
        )}

        {/* Metadata row */}
        <div className="mt-auto flex items-center gap-4 border-t border-outline-variant/30 pt-3">
          {(recipe.prepTime || recipe.cookTime || recipe.totalTime) && (
            <div className="flex flex-col">
              <span className="text-[10px] uppercase text-on-surface-variant font-bold tracking-wide">Time</span>
              <span className="text-sm font-semibold text-on-surface flex items-center gap-1">
                <span className="material-symbols-outlined text-xs text-primary">timer</span>
                {recipe.totalTime || recipe.cookTime || recipe.prepTime}
              </span>
            </div>
          )}
          {recipe.servings && (
            <div className="flex flex-col">
              <span className="text-[10px] uppercase text-on-surface-variant font-bold tracking-wide">Serves</span>
              <span className="text-sm font-semibold text-on-surface flex items-center gap-1">
                <span className="material-symbols-outlined text-xs text-primary">groups</span>
                {recipe.servings}
              </span>
            </div>
          )}
          {recipe.cuisine && (
            <div className="flex flex-col">
              <span className="text-[10px] uppercase text-on-surface-variant font-bold tracking-wide">Cuisine</span>
              <span className="text-sm font-semibold text-on-surface flex items-center gap-1">
                <span className="material-symbols-outlined text-xs text-primary">public</span>
                {recipe.cuisine}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export default RecipeCard;
