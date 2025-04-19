import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Heart,
  Clock,
  ChefHat,
  Share2,
  Bookmark,
  MessageCircle,
  ArrowLeft,
} from 'lucide-react-native';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { CookingGuide } from '../../components';

interface RecipeDetailProps {
  route: {
    params: {
      recipeId: string;
    };
  };
  navigation: any;
}

export const RecipeDetailScreen: React.FC<RecipeDetailProps> = ({
  route,
  navigation,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Mock data - replace with API call
  const recipe = {
    id: '1',
    title: 'Creamy Garlic Pasta',
    description: 'A delicious Italian pasta dish with creamy garlic sauce and fresh herbs. Perfect for a cozy dinner.',
    imageUrl: 'https://source.unsplash.com/random/400x300/?pasta',
    duration: '30 min',
    difficulty: 'easy',
    likes: 245,
    servings: 4,
    ingredients: [
      '400g spaghetti',
      '4 cloves garlic, minced',
      '2 cups heavy cream',
      '1/2 cup parmesan cheese',
      'Salt and pepper to taste',
      'Fresh parsley for garnish',
    ],
    steps: [
      {
        number: 1,
        instruction: 'Boil pasta according to package instructions',
        timer: 600,
        tips: ['Add salt to the water for better taste'],
      },
      {
        number: 2,
        instruction: 'In a large pan, sauté minced garlic until fragrant',
        timer: 120,
      },
      {
        number: 3,
        instruction: 'Add heavy cream and simmer until slightly thickened',
        timer: 300,
        tips: ['Stir occasionally to prevent burning'],
      },
    ],
  };

  const handleShare = () => {
    // Implement share functionality
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image source={{ uri: recipe.imageUrl }} style={styles.headerImage} />
          <LinearGradient
            colors={['rgba(0,0,0,0.8)', 'transparent', 'rgba(0,0,0,0.8)']}
            style={styles.headerGradient}
          />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={24} color={colors.background.paper} />
          </TouchableOpacity>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setIsSaved(!isSaved)}
            >
              <Bookmark
                size={24}
                color={colors.background.paper}
                fill={isSaved ? colors.background.paper : 'none'}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <Share2 size={24} color={colors.background.paper} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{recipe.title}</Text>
          <Text style={styles.description}>{recipe.description}</Text>

          <View style={styles.metaInfo}>
            <View style={styles.metaItem}>
              <Clock size={20} color={colors.text.secondary} />
              <Text style={styles.metaText}>{recipe.duration}</Text>
            </View>
            <View style={styles.metaItem}>
              <ChefHat size={20} color={colors.text.secondary} />
              <Text style={styles.metaText}>
                {recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1)}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.likeButton}
              onPress={() => setIsLiked(!isLiked)}
            >
              <Heart
                size={20}
                color={isLiked ? colors.error.main : colors.text.secondary}
                fill={isLiked ? colors.error.main : 'none'}
              />
              <Text style={styles.metaText}>{recipe.likes}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            <Text style={styles.servings}>For {recipe.servings} servings</Text>
            {recipe.ingredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientItem}>
                <View style={styles.bullet} />
                <Text style={styles.ingredientText}>{ingredient}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            <CookingGuide
              steps={recipe.steps}
              onStepComplete={(step) => console.log('Step completed:', step)}
              onTimerComplete={(step) => console.log('Timer completed for step:', step)}
            />
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.commentButton}>
        <MessageCircle size={24} color={colors.background.paper} />
        <Text style={styles.commentButtonText}>Comments</Text>
      </TouchableOpacity>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  header: {
    height: width * 0.8,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  headerGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  backButton: {
    position: 'absolute',
    top: spacing.xl,
    left: spacing.lg,
    padding: spacing.sm,
  },
  headerActions: {
    position: 'absolute',
    top: spacing.xl,
    right: spacing.lg,
    flexDirection: 'row',
  },
  actionButton: {
    padding: spacing.sm,
    marginLeft: spacing.md,
  },
  content: {
    flex: 1,
    padding: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.body1,
    color: colors.text.secondary,
    marginBottom: spacing.xl,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.xl,
  },
  metaText: {
    ...typography.body2,
    color: colors.text.secondary,
    marginLeft: spacing.xs,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  servings: {
    ...typography.body2,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary.main,
    marginRight: spacing.sm,
  },
  ingredientText: {
    ...typography.body1,
    color: colors.text.primary,
  },
  commentButton: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.xl,
    backgroundColor: colors.primary.main,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.full,
    elevation: 4,
    shadowColor: colors.grey[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  commentButtonText: {
    ...typography.button,
    color: colors.background.paper,
    marginLeft: spacing.sm,
  },
}); 