'use client'

import { useRouter } from 'next/navigation'

export default function EditButton({ id }: { id: string }) {
  const router = useRouter()
  return (
    <button
      onClick={() => router.push(`/recipe/${id}/edit`)}
      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 h-12 rounded-xl border border-outline-variant text-on-surface hover:bg-primary-container font-bold transition-all"
    >
      <span className="material-symbols-outlined text-lg">edit</span>
      <span>Edit</span>
    </button>
  )
}
