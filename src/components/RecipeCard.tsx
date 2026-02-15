import Link from "next/link";
import { Recipe } from "@/lib/types";

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Link
      href={`/recipe/${recipe.id}`}
      className="block bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors group"
    >
      {recipe.image && (
        <div className="h-40 overflow-hidden">
          <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        </div>
      )}
      <div className="p-4">
        <h3 className="font-semibold text-zinc-200 mb-1 line-clamp-1">{recipe.title}</h3>
        {recipe.description && (
          <p className="text-xs text-zinc-500 line-clamp-2 mb-2">{recipe.description}</p>
        )}
        <div className="flex flex-wrap gap-2 text-xs text-zinc-500">
          {recipe.totalTime && <span>⏱ {recipe.totalTime}</span>}
          {recipe.servings && <span>🍽 {recipe.servings}</span>}
          {recipe.cuisine && <span>🌍 {recipe.cuisine}</span>}
        </div>
        {recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {recipe.tags.slice(0, 4).map((t) => (
              <span key={t} className="text-xs px-2 py-0.5 bg-zinc-800 rounded text-zinc-400">{t}</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
