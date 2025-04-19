import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { Clock, Users } from 'lucide-react-native';

interface Recipe {
  id: string;
  title: string;
  cookingTime: number;
  servings: number;
  image: string;
  description?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

interface RecipeCardProps {
  recipe: Recipe;
  onPress: (recipe: Recipe) => void;
  isLoading?: boolean;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ 
  recipe, 
  onPress,
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <TouchableOpacity
      testID="recipe-card"
      style={styles.container}
      onPress={() => onPress(recipe)}
      activeOpacity={0.7}
    >
      {recipe.image && (
        <Image
          source={{ uri: recipe.image }}
          style={styles.image}
          resizeMode="cover"
        />
      )}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {recipe.title}
        </Text>
        {recipe.description && (
          <Text style={styles.description} numberOfLines={2}>
            {recipe.description}
          </Text>
        )}
        <View style={styles.metadata}>
          <View style={styles.metadataItem}>
            <Clock size={16} color="#666" />
            <Text style={styles.detail}>{recipe.cookingTime} mins</Text>
          </View>
          <View style={styles.metadataItem}>
            <Users size={16} color="#666" />
            <Text style={styles.detail}>{recipe.servings} servings</Text>
          </View>
          {recipe.difficulty && (
            <View style={[styles.difficultyBadge, styles[`difficulty_${recipe.difficulty}`]]}>
              <Text style={styles.difficultyText}>
                {recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1)}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 16,
  },
  image: {
    width: '100%',
    height: 160,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 4,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detail: {
    fontSize: 14,
    color: '#666',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  difficulty_easy: {
    backgroundColor: '#e6f4ea',
  },
  difficulty_medium: {
    backgroundColor: '#fff3e0',
  },
  difficulty_hard: {
    backgroundColor: '#fde7e7',
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
  },
}); 