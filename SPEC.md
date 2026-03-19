# Project: Recipe Book — UI Redesign

## Overview

Visual redesign of an existing Next.js 16 recipe management app. The backend (API routes, data model, auth, storage) is completely unchanged. This spec covers restyling all frontend components and adding a new pre-auth landing page, based on designs generated in Google Stitch.

## Project Type

webapp (frontend-only redesign of existing project)

## Tech Stack (unchanged)

- **Framework**: Next.js 16.1.6 + React 19.2.3 — existing, no change
- **Styling**: Tailwind CSS 4 — existing, new custom `@theme` for the redesigned color palette
- **Auth**: Clerk (web) + Firebase (iOS) dual auth — existing, no change
- **Storage**: Upstash Redis — existing, no change
- **Icons**: Material Symbols Outlined via Google Fonts CDN — **replacing emoji icons**

## Design System

### Color Palette (M3-inspired)

Define these in `globals.css` using Tailwind 4's `@theme` directive:

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#f5a30a` | Buttons, active states, accents |
| `--color-primary-container` | `#ffedd5` | Light primary backgrounds, badges |
| `--color-background` | `#f8f7f5` | Page background (light) |
| `--color-background-dark` | `#221c10` | Page background (dark) |
| `--color-surface` | `#ffffff` | Cards, navbar, elevated elements |
| `--color-surface-dark` | `#2a2318` | Cards, navbar (dark) |
| `--color-on-surface` | `#0f172a` | Primary text |
| `--color-on-surface-variant` | `#64748b` | Secondary text, labels |
| `--color-outline-variant` | `#cbd5e1` | Borders, dividers |
| `--color-error` | `#ef4444` | Delete, error states |
| `--color-tertiary` | `#0ea5e9` | Info accents, links |
| `--color-secondary` | `#475569` | Muted UI elements |

### Typography

- Font family: Inter (kept) via Google Fonts CDN
- Weights: 400 (body), 500 (labels), 600 (headings), 700 (hero titles)

### Icons

Replace all emoji icons with Material Symbols Outlined. Add CDN link to root layout `<head>`:
```
https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0
```

Usage: `<span class="material-symbols-outlined">restaurant_menu</span>`

Key icon mappings:
- `restaurant_menu` — app logo/brand
- `search` — search bar
- `add` — add recipe FAB
- `timer` — prep/cook time
- `group` — servings
- `public` — cuisine
- `skillet` — cook counter "I made this!"
- `edit` — edit recipe
- `delete` — delete recipe
- `link` — import/source URL
- `auto_awesome` — smart extraction
- `swap_horiz` — unit conversion
- `cloud_done` — save forever
- `arrow_back` — back navigation
- `light_mode` / `dark_mode` — theme toggle
- `restaurant` — category
- `note` — chef's notes

### Border Radius

- Cards, large containers: `rounded-xl` to `rounded-2xl`
- Buttons: `rounded-xl`
- Chips/badges: `rounded-full`
- Inputs: `rounded-xl`

---

## Files to Change

### Do NOT modify (backend/data layer)
- `src/app/api/**/*` — all API routes
- `src/lib/storage.ts` — Redis storage
- `src/lib/auth.ts` — dual auth helper
- `src/lib/parser.ts` — recipe parser
- `src/lib/types.ts` — data types
- `middleware.ts` — auth middleware
- `next.config.ts`

### Modify in-place (restyle only)
- `src/app/globals.css` — add `@theme` with new palette, update base styles
- `src/app/layout.tsx` — replace Sidebar with Navbar, add font CDN links, update body classes
- `src/components/Sidebar.tsx` — **delete** (replaced by Navbar)
- `src/components/RecipeCard.tsx` — new card design with hover zoom, overlay badges
- `src/components/RecipeGrid.tsx` — updated search, tag chips, grid styling
- `src/components/RecipeForm.tsx` — new form layout with dropzone, two-column sections
- `src/components/IngredientList.tsx` — updated checkbox styling with new colors
- `src/components/ThemeToggle.tsx` — use Material Symbols icons instead of inline SVGs
- `src/components/ThemeProvider.tsx` — no changes needed (logic stays the same)
- `src/app/page.tsx` — split behavior: landing page (unauthed) vs recipe grid (authed)
- `src/app/recipe/[id]/page.tsx` — hero image, metadata cards, two-column layout
- `src/app/recipe/[id]/CookCounter.tsx` — primary amber button style
- `src/app/recipe/[id]/EditButton.tsx` — outline button style
- `src/app/recipe/[id]/DeleteButton.tsx` — danger/error button style
- `src/app/recipe/[id]/edit/page.tsx` — minor: update back link color
- `src/app/import/page.tsx` — new import page layout with feature cards
- `src/app/add/page.tsx` — no changes needed (wrapper only)

### New files
- `src/components/Navbar.tsx` — top sticky navbar replacing Sidebar

---

## Page Specifications

### 1. Landing Page (NEW — unauthenticated view on `/`)

Currently `src/app/page.tsx` shows a minimal "Sign in to get started" message when unauthenticated. Replace with a full landing page.

