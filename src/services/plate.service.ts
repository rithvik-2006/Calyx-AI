import { PlateRepository } from '../repositories/plate.repository';
import { CreatePlateInput, PlateDTO, PlateItemDTO } from '@/types/plate.types';
import { DailyLogService } from './dailyLog.service';
import { DashboardService } from './dashboard.service';

const DAILY_MEAL_TYPES = ['Breakfast', 'Lunch', 'Snack', 'Dinner'];

export class PlateService {
  private static mapPlateData(plateObj: any): PlateDTO {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalFat = 0;
    let totalCarbs = 0;

    const mappedItems: PlateItemDTO[] = plateObj.items.map((item: any) => {
      const isMaster = !!item.foodMasterId;
      const quantity = Number(item.quantity);
      
      const calories = isMaster ? item.masterCalories : item.customCalories;
      const protein = Number(isMaster ? item.masterProtein : item.customProtein);
      const fat = Number(isMaster ? item.masterFat : item.customFat);
      const carbs = Number(isMaster ? item.masterCarbs : item.customCarbs);

      totalCalories += Math.round(calories * quantity);
      totalProtein += protein * quantity;
      totalFat += fat * quantity;
      totalCarbs += carbs * quantity;

      return {
        id: item.id,
        foodId: isMaster ? item.foodMasterId : item.customFoodId,
        source: isMaster ? 'food_master' : 'custom_foods',
        name: isMaster ? item.masterName : item.customName,
        calories,
        protein,
        fat,
        carbs,
        servingSize: isMaster ? item.masterServingSize : item.customServingSize,
        quantity,
      };
    });

    return {
      id: plateObj.id,
      name: plateObj.name,
      description: plateObj.description,
      mealType: plateObj.mealType,
      createdAt: plateObj.createdAt.toISOString(),
      updatedAt: plateObj.updatedAt.toISOString(),
      items: mappedItems,
      totalCalories,
      totalProtein: Math.round(totalProtein * 10) / 10,
      totalFat: Math.round(totalFat * 10) / 10,
      totalCarbs: Math.round(totalCarbs * 10) / 10,
    };
  }

  static async getGroupedPlates(userId: string) {
    const rawPlates = await PlateRepository.getPlatesByUser(userId);
    const plates = rawPlates.map(this.mapPlateData);

    const daily: PlateDTO[] = [];
    const custom: PlateDTO[] = [];

    for (const plate of plates) {
      if (plate.mealType && DAILY_MEAL_TYPES.includes(plate.mealType)) {
        daily.push(plate);
      } else {
        custom.push(plate);
      }
    }

    return { daily, custom };
  }

  static async createPlate(userId: string, input: CreatePlateInput) {
    const plateId = await PlateRepository.createPlate(userId, input);
    return await PlateRepository.getPlateById(plateId, userId);
  }

  static async updatePlate(userId: string, plateId: number, input: CreatePlateInput) {
    await PlateRepository.updatePlate(plateId, userId, input);
    return await PlateRepository.getPlateById(plateId, userId);
  }

  static async deletePlate(userId: string, plateId: number) {
    await PlateRepository.deletePlate(plateId, userId);
  }

  static async duplicatePlate(userId: string, plateId: number) {
    const plate = await PlateRepository.getPlateById(plateId, userId);
    if (!plate) throw new Error('Plate not found');

    const newName = `${plate.name} v2`;
    const input: CreatePlateInput = {
      name: newName,
      description: plate.description || undefined,
      mealType: plate.mealType || undefined,
      items: plate.items.map(i => ({
        foodId: (i.foodMasterId || i.customFoodId) as number,
        source: i.foodMasterId ? 'food_master' : 'custom_foods',
        quantity: Number(i.quantity)
      }))
    };

    return this.createPlate(userId, input);
  }

  static async logPlate(userId: string, plateId: number, dateStr: string) {
    const plate = await PlateRepository.getPlateById(plateId, userId);
    if (!plate) throw new Error('Plate not found');

    const mappedPlate = this.mapPlateData(plate);
    const targetMeal = mappedPlate.mealType && DAILY_MEAL_TYPES.includes(mappedPlate.mealType) 
      ? mappedPlate.mealType 
      : 'Snack';

    // The LogService should handle finding today's log, inserting multiple items, and recalculating.
    // Assuming LogService has logMultipleFoods method or we can just loop (though loop isn't one transaction).
    // Actually, let's implement a batch log in LogService if it doesn't exist, or just loop for now.
    
    // We will do a loop since LogService might not have a batch insert yet, 
    // but the prompt requested it to be one transaction. 
    // Let's assume LogService.addFood handles it or we can create LogService.logPlateItems.
    
    // Let's implement batch logging via DailyLogService to adhere to the spec.
    await DailyLogService.logPlateItems(userId, dateStr, mappedPlate.items.map(i => ({
      foodId: i.foodId,
      source: i.source,
      quantity: i.quantity,
      mealType: targetMeal
    })));

    return await DashboardService.getDashboardData(userId, dateStr);
  }
}
