import { currentUser } from "@clerk/nextjs/server";
import { getRecipe } from "@/lib/storage";
import { notFound } from "next/navigation";
import RecipeForm from "@/components/RecipeForm";
import Link from "next/link";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditRecipePage({ params }: Props) {
  const { id } = await params;
  const user = await currentUser();

  if (!user) {
    notFound();
  }

  const recipe = await getRecipe(id, user.id);

  if (!recipe) {
    notFound();
  }

  const initialData = {
    title: recipe.title,
    description: recipe.description || '',
    servings: recipe.servings || '',
    prepTime: recipe.prepTime || '',
    cookTime: recipe.cookTime || '',
    totalTime: recipe.totalTime || '',
    cuisine: recipe.cuisine || '',
    category: recipe.category || '',
    tags: recipe.tags.join(', '),
    ingredients: recipe.ingredients.map(ing => ({
      amount: ing.amount,
      unit: ing.unit,
      name: ing.name,
    })),
    instructions: recipe.instructions,
    notes: recipe.notes || '',
    image: recipe.image || '',
    sourceUrl: recipe.sourceUrl || '',
  };

  return (
    <div>
      <Link href={`/recipe/${id}`} className="text-sm text-zinc-500 hover:text-rose-500 dark:hover:text-rose-400 mb-6 inline-block transition-colors">← Back to recipe</Link>
      <RecipeForm initialData={initialData} recipeId={id} mode="edit" />
    </div>
  );
}