**Layout:**
- Sticky top navbar: "Recipe Book" brand (left) + "Sign In" / "Sign Up" buttons (right)
- Hero section: large heading "Your recipes, all in one place", subtext, food photo/illustration, amber CTA "Get Started"
- Features section: 3 cards in a row
  - "Import from any website" — `link` icon
  - "Organize with tags" — `label` icon
  - "Track what you cook" — `skillet` icon
- Amber CTA banner: "Ready to build your digital cookbook?" with "Sign Up Free" button
- Footer: minimal, "Recipe Book" + copyright

**The navbar on this page should NOT have the search bar or avatar — just brand + auth buttons.**

### 2. Navbar (`src/components/Navbar.tsx` — NEW)

Replaces the current Sidebar. Sticky top bar with blur backdrop.

**Authenticated state:**
- Left: `restaurant_menu` icon + "Recipe Book" text
- Center: Search input (optional, can be on home page only)
- Right: Theme toggle + Clerk `<UserButton />` avatar

**Unauthenticated state:**
- Left: `restaurant_menu` icon + "Recipe Book" text
- Right: "Sign In" / "Sign Up" buttons (link to `/sign-in`, `/sign-up`)

**Styling:**
- `sticky top-0 z-50`
- `bg-surface/80 dark:bg-surface-dark/80 backdrop-blur-md`
- `border-b border-outline-variant dark:border-outline-variant/20`
- Height: `h-16`
- Max-width container centered

**Mobile:** Same top bar, no hamburger menu needed since sidebar is gone. Nav links (Add, Import) move to the home page or become the FAB.

### 3. Home / Recipe Grid (`src/app/page.tsx` + `RecipeGrid.tsx` + `RecipeCard.tsx`)

**Page (`page.tsx`) — authenticated:**
- Remove the old header with "Your Recipes" / "Import URL" button
- The Navbar handles branding. Page just renders `<RecipeGrid />`
- Add floating action button (FAB) bottom-right: amber circle with `add` icon, links to `/add`

**RecipeGrid:**
- Search bar: white/surface card style, `search` icon, amber focus ring
- Tag filter chips: horizontal scrollable row (use `overflow-x-auto flex-nowrap`)
  - Active chip: `bg-primary text-white`
  - Inactive chip: `bg-primary-container text-on-surface`
- 3-column grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`)
- Results count text uses `on-surface-variant` color
- Empty state: use `search` Material Symbol instead of emoji

**RecipeCard:**
- Card: `bg-surface dark:bg-surface-dark rounded-xl overflow-hidden shadow-sm hover:shadow-lg border border-outline-variant/50`
- Image: `h-48 overflow-hidden` with `group-hover:scale-110 transition-transform duration-500`
- Overlay badges on image (positioned absolute):
  - Top-right: cook counter badge `"Made Xx"` — `bg-primary text-white rounded-full px-2 py-0.5 text-xs font-semibold` (only if `timesMade > 0`)
  - Bottom-left: category badge — `bg-black/60 text-white rounded-full px-2 py-0.5 text-xs` (only if `category` exists)
- Title: `font-semibold text-on-surface`
- Description: `text-on-surface-variant text-sm line-clamp-2`
- Metadata row: `timer` icon + prep/cook time, `group` icon + serves — small text with icons
- Remove tag pills from card (too cluttered with new overlay design)

### 4. Recipe Detail (`src/app/recipe/[id]/page.tsx`)

**Hero image:**
- Full-width image with gradient overlay (`bg-gradient-to-t from-black/70 to-transparent`)
- Title overlaid on image in white, bottom-left
- Back arrow button overlaid top-left
- If no image: standard title with `bg-primary-container` banner

**Metadata cards:**
- Row of up to 6 small cards: Prep, Cook, Total, Serves, Cuisine, Times Made
- Each card: `bg-surface dark:bg-surface-dark rounded-xl p-4 text-center border border-outline-variant/50`
- Label in `text-on-surface-variant text-xs`, value in `text-on-surface font-semibold`
- Icon above each label (Material Symbols)

**Action bar:**
- Row of 3 buttons below metadata:
  - "I made this!" — `bg-primary hover:bg-primary/90 text-white` (primary, prominent)
  - "Edit" — `border border-outline-variant text-on-surface hover:bg-primary-container` (outline)
  - "Delete" — `border border-error/30 text-error hover:bg-error/10` (danger outline)
- CookCounter component refactored: the button is in the action bar, the count is in the metadata cards

**Two-column content:**
- Left (1/3): Ingredients checklist
  - Section header with `egg_alt` or similar icon
  - Each ingredient as a checkbox row
  - Checkbox accent color: `accent-primary`
  - Checked state: line-through with reduced opacity
- Right (2/3): Numbered instructions
  - Section header with `format_list_numbered` icon
  - Step numbers in amber `text-primary font-bold`
  - Step text in `text-on-surface`

**Chef's Notes callout:**
- `border-l-4 border-primary bg-primary-container/30 dark:bg-primary/10 rounded-r-xl p-4`
- `note` icon + "Chef's Notes" label
- Notes text in `text-on-surface-variant`

**Source link:**
- Below notes, `link` icon + "View Original Recipe" in `text-tertiary`

**Tags:**
- Display as `bg-primary-container text-primary rounded-full` pills

### 5. Add/Edit Recipe Form (`src/components/RecipeForm.tsx`)

**Header:**
- Create mode: "Create New Masterpiece" (with `auto_awesome` icon)
- Edit mode: "Edit Recipe" (with `edit` icon)

**Image section:**
- Image URL input with live preview
- If image URL provided, show a `rounded-xl` 16:9 preview above the form
- If no image, show a dashed-border dropzone placeholder with `add_photo_alternate` icon

**Form layout:**
- Title input: large, prominent
- Category: dropdown/select instead of free text (options: Breakfast, Lunch, Dinner, Dessert, Snack, Appetizer, Beverage, Other)
- Description: textarea

**Stat bar:**
- Horizontal row of 3 compact inputs: Prep Time, Cook Time, Serves
- Styled as a connected group with `bg-surface border border-outline-variant rounded-xl`

**Two-column section:**
- Left: Ingredients — amount + name input rows with `add_circle` button to add more
- Right: Instructions — numbered textarea steps with `add_circle` button to add more
- Remove buttons use `remove_circle` icon in `text-error`

**Footer actions:**
- Three buttons right-aligned:
  - "Discard" — `text-on-surface-variant` text button (navigates back)
  - "Save Recipe" — `bg-primary text-white rounded-xl` primary button

**Input styling (all inputs):**
- `bg-surface dark:bg-surface-dark border border-outline-variant dark:border-outline-variant/30 rounded-xl`
- Focus: `focus:border-primary focus:ring-2 focus:ring-primary/20`

### 6. Import Recipe (`src/app/import/page.tsx`)

**Header:** "Import Your Next Masterpiece" with `auto_awesome` icon

**URL input section:**
- Full-width URL input
- "Fetch Recipe" button: `bg-primary text-white rounded-xl`

**Feature cards:** 3 cards below the input
- "Smart Extraction" — `auto_awesome` icon — "AI-powered parsing from any recipe site"
- "Unit Conversion" — `swap_horiz` icon — "Automatic metric/imperial conversion"
- "Save Forever" — `cloud_done` icon — "Your recipes, always accessible"

Each card: `bg-surface dark:bg-surface-dark rounded-xl p-6 border border-outline-variant/50 text-center`

**Preview area:**
- Dashed border placeholder: `border-2 border-dashed border-outline-variant rounded-xl p-12 text-center`
- "Your imported recipe will appear here" in `text-on-surface-variant`

---

## globals.css Changes

```css
@import "tailwindcss";

