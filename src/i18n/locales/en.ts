export default {
  common: {
    search: 'Search',
    searchPlaceholder: 'Search recipes...',
    loading: 'Loading...',
    error: 'Something went wrong',
    tryAgain: 'Try Again',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
  },
  filters: {
    difficulty: {
      easy: 'Easy',
      medium: 'Medium',
      hard: 'Hard',
    },
    time: {
      quick: 'Quick',
      medium: 'Medium',
      long: 'Long',
    },
    diet: {
      vegetarian: 'Vegetarian',
      vegan: 'Vegan',
      glutenFree: 'Gluten Free',
      dairyFree: 'Dairy Free',
    },
  },
  recipe: {
    ingredients: 'Ingredients',
    instructions: 'Instructions',
    servings: '{{count}} servings',
    cookingTime: '{{time}} mins',
    difficulty: 'Difficulty',
    addToFavorites: 'Add to Favorites',
    removeFromFavorites: 'Remove from Favorites',
    share: 'Share Recipe',
  },
  errors: {
    loadingFailed: 'Failed to load recipes',
    saveFailed: 'Failed to save recipe',
    deleteFailed: 'Failed to delete recipe',
    networkError: 'Network error. Please check your connection.',
    unexpectedError: 'An unexpected error occurred',
  },
} as const; 