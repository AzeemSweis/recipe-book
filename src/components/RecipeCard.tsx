import Link from "next/link";
import { Recipe } from "@/lib/types";

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Link
      href={`/recipe/${recipe.id}`}
      className="block bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl dark:shadow-none border border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700 transition-all duration-300 group"
    >
      {recipe.image && (
        <div className="h-44 overflow-hidden">
          <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      )}
      <div className="p-5">
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5 line-clamp-1 text-base">{recipe.title}</h3>
        {recipe.description && (
          <p className="text-sm text-zinc-500 dark:text-zinc-500 line-clamp-2 mb-3">{recipe.description}</p>
        )}
        <div className="flex flex-wrap gap-3 text-xs text-zinc-500 dark:text-zinc-500">
          {recipe.totalTime && <span>⏱ {recipe.totalTime}</span>}
          {recipe.servings && <span>🍽 {recipe.servings}</span>}
          {recipe.cuisine && <span>🌍 {recipe.cuisine}</span>}
        </div>
        {recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {recipe.tags.slice(0, 4).map((t) => (
              <span key={t} className="text-xs px-2.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-600 dark:text-zinc-400">{t}</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
