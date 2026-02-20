'use client'

import { useRouter } from 'next/navigation'

export default function EditButton({ id }: { id: string }) {
  const router = useRouter()
  return (
    <button 
      onClick={() => router.push(`/recipe/${id}/edit`)} 
      className="text-sm text-zinc-400 hover:text-rose-500 dark:text-zinc-600 dark:hover:text-rose-400 transition-colors font-medium"
    >
      Edit
    </button>
  )
}