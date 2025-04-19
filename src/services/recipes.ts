import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './api';
import { z } from 'zod';

export const RecipeSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  cookingTime: z.number(),
  servings: z.number(),
  image: z.string(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  ingredients: z.array(z.string()),
  instructions: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Recipe = z.infer<typeof RecipeSchema>;

export const useRecipes = (filters?: {
  difficulty?: Recipe['difficulty'];
  searchQuery?: string;
}) => {
  return useQuery({
    queryKey: ['recipes', filters],
    queryFn: async () => {
      const response = await api.get<Recipe[]>('/recipes', { params: filters });
      return z.array(RecipeSchema).parse(response);
    },
  });
};

export const useRecipe = (id: string) => {
  return useQuery({
    queryKey: ['recipe', id],
    queryFn: async () => {
      const response = await api.get<Recipe>(`/recipes/${id}`);
      return RecipeSchema.parse(response);
    },
  });
};

export const useCreateRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newRecipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => {
      const response = await api.post<Recipe>('/recipes', newRecipe);
      return RecipeSchema.parse(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });
};

export const useUpdateRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      recipe,
    }: {
      id: string;
      recipe: Partial<Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>>;
    }) => {
      const response = await api.put<Recipe>(`/recipes/${id}`, recipe);
      return RecipeSchema.parse(response);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      queryClient.invalidateQueries({ queryKey: ['recipe', id] });
    },
  });
};

export const useDeleteRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/recipes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });
}; 