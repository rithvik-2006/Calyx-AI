import { db } from '@/db';
import { foodMaster, customFoods, favoriteFoods, dailyFoodItems, dailyLogs } from '@/db/schema';
import { ilike, and, eq, desc, isNotNull } from 'drizzle-orm';

export class FoodRepository {
  static async searchFoods(query: string, userId: string) {
    const likeQuery = `%${query}%`;
    const beginsQuery = `${query}%`;

    // A real implementation would order by CASE WHEN name ILIKE 'query%' THEN 1 ELSE 2 END
    // Since Drizzle's direct order-by-case isn't as clean without raw SQL, we will do it via JS service layer later,
    // or just fetch both and merge them in JS.
    const masterResults = await db.query.foodMaster.findMany({
      where: ilike(foodMaster.name, likeQuery),
      limit: 50,
    });

    const customResults = await db.query.customFoods.findMany({
      where: and(
        eq(customFoods.userId, userId),
        ilike(customFoods.name, likeQuery)
      ),
      limit: 50,
    });

    return {
      master: masterResults,
      custom: customResults
    };
  }
  
  static async getFoodMasterById(id: number) {
    return db.query.foodMaster.findFirst({
      where: eq(foodMaster.id, id),
    });
  }

  static async getCustomFoodById(id: number, userId: string) {
    return db.query.customFoods.findFirst({
      where: and(eq(customFoods.id, id), eq(customFoods.userId, userId)),
    });
  }

  static async getRecentFoods(userId: string) {
    const recentItems = await db.select({
      foodMasterId: dailyFoodItems.foodMasterId,
      customFoodId: dailyFoodItems.customFoodId,
      loggedAt: dailyFoodItems.loggedAt
    })
    .from(dailyFoodItems)
    .innerJoin(dailyLogs, eq(dailyFoodItems.dailyLogId, dailyLogs.id))
    .where(eq(dailyLogs.userId, userId))
    .orderBy(desc(dailyFoodItems.loggedAt))
    .limit(50);

    return recentItems;
  }
}
