import React, { useCallback } from 'react';
import { StyleSheet, TextInput, Pressable, View } from 'react-native';
import { Search, X } from 'lucide-react-native';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  useSharedValue 
} from 'react-native-reanimated';
import { theme } from '@/theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const SearchBar = ({ 
  value, 
  onChangeText, 
  placeholder = 'Search recipes...' 
}: SearchBarProps) => {
  const clearButtonScale = useSharedValue(0);

  const clearButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: clearButtonScale.value }],
  }));

  const handleTextChange = useCallback((text: string) => {
    onChangeText(text);
    clearButtonScale.value = withSpring(text.length > 0 ? 1 : 0);
  }, [onChangeText, clearButtonScale]);

  const handleClear = useCallback(() => {
    onChangeText('');
    clearButtonScale.value = withSpring(0);
  }, [onChangeText, clearButtonScale]);

  return (
    <View style={styles.container}>
      <Search 
        size={20} 
        strokeWidth={2} 
        stroke={theme.colors.text.secondary} 
        style={styles.searchIcon} 
      />
      <TextInput
        value={value}
        onChangeText={handleTextChange}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.text.secondary}
        style={styles.input}
        returnKeyType="search"
        clearButtonMode="never"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Animated.View style={[styles.clearButton, clearButtonStyle]}>
        <Pressable onPress={handleClear} hitSlop={8}>
          <X 
            size={16} 
            strokeWidth={2.5} 
            stroke={theme.colors.text.secondary} 
          />
        </Pressable>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.sm,
    height: 48,
    ...theme.shadows.sm,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.primary,
    paddingVertical: theme.spacing.sm,
  },
  clearButton: {
    marginLeft: theme.spacing.sm,
    padding: theme.spacing.xs,
  },
}); 