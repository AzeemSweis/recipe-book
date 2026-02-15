import fs from "fs";
import path from "path";
import { Recipe } from "./types";

interface Db {
  recipesByUser: Record<string, Recipe[]>;
}

const DATA_DIR = path.join(process.cwd(), "data");
const RECIPES_FILE = path.join(DATA_DIR, "recipes.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(RECIPES_FILE)) fs.writeFileSync(RECIPES_FILE, JSON.stringify({ recipesByUser: {} }, null, 2));
}

function getDb(): Db {
  ensureDataDir();
  try {
    let data = JSON.parse(fs.readFileSync(RECIPES_FILE, "utf-8"));
    if (Array.isArray(data)) {
      data = { recipesByUser: { legacy: data } };
      fs.writeFileSync(RECIPES_FILE, JSON.stringify(data, null, 2));
    }
    return data as Db;
  } catch {
    return { recipesByUser: {} };
  }
}

function saveDb(db: Db) {
  fs.writeFileSync(RECIPES_FILE, JSON.stringify(db, null, 2));
}

export function getRecipes(userId: string): Recipe[] {
  const db = getDb();
  return db.recipesByUser[userId] || [];
}

export function getRecipe(id: string, userId: string): Recipe | null {
  return getRecipes(userId).find((r) => r.id === id) || null;
}

export function saveRecipe(recipe: Recipe, userId: string): Recipe {
  const db = getDb();
  if (!db.recipesByUser[userId]) db.recipesByUser[userId] = [];
  const idx = db.recipesByUser[userId].findIndex((r) => r.id === recipe.id);
  recipe.userId = userId;
  recipe.updatedAt = new Date().toISOString();
  if (idx >= 0) {
    db.recipesByUser[userId][idx] = recipe;
  } else {
    db.recipesByUser[userId].push(recipe);
  }
  saveDb(db);
  return recipe;
}

export function deleteRecipe(id: string, userId: string) {
  const db = getDb();
  if (db.recipesByUser[userId]) {
    db.recipesByUser[userId] = db.recipesByUser[userId].filter((r) => r.id !== id);
    saveDb(db);
  }
}