@theme {
  --color-primary: #f5a30a;
  --color-primary-container: #ffedd5;
  --color-background: #f8f7f5;
  --color-background-dark: #221c10;
  --color-surface: #ffffff;
  --color-surface-dark: #2a2318;
  --color-on-surface: #0f172a;
  --color-on-surface-variant: #64748b;
  --color-outline-variant: #cbd5e1;
  --color-error: #ef4444;
  --color-tertiary: #0ea5e9;
  --color-secondary: #475569;
}

@custom-variant dark (&:where(.dark, .dark *));

@layer base {
  body {
    font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  }
}

html.dark { color-scheme: dark; }
html:not(.dark) { color-scheme: light; }
```

## layout.tsx Changes

```tsx
// Key structural changes:
// 1. Add Google Fonts CDN links for Inter + Material Symbols Outlined
// 2. Replace <Sidebar /> with <Navbar />
// 3. Remove `md:ml-64` from <main> (no sidebar offset)
// 4. Update body classes to use new palette:
//    bg-background dark:bg-background-dark text-on-surface
```

---

## Implementation Order

1. **globals.css** — Define `@theme` color palette, update base styles
2. **layout.tsx** — Add font CDN links, swap Sidebar for Navbar, update body classes
3. **Navbar.tsx** — New sticky top navbar component (authed + unauthed states)
4. **Delete Sidebar.tsx** — Remove old sidebar component
5. **ThemeToggle.tsx** — Replace SVG icons with Material Symbols
6. **RecipeCard.tsx** — New card design with image hover zoom and overlay badges
7. **RecipeGrid.tsx** — Updated search bar, tag chips, grid styling, empty state
8. **page.tsx (home)** — Landing page for unauthed, recipe grid for authed, FAB
9. **Recipe detail page** — Hero image, metadata cards, action bar, two-column layout
10. **CookCounter, EditButton, DeleteButton** — Updated button styles for action bar
11. **IngredientList.tsx** — Updated checkbox colors
12. **RecipeForm.tsx** — New form layout with image preview, category dropdown, two-column ingredients/instructions
13. **Import page** — New layout with feature cards and preview area
14. **Sign-in/Sign-up pages** — Minor: update wrapper styling to match new background

## Out of Scope

- Backend/API changes — all routes stay as-is
- Data model changes — Recipe and Ingredient types unchanged
- Auth changes — Clerk + Firebase dual auth unchanged
- Middleware changes
- New features or functionality — this is purely visual
- Image upload (actual file upload) — still URL-based
- Animations beyond hover transitions
- Mobile app (iOS) — separate project
