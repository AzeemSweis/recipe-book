# Recipe Book

Personal recipe management web app with import, search, and cook tracking.

## Quick Start

```bash
git clone https://github.com/asweis/recipe-book.git
cd recipe-book
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## What It Does

Recipe Book is a full-stack web app for managing your personal recipes. Import recipes from any website, organize them with tags, track what you've cooked, and view detailed recipe cards with ingredients, instructions, and metadata. Features dual authentication (Clerk for web, Firebase for iOS app) and real-time recipe storage via Redis.

## Development

### Prerequisites

- Node.js 20+
- npm or yarn

### Setup

```bash
git clone https://github.com/asweis/recipe-book.git
cd recipe-book
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` — Clerk auth public key
- `CLERK_SECRET_KEY` — Clerk auth secret
- `UPSTASH_REDIS_REST_URL` — Redis database URL
- `UPSTASH_REDIS_REST_TOKEN` — Redis authentication token

Optional variables (iOS Firebase auth):
- `FIREBASE_PROJECT_ID`
- `FIREBASE_PRIVATE_KEY`
- `FIREBASE_CLIENT_EMAIL`

### Running

```bash
npm run dev
```

Server starts at [http://localhost:3000](http://localhost:3000). Changes auto-reload.

### Building

```bash
npm run build
npm start
```

## Features

- **Recipe CRUD** — Create, read, update, delete recipes with full metadata
- **Import from URL** — Intelligent parsing of recipes from any website
- **Search & Filter** — Full-text search, organize by tags and categories
- **Cook Counter** — Track how many times you've made each recipe
- **Dark Mode** — Complete light/dark theme support
- **Responsive Design** — Mobile, tablet, and desktop layouts
- **Dual Auth** — Clerk for web app, Firebase Admin for iOS companion app

## Tech Stack

- **Framework** — Next.js 16 + React 19
- **Styling** — Tailwind CSS 4 with custom Material Design 3 color tokens
- **Auth** — Clerk (web) + Firebase Admin (iOS)
- **Storage** — Upstash Redis (serverless)
- **Icons** — Material Symbols Outlined via Google Fonts CDN

## Project Structure

```
src/
  app/
    api/               # Next.js API routes (recipe CRUD, import, cook counter)
    recipe/            # Recipe detail page and edit flow
    import/            # URL import page
    add/               # Create recipe page
    sign-in/           # Clerk auth UI
    sign-up/           # Clerk auth UI
    page.tsx           # Home: landing page (unauthed) or recipe grid (authed)
    layout.tsx         # Root layout with Navbar and theme provider
    globals.css        # Tailwind + design tokens
  components/
    Navbar.tsx         # Sticky top navigation bar
    RecipeGrid.tsx     # Recipe list with search and filters
    RecipeCard.tsx     # Individual recipe card with metadata
    RecipeForm.tsx     # Create/edit recipe form with image preview
    IngredientList.tsx # Ingredient checklist component
    ThemeToggle.tsx    # Light/dark mode switcher
    ThemeProvider.tsx  # Next.js theme context provider
  lib/
    auth.ts            # Dual auth helpers (Clerk + Firebase)
    storage.ts         # Redis storage layer
    parser.ts          # Recipe URL parser
    types.ts           # TypeScript types for Recipe, Ingredient, etc.
middleware.ts          # Auth middleware for protected routes
```

## Configuration

All configuration via environment variables (see Setup section). No additional config files needed.

## Deployment

Build for production:

```bash
npm run build
```

Deploy the `.next` build artifact to any Node.js hosting (Vercel, Railway, etc.).

For environment variables, set them in your hosting platform's environment config and reference the `.env.example` file.
