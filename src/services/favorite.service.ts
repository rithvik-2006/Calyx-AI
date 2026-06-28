import { FavoriteRepository } from '../repositories/favorite.repository';
import { FavoriteFoodDTO } from '@/types/favorite.types';

export class FavoriteService {
  private static mapIcon(category: string | null): string {
    const map: Record<string, string> = {
      'Protein': 'egg',
      'Beverage': 'local_cafe',
      'Fruit': 'nutrition',
      'Water': 'water_drop',
      'Meal': 'restaurant',
      'Dairy': 'icecream',
      'Vegetables': 'eco',
      'Grains': 'bakery_dining',
    };
    return category && map[category] ? map[category] : 'restaurant';
  }

  private static mapFoodItem(item: any, isFavorite: boolean = false): FavoriteFoodDTO {
    const isMaster = !!item.foodMasterId;
    return {
      favoriteId: item.favoriteId || null,
      foodId: isMaster ? item.foodMasterId : item.customFoodId,
      source: isMaster ? 'food_master' : 'custom_foods',
      name: isMaster ? item.masterName : item.customName,
      calories: isMaster ? item.masterCalories : item.customCalories,
      protein: Number(isMaster ? item.masterProtein : item.customProtein),
      fat: Number(isMaster ? item.masterFat : item.customFat),
      carbs: Number(isMaster ? item.masterCarbs : item.customCarbs),
      servingSize: isMaster ? item.masterServingSize : item.customServingSize,
      category: isMaster ? item.masterCategory : null,
      icon: this.mapIcon(isMaster ? item.masterCategory : null),
      isPinned: item.isPinned || false,
      pinOrder: item.pinOrder || 0,
      isFavorite: isFavorite
    };
  }

  static async getFavoritesData(userId: string): Promise<{ pinned: FavoriteFoodDTO[], others: FavoriteFoodDTO[] }> {
    const favorites = await FavoriteRepository.getFavorites(userId);
    
    const pinned: FavoriteFoodDTO[] = [];
    const others: FavoriteFoodDTO[] = [];

    for (const fav of favorites) {
      const mapped = this.mapFoodItem(fav, true);
      if (fav.isPinned) {
        pinned.push(mapped);
      } else {
        others.push(mapped);
      }
    }

    pinned.sort((a, b) => a.pinOrder - b.pinOrder);

    return { pinned, others };
  }

  static async getRecentFoods(userId: string): Promise<FavoriteFoodDTO[]> {
    const recentItems = await FavoriteRepository.getRecentFoods(userId);
    const favorites = await FavoriteRepository.getFavorites(userId);
    
    // Create a map of favorite keys to favorite items for quick lookup
    const favoriteMap = new Map();
    for (const fav of favorites) {
      const key = `${fav.foodMasterId ? 'food_master' : 'custom_foods'}-${fav.foodMasterId || fav.customFoodId}`;
      favoriteMap.set(key, fav);
    }

    const deduplicated: FavoriteFoodDTO[] = [];
    const seen = new Set<string>();

    for (const item of recentItems) {
      const isMaster = !!item.foodMasterId;
      const id = isMaster ? item.foodMasterId : item.customFoodId;
      const source = isMaster ? 'food_master' : 'custom_foods';
      const key = `${source}-${id}`;

      if (!seen.has(key)) {
        seen.add(key);
        
        // If it's a favorite, we use the favoriteId from the map so the frontend knows it's a favorite
        const favData = favoriteMap.get(key);
        const mapped = this.mapFoodItem(
          { ...item, favoriteId: favData?.favoriteId }, 
          !!favData
        );
        deduplicated.push(mapped);
      }

      if (deduplicated.length >= 30) break;
    }

    return deduplicated;
  }

  static async toggleFavorite(userId: string, foodId: number, source: 'food_master' | 'custom_foods'): Promise<{ isFavorite: boolean }> {
    const existing = await FavoriteRepository.findFavorite(userId, foodId, source);

    if (existing) {
      await FavoriteRepository.deleteFavorite(userId, existing.id);
      return { isFavorite: false };
    } else {
      await FavoriteRepository.createFavorite(userId, foodId, source);
      return { isFavorite: true };
    }
  }

  static async pinFavorite(userId: string, favoriteId: number, isPinned: boolean) {
    if (isPinned) {
      const favorites = await FavoriteRepository.getFavorites(userId);
      const pinnedCount = favorites.filter(f => f.isPinned).length;
      if (pinnedCount >= 8) {
        throw new Error('Maximum of 8 pinned favorites allowed');
      }
    }
    await FavoriteRepository.pinFavorite(userId, favoriteId, isPinned);
  }

  static async reorderPins(userId: string, orderedFavoriteIds: number[]) {
    const orders = orderedFavoriteIds.map((id, index) => ({ id, order: index }));
    await FavoriteRepository.reorderFavorites(orders, userId);
  }

  static async deleteFavorite(userId: string, favoriteId: number) {
    await FavoriteRepository.deleteFavorite(userId, favoriteId);
  }
}
