export interface PlateItemDTO {
  id: number;
  foodId: number;
  source: 'food_master' | 'custom_foods';
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  servingSize: string;
  quantity: number;
}

export interface PlateDTO {
  id: number;
  name: string;
  description: string | null;
  mealType: string | null;
  createdAt: string;
  updatedAt: string;
  items: PlateItemDTO[];
  
  // Computed fields
  totalCalories: number;
  totalProtein: number;
  totalFat: number;
  totalCarbs: number;
}

export interface CreatePlateInput {
  name: string;
  description?: string;
  mealType?: string;
  items: {
    foodId: number;
    source: 'food_master' | 'custom_foods';
    quantity: number;
  }[];
}
