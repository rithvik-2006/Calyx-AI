import { db } from '@/db';
import { plates, plateItems, foodMaster, customFoods } from '@/db/schema';
import { eq, desc, and, inArray } from 'drizzle-orm';
import { CreatePlateInput } from '@/types/plate.types';

export class PlateRepository {
  static async getPlatesByUser(userId: string) {
    const userPlates = await db.query.plates.findMany({
      where: eq(plates.userId, userId),
      orderBy: [desc(plates.createdAt)]
    });

    if (userPlates.length === 0) return [];

    const pIds = userPlates.map(p => p.id);
    const items = await db.select({
      id: plateItems.id,
      plateId: plateItems.plateId,
      quantity: plateItems.quantity,
      foodMasterId: plateItems.foodMasterId,
      customFoodId: plateItems.customFoodId,
      masterName: foodMaster.name,
      masterCalories: foodMaster.calories,
      masterProtein: foodMaster.protein,
      masterFat: foodMaster.fat,
      masterCarbs: foodMaster.carbs,
      masterServingSize: foodMaster.servingSize,
      customName: customFoods.name,
      customCalories: customFoods.calories,
      customProtein: customFoods.protein,
      customFat: customFoods.fat,
      customCarbs: customFoods.carbs,
      customServingSize: customFoods.servingSize,
    })
    .from(plateItems)
    .leftJoin(foodMaster, eq(plateItems.foodMasterId, foodMaster.id))
    .leftJoin(customFoods, eq(plateItems.customFoodId, customFoods.id))
    .where(inArray(plateItems.plateId, pIds));

    return userPlates.map(plate => ({
      ...plate,
      items: items.filter(i => i.plateId === plate.id)
    }));
  }

  static async getPlateById(plateId: number, userId: string) {
    const plate = await db.query.plates.findFirst({
      where: and(eq(plates.id, plateId), eq(plates.userId, userId))
    });

    if (!plate) return null;

    const items = await db.select({
      id: plateItems.id,
      plateId: plateItems.plateId,
      quantity: plateItems.quantity,
      foodMasterId: plateItems.foodMasterId,
      customFoodId: plateItems.customFoodId,
      masterName: foodMaster.name,
      masterCalories: foodMaster.calories,
      masterProtein: foodMaster.protein,
      masterFat: foodMaster.fat,
      masterCarbs: foodMaster.carbs,
      masterServingSize: foodMaster.servingSize,
      customName: customFoods.name,
      customCalories: customFoods.calories,
      customProtein: customFoods.protein,
      customFat: customFoods.fat,
      customCarbs: customFoods.carbs,
      customServingSize: customFoods.servingSize,
    })
    .from(plateItems)
    .leftJoin(foodMaster, eq(plateItems.foodMasterId, foodMaster.id))
    .leftJoin(customFoods, eq(plateItems.customFoodId, customFoods.id))
    .where(eq(plateItems.plateId, plateId));

    return { ...plate, items };
  }

  static async createPlate(userId: string, input: CreatePlateInput) {
    const [newPlate] = await db.insert(plates).values({
      userId,
      name: input.name,
      description: input.description || null,
      mealType: input.mealType || null
    }).returning();

    if (input.items.length > 0) {
      await db.insert(plateItems).values(
        input.items.map(item => ({
          plateId: newPlate.id,
          foodMasterId: item.source === 'food_master' ? item.foodId : null,
          customFoodId: item.source === 'custom_foods' ? item.foodId : null,
          quantity: item.quantity.toString()
        }))
      );
    }

    return newPlate.id;
  }

  static async updatePlate(plateId: number, userId: string, input: CreatePlateInput) {
    await db.update(plates)
      .set({
        name: input.name,
        description: input.description || null,
        mealType: input.mealType || null,
        updatedAt: new Date()
      })
      .where(and(eq(plates.id, plateId), eq(plates.userId, userId)));

    await db.delete(plateItems).where(eq(plateItems.plateId, plateId));

    if (input.items.length > 0) {
      await db.insert(plateItems).values(
        input.items.map(item => ({
          plateId: plateId,
          foodMasterId: item.source === 'food_master' ? item.foodId : null,
          customFoodId: item.source === 'custom_foods' ? item.foodId : null,
          quantity: item.quantity.toString()
        }))
      );
    }
  }

  static async deletePlate(plateId: number, userId: string) {
    await db.delete(plates).where(and(eq(plates.id, plateId), eq(plates.userId, userId)));
  }
}
