import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput, Animated, Easing } from 'react-native';
import { Settings, Bell, Heart, Clock, CircleHelp as HelpCircle, LogOut, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen() {
  const [allergies, setAllergies] = useState('');
  const [dietaryPreferences, setDietaryPreferences] = useState('');
  const [dislikedIngredients, setDislikedIngredients] = useState('');

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

  const handleSavePreferences = () => {
    // Save preferences logic (e.g., send to backend or local storage)
    console.log('Preferences saved:', { allergies, dietaryPreferences, dislikedIngredients });
  };

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
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity activeOpacity={0.8}>
          <Settings size={24} color="#4A5568" />
        </TouchableOpacity>
      </Animated.View>

      <Animated.ScrollView 
        showsVerticalScrollIndicator={false}
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <Animated.View 
          style={[
            styles.profileSection,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200' }}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>Sarah Johnson</Text>
          <Text style={styles.profileBio}>Passionate home cook • Food enthusiast</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>127</Text>
              <Text style={styles.statLabel}>Recipes</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>1.2k</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>3.4k</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View 
          style={[
            styles.menuSection,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {[
            { icon: Bell, label: 'Notifications', info: '3 new' },
            { icon: Heart, label: 'Favorite Recipes', info: '24' },
            { icon: Clock, label: 'Cooking History', info: '' },
            { icon: HelpCircle, label: 'Help & Support', info: '' },
            { icon: LogOut, label: 'Log Out', info: '' },
          ].map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.menuItem}
              activeOpacity={0.8}
            >
              <View style={styles.menuItemLeft}>
                <item.icon size={24} color="#4A5568" />
                <Text style={styles.menuItemLabel}>{item.label}</Text>
              </View>
              {item.info && (
                <View style={styles.menuItemBadge}>
                  <Text style={styles.menuItemBadgeText}>{item.info}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </Animated.View>

        <Animated.View 
          style={[
            styles.premiumCard,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={['#2D3748', '#1A202C']}
            style={styles.premiumContent}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.sparklesContainer}>
              <Sparkles size={16} color="#FFD166" />
              <Text style={styles.sparklesText}>Premium</Text>
            </View>
            <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
            <Text style={styles.premiumDescription}>
              Get access to exclusive recipes, meal plans, and more!
            </Text>
            <TouchableOpacity 
              style={styles.premiumButton}
              activeOpacity={0.8}
            >
              <Text style={styles.premiumButtonText}>Upgrade Now</Text>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>

        <Animated.View 
          style={[
            styles.preferencesSection,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Your Preferences</Text>

          <Text style={styles.inputLabel}>Allergies</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your allergies"
            value={allergies}
            onChangeText={setAllergies}
          />

          <Text style={styles.inputLabel}>Dietary Preferences</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Vegan, Gluten-Free"
            value={dietaryPreferences}
            onChangeText={setDietaryPreferences}
          />

          <Text style={styles.inputLabel}>Disliked Ingredients</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter ingredients you dislike"
            value={dislikedIngredients}
            onChangeText={setDislikedIngredients}
          />

          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSavePreferences}
            activeOpacity={0.8}
          >
            <Text style={styles.saveButtonText}>Save Preferences</Text>
          </TouchableOpacity>
        </Animated.View>
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
  profileSection: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#FFFFFF',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileName: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#2D3748',
    marginBottom: 4,
  },
  profileBio: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#718096',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#2D3748',
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#718096',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E2E8F0',
  },
  menuSection: {
    backgroundColor: '#FFFFFF',
    marginTop: 20,
    paddingVertical: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#2D3748',
  },
  menuItemBadge: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  menuItemBadgeText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#FFFFFF',
  },
  premiumCard: {
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  premiumContent: {
    padding: 24,
    alignItems: 'center',
  },
  sparklesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  sparklesText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FFD166',
  },
  premiumTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  premiumDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#CBD5E0',
    textAlign: 'center',
    marginBottom: 20,
  },
  premiumButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  premiumButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  preferencesSection: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#2D3748',
    marginBottom: 20,
  },
  inputLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#4A5568',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#2D3748',
  },
  saveButton: {
    backgroundColor: '#FF6B6B',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});