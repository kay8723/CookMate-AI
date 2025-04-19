import * as SecureStore from 'expo-secure-store';

export const SecureStorage = {
  async setItem(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error('Error storing data securely:', error);
      throw error;
    }
  },

  async getItem(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('Error retrieving secure data:', error);
      throw error;
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('Error removing secure data:', error);
      throw error;
    }
  },

  async clear(): Promise<void> {
    // Note: expo-secure-store doesn't provide a clear all method
    // You'll need to maintain a list of keys and remove them individually
    const keys = ['auth_token', 'user_data', 'api_keys'];
    try {
      await Promise.all(keys.map(key => SecureStore.deleteItemAsync(key)));
    } catch (error) {
      console.error('Error clearing secure storage:', error);
      throw error;
    }
  }
}; 