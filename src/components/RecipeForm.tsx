'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface IngredientRow {
  amount: string
  unit: string
  name: string
}

interface RecipeFormData {
  title: string
  description: string
  servings: string
  prepTime: string
  cookTime: string
  totalTime: string
  cuisine: string
  category: string
  tags: string
  ingredients: IngredientRow[]
  instructions: string[]
  notes: string
  image: string
  sourceUrl: string
}

interface Props {
  initialData?: Partial<RecipeFormData>
  recipeId?: string
  mode: 'create' | 'edit'
}

const emptyIngredient = (): IngredientRow => ({ amount: '', unit: '', name: '' })
const inputCls = "w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-200 outline-none focus:border-rose-400 dark:focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all"
const smallInputCls = "bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-zinc-200 outline-none focus:border-rose-400 dark:focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all"

export default function RecipeForm({ initialData, recipeId, mode }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [title, setTitle] = useState(initialData?.title || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [servings, setServings] = useState(initialData?.servings || '')
  const [prepTime, setPrepTime] = useState(initialData?.prepTime || '')
  const [cookTime, setCookTime] = useState(initialData?.cookTime || '')
  const [totalTime, setTotalTime] = useState(initialData?.totalTime || '')
  const [cuisine, setCuisine] = useState(initialData?.cuisine || '')
  const [category, setCategory] = useState(initialData?.category || '')
  const [tags, setTags] = useState(initialData?.tags || '')
  const [notes, setNotes] = useState(initialData?.notes || '')
  const [image, setImage] = useState(initialData?.image || '')
  const [sourceUrl, setSourceUrl] = useState(initialData?.sourceUrl || '')

  const [ingredients, setIngredients] = useState<IngredientRow[]>(
    initialData?.ingredients?.length ? initialData.ingredients : [emptyIngredient()]
  )
  const [instructions, setInstructions] = useState<string[]>(
    initialData?.instructions?.length ? initialData.instructions : ['']
  )

  const addIngredient = () => setIngredients([...ingredients, emptyIngredient()])
  const removeIngredient = (i: number) => setIngredients(ingredients.filter((_, idx) => idx !== i))
  const updateIngredient = (i: number, field: keyof IngredientRow, value: string) => {
    const updated = [...ingredients]
    updated[i] = { ...updated[i], [field]: value }
    setIngredients(updated)
  }

  const addInstruction = () => setInstructions([...instructions, ''])
  const removeInstruction = (i: number) => setInstructions(instructions.filter((_, idx) => idx !== i))
  const updateInstruction = (i: number, value: string) => {
    const updated = [...instructions]
    updated[i] = value
    setInstructions(updated)
  }

  const handleSubmit = async () => {
    if (!title.trim()) return
    setLoading(true)

    const body = {
      title: title.trim(),
      description: description.trim() || undefined,
      servings: servings.trim() || undefined,
      prepTime: prepTime.trim() || undefined,
      cookTime: cookTime.trim() || undefined,
      totalTime: totalTime.trim() || undefined,
      cuisine: cuisine.trim() || undefined,
      category: category.trim() || undefined,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      ingredients: ingredients.filter(ing => ing.name.trim()).map(ing => ({
        amount: ing.amount.trim(),
        unit: ing.unit.trim(),
        name: ing.name.trim(),
      })),
      instructions: instructions.filter(s => s.trim()).map(s => s.trim()),
      notes: notes.trim() || undefined,
      image: image.trim() || undefined,
      sourceUrl: sourceUrl.trim() || undefined,
    }

    try {
      if (mode === 'edit' && recipeId) {
        const res = await fetch(`/api/recipes/${recipeId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (!res.ok) throw new Error('Failed to update')
        router.push(`/recipe/${recipeId}`)
      } else {
        const res = await fetch('/api/recipes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (!res.ok) throw new Error('Failed to create')
        const data = await res.json()
        router.push(`/recipe/${data.id}`)
      }
    } catch {
      alert('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-2">
        {mode === 'edit' ? 'Edit Recipe' : 'Add Recipe'}
      </h1>
      <p className="text-zinc-500 dark:text-zinc-400 mb-8 text-lg">
        {mode === 'edit' ? 'Update your recipe details' : 'Create a new recipe from scratch'}
      </p>

      <div className="space-y-6">
        {/* Title & Description */}
        <div>
          <label className="text-xs font-medium text-zinc-500 dark:text-zinc-500 mb-1.5 block">Title *</label>
          <input value={title} onChange={e => setTitle(e.target.value)} className={inputCls} placeholder="Recipe name" />
        </div>
        <div>
          <label className="text-xs font-medium text-zinc-500 dark:text-zinc-500 mb-1.5 block">Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} className={`${inputCls} h-20`} placeholder="A brief description of the recipe..." />
        </div>

        {/* Meta grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-500 mb-1.5 block">Servings</label>
            <input value={servings} onChange={e => setServings(e.target.value)} className={inputCls} placeholder="4" />
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-500 mb-1.5 block">Cuisine</label>
            <input value={cuisine} onChange={e => setCuisine(e.target.value)} className={inputCls} placeholder="Italian" />
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-500 mb-1.5 block">Prep Time</label>
            <input value={prepTime} onChange={e => setPrepTime(e.target.value)} className={inputCls} placeholder="15m" />
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-500 mb-1.5 block">Cook Time</label>
            <input value={cookTime} onChange={e => setCookTime(e.target.value)} className={inputCls} placeholder="30m" />
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-500 mb-1.5 block">Total Time</label>
            <input value={totalTime} onChange={e => setTotalTime(e.target.value)} className={inputCls} placeholder="45m" />
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-500 mb-1.5 block">Category</label>
            <input value={category} onChange={e => setCategory(e.target.value)} className={inputCls} placeholder="Dinner" />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-zinc-500 dark:text-zinc-500 mb-1.5 block">Tags (comma-separated)</label>
          <input value={tags} onChange={e => setTags(e.target.value)} className={inputCls} placeholder="dinner, quick, healthy" />
        </div>

        {/* Ingredients */}
        <div>
          <label className="text-xs font-medium text-zinc-500 dark:text-zinc-500 mb-3 block">🥘 Ingredients</label>
          <div className="space-y-2">
            {ingredients.map((ing, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  value={ing.amount}
                  onChange={e => updateIngredient(i, 'amount', e.target.value)}
                  className={`${smallInputCls} w-20`}
                  placeholder="Amt"
                />
                <input
                  value={ing.unit}
                  onChange={e => updateIngredient(i, 'unit', e.target.value)}
                  className={`${smallInputCls} w-20`}
                  placeholder="Unit"
                />
                <input
                  value={ing.name}
                  onChange={e => updateIngredient(i, 'name', e.target.value)}
                  className={`${smallInputCls} flex-1`}
                  placeholder="Ingredient name"
                />
                {ingredients.length > 1 && (
                  <button
                    onClick={() => removeIngredient(i)}
                    className="text-zinc-400 hover:text-rose-500 transition-colors text-sm px-1"
                    title="Remove"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={addIngredient}
            className="mt-2 text-xs text-rose-500 hover:text-rose-400 font-medium transition-colors"
          >
            + Add ingredient
          </button>
        </div>

        {/* Instructions */}
        <div>
          <label className="text-xs font-medium text-zinc-500 dark:text-zinc-500 mb-3 block">📝 Instructions</label>
          <div className="space-y-2">
            {instructions.map((step, i) => (
              <div key={i} className="flex gap-2 items-start">
                <span className="text-rose-500 dark:text-rose-400 font-bold text-sm min-w-[1.5rem] pt-2.5">{i + 1}</span>
                <textarea
                  value={step}
                  onChange={e => updateInstruction(i, e.target.value)}
                  className={`${smallInputCls} flex-1 min-h-[2.5rem] resize-y`}
                  placeholder={`Step ${i + 1}...`}
                  rows={2}
                />
                {instructions.length > 1 && (
                  <button
                    onClick={() => removeInstruction(i)}
                    className="text-zinc-400 hover:text-rose-500 transition-colors text-sm px-1 pt-2.5"
                    title="Remove"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={addInstruction}
            className="mt-2 text-xs text-rose-500 hover:text-rose-400 font-medium transition-colors"
          >
            + Add step
          </button>
        </div>

        {/* Notes, Image, Source */}
        <div>
          <label className="text-xs font-medium text-zinc-500 dark:text-zinc-500 mb-1.5 block">Notes</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} className={`${inputCls} h-20`} placeholder="Optional notes..." />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-500 mb-1.5 block">Image URL</label>
            <input value={image} onChange={e => setImage(e.target.value)} className={inputCls} placeholder="https://..." />
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-500 mb-1.5 block">Source URL</label>
            <input value={sourceUrl} onChange={e => setSourceUrl(e.target.value)} className={inputCls} placeholder="https://..." />
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading || !title.trim()}
          className="bg-rose-500 hover:bg-rose-600 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 text-white px-6 py-3.5 rounded-2xl text-sm font-semibold transition-all hover:shadow-lg hover:shadow-rose-500/25 w-full"
        >
          {loading ? 'Saving...' : mode === 'edit' ? 'Update Recipe' : 'Save Recipe'}
        </button>
      </div>
    </div>
  )
}
