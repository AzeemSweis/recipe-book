import fs from "fs";
import path from "path";
import { Recipe } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const RECIPES_FILE = path.join(DATA_DIR, "recipes.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(RECIPES_FILE)) fs.writeFileSync(RECIPES_FILE, "[]");
}

export function getRecipes(): Recipe[] {
  ensureDataDir();
  try {
    return JSON.parse(fs.readFileSync(RECIPES_FILE, "utf-8"));
  } catch {
    return [];
  }
}

export function getRecipe(id: string): Recipe | null {
  return getRecipes().find((r) => r.id === id) || null;
}

export function saveRecipe(recipe: Recipe): Recipe {
  const recipes = getRecipes();
  const idx = recipes.findIndex((r) => r.id === recipe.id);
  if (idx >= 0) {
    recipes[idx] = recipe;
  } else {
    recipes.push(recipe);
  }
  fs.writeFileSync(RECIPES_FILE, JSON.stringify(recipes, null, 2));
  return recipe;
}

export function deleteRecipe(id: string) {
  const recipes = getRecipes().filter((r) => r.id !== id);
  fs.writeFileSync(RECIPES_FILE, JSON.stringify(recipes, null, 2));
}
