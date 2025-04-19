import React from 'react';
import { StyleSheet, ScrollView, Pressable, Text } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  interpolateColor,
  useDerivedValue 
} from 'react-native-reanimated';
import { theme } from '@/theme';

interface FilterChip {
  id: string;
  label: string;
}

interface FilterChipsProps {
  chips: FilterChip[];
  selectedChipIds: string[];
  onChipPress: (chipId: string) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const FilterChips = ({ 
  chips, 
  selectedChipIds, 
  onChipPress 
}: FilterChipsProps) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {chips.map((chip) => (
        <Chip
          key={chip.id}
          label={chip.label}
          isSelected={selectedChipIds.includes(chip.id)}
          onPress={() => onChipPress(chip.id)}
        />
      ))}
    </ScrollView>
  );
};

interface ChipProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

const Chip = ({ label, isSelected, onPress }: ChipProps) => {
  const progress = useDerivedValue(() => 
    withSpring(isSelected ? 1 : 0, { damping: 20 })
  );

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [theme.colors.surface, theme.colors.primary]
    );

    const borderColor = interpolateColor(
      progress.value,
      [0, 1],
      [theme.colors.border, theme.colors.primary]
    );

    return {
      backgroundColor,
      borderColor,
      transform: [
        { scale: withSpring(isSelected ? 1.05 : 1) }
      ],
    };
  });

  const textStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      progress.value,
      [0, 1],
      [theme.colors.text.secondary, '#FFFFFF']
    );

    return { color };
  });

  return (
    <AnimatedPressable
      onPress={onPress}
      style={[styles.chip, animatedStyle]}
    >
      <Animated.Text style={[styles.chipText, textStyle]}>
        {label}
      </Animated.Text>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  chip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.round,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  chipText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
  },
}); 