import { db } from '@/db';
import { favoriteFoods, foodMaster, customFoods, dailyFoodItems, dailyLogs } from '@/db/schema';
import { and, eq, desc } from 'drizzle-orm';

export class FavoriteRepository {
  static async getFavorites(userId: string) {
    return db.select({
      favoriteId: favoriteFoods.id,
      foodMasterId: favoriteFoods.foodMasterId,
      customFoodId: favoriteFoods.customFoodId,
      isPinned: favoriteFoods.isPinned,
      pinOrder: favoriteFoods.pinOrder,
      masterName: foodMaster.name,
      masterCalories: foodMaster.calories,
      masterProtein: foodMaster.protein,
      masterFat: foodMaster.fat,
      masterCarbs: foodMaster.carbs,
      masterServingSize: foodMaster.servingSize,
      masterCategory: foodMaster.category,
      customName: customFoods.name,
      customCalories: customFoods.calories,
      customProtein: customFoods.protein,
      customFat: customFoods.fat,
      customCarbs: customFoods.carbs,
      customServingSize: customFoods.servingSize,
    })
    .from(favoriteFoods)
    .leftJoin(foodMaster, eq(favoriteFoods.foodMasterId, foodMaster.id))
    .leftJoin(customFoods, eq(favoriteFoods.customFoodId, customFoods.id))
    .where(eq(favoriteFoods.userId, userId))
    .orderBy(desc(favoriteFoods.createdAt));
  }

  static async getRecentFoods(userId: string) {
    return db.select({
      foodMasterId: dailyFoodItems.foodMasterId,
      customFoodId: dailyFoodItems.customFoodId,
      loggedAt: dailyFoodItems.loggedAt,
      masterName: foodMaster.name,
      masterCalories: foodMaster.calories,
      masterProtein: foodMaster.protein,
      masterFat: foodMaster.fat,
      masterCarbs: foodMaster.carbs,
      masterServingSize: foodMaster.servingSize,
      masterCategory: foodMaster.category,
      customName: customFoods.name,
      customCalories: customFoods.calories,
      customProtein: customFoods.protein,
      customFat: customFoods.fat,
      customCarbs: customFoods.carbs,
      customServingSize: customFoods.servingSize,
    })
    .from(dailyFoodItems)
    .innerJoin(dailyLogs, eq(dailyFoodItems.dailyLogId, dailyLogs.id))
    .leftJoin(foodMaster, eq(dailyFoodItems.foodMasterId, foodMaster.id))
    .leftJoin(customFoods, eq(dailyFoodItems.customFoodId, customFoods.id))
    .where(eq(dailyLogs.userId, userId))
    .orderBy(desc(dailyFoodItems.loggedAt))
    .limit(100);
  }

  static async findFavorite(userId: string, foodId: number, source: 'food_master' | 'custom_foods') {
    return db.query.favoriteFoods.findFirst({
      where: and(
        eq(favoriteFoods.userId, userId),
        source === 'food_master' ? eq(favoriteFoods.foodMasterId, foodId) : eq(favoriteFoods.customFoodId, foodId)
      )
    });
  }

  static async createFavorite(userId: string, foodId: number, source: 'food_master' | 'custom_foods') {
    return db.insert(favoriteFoods).values({
      userId,
      foodMasterId: source === 'food_master' ? foodId : null,
      customFoodId: source === 'custom_foods' ? foodId : null,
    }).returning();
  }

  static async deleteFavorite(userId: string, favoriteId: number) {
    return db.delete(favoriteFoods).where(
      and(eq(favoriteFoods.id, favoriteId), eq(favoriteFoods.userId, userId))
    );
  }

  static async pinFavorite(userId: string, favoriteId: number, isPinned: boolean) {
    return db.update(favoriteFoods)
      .set({ isPinned })
      .where(and(eq(favoriteFoods.id, favoriteId), eq(favoriteFoods.userId, userId)));
  }

  static async reorderFavorites(orders: { id: number; order: number }[], userId: string) {
    await db.transaction(async (tx) => {
      for (const item of orders) {
        await tx.update(favoriteFoods)
          .set({ pinOrder: item.order })
          .where(and(eq(favoriteFoods.id, item.id), eq(favoriteFoods.userId, userId)));
      }
    });
  }
}
