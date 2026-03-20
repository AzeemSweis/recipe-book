'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function SpeedDial() {
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-[2px] -z-10"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Import option — radiates up-left */}
      <Link
        href="/import"
        onClick={() => setOpen(false)}
        className={`absolute flex items-center gap-2 transition-all duration-300 ${
          open
            ? 'bottom-20 -right-1 opacity-100 scale-100'
            : 'bottom-0 right-0 opacity-0 scale-50 pointer-events-none'
        }`}
      >
        <span className="px-3 py-1.5 bg-on-surface text-surface text-xs font-semibold rounded-lg shadow-lg whitespace-nowrap">
          Import URL
        </span>
        <div className="w-11 h-11 rounded-full bg-tertiary text-white shadow-lg shadow-tertiary/30 flex items-center justify-center">
          <span className="material-symbols-outlined text-xl">link</span>
        </div>
      </Link>

      {/* Add manually option — radiates up */}
      <Link
        href="/add"
        onClick={() => setOpen(false)}
        className={`absolute flex items-center gap-2 transition-all duration-300 delay-75 ${
          open
            ? 'bottom-36 -right-1 opacity-100 scale-100'
            : 'bottom-0 right-0 opacity-0 scale-50 pointer-events-none'
        }`}
      >
        <span className="px-3 py-1.5 bg-on-surface text-surface text-xs font-semibold rounded-lg shadow-lg whitespace-nowrap">
          Add Manually
        </span>
        <div className="w-11 h-11 rounded-full bg-secondary text-white shadow-lg shadow-secondary/30 flex items-center justify-center">
          <span className="material-symbols-outlined text-xl">edit_note</span>
        </div>
      </Link>

      {/* Main FAB */}
      <button
        onClick={() => setOpen(!open)}
        className={`w-14 h-14 bg-primary hover:bg-primary/90 text-white rounded-full shadow-2xl shadow-primary/30 hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center ${
          open ? 'rotate-45' : ''
        }`}
        aria-label={open ? 'Close menu' : 'Add recipe'}
      >
        <span className="material-symbols-outlined text-2xl">add</span>
      </button>
    </div>
  )
}
