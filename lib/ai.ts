import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from './supabase';
import { AIConversation } from './supabase';

// Type-safe environment variables
const ENV = {
  GEMINI_API_KEY: process.env.EXPO_PUBLIC_GEMINI_API_KEY,
} as const;

// Validate environment variables
if (!ENV.GEMINI_API_KEY) {
  throw new Error('Missing EXPO_PUBLIC_GEMINI_API_KEY environment variable');
}

const genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);

export class AIService {
  private static model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  static async getCookingAdvice(
    userId: string,
    query: string,
    context?: {
      currentRecipe?: string;
      availableIngredients?: string[];
      dietaryRestrictions?: string[];
    }
  ) {
    try {
      // Get conversation history
      const { data: conversation } = await supabase
        .from('ai_conversations')
        .select('messages')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      // Prepare context for the AI
      const contextPrompt = context
        ? `Context:
           - Current Recipe: ${context.currentRecipe || 'None'}
           - Available Ingredients: ${context.availableIngredients?.join(', ') || 'None specified'}
           - Dietary Restrictions: ${context.dietaryRestrictions?.join(', ') || 'None specified'}
           `
        : '';

      // Prepare conversation history
      const history = conversation?.messages
        ?.slice(-5) // Last 5 messages for context
        .map((msg: { role: string; content: string }) => `${msg.role}: ${msg.content}`)
        .join('\n') || '';

      // Generate response
      const result = await this.model.generateContent(`
        You are a helpful cooking assistant. Provide clear, concise advice.
        ${contextPrompt}
        
        Previous conversation:
        ${history}
        
        User: ${query}
      `);

      const response = await result.response;
      const text = response.text();

      // Save conversation
      await this.saveConversation(userId, query, text);

      return text;
    } catch (error) {
      console.error('Error getting AI response:', error);
      throw error;
    }
  }

  static async getIngredientSubstitution(
    ingredient: string,
    reason: string,
    availableIngredients: string[]
  ) {
    try {
      const result = await this.model.generateContent(`
        Suggest substitutes for ${ingredient} because ${reason}.
        Available ingredients: ${availableIngredients.join(', ')}.
        Provide 3 options, ranked by preference, with explanations.
      `);

      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error getting substitution:', error);
      throw error;
    }
  }

  static async getRecipeSuggestions(
    availableIngredients: string[],
    dietaryRestrictions: string[],
    preferences: {
      cuisine?: string;
      mealType?: string;
      timeAvailable?: number;
    }
  ) {
    try {
      const result = await this.model.generateContent(`
        Suggest recipes based on:
        - Available ingredients: ${availableIngredients.join(', ')}
        - Dietary restrictions: ${dietaryRestrictions.join(', ')}
        - Preferences: ${JSON.stringify(preferences)}
        
        For each recipe, provide:
        1. Name
        2. Brief description
        3. Main ingredients needed
        4. Estimated prep time
        5. Difficulty level
      `);

      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error getting recipe suggestions:', error);
      throw error;
    }
  }

  private static async saveConversation(
    userId: string,
    userMessage: string,
    assistantMessage: string
  ) {
    const timestamp = new Date().toISOString();

    // Get or create conversation
    let { data: conversation } = await supabase
      .from('ai_conversations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!conversation) {
      const { data: newConversation } = await supabase
        .from('ai_conversations')
        .insert([
          {
            user_id: userId,
            messages: [],
          },
        ])
        .select()
        .single();

      conversation = newConversation;
    }

    // Add new messages
    const updatedMessages = [
      ...(conversation.messages || []),
      {
        role: 'user',
        content: userMessage,
        timestamp,
      },
      {
        role: 'assistant',
        content: assistantMessage,
        timestamp,
      },
    ];

    // Update conversation
    await supabase
      .from('ai_conversations')
      .update({ messages: updatedMessages })
      .eq('id', conversation.id);
  }
}
