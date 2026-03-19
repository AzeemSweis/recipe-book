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

const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Appetizer', 'Beverage', 'Other']

const emptyIngredient = (): IngredientRow => ({ amount: '', unit: '', name: '' })

const inputCls = "w-full bg-surface dark:bg-surface-dark border border-outline-variant dark:border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm text-on-surface placeholder-on-surface-variant/50 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
const labelCls = "block text-[11px] font-extrabold uppercase tracking-widest text-on-surface-variant mb-2"

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
  const [imageError, setImageError] = useState(false)
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
    <div className="max-w-4xl mx-auto px-4 md:px-10 py-8 pb-16">
      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <span className="material-symbols-outlined text-primary text-2xl">
            {mode === 'edit' ? 'edit' : 'auto_awesome'}
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">
            {mode === 'edit' ? 'Edit Recipe' : 'Create New Masterpiece'}
          </h1>
        </div>
        <p className="text-on-surface-variant">
          {mode === 'edit' ? 'Update your recipe details below.' : 'Document your culinary creation for future cooks.'}
        </p>
      </header>

      <div className="space-y-10">
        {/* Hero image section */}
        <section>
          <label className={labelCls}>Recipe Image (URL)</label>
          <input
            value={image}
            onChange={e => { setImage(e.target.value); setImageError(false) }}
            className={inputCls}
            placeholder="https://example.com/image.jpg"
          />
          {image ? (
            !imageError ? (
              <div className="mt-4 aspect-video w-full rounded-xl overflow-hidden border border-outline-variant/50 shadow-sm">
                <img
                  key={image}
                  src={image}
                  alt="Recipe preview"
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              </div>
            ) : null
          ) : (
            <div className="mt-4 aspect-video w-full rounded-xl bg-surface dark:bg-surface-dark border-2 border-dashed border-outline-variant flex flex-col items-center justify-center text-on-surface-variant/50">
              <span className="material-symbols-outlined text-4xl mb-2">add_photo_alternate</span>
              <p className="text-sm font-medium">Paste an image URL above to preview</p>
              <p className="text-xs mt-1 uppercase tracking-wide font-bold">Recommended: 16:9 ratio</p>
            </div>
          )}
        </section>

        {/* Basic info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <label className={labelCls}>Recipe Title *</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              className={`${inputCls} text-lg font-semibold`}
              placeholder="e.g. Herb Roasted Chicken"
            />
          </div>
          <div>
            <label className={labelCls}>Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className={`${inputCls} appearance-none`}
            >
              <option value="">Select category...</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className={labelCls}>Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            className={`${inputCls} resize-none`}
            placeholder="Describe the soul of this dish..."
            rows={3}
          />
        </div>

        {/* Stats bar: Prep / Cook / Serves */}
        <div className="grid grid-cols-3 gap-0 bg-surface dark:bg-surface-dark border border-outline-variant rounded-xl overflow-hidden">
          <div className="text-center px-4 py-3">
            <span className="block text-[10px] font-extrabold text-on-surface-variant uppercase tracking-wider mb-1">Prep Time</span>
            <input
              value={prepTime}
              onChange={e => setPrepTime(e.target.value)}
              className="w-full bg-transparent border-none text-center font-bold text-on-surface outline-none focus:ring-0 p-0 text-sm placeholder-on-surface-variant/40"
              placeholder="15m"
            />
          </div>
          <div className="text-center px-4 py-3 border-x border-outline-variant">
            <span className="block text-[10px] font-extrabold text-on-surface-variant uppercase tracking-wider mb-1">Cook Time</span>
            <input
              value={cookTime}
              onChange={e => setCookTime(e.target.value)}
              className="w-full bg-transparent border-none text-center font-bold text-on-surface outline-none focus:ring-0 p-0 text-sm placeholder-on-surface-variant/40"
              placeholder="45m"
            />
          </div>
          <div className="text-center px-4 py-3">
            <span className="block text-[10px] font-extrabold text-on-surface-variant uppercase tracking-wider mb-1">Serves</span>
            <input
              value={servings}
              onChange={e => setServings(e.target.value)}
              className="w-full bg-transparent border-none text-center font-bold text-on-surface outline-none focus:ring-0 p-0 text-sm placeholder-on-surface-variant/40"
              placeholder="4"
            />
          </div>
        </div>

        {/* Extra fields: Total Time, Cuisine, Tags */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className={labelCls}>Total Time</label>
            <input
              value={totalTime}
              onChange={e => setTotalTime(e.target.value)}
              className={inputCls}
              placeholder="1h"
            />
          </div>
          <div>
            <label className={labelCls}>Cuisine</label>
            <input
              value={cuisine}
              onChange={e => setCuisine(e.target.value)}
              className={inputCls}
              placeholder="Italian"
            />
          </div>
          <div>
            <label className={labelCls}>Tags (comma-separated)</label>
            <input
              value={tags}
              onChange={e => setTags(e.target.value)}
              className={inputCls}
              placeholder="dinner, quick, healthy"
            />
          </div>
        </div>

        {/* Ingredients & Instructions two-column */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ingredients */}
          <section className="bg-surface dark:bg-surface-dark p-6 rounded-xl border border-outline-variant/50 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <label className={labelCls + ' mb-0'}>Ingredients</label>
              <button
                type="button"
                onClick={addIngredient}
                className="text-primary hover:bg-primary/5 p-1 rounded-full transition-colors"
                aria-label="Add ingredient"
              >
                <span className="material-symbols-outlined text-2xl">add_circle</span>
              </button>
            </div>
            <div className="space-y-3">
              {ingredients.map((ing, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    value={ing.amount}
                    onChange={e => updateIngredient(i, 'amount', e.target.value)}
                    className="w-16 bg-background dark:bg-background-dark border border-outline-variant/50 rounded-lg px-2 py-2 text-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                    placeholder="Amt"
                  />
                  <input
                    value={ing.unit}
                    onChange={e => updateIngredient(i, 'unit', e.target.value)}
                    className="w-16 bg-background dark:bg-background-dark border border-outline-variant/50 rounded-lg px-2 py-2 text-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                    placeholder="Unit"
                  />
                  <input
                    value={ing.name}
                    onChange={e => updateIngredient(i, 'name', e.target.value)}
                    className="flex-1 bg-background dark:bg-background-dark border border-outline-variant/50 rounded-lg px-2 py-2 text-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                    placeholder="Ingredient name"
                  />
                  {ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIngredient(i)}
                      className="text-error hover:text-error/80 transition-colors shrink-0"
                      aria-label="Remove ingredient"
                    >
                      <span className="material-symbols-outlined text-xl">remove_circle</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Instructions */}
          <section className="bg-surface dark:bg-surface-dark p-6 rounded-xl border border-outline-variant/50 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <label className={labelCls + ' mb-0'}>Instructions</label>
              <button
                type="button"
                onClick={addInstruction}
                className="text-primary hover:bg-primary/5 p-1 rounded-full transition-colors"
                aria-label="Add instruction step"
              >
                <span className="material-symbols-outlined text-2xl">add_circle</span>
              </button>
            </div>
            <div className="space-y-4">
              {instructions.map((step, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <span className="flex-none w-6 h-6 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold mt-2">
                    {i + 1}
                  </span>
                  <textarea
                    value={step}
                    onChange={e => updateInstruction(i, e.target.value)}
                    className="flex-1 bg-background dark:bg-background-dark border border-outline-variant/50 rounded-lg px-3 py-2 text-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 resize-none"
                    placeholder={`Step ${i + 1}...`}
                    rows={2}
                  />
                  {instructions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeInstruction(i)}
                      className="text-error hover:text-error/80 transition-colors shrink-0 mt-2"
                      aria-label="Remove step"
                    >
                      <span className="material-symbols-outlined text-xl">remove_circle</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Notes */}
        <div>
          <label className={labelCls}>
            <span className="material-symbols-outlined text-sm align-middle mr-1">note</span>
            Chef&apos;s Notes
          </label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className={`${inputCls} resize-none`}
            placeholder="Optional tips, variations, or memories..."
            rows={3}
          />
        </div>

        {/* Source URL */}
        <div>
          <label className={labelCls}>
            <span className="material-symbols-outlined text-sm align-middle mr-1">link</span>
            Source URL
          </label>
          <input
            value={sourceUrl}
            onChange={e => setSourceUrl(e.target.value)}
            className={inputCls}
            placeholder="https://original-recipe-website.com/..."
          />
        </div>

        {/* Footer actions */}
        <footer className="flex items-center justify-between pt-6 border-t border-outline-variant/30">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 rounded-xl text-on-surface-variant font-semibold hover:bg-outline-variant/20 transition-all"
          >
            Discard
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !title.trim()}
            className="px-10 py-3 rounded-xl bg-primary hover:bg-primary/90 disabled:bg-outline-variant disabled:text-on-surface-variant text-white font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            {loading ? 'Saving...' : mode === 'edit' ? 'Update Recipe' : 'Save Recipe'}
          </button>
        </footer>
      </div>
    </div>
  )
}
