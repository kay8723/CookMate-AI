import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated, Easing } from 'react-native';
import { Mic, Search, Clock, ChefHat, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function CookScreen() {
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
        <Text style={styles.title}>Hey Chef! 👋</Text>
        <Text style={styles.subtitle}>What would you like to cook today?</Text>
      </Animated.View>

      <Animated.View 
        style={[
          styles.searchContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Search size={20} color="#718096" style={styles.searchIcon} />
        <Text style={styles.searchText}>Search recipes, ingredients...</Text>
      </Animated.View>

      <Animated.View 
        style={[
          styles.aiAssistant,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <LinearGradient
          colors={['#FF6B6B', '#FF8E8E']}
          style={styles.aiButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Mic size={32} color="#FFFFFF" />
        </LinearGradient>
        <Text style={styles.aiText}>Ask your AI Chef Assistant</Text>
        <View style={styles.sparklesContainer}>
          <Sparkles size={16} color="#FFD166" />
          <Text style={styles.sparklesText}>Powered by AI</Text>
        </View>
      </Animated.View>

      <Animated.View 
        style={[
          styles.quickActions,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <TouchableOpacity 
          style={styles.actionButton}
          activeOpacity={0.8}
        >
          <View style={styles.actionIcon}>
            <ChefHat size={24} color="#FF6B6B" />
          </View>
          <Text style={styles.actionText}>Quick Meals</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          activeOpacity={0.8}
        >
          <View style={styles.actionIcon}>
            <Clock size={24} color="#FF6B6B" />
          </View>
          <Text style={styles.actionText}>30 Min Meals</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View 
        style={[
          styles.featuredRecipe,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?auto=format&fit=crop&q=80&w=800' }}
          style={styles.recipeImage}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.recipeGradient}
        />
        <View style={styles.recipeInfo}>
          <Text style={styles.recipeTitle}>Featured Recipe</Text>
          <Text style={styles.recipeName}>Homemade Pasta Carbonara</Text>
          <Text style={styles.recipeDetails}>25 mins • Easy • Italian</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
    padding: 20,
  },
  header: {
    marginTop: 60,
    marginBottom: 20,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: '#2D3748',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#718096',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#718096',
  },
  aiAssistant: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  aiButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  aiText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#4A5568',
    marginBottom: 8,
  },
  sparklesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sparklesText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#718096',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFF5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#4A5568',
  },
  featuredRecipe: {
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
    height: 240,
  },
  recipeGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%',
  },
  recipeInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
  },
  recipeTitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  recipeName: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  recipeDetails: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#FFFFFF',
  },
});