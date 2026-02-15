export interface Ingredient {
  amount: string;
  unit: string;
  name: string;
  notes?: string;
}

export interface Recipe {
  id: string;
  userId: string;
  title: string;
  sourceUrl?: string;
  description?: string;
  servings?: string;
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  cuisine?: string;
  category?: string;
  tags: string[];
  ingredients: Ingredient[];
  instructions: string[];
  notes?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}
