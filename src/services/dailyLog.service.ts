import { DailyLogRepository } from '../repositories/dailyLog.repository';
import { FoodRepository } from '../repositories/food.repository';
import { format } from 'date-fns';

export class DailyLogService {
  static async getTodayMeals(userId: string) {
    const date = format(new Date(), 'yyyy-MM-dd');
    const log = await DailyLogRepository.getLogByDate(userId, date);
    
    const result = {
      Breakfast: [] as any[],
      Lunch: [] as any[],
      Snack: [] as any[],
      Dinner: [] as any[],
    };

    if (!log) return result;

    const items = await DailyLogRepository.getTodayItemsWithDetails(log.id);

    for (const item of items) {
      const isMaster = !!item.foodMasterId;
      const mealType = item.mealType as keyof typeof result;
      if (result[mealType]) {
        result[mealType].push({
          id: item.id,
          foodName: isMaster ? item.masterName : item.customName,
          quantity: Number(item.quantity),
          calories: Math.round((isMaster ? item.masterCalories! : item.customCalories!) * Number(item.quantity)),
        });
      }
    }

    return result;
  }

  static async addFood(userId: string, data: { mealType: string, foodId: number, source: 'food_master' | 'custom_foods', quantity: number }) {
    const date = format(new Date(), 'yyyy-MM-dd');
    let log = await DailyLogRepository.getLogByDate(userId, date);

    if (!log) {
      log = await DailyLogRepository.createDailyLog(userId, date);
    }

    // Get food nutrition info
    let food;
    if (data.source === 'food_master') {
      food = await FoodRepository.getFoodMasterById(data.foodId);
    } else {
      food = await FoodRepository.getCustomFoodById(data.foodId, userId);
    }

    if (!food) throw new Error('Food not found');

    const qty = data.quantity;
    const addedCalories = Math.round(food.calories * qty);
    const addedProtein = Number(food.protein) * qty;
    const addedFat = Number(food.fat) * qty;
    const addedCarbs = Number(food.carbs) * qty;

    // Insert food item
    await DailyLogRepository.insertFoodItem({
      dailyLogId: log.id,
      mealType: data.mealType,
      foodMasterId: data.source === 'food_master' ? food.id : null,
      customFoodId: data.source === 'custom_foods' ? food.id : null,
      quantity: qty.toString()
    });

    // Recalculate totals
    const newTotals = {
      calories: (log.totalCalories || 0) + addedCalories,
      protein: Number(log.totalProtein || 0) + addedProtein,
      fat: Number(log.totalFat || 0) + addedFat,
      carbs: Number(log.totalCarbs || 0) + addedCarbs
    };

    await DailyLogRepository.updateTotals(log.id, newTotals);
    return newTotals;
  }

  static async logPlateItems(userId: string, dateStr: string, items: { foodId: number, source: 'food_master' | 'custom_foods', quantity: number, mealType: string }[]) {
    let log = await DailyLogRepository.getLogByDate(userId, dateStr);

    if (!log) {
      log = await DailyLogRepository.createDailyLog(userId, dateStr);
    }

    let addedCalories = 0;
    let addedProtein = 0;
    let addedFat = 0;
    let addedCarbs = 0;

    for (const item of items) {
      let food;
      if (item.source === 'food_master') {
        food = await FoodRepository.getFoodMasterById(item.foodId);
      } else {
        food = await FoodRepository.getCustomFoodById(item.foodId, userId);
      }

      if (!food) continue; // Skip if food somehow doesn't exist

      const qty = item.quantity;
      addedCalories += Math.round(food.calories * qty);
      addedProtein += Number(food.protein) * qty;
      addedFat += Number(food.fat) * qty;
      addedCarbs += Number(food.carbs) * qty;

      await DailyLogRepository.insertFoodItem({
        dailyLogId: log.id,
        mealType: item.mealType,
        foodMasterId: item.source === 'food_master' ? food.id : null,
        customFoodId: item.source === 'custom_foods' ? food.id : null,
        quantity: qty.toString()
      });
    }

    const newTotals = {
      calories: (log.totalCalories || 0) + addedCalories,
      protein: Number(log.totalProtein || 0) + addedProtein,
      fat: Number(log.totalFat || 0) + addedFat,
      carbs: Number(log.totalCarbs || 0) + addedCarbs
    };

    await DailyLogRepository.updateTotals(log.id, newTotals);
    return newTotals;
  }
}
