import { FoodRepository } from '../repositories/food.repository';
import { CustomFoodRepository } from '../repositories/customFood.repository';
import { FavoriteService } from './favorite.service';
import { CustomFoodInput } from '@/validators/food.validator';
import { FoodDTO } from '@/types/food.types';

export class FoodService {
  static async search(query: string, userId: string): Promise<FoodDTO[]> {
    if (!query || query.trim().length === 0) return [];
    
    const { master, custom } = await FoodRepository.searchFoods(query, userId);
    const { pinned, others } = await FavoriteService.getFavoritesData(userId);
    const favorites = [...pinned, ...others];
    const favoriteKeys = new Set(favorites.map(f => `${f.source}-${f.foodId}`));
    
    let results: FoodDTO[] = [
      ...custom.map(f => ({ ...f, source: 'custom_foods' as const, category: null, protein: Number(f.protein), fat: Number(f.fat), carbs: Number(f.carbs), isFavorite: favoriteKeys.has(`custom_foods-${f.id}`) })),
      ...master.map(f => ({ ...f, source: 'food_master' as const, protein: Number(f.protein), fat: Number(f.fat), carbs: Number(f.carbs), isFavorite: favoriteKeys.has(`food_master-${f.id}`) }))
    ];

    const qLower = query.toLowerCase();
    
    // Ranking: Begins with > Contains
    results.sort((a, b) => {
      const aStarts = a.name.toLowerCase().startsWith(qLower);
      const bStarts = b.name.toLowerCase().startsWith(qLower);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return a.name.localeCompare(b.name);
    });

    return results.slice(0, 25);
  }

  static async getRecent(userId: string): Promise<FoodDTO[]> {
    const recentItems = await FoodRepository.getRecentFoods(userId);
    
    const uniqueIds = new Set<string>();
    const recentFoods: FoodDTO[] = [];

    for (const item of recentItems) {
      const isMaster = !!item.foodMasterId;
      const id = isMaster ? item.foodMasterId! : item.customFoodId!;
      const key = `${isMaster ? 'm' : 'c'}-${id}`;
      
      if (!uniqueIds.has(key)) {
        uniqueIds.add(key);
        const food = isMaster 
          ? await FoodRepository.getFoodMasterById(id) 
          : await FoodRepository.getCustomFoodById(id, userId);
          
        if (food) {
          recentFoods.push({
            ...food,
            source: isMaster ? 'food_master' : 'custom_foods',
            protein: Number(food.protein),
            fat: Number(food.fat),
            carbs: Number(food.carbs),
            isFavorite: false // We will set this in getSuggestions properly by using favorites array
          } as FoodDTO);
        }
      }
      
      if (recentFoods.length >= 20) break;
    }

    return recentFoods;
  }

  static async getSuggestions(userId: string): Promise<FoodDTO[]> {
    const [recent, favData] = await Promise.all([
      this.getRecent(userId),
      FavoriteService.getFavoritesData(userId)
    ]);
    
    const favorites = [...favData.pinned, ...favData.others];

    const suggestions: FoodDTO[] = [];
    const seen = new Set<string>();
    const favoriteKeys = new Set(favorites.map(f => `${f.source}-${f.foodId}`));

    const addUnique = (foods: FoodDTO[]) => {
      for (const f of foods) {
        // For favorites, f.id is the foodId since they are FoodDTO not FavoriteFoodDTO (wait, FavoriteService returns FavoriteFoodDTO)
        // We must map FavoriteFoodDTO to FoodDTO
        const foodId = 'foodId' in f ? (f as any).foodId : f.id;
        const key = `${f.source}-${foodId}`;
        
        if (!seen.has(key)) {
          seen.add(key);
          suggestions.push({
            id: foodId,
            source: f.source as 'food_master' | 'custom_foods',
            name: f.name,
            calories: f.calories,
            protein: f.protein,
            fat: f.fat,
            carbs: f.carbs,
            servingSize: f.servingSize,
            category: f.category,
            isFavorite: favoriteKeys.has(key)
          });
        }
        if (suggestions.length >= 20) return;
      }
    };

    // Favorites first, then recents
    addUnique(favorites as any[]);
    addUnique(recent);

    return suggestions;
  }

  static async createCustomFood(userId: string, data: CustomFoodInput) {
    return CustomFoodRepository.createCustomFood(userId, data);
  }
}
