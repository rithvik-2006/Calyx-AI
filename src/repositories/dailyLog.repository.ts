import { db } from '@/db';
import { dailyLogs, dailyFoodItems, foodMaster, customFoods } from '@/db/schema';
import { and, eq } from 'drizzle-orm';

export class DailyLogRepository {
  static async getLogByDate(userId: string, date: string) {
    return db.query.dailyLogs.findFirst({
      where: and(eq(dailyLogs.userId, userId), eq(dailyLogs.date, date)),
    });
  }

  static async getLogWithItems(userId: string, date: string) {
    const log = await db.query.dailyLogs.findFirst({
      where: and(eq(dailyLogs.userId, userId), eq(dailyLogs.date, date)),
    });

    if (!log) return null;

    const items = await db.query.dailyFoodItems.findMany({
      where: eq(dailyFoodItems.dailyLogId, log.id),
    });

    return { ...log, items };
  }

  static async getTodayItemsWithDetails(logId: number) {
    const items = await db.select({
      id: dailyFoodItems.id,
      mealType: dailyFoodItems.mealType,
      quantity: dailyFoodItems.quantity,
      foodMasterId: dailyFoodItems.foodMasterId,
      customFoodId: dailyFoodItems.customFoodId,
      masterName: foodMaster.name,
      masterCalories: foodMaster.calories,
      masterProtein: foodMaster.protein,
      masterFat: foodMaster.fat,
      masterCarbs: foodMaster.carbs,
      customName: customFoods.name,
      customCalories: customFoods.calories,
      customProtein: customFoods.protein,
      customFat: customFoods.fat,
      customCarbs: customFoods.carbs,
    })
    .from(dailyFoodItems)
    .leftJoin(foodMaster, eq(dailyFoodItems.foodMasterId, foodMaster.id))
    .leftJoin(customFoods, eq(dailyFoodItems.customFoodId, customFoods.id))
    .where(eq(dailyFoodItems.dailyLogId, logId));

    return items;
  }

  static async recalculateTotals(logId: number) {
    const items = await this.getTodayItemsWithDetails(logId);
    let totalCalories = 0;
    let totalProtein = 0;
    let totalFat = 0;
    let totalCarbs = 0;
    
    for (const item of items) {
      const qty = Number(item.quantity);
      const calories = item.masterCalories || item.customCalories || 0;
      const protein = Number(item.masterProtein || item.customProtein || 0);
      const fat = Number(item.masterFat || item.customFat || 0);
      const carbs = Number(item.masterCarbs || item.customCarbs || 0);
      
      totalCalories += Math.round(calories * qty);
      totalProtein += (protein * qty);
      totalFat += (fat * qty);
      totalCarbs += (carbs * qty);
    }
    
    await db.update(dailyLogs)
      .set({
        totalCalories: totalCalories,
        totalProtein: totalProtein.toString(),
        totalFat: totalFat.toString(),
        totalCarbs: totalCarbs.toString()
      })
      .where(eq(dailyLogs.id, logId));
      
    return totalCalories;
  }

  static async createDailyLog(userId: string, date: string) {
    const [newLog] = await db.insert(dailyLogs).values({
      userId,
      date,
      totalCalories: 0,
      totalProtein: '0',
      totalFat: '0',
      totalCarbs: '0'
    }).returning();
    return newLog;
  }

  static async insertFoodItem(data: typeof dailyFoodItems.$inferInsert) {
    const [newItem] = await db.insert(dailyFoodItems).values(data).returning();
    return newItem;
  }

  static async deleteFoodItem(itemId: number) {
    await db.delete(dailyFoodItems).where(eq(dailyFoodItems.id, itemId));
  }

  static async updateFoodItem(itemId: number, quantity: string) {
    await db.update(dailyFoodItems)
      .set({ quantity })
      .where(eq(dailyFoodItems.id, itemId));
  }

  static async updateTotals(logId: number, totals: { calories: number, protein: number, fat: number, carbs: number }) {
    await db.update(dailyLogs)
      .set({
        totalCalories: totals.calories,
        totalProtein: totals.protein.toString(),
        totalFat: totals.fat.toString(),
        totalCarbs: totals.carbs.toString()
      })
      .where(eq(dailyLogs.id, logId));
  }
}
