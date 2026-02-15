import { currentUser } from "@clerk/nextjs/server";
import { getRecipe } from "@/lib/storage";
import Link from "next/link";
import DeleteButton from "./DeleteButton";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function RecipePage({ params }: Props) {
  const { id } = await params;
  const user = await currentUser();

  if (!user) {
    notFound();
  }

  const recipe = getRecipe(id, user.id);

  if (!recipe) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/" className="text-sm text-zinc-500 hover:text-rose-500 dark:hover:text-rose-400 mb-6 inline-block transition-colors">← Back to recipes</Link>

      {recipe.image && (
        <div className="rounded-2xl overflow-hidden mb-8 max-h-80">
          <img src={recipe.image} alt={recipe.title} className="w-full object-cover" />
        </div>
      )}

      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">{recipe.title}</h1>
      {recipe.description && <p className="text-zinc-500 dark:text-zinc-400 text-lg mb-6">{recipe.description}</p>}

      {/* Meta info */}
      <div className="flex flex-wrap gap-4 text-sm text-zinc-600 dark:text-zinc-400 mb-8">
        {recipe.prepTime && <div className="bg-zinc-100 dark:bg-zinc-800/60 px-3 py-1.5 rounded-xl"><span className="text-zinc-400 dark:text-zinc-600">Prep:</span> {recipe.prepTime}</div>}
        {recipe.cookTime && <div className="bg-zinc-100 dark:bg-zinc-800/60 px-3 py-1.5 rounded-xl"><span className="text-zinc-400 dark:text-zinc-600">Cook:</span> {recipe.cookTime}</div>}
        {recipe.totalTime && <div className="bg-zinc-100 dark:bg-zinc-800/60 px-3 py-1.5 rounded-xl"><span className="text-zinc-400 dark:text-zinc-600">Total:</span> {recipe.totalTime}</div>}
        {recipe.servings && <div className="bg-zinc-100 dark:bg-zinc-800/60 px-3 py-1.5 rounded-xl"><span className="text-zinc-400 dark:text-zinc-600">Servings:</span> {recipe.servings}</div>}
        {recipe.cuisine && <div className="bg-zinc-100 dark:bg-zinc-800/60 px-3 py-1.5 rounded-xl"><span className="text-zinc-400 dark:text-zinc-600">Cuisine:</span> {recipe.cuisine}</div>}
        {recipe.category && <div className="bg-zinc-100 dark:bg-zinc-800/60 px-3 py-1.5 rounded-xl"><span className="text-zinc-400 dark:text-zinc-600">Category:</span> {recipe.category}</div>}
      </div>

      {recipe.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {recipe.tags.map((t) => (
            <span key={t} className="text-xs px-3 py-1 bg-rose-50 dark:bg-rose-500/10 rounded-full text-rose-600 dark:text-rose-400 font-medium">{t}</span>
          ))}
        </div>
      )}

      {/* Ingredients */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">🥘 Ingredients</h2>
        <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
          {recipe.ingredients.length === 0 ? (
            <p className="text-zinc-500 text-sm">No ingredients parsed.</p>
          ) : (
            <ul className="space-y-2.5">
              {recipe.ingredients.map((ing, i) => (
                <li key={i} className="flex items-baseline gap-2 text-sm">
                  <span className="text-rose-500 dark:text-rose-400 font-semibold min-w-[3rem] text-right">{ing.amount}</span>
                  <span className="text-zinc-500 min-w-[3rem]">{ing.unit}</span>
                  <span className="text-zinc-800 dark:text-zinc-200">{ing.name}</span>
                  {ing.notes && <span className="text-zinc-400 dark:text-zinc-600 text-xs">({ing.notes})</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Instructions */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">📝 Instructions</h2>
        <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
          {recipe.instructions.length === 0 ? (
            <p className="text-zinc-500 text-sm">No instructions parsed.</p>
          ) : (
            <ol className="space-y-5">
              {recipe.instructions.map((step, i) => (
                <li key={i} className="flex gap-4 text-sm">
                  <span className="text-rose-500 dark:text-rose-400 font-bold text-lg min-w-[1.5rem]">{i + 1}</span>
                  <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>

      {recipe.notes && (
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">📌 Notes</h2>
          <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {recipe.notes}
          </div>
        </section>
      )}

      <div className="flex items-center gap-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
        {recipe.sourceUrl && (
          <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 font-medium transition-colors">
            View original →
          </a>
        )}
        <DeleteButton id={recipe.id} />
      </div>
    </div>
  );
}
