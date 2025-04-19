import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TextInput, TouchableOpacity, ActivityIndicator, Animated, Easing } from 'react-native';
import { Search, Filter, Clock, ChefHat, Heart, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';

export default function RecipesScreen() {
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [favorites, setFavorites] = useState(new Set());

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(100)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async (query = '') => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
      );
      setRecipes(response.data.meals || []);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchRecipes(searchQuery);
  };

  const toggleFavorite = (id) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'breakfast', label: 'Breakfast' },
    { id: 'lunch', label: 'Lunch' },
    { id: 'dinner', label: 'Dinner' },
    { id: 'dessert', label: 'Dessert' },
  ];

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.title}>Recipes</Text>
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#718096" />
            <TextInput
              placeholder="Search recipes..."
              style={styles.searchInput}
              placeholderTextColor="#718096"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={[
          styles.filterContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
        contentContainerStyle={styles.filterContent}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterChip,
              activeFilter === filter.id && styles.activeFilterChip
            ]}
            onPress={() => setActiveFilter(filter.id)}
          >
            <Text style={[
              styles.filterText,
              activeFilter === filter.id && styles.activeFilterText
            ]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </Animated.ScrollView>

      {loading ? (
        <ActivityIndicator size="large" color="#FF6B6B" style={styles.loader} />
      ) : (
        <Animated.ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.recipeGrid}
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {recipes.map((recipe, index) => (
            <Animated.View
              key={recipe.idMeal}
              style={[
                styles.recipeCard,
                {
                  transform: [
                    { scale: scaleAnim },
                    { translateY: slideAnim.interpolate({
                      inputRange: [0, 100],
                      outputRange: [0, 20 * index],
                    })}
                  ],
                },
              ]}
            >
              <Image 
                source={{ uri: recipe.strMealThumb }} 
                style={styles.recipeImage}
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.recipeGradient}
              />
              <TouchableOpacity 
                style={styles.favoriteButton}
                onPress={() => toggleFavorite(recipe.idMeal)}
              >
                <Heart 
                  size={24} 
                  color={favorites.has(recipe.idMeal) ? '#FF6B6B' : '#FFFFFF'} 
                  fill={favorites.has(recipe.idMeal) ? '#FF6B6B' : 'none'}
                />
              </TouchableOpacity>
              <View style={styles.recipeInfo}>
                <Text style={styles.recipeName}>{recipe.strMeal}</Text>
                <View style={styles.recipeMeta}>
                  <View style={styles.metaItem}>
                    <Clock size={16} color="#FFFFFF" />
                    <Text style={styles.metaText}>30 min</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <ChefHat size={16} color="#FFFFFF" />
                    <Text style={styles.metaText}>{recipe.strCategory}</Text>
                  </View>
                </View>
              </View>
            </Animated.View>
          ))}
        </Animated.ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 15,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: '#2D3748',
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 48,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: '#FFF5F5',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  filterContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F7FAFC',
    marginRight: 10,
  },
  activeFilterChip: {
    backgroundColor: '#FF6B6B',
  },
  filterText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#4A5568',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  loader: {
    marginTop: 20,
  },
  recipeGrid: {
    padding: 20,
    gap: 15,
  },
  recipeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  recipeImage: {
    width: '100%',
    height: 200,
  },
  recipeGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recipeInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  recipeName: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  recipeMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#FFFFFF',
  },
});