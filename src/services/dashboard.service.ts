import { UserRepository } from '../repositories/user.repository';
import { DailyLogRepository } from '../repositories/dailyLog.repository';
import { DashboardResponseDTO } from '@/types/dashboard.types';
import { format } from 'date-fns';

export class DashboardService {
  static async getDashboardData(userId: string, dateStr?: string): Promise<DashboardResponseDTO> {
    const targetDate = dateStr || format(new Date(), 'yyyy-MM-dd');

    const user = await UserRepository.getUserById(userId);
    if (!user) throw new Error('User not found');

    const goals = {
      calories: user.targetCalories || 2350,
      protein: user.proteinGoal || 150,
      fat: user.fatGoal || 70,
      carbs: user.carbGoal || 250
    };

    const log = await DailyLogRepository.getLogWithItems(userId, targetDate);

    const consumedCals = log?.totalCalories ?? 0;
    const consumedProtein = Number(log?.totalProtein ?? 0);
    const consumedFat = Number(log?.totalFat ?? 0);
    const consumedCarbs = Number(log?.totalCarbs ?? 0);

    // Group meals
    const mealTotals: Record<string, { items: number, calories: number }> = {
      'Breakfast': { items: 0, calories: 0 },
      'Lunch': { items: 0, calories: 0 },
      'Snack': { items: 0, calories: 0 },
      'Dinner': { items: 0, calories: 0 },
    };

    if (log && log.items) {
      const itemsWithDetails = await DailyLogRepository.getTodayItemsWithDetails(log.id);
      
      for (const item of itemsWithDetails) {
        if (mealTotals[item.mealType]) {
          mealTotals[item.mealType].items += 1;
          
          const isMaster = !!item.foodMasterId;
          const calories = Math.round((isMaster ? item.masterCalories! : item.customCalories!) * Number(item.quantity));
          mealTotals[item.mealType].calories += calories;
        }
      }
    }
    
    return {
      date: targetDate,
      calories: {
        consumed: consumedCals,
        goal: goals.calories,
        remaining: Math.max(0, goals.calories - consumedCals),
        percentage: Math.min(100, Math.round((consumedCals / goals.calories) * 100))
      },
      macros: {
        protein: {
          current: consumedProtein,
          goal: goals.protein,
          percentage: Math.min(100, Math.round((consumedProtein / goals.protein) * 100))
        },
        fat: {
          current: consumedFat,
          goal: goals.fat,
          percentage: Math.min(100, Math.round((consumedFat / goals.fat) * 100))
        },
        carbs: {
          current: consumedCarbs,
          goal: goals.carbs,
          percentage: Math.min(100, Math.round((consumedCarbs / goals.carbs) * 100))
        }
      },
      meals: [
        { meal: 'Breakfast', items: mealTotals['Breakfast'].items, calories: mealTotals['Breakfast'].calories },
        { meal: 'Lunch', items: mealTotals['Lunch'].items, calories: mealTotals['Lunch'].calories },
        { meal: 'Snack', items: mealTotals['Snack'].items, calories: mealTotals['Snack'].calories },
        { meal: 'Dinner', items: mealTotals['Dinner'].items, calories: mealTotals['Dinner'].calories },
      ]
    };
  }
}
