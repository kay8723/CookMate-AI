export default {
  common: {
    search: 'Buscar',
    searchPlaceholder: 'Buscar recetas...',
    loading: 'Cargando...',
    error: 'Algo salió mal',
    tryAgain: 'Intentar de nuevo',
    cancel: 'Cancelar',
    save: 'Guardar',
    delete: 'Eliminar',
    edit: 'Editar',
  },
  filters: {
    difficulty: {
      easy: 'Fácil',
      medium: 'Medio',
      hard: 'Difícil',
    },
    time: {
      quick: 'Rápido',
      medium: 'Medio',
      long: 'Largo',
    },
    diet: {
      vegetarian: 'Vegetariano',
      vegan: 'Vegano',
      glutenFree: 'Sin Gluten',
      dairyFree: 'Sin Lácteos',
    },
  },
  recipe: {
    ingredients: 'Ingredientes',
    instructions: 'Instrucciones',
    servings: '{{count}} porciones',
    cookingTime: '{{time}} minutos',
    difficulty: 'Dificultad',
    addToFavorites: 'Agregar a Favoritos',
    removeFromFavorites: 'Quitar de Favoritos',
    share: 'Compartir Receta',
  },
  errors: {
    loadingFailed: 'Error al cargar las recetas',
    saveFailed: 'Error al guardar la receta',
    deleteFailed: 'Error al eliminar la receta',
    networkError: 'Error de red. Por favor, verifica tu conexión.',
    unexpectedError: 'Ocurrió un error inesperado',
  },
} as const; 