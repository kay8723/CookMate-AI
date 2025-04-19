import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Easing } from 'react-native';
import { Plus, Apple, Carrot, Beef, Fish, Milk, Heading as Bread, Clock, AlertTriangle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function PantryScreen() {
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
        <Text style={styles.title}>Pantry</Text>
        <TouchableOpacity 
          style={styles.addButton}
          activeOpacity={0.8}
        >
          <Plus size={24} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add Items</Text>
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
          {
            category: 'Fruits',
            icon: Apple,
            items: [
              { name: 'Apples', quantity: '5 pieces', expiry: '3 days' },
              { name: 'Bananas', quantity: '4 pieces', expiry: '2 days' },
              { name: 'Oranges', quantity: '6 pieces', expiry: '5 days' },
            ],
          },
          {
            category: 'Vegetables',
            icon: Carrot,
            items: [
              { name: 'Carrots', quantity: '500g', expiry: '7 days' },
              { name: 'Tomatoes', quantity: '4 pieces', expiry: '4 days' },
            ],
          },
          {
            category: 'Meat',
            icon: Beef,
            items: [
              { name: 'Chicken Breast', quantity: '1kg', expiry: '2 days' },
              { name: 'Ground Beef', quantity: '500g', expiry: '1 day' },
            ],
          },
          {
            category: 'Seafood',
            icon: Fish,
            items: [
              { name: 'Salmon', quantity: '400g', expiry: '2 days' },
            ],
          },
          {
            category: 'Dairy',
            icon: Milk,
            items: [
              { name: 'Milk', quantity: '1L', expiry: '5 days' },
              { name: 'Cheese', quantity: '200g', expiry: '10 days' },
              { name: 'Yogurt', quantity: '500g', expiry: '7 days' },
            ],
          },
          {
            category: 'Bakery',
            icon: Bread,
            items: [
              { name: 'Bread', quantity: '1 loaf', expiry: '3 days' },
              { name: 'Bagels', quantity: '4 pieces', expiry: '4 days' },
            ],
          },
        ].map((section, sectionIndex) => (
          <Animated.View 
            key={section.category} 
            style={[
              styles.section,
              {
                transform: [
                  { scale: scaleAnim },
                  { translateY: slideAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: [0, 20 * sectionIndex],
                  })}
                ],
              },
            ]}
          >
            <View style={styles.sectionHeader}>
              <section.icon size={24} color="#4A5568" />
              <Text style={styles.sectionTitle}>{section.category}</Text>
            </View>
            {section.items.map((item, index) => (
              <View style={styles.itemCard}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <View style={styles.itemMeta}>
                    <View style={styles.metaItem}>
                      <Clock size={14} color="#718096" />
                      <Text style={styles.metaText}>{item.quantity}</Text>
                    </View>
                    {parseInt(item.expiry) <= 2 && (
                      <View style={styles.metaItem}>
                        <AlertTriangle size={14} color="#E53E3E" />
                        <Text style={[styles.metaText, styles.warningText]}>Expires soon</Text>
                      </View>
                    )}
                  </View>
                </View>
                <View style={[
                  styles.expiryTag,
                  parseInt(item.expiry) <= 2 ? styles.expiryWarning : styles.expiryNormal
                ]}>
                  <Text style={[
                    styles.expiryText,
                    parseInt(item.expiry) <= 2 ? styles.expiryTextWarning : styles.expiryTextNormal
                  ]}>
                    {item.expiry}
                  </Text>
                </View>
              </View>
            ))}
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    fontSize: 16,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: '#2D3748',
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#2D3748',
    marginBottom: 8,
  },
  itemMeta: {
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
  warningText: {
    color: '#E53E3E',
  },
  expiryTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  expiryNormal: {
    backgroundColor: '#E6FFFA',
  },
  expiryWarning: {
    backgroundColor: '#FFF5F5',
  },
  expiryText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
  },
  expiryTextNormal: {
    color: '#319795',
  },
  expiryTextWarning: {
    color: '#E53E3E',
  },
});