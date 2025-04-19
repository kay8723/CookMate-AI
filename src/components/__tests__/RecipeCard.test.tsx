import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { RecipeCard } from '@components/RecipeCard';

describe('RecipeCard', () => {
  const mockRecipe = {
    id: '1',
    title: 'Spaghetti Carbonara',
    cookingTime: 30,
    servings: 4,
    image: 'https://example.com/carbonara.jpg',
  };

  const mockOnPress = jest.fn();

  it('renders recipe details correctly', () => {
    const { getByText, getByTestId } = render(
      <RecipeCard recipe={mockRecipe} onPress={mockOnPress} />
    );

    expect(getByText('Spaghetti Carbonara')).toBeTruthy();
    expect(getByText('30 mins')).toBeTruthy();
    expect(getByText('4 servings')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const { getByTestId } = render(
      <RecipeCard recipe={mockRecipe} onPress={mockOnPress} />
    );

    fireEvent.press(getByTestId('recipe-card'));
    expect(mockOnPress).toHaveBeenCalledWith(mockRecipe);
  });
}); 