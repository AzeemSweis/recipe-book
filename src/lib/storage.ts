import { Redis } from "@upstash/redis";
import { Recipe } from "./types";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

function userKey(userId: string) {
  return `recipes:${userId}`;
}

function recipeKey(userId: string, id: string) {
  return `recipe:${userId}:${id}`;
}

export async function getRecipes(userId: string): Promise<Recipe[]> {
  const ids = await redis.smembers(userKey(userId));
  if (!ids.length) return [];
  const keys = ids.map((id) => recipeKey(userId, id));
  const results = await redis.mget<(Recipe | null)[]>(...keys);
  return results.filter((r): r is Recipe => r !== null);
}

export async function getRecipe(id: string, userId: string): Promise<Recipe | null> {
  return await redis.get<Recipe>(recipeKey(userId, id));
}

export async function saveRecipe(recipe: Recipe, userId: string): Promise<Recipe> {
  recipe.userId = userId;
  recipe.updatedAt = new Date().toISOString();
  await redis.set(recipeKey(userId, recipe.id), recipe);
  await redis.sadd(userKey(userId), recipe.id);
  return recipe;
}

export async function deleteRecipe(id: string, userId: string): Promise<void> {
  await redis.del(recipeKey(userId, id));
  await redis.srem(userKey(userId), id);
}
