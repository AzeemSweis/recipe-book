import { getRecipe } from "@/lib/storage";
import Link from "next/link";
import DeleteButton from "./DeleteButton";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function RecipePage({ params }: Props) {
  const { id } = await params;
  const recipe = getRecipe(id);

  if (!recipe) {
    return (
      <div className="text-center py-20">
        <p className="text-zinc-400">Recipe not found.</p>
        <Link href="/" className="text-indigo-400 text-sm mt-2 inline-block">← Back to recipes</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-300 mb-4 inline-block">← Back to recipes</Link>

      {recipe.image && (
        <div className="rounded-xl overflow-hidden mb-6 max-h-80">
          <img src={recipe.image} alt={recipe.title} className="w-full object-cover" />
        </div>
      )}

      <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
      {recipe.description && <p className="text-zinc-400 mb-4">{recipe.description}</p>}

      {/* Meta info */}
      <div className="flex flex-wrap gap-4 text-sm text-zinc-400 mb-6">
        {recipe.prepTime && <div><span className="text-zinc-600">Prep:</span> {recipe.prepTime}</div>}
        {recipe.cookTime && <div><span className="text-zinc-600">Cook:</span> {recipe.cookTime}</div>}
        {recipe.totalTime && <div><span className="text-zinc-600">Total:</span> {recipe.totalTime}</div>}
        {recipe.servings && <div><span className="text-zinc-600">Servings:</span> {recipe.servings}</div>}
        {recipe.cuisine && <div><span className="text-zinc-600">Cuisine:</span> {recipe.cuisine}</div>}
        {recipe.category && <div><span className="text-zinc-600">Category:</span> {recipe.category}</div>}
      </div>

      {recipe.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {recipe.tags.map((t) => (
            <span key={t} className="text-xs px-2.5 py-1 bg-zinc-800 rounded-full text-zinc-400">{t}</span>
          ))}
        </div>
      )}

      {/* Ingredients */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-zinc-200">🥘 Ingredients</h2>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          {recipe.ingredients.length === 0 ? (
            <p className="text-zinc-500 text-sm">No ingredients parsed.</p>
          ) : (
            <ul className="space-y-2">
              {recipe.ingredients.map((ing, i) => (
                <li key={i} className="flex items-baseline gap-2 text-sm">
                  <span className="text-indigo-400 font-medium min-w-[3rem] text-right">{ing.amount}</span>
                  <span className="text-zinc-500 min-w-[3rem]">{ing.unit}</span>
                  <span className="text-zinc-200">{ing.name}</span>
                  {ing.notes && <span className="text-zinc-600 text-xs">({ing.notes})</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Instructions */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-zinc-200">📝 Instructions</h2>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          {recipe.instructions.length === 0 ? (
            <p className="text-zinc-500 text-sm">No instructions parsed.</p>
          ) : (
            <ol className="space-y-4">
              {recipe.instructions.map((step, i) => (
                <li key={i} className="flex gap-4 text-sm">
                  <span className="text-indigo-400 font-bold text-lg min-w-[1.5rem]">{i + 1}</span>
                  <p className="text-zinc-300 leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>

      {recipe.notes && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-zinc-200">📌 Notes</h2>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-sm text-zinc-400">
            {recipe.notes}
          </div>
        </section>
      )}

      <div className="flex items-center gap-4 pt-4 border-t border-zinc-800">
        {recipe.sourceUrl && (
          <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-400 hover:text-indigo-300">
            View original →
          </a>
        )}
        <DeleteButton id={recipe.id} />
      </div>
    </div>
  );
}
