export interface FavoriteFoodDTO {
  favoriteId: number | null; // The ID of the favorite_foods row (null if returned in recent and not favorite)
  foodId: number;            // The ID from food_master or custom_foods
  source: 'food_master' | 'custom_foods';
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  servingSize: string;
  category: string;
  icon: string;
  isFavorite: boolean;
  isPinned: boolean;
  pinOrder: number;
}
