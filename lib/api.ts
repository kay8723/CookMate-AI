import axios from 'axios';
import { supabase } from './supabase';
import { Recipe, GroceryItem } from './supabase';

// API configuration with type-safe environment variables
const ENV = {
  SPOONACULAR_API_KEY: process.env.EXPO_PUBLIC_SPOONACULAR_API_KEY,
  NUTRITIONIX_APP_ID: process.env.EXPO_PUBLIC_NUTRITIONIX_APP_ID,
  NUTRITIONIX_APP_KEY: process.env.EXPO_PUBLIC_NUTRITIONIX_APP_KEY,
} as const;

// API endpoints
const THEMEALDB_API = 'https://www.themealdb.com/api/json/v1/1';
const SPOONACULAR_API = 'https://api.spoonacular.com';
const NUTRITIONIX_API = 'https://trackapi.nutritionix.com/v2';

// Log warning for missing API keys
if (!ENV.SPOONACULAR_API_KEY) {
  console.warn('Warning: Missing EXPO_PUBLIC_SPOONACULAR_API_KEY environment variable');
}

if (!ENV.NUTRITIONIX_APP_ID || !ENV.NUTRITIONIX_APP_KEY) {
  console.warn('Warning: Missing Nutritionix API credentials in environment variables');
}

export class RecipeService {
  // Local recipe management
  static async getRecipes(userId: string): Promise<Recipe[]> {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data || [];
  }

  static async addRecipe(recipe: Omit<Recipe, 'id' | 'created_at'>): Promise<Recipe> {
    const { data, error } = await supabase
      .from('recipes')
      .insert([recipe])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // External API integrations
  static async searchRecipes(query: string, filters?: {
    cuisine?: string;
    diet?: string;
    intolerances?: string[];
    maxReadyTime?: number;
  }) {
    try {
      // Try Spoonacular first
      if (ENV.SPOONACULAR_API_KEY) {
        const response = await axios.get(`${SPOONACULAR_API}/recipes/complexSearch`, {
          params: {
            apiKey: ENV.SPOONACULAR_API_KEY,
            query,
            ...filters,
          },
        });
        return response.data.results;
      }

      // Fallback to TheMealDB
      const response = await axios.get(`${THEMEALDB_API}/search.php`, {
        params: { s: query },
      });
      return response.data.meals || [];
    } catch (error) {
      console.error('Error searching recipes:', error);
      throw error;
    }
  }

  static async getRecipeDetails(id: string, source: 'spoonacular' | 'themealdb' = 'spoonacular') {
    try {
      if (source === 'spoonacular' && ENV.SPOONACULAR_API_KEY) {
        const response = await axios.get(`${SPOONACULAR_API}/recipes/${id}/information`, {
          params: { apiKey: ENV.SPOONACULAR_API_KEY },
        });
        return response.data;
      }

      const response = await axios.get(`${THEMEALDB_API}/lookup.php`, {
        params: { i: id },
      });
      return response.data.meals?.[0];
    } catch (error) {
      console.error('Error getting recipe details:', error);
      throw error;
    }
  }
}

export class GroceryService {
  static async getGroceryItems(userId: string): Promise<GroceryItem[]> {
    const { data, error } = await supabase
      .from('grocery_items')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data || [];
  }

  static async addGroceryItem(item: Omit<GroceryItem, 'id' | 'created_at'>): Promise<GroceryItem> {
    const { data, error } = await supabase
      .from('grocery_items')
      .insert([item])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateGroceryItem(id: string, updates: Partial<GroceryItem>): Promise<GroceryItem> {
    const { data, error } = await supabase
      .from('grocery_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteGroceryItem(id: string): Promise<void> {
    const { error } = await supabase
      .from('grocery_items')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}

export class NutritionService {
  static async getNutritionalInfo(food: string) {
    try {
      if (ENV.NUTRITIONIX_APP_ID && ENV.NUTRITIONIX_APP_KEY) {
        const response = await axios.post(
          `${NUTRITIONIX_API}/natural/nutrients`,
          { query: food },
          {
            headers: {
              'x-app-id': ENV.NUTRITIONIX_APP_ID,
              'x-app-key': ENV.NUTRITIONIX_APP_KEY,
            },
          }
        );
        return response.data;
      }
      throw new Error('Nutritionix API credentials not configured');
    } catch (error) {
      console.error('Error getting nutritional info:', error);
      throw error;
    }
  }
}
