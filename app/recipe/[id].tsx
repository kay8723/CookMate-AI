import React from 'react';
import { RecipeDetailScreen } from '../../src/screens/recipe/RecipeDetailScreen';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function RecipeDetail() {
  const { id } = useLocalSearchParams();
  const navigation = useRouter();
  return <RecipeDetailScreen route={{ params: { recipeId: id as string } }} navigation={navigation} />;
} 