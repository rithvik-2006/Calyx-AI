import { db } from '@/db';
import { customFoods } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { CustomFoodInput } from '@/validators/food.validator';

export class CustomFoodRepository {
  static async createCustomFood(userId: string, data: CustomFoodInput) {
    const [newFood] = await db.insert(customFoods).values({
      userId,
      name: data.name,
      calories: data.calories,
      protein: data.protein.toString(),
      fat: data.fat.toString(),
      carbs: data.carbs.toString(),
      servingSize: data.servingSize,
    }).returning();
    
    return newFood;
  }
}
