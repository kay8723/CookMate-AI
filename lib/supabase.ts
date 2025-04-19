import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Type-safe environment variables
const ENV = {
  SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
} as const;

// Validate environment variables
if (!ENV.SUPABASE_URL) {
  throw new Error('Missing EXPO_PUBLIC_SUPABASE_URL environment variable');
}
if (!ENV.SUPABASE_ANON_KEY) {
  throw new Error('Missing EXPO_PUBLIC_SUPABASE_ANON_KEY environment variable');
}

export const supabase = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Types for our database tables
export type Profile = {
  id: string;
  user_id: string;
  username: string;
  avatar_url: string;
  allergies: string[];
  dietary_preferences: string[];
  disliked_ingredients: string[];
  created_at: string;
};

export type Recipe = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prep_time: number;
  cook_time: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  image_url: string;
  created_at: string;
};

export type GroceryItem = {
  id: string;
  user_id: string;
  name: string;
  quantity: number;
  unit: string;
  expiry_date: string;
  category: string;
  created_at: string;
};

export type AIConversation = {
  id: string;
  user_id: string;
  messages: {
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }[];
  created_at: string;
}; 