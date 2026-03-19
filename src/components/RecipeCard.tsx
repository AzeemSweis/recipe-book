import Link from "next/link";
import { Recipe } from "@/lib/types";

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Link
      href={`/recipe/${recipe.id}`}
      className="group block bg-surface dark:bg-surface-dark rounded-xl overflow-hidden shadow-sm hover:shadow-lg border border-outline-variant/50 transition-all duration-300"
    >
      {/* Image area */}
      <div className="relative aspect-video overflow-hidden bg-primary-container/30">
        {recipe.image ? (
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant/30">restaurant_menu</span>
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
