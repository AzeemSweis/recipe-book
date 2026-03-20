'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  id: string
  timesMade: number
}

export default function CookCounter({ id, timesMade }: Props) {
  const [count, setCount] = useState(timesMade)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

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
      router.refresh()
    } catch {
      setCount(prev)
      alert('Failed to update cook count.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={increment}
      disabled={isLoading}
      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold transition-all shadow-md shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span className="material-symbols-outlined text-xl">skillet</span>
      <span>{isLoading ? 'Saving...' : 'I made this!'}</span>
    </button>
  )
}
