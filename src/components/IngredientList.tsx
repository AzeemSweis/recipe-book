'use client'

import { Ingredient } from '@/lib/types'
import { useState } from 'react'

interface Props {
  ingredients: Ingredient[]
}

export default function IngredientList({ ingredients }: Props) {
  const [checked, setChecked] = useState(new Set<number>())

  const toggle = (i: number) => {
    const newSet = new Set(checked)
    if (newSet.has(i)) {
      newSet.delete(i)
    } else {
      newSet.add(i)
    }
    setChecked(newSet)
  }

  if (ingredients.length === 0) {
    return <p className="text-zinc-500 text-sm">No ingredients parsed.</p>
  }

  return (
    <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
      {ingredients.map((ing, i) => {
        const isChecked = checked.has(i)
        const measure = [ing.amount, ing.unit].filter(Boolean).join(' ') || '•'
        return (
          <li 
            key={i} 
            className={`flex items-start py-2.5 text-sm gap-3 ${
              isChecked 
                ? 'opacity-60' 
                : ''
            }`}
          >
            <label className="flex items-center gap-2 cursor-pointer min-w-[2rem] -mt-0.5">
              <input
                type="checkbox"
                id={`ing-${i}`}
                checked={isChecked}
                onChange={() => toggle(i)}
                className="w-4 h-4 text-rose-500 rounded border-zinc-300 focus:ring-rose-500 bg-white shadow-sm dark:bg-zinc-800 dark:border-zinc-600 dark:checked:bg-rose-500 dark:checked:border-rose-500 dark:focus:ring-offset-zinc-900"
              />
            </label>
            <div className="flex-1 min-w-0">
              <div className={`text-right text-rose-500 dark:text-rose-400 font-semibold text-sm mb-0.5 ${isChecked ? 'line-through decoration-rose-400/50 decoration-2' : ''}`}>
                {measure}
              </div>
              <div className={`text-zinc-800 dark:text-zinc-200 ${isChecked ? 'line-through decoration-zinc-400/50 decoration-2' : ''}`}>
                {ing.name}
                {ing.notes && (
                  <span className="text-zinc-400 dark:text-zinc-600 text-xs ml-1">({ing.notes})</span>
                )}
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}