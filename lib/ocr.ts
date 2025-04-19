import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from './supabase';
import { GroceryItem } from './supabase';

// Type-safe environment variables
const ENV = {
  GEMINI_API_KEY: process.env.EXPO_PUBLIC_GEMINI_API_KEY,
} as const;

// Validate environment variables
if (!ENV.GEMINI_API_KEY) {
  throw new Error('Missing EXPO_PUBLIC_GEMINI_API_KEY environment variable');
}

const genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);

export class OCRService {
  private static model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });

  static async processReceipt(imageUri: string): Promise<GroceryItem[]> {
    try {
      // Optimize image for processing
      const optimizedImage = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ resize: { width: 1024 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );

      // Read image file
      const base64Image = await FileSystem.readAsStringAsync(optimizedImage.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Process with Gemini Vision
      const result = await this.model.generateContent([
        {
          inlineData: {
            data: base64Image,
            mimeType: 'image/jpeg',
          },
        },
        {
          text: `Extract grocery items from this receipt. For each item, provide:
          1. Name (normalized, e.g., "Tomatoes, Roma" -> "Tomato")
          2. Quantity (if specified)
          3. Unit (if specified)
          4. Category (Fruits, Vegetables, Meat, Seafood, Dairy, Bakery, Other)
          
          Format the response as a JSON array of objects with these properties:
          - name: string
          - quantity: number (optional)
          - unit: string (optional)
          - category: string
          
          Ignore non-grocery items like taxes, totals, and store information.`,
        },
      ]);

      const response = await result.response;
      const text = response.text();

      // Parse the response with error handling
      let items: GroceryItem[] = [];
      try {
        items = JSON.parse(text) as GroceryItem[];
        
        // Validate the parsed data is an array
        if (!Array.isArray(items)) {
          console.error('AI response is not an array:', text);
          throw new Error('Invalid response format: expected an array of grocery items');
        }
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        console.error('Raw response:', text);
        throw new Error('Failed to parse grocery items from receipt');
      }

      // Add default values for required fields
      return items.map((item) => ({
        ...item,
        user_id: '', // Will be set by the caller
        expiry_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Default 7 days
        created_at: new Date().toISOString(),
      }));
    } catch (error) {
      console.error('Error processing receipt:', error);
      throw error;
    }
  }

  static async validateItems(items: GroceryItem[]): Promise<{
    validItems: GroceryItem[];
    invalidItems: { item: GroceryItem; reason: string }[];
  }> {
    const validItems: GroceryItem[] = [];
    const invalidItems: { item: GroceryItem; reason: string }[] = [];

    for (const item of items) {
      try {
        // Validate item name
        if (!item.name || item.name.trim().length === 0) {
          invalidItems.push({ item, reason: 'Missing item name' });
          continue;
        }

        // Validate category
        const validCategories = [
          'Fruits',
          'Vegetables',
          'Meat',
          'Seafood',
          'Dairy',
          'Bakery',
          'Other',
        ];
        if (!validCategories.includes(item.category)) {
          invalidItems.push({ item, reason: 'Invalid category' });
          continue;
        }

        // Validate quantity if present
        if (item.quantity !== undefined && item.quantity <= 0) {
          invalidItems.push({ item, reason: 'Invalid quantity' });
          continue;
        }

        validItems.push(item);
      } catch (error) {
        invalidItems.push({ item, reason: 'Validation error' });
      }
    }

    return { validItems, invalidItems };
  }

  static async saveGroceryItems(
    userId: string,
    items: GroceryItem[]
  ): Promise<GroceryItem[]> {
    try {
      // Add user_id to all items
      const itemsWithUserId = items.map((item) => ({
        ...item,
        user_id: userId,
      }));

      // Insert items in batches of 50
      const batchSize = 50;
      const batches = [];
      for (let i = 0; i < itemsWithUserId.length; i += batchSize) {
        batches.push(itemsWithUserId.slice(i, i + batchSize));
      }

      const results: GroceryItem[] = [];
      for (const batch of batches) {
        const { data, error } = await supabase
          .from('grocery_items')
          .insert(batch)
          .select();

        if (error) throw error;
        results.push(...(data || []));
      }

      return results;
    } catch (error) {
      console.error('Error saving grocery items:', error);
      throw error;
    }
  }
}
