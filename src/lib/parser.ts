import { Recipe, Ingredient } from "./types";

// Extract JSON-LD structured data (schema.org Recipe)
function extractJsonLd(html: string): Record<string, unknown> | null {
  const scripts = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  if (!scripts) return null;
  for (const script of scripts) {
    try {
      const json = script.replace(/<script[^>]*>/, "").replace(/<\/script>/, "").trim();
      const data = JSON.parse(json);
      // Could be array or single object
      const items = Array.isArray(data) ? data : data["@graph"] ? data["@graph"] : [data];
      for (const item of items) {
        if (item["@type"] === "Recipe" || (Array.isArray(item["@type"]) && item["@type"].includes("Recipe"))) {
          return item;
        }
      }
    } catch { /* skip */ }
  }
  return null;
}

function parseDuration(iso: string): string {
  if (!iso) return "";
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return iso;
  const parts = [];
  if (match[1]) parts.push(`${match[1]}h`);
  if (match[2]) parts.push(`${match[2]}m`);
  if (match[3]) parts.push(`${match[3]}s`);
  return parts.join(" ") || iso;
}

function parseIngredientStr(s: string): Ingredient {
  s = s.replace(/<[^>]+>/g, "").trim();
  // Try to match "amount unit name"
  const match = s.match(/^([\d\s\/¼½¾⅓⅔⅛.,-]+)\s*(cups?|tbsp|tsp|tablespoons?|teaspoons?|oz|ounces?|lbs?|pounds?|g|grams?|kg|ml|liters?|cloves?|cans?|pieces?|slices?|pinch|dash|bunch|stalks?|heads?|large|medium|small|whole)?\s*(.*)$/i);
  if (match) {
    return { amount: match[1].trim(), unit: (match[2] || "").trim(), name: match[3].trim() };
  }
  return { amount: "", unit: "", name: s };
}

function extractInstructions(data: Record<string, unknown>): string[] {
  const raw = data.recipeInstructions;
  if (!raw) return [];
  if (typeof raw === "string") return raw.split(/\n+/).filter(Boolean).map((s: string) => s.replace(/<[^>]+>/g, "").trim());
  if (Array.isArray(raw)) {
    return raw.flatMap((item: unknown) => {
      if (typeof item === "string") return [item.replace(/<[^>]+>/g, "").trim()];
      if (typeof item === "object" && item !== null) {
        const obj = item as Record<string, unknown>;
        if (obj["@type"] === "HowToStep") return [String(obj.text || "").replace(/<[^>]+>/g, "").trim()];
        if (obj["@type"] === "HowToSection" && Array.isArray(obj.itemListElement)) {
          return (obj.itemListElement as Record<string, unknown>[]).map((s) => String(s.text || "").replace(/<[^>]+>/g, "").trim());
        }
      }
      return [];
    }).filter(Boolean);
  }
  return [];
}

function extractImage(data: Record<string, unknown>): string | undefined {
  const img = data.image;
  if (!img) return undefined;
  if (typeof img === "string") return img;
  if (Array.isArray(img)) return typeof img[0] === "string" ? img[0] : (img[0] as Record<string, string>)?.url;
  if (typeof img === "object") return (img as Record<string, string>).url;
  return undefined;
}

export function parseRecipeFromHtml(html: string, sourceUrl: string): Partial<Recipe> {
  const jsonLd = extractJsonLd(html);

  if (jsonLd) {
    const ingredients = Array.isArray(jsonLd.recipeIngredient)
      ? (jsonLd.recipeIngredient as string[]).map(parseIngredientStr)
      : [];

    return {
      title: String(jsonLd.name || "Untitled Recipe"),
      sourceUrl,
      description: String(jsonLd.description || "").replace(/<[^>]+>/g, "").trim() || undefined,
      servings: jsonLd.recipeYield ? String(Array.isArray(jsonLd.recipeYield) ? jsonLd.recipeYield[0] : jsonLd.recipeYield) : undefined,
      prepTime: jsonLd.prepTime ? parseDuration(String(jsonLd.prepTime)) : undefined,
      cookTime: jsonLd.cookTime ? parseDuration(String(jsonLd.cookTime)) : undefined,
      totalTime: jsonLd.totalTime ? parseDuration(String(jsonLd.totalTime)) : undefined,
      cuisine: jsonLd.recipeCuisine ? String(Array.isArray(jsonLd.recipeCuisine) ? jsonLd.recipeCuisine.join(", ") : jsonLd.recipeCuisine) : undefined,
      category: jsonLd.recipeCategory ? String(Array.isArray(jsonLd.recipeCategory) ? jsonLd.recipeCategory.join(", ") : jsonLd.recipeCategory) : undefined,
      tags: Array.isArray(jsonLd.keywords) ? jsonLd.keywords.map(String) : typeof jsonLd.keywords === "string" ? jsonLd.keywords.split(",").map((s: string) => s.trim()) : [],
      ingredients,
      instructions: extractInstructions(jsonLd),
      image: extractImage(jsonLd),
    };
  }

  // Fallback: try to extract title from HTML
  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
  return {
    title: titleMatch ? titleMatch[1].replace(/<[^>]+>/g, "").trim() : "Untitled Recipe",
    sourceUrl,
    ingredients: [],
    instructions: [],
    tags: [],
  };
}
