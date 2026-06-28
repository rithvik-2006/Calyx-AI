import { z } from 'zod';

export const customFoodSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  calories: z.number().int().nonnegative('Calories must be positive'),
  protein: z.number().nonnegative(),
  fat: z.number().nonnegative(),
  carbs: z.number().nonnegative(),
  servingSize: z.string().min(1, 'Serving size is required'),
});

export type CustomFoodInput = z.infer<typeof customFoodSchema>;

export const toggleFavoriteSchema = z.object({
  foodId: z.number().int().positive(),
  source: z.enum(['food_master', 'custom_foods']),
});

export type ToggleFavoriteInput = z.infer<typeof toggleFavoriteSchema>;
