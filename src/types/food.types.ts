export interface FoodDTO {
  id: number;
  source: 'food_master' | 'custom_foods';
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  servingSize: string;
  category?: string | null;
  isFavorite?: boolean;
}
