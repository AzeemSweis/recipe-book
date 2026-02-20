'use client'

import { useState } from 'react'

interface Props {
  id: string
  timesMade: number
}

export default function CookCounter({ id, timesMade }: Props) {
  const [count, setCount] = useState(timesMade)
  const [isLoading, setIsLoading] = useState(false)

  const increment = async () => {
    setIsLoading(true)
    const prev = count
    setCount(count + 1)
    try {
      const response = await fetch(`/api/recipes/${id}/cook`, {
        method: 'POST',
      })
      if (!response.ok) {
        throw new Error('Failed to update')
      }
    } catch (error) {
      setCount(prev)
      alert('Failed to update cook count.')
    } finally {
      setIsLoading(false)
    }
  }

  const label = count === 0 ? 'Not yet cooked' : `Cooked ${count} time${count === 1 ? '' : 's'}`

  return (
    <div className="flex items-center gap-3 bg-zinc-100 dark:bg-zinc-800/60 px-4 py-2.5 rounded-xl mb-8 border border-zinc-200/50 dark:border-zinc-700/50">
      <span className="text-sm text-zinc-600 dark:text-zinc-400">
        <span className="text-zinc-400 dark:text-zinc-600 font-medium">Cooked:</span> {label}
      </span>
      <button
        onClick={increment}
        disabled={isLoading}
        className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-rose-500/25"
      >
        {isLoading ? '...' : 'I made this! 🍳'}
      </button>
    </div>
  )
}