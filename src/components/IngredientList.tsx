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
    return <p className="text-on-surface-variant text-sm">No ingredients parsed.</p>
  }

  return (
    <ul className="divide-y divide-outline-variant/20">
      {ingredients.map((ing, i) => {
        const isChecked = checked.has(i)
        const measure = [ing.amount, ing.unit].filter(Boolean).join(' ')
        // Combine name + notes into a single display string
        const displayName = ing.notes
          ? `${ing.name} (${ing.notes})`
          : ing.name
        return (
          <li key={i}>
            <label
              className={`flex items-center py-3 text-sm gap-3 cursor-pointer select-none hover:bg-primary/5 rounded-lg px-2 -mx-2 transition-colors ${
                isChecked ? 'opacity-50' : ''
              }`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => toggle(i)}
                className="w-4 h-4 shrink-0 accent-primary rounded border-outline-variant"
              />
              <span className="leading-relaxed">
                {measure && (
                  <span
                    className={`text-primary font-semibold mr-1.5 ${
                      isChecked ? 'line-through decoration-primary/40' : ''
                    }`}
                  >
                    {measure}
                  </span>
                )}
                <span
                  className={`text-on-surface dark:text-on-surface-dark ${
                    isChecked ? 'line-through decoration-on-surface-variant/40' : ''
                  }`}
                >
                  {displayName}
                </span>
              </span>
            </label>
          </li>
        )
      })}
    </ul>
  )
}
