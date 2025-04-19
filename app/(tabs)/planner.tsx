import * as React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Easing } from 'react-native';
import { ChevronLeft, ChevronRight, Plus, Clock, ChefHat, Heart } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function PlannerScreen() {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(100)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;

  React.useEffect(() => {
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
        <Text style={styles.title}>Meal Planner</Text>
        <TouchableOpacity 
          style={styles.addButton}
          activeOpacity={0.8}
        >
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </Animated.View>

      <Animated.View 
        style={[
          styles.weekSelector,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <TouchableOpacity activeOpacity={0.8}>
          <ChevronLeft size={24} color="#4A5568" />
        </TouchableOpacity>
        <Text style={styles.weekText}>March 18 - 24</Text>
        <TouchableOpacity activeOpacity={0.8}>
          <ChevronRight size={24} color="#4A5568" />
        </TouchableOpacity>
      </Animated.View>

      <Animated.ScrollView 
        showsVerticalScrollIndicator={false}
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        {[
          { day: 'Monday', meals: ['Avocado Toast', 'Chicken Caesar Salad', 'Grilled Salmon'] },
          { day: 'Tuesday', meals: ['Oatmeal Bowl', 'Quinoa Buddha Bowl', 'Pasta Primavera'] },
          { day: 'Wednesday', meals: ['Greek Yogurt Parfait', 'Tuna Sandwich', 'Stir-Fry Tofu'] },
          { day: 'Thursday', meals: ['Smoothie Bowl', 'Mediterranean Wrap', 'Beef Stir-Fry'] },
          { day: 'Friday', meals: ['Breakfast Burrito', 'Poke Bowl', 'Pizza Night'] },
          { day: 'Saturday', meals: ['Pancakes', 'Grilled Chicken Salad', 'Sushi Night'] },
          { day: 'Sunday', meals: ['Eggs Benedict', 'Burger', 'Roast Chicken'] },
        ].map((dayPlan, index) => (
          <Animated.View 
            key={index} 
            style={[
              styles.dayCard,
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
            <Text style={styles.dayText}>{dayPlan.day}</Text>
            <View style={styles.mealsContainer}>
              {['Breakfast', 'Lunch', 'Dinner'].map((mealType, mealIndex) => (
                <View key={mealType} style={styles.mealSection}>
                  <Text style={styles.mealType}>{mealType}</Text>
                  <View style={styles.mealCard}>
                    <View style={styles.mealInfo}>
                      <Text style={styles.mealText}>{dayPlan.meals[mealIndex]}</Text>
                      <View style={styles.mealMeta}>
                        <View style={styles.metaItem}>
                          <Clock size={14} color="#718096" />
                          <Text style={styles.metaText}>30 min</Text>
                        </View>
                        <View style={styles.metaItem}>
                          <ChefHat size={14} color="#718096" />
                          <Text style={styles.metaText}>Easy</Text>
                        </View>
                      </View>
                    </View>
                    <TouchableOpacity 
                      style={styles.editButton}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </Animated.View>
        ))}
      </Animated.ScrollView>
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
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: '#2D3748',
  },
  addButton: {
    backgroundColor: '#FF6B6B',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  weekSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  weekText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#2D3748',
  },
  dayCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  dayText: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#2D3748',
    marginBottom: 20,
  },
  mealsContainer: {
    gap: 20,
  },
  mealSection: {
    gap: 8,
  },
  mealType: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#718096',
  },
  mealCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    padding: 16,
    borderRadius: 12,
  },
  mealInfo: {
    flex: 1,
  },
  mealText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#2D3748',
    marginBottom: 8,
  },
  mealMeta: {
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
    fontSize: 12,
    color: '#718096',
  },
  editButton: {
    backgroundColor: '#EDF2F7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#4A5568',
  },
});