import { z } from 'zod';

export const addFoodLogSchema = z.object({
  mealType: z.enum(['Breakfast', 'Lunch', 'Snack', 'Dinner']),
  foodId: z.number().int().positive(),
  source: z.enum(['food_master', 'custom_foods']),
  quantity: z.number().positive(),
});

export type AddFoodLogInput = z.infer<typeof addFoodLogSchema>;

export const dateQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format, use YYYY-MM-DD').optional(),
});
