import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Clock, ChefHat } from 'lucide-react-native';
import { colors, spacing, typography, borderRadius } from '../../theme';
import i18n from '../../i18n';
import { useRouter } from 'expo-router';

interface Recipe {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  duration: string;
  difficulty: 'easy' | 'medium' | 'hard';
  likes: number;
}

export const HomeScreen: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const router = useRouter();

  const categories = [
    { id: 'all', name: i18n.t('all_recipes') },
    { id: 'trending', name: i18n.t('trending') },
    { id: 'quick', name: i18n.t('quick_easy') },
    { id: 'vegetarian', name: i18n.t('vegetarian') },
    { id: 'desserts', name: i18n.t('desserts') },
  ];

  // Mock data - replace with API call
  useEffect(() => {
    setRecipes([
      {
        id: '1',
        title: 'Creamy Garlic Pasta',
        description: 'A delicious Italian pasta dish with creamy garlic sauce',
        imageUrl: 'https://source.unsplash.com/random/400x300/?pasta',
        duration: '30 min',
        difficulty: 'easy',
        likes: 245,
      },
      {
        id: '2',
        title: 'Grilled Salmon',
        description: 'Fresh salmon with herbs and lemon',
        imageUrl: 'https://source.unsplash.com/random/400x300/?salmon',
        duration: '25 min',
        difficulty: 'medium',
        likes: 189,
      },
      // Add more mock recipes
    ]);
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Implement refresh logic here
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return colors.success.main;
      case 'medium':
        return colors.warning.main;
      case 'hard':
        return colors.error.main;
      default:
        return colors.grey[500];
    }
  };

  const renderRecipeCard = ({ item }: { item: Recipe }) => (
    <TouchableOpacity
      style={styles.recipeCard}
      onPress={() => router.push(`/recipe/${item.id}` as any)}
      activeOpacity={0.9}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.recipeImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.gradient}
      />
      <View style={styles.recipeInfo}>
        <Text style={styles.recipeTitle}>{item.title}</Text>
        <Text style={styles.recipeDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.recipeMetaInfo}>
          <View style={styles.metaItem}>
            <Clock size={16} color={colors.grey[300]} />
            <Text style={styles.metaText}>{item.duration}</Text>
          </View>
          <View style={styles.metaItem}>
            <ChefHat size={16} color={getDifficultyColor(item.difficulty)} />
            <Text style={[styles.metaText, { color: getDifficultyColor(item.difficulty) }]}>
              {i18n.t(`difficulty.${item.difficulty}`)}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Heart size={16} color={colors.error.light} />
            <Text style={styles.metaText}>{item.likes}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryChip = ({ item }: { item: typeof categories[0] }) => (
    <TouchableOpacity
      style={[
        styles.categoryChip,
        selectedCategory === item.id && styles.categoryChipSelected,
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Text
        style={[
          styles.categoryText,
          selectedCategory === item.id && styles.categoryTextSelected,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={recipes}
        renderItem={renderRecipeCard}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={
          <View>
            <Text style={styles.headerTitle}>{i18n.t('discover_recipes')}</Text>
            <Text style={styles.headerSubtitle}>{i18n.t('find_perfect_meal')}</Text>
            <FlatList
              data={categories}
              renderItem={renderCategoryChip}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoriesList}
              contentContainerStyle={styles.categoriesContent}
            />
          </View>
        }
        contentContainerStyle={styles.recipeList}
      />
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  headerTitle: {
    ...typography.h1,
    color: colors.text.primary,
    marginHorizontal: spacing.xl,
    marginTop: spacing.xl,
  },
  headerSubtitle: {
    ...typography.body1,
    color: colors.text.secondary,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  categoriesList: {
    marginBottom: spacing.lg,
  },
  categoriesContent: {
    paddingHorizontal: spacing.xl,
  },
  categoryChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.grey[200],
  },
  categoryChipSelected: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
  categoryText: {
    ...typography.button,
    color: colors.text.secondary,
  },
  categoryTextSelected: {
    color: colors.background.paper,
  },
  recipeList: {
    paddingBottom: spacing.xl,
  },
  recipeCard: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.xl,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: colors.background.paper,
    elevation: 4,
    shadowColor: colors.grey[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recipeImage: {
    width: '100%',
    height: 200,
    backgroundColor: colors.grey[200],
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  recipeInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
  },
  recipeTitle: {
    ...typography.h3,
    color: colors.background.paper,
    marginBottom: spacing.xs,
  },
  recipeDescription: {
    ...typography.body2,
    color: colors.grey[300],
    marginBottom: spacing.sm,
  },
  recipeMetaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  metaText: {
    ...typography.caption,
    color: colors.grey[300],
    marginLeft: spacing.xs,
  },
}); 