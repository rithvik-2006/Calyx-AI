import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';
import { FavoriteFoodDTO } from '@/types/favorite.types';

export function useFavorites() {
  return useQuery<{ pinned: FavoriteFoodDTO[], others: FavoriteFoodDTO[] }>({
    queryKey: ['favorites'],
    queryFn: () => fetchApi('/favorites'),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useRecentFoods() {
  return useQuery<FavoriteFoodDTO[]>({
    queryKey: ['recentFoods'],
    queryFn: () => fetchApi('/favorites/recent'),
    staleTime: 1000 * 60 * 5,
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { foodId: number, source: 'food_master' | 'custom_foods' }) => 
      fetchApi('/favorites/toggle', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onMutate: async (variables) => {
      const keysToCancel = [
        ['favorites'],
        ['recentFoods'],
        ['foods', 'search'],
        ['foods', 'suggestions']
      ];
      
      for (const key of keysToCancel) {
        await queryClient.cancelQueries({ queryKey: key });
      }

      const prevData: Record<string, any> = {};

      // Helper to optimistically flip isFavorite in lists
      const flipFavoriteInList = (key: any[]) => {
        const prev = queryClient.getQueryData<any>(key);
        if (prev?.data || Array.isArray(prev)) {
          prevData[JSON.stringify(key)] = prev;
          
          const list = prev.data || prev; // API wrapper check
          const updatedList = list.map((f: any) => {
            const fId = 'foodId' in f ? f.foodId : f.id;
            return fId === variables.foodId && f.source === variables.source 
              ? { ...f, isFavorite: !f.isFavorite } 
              : f;
          });
          
          queryClient.setQueryData(key, prev.data ? { ...prev, data: updatedList } : updatedList);
        }
      };

      // Optimistically update recent foods
      flipFavoriteInList(['recentFoods']);
      
      // Optimistically update search results (it's dynamic based on query, so we use setQueriesData)
      queryClient.setQueriesData({ queryKey: ['foods', 'search'] }, (prev: any) => {
        if (!prev) return prev;
        const list = prev.data || prev;
        const updatedList = list.map((f: any) => {
          const fId = 'foodId' in f ? f.foodId : f.id;
          return fId === variables.foodId && f.source === variables.source 
            ? { ...f, isFavorite: !f.isFavorite } 
            : f;
        });
        return prev.data ? { ...prev, data: updatedList } : updatedList;
      });

      // Optimistically update suggestions
      flipFavoriteInList(['foods', 'suggestions']);

      return { prevData };
    },
    onError: (err, variables, context) => {
      if (context?.prevData) {
        Object.keys(context.prevData).forEach(keyStr => {
          queryClient.setQueryData(JSON.parse(keyStr), context.prevData[keyStr]);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['recentFoods'] });
      queryClient.invalidateQueries({ queryKey: ['foods'] });
    },
  });
}

export function usePinFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { favoriteId: number, isPinned: boolean }) => 
      fetchApi(`/favorites/${data.favoriteId}/pin`, {
        method: 'PATCH',
        body: JSON.stringify({ isPinned: data.isPinned }),
      }),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ['favorites'] });
      
      const prevFavorites = queryClient.getQueryData<any>(['favorites']);
      
      // Simple optimistic move
      if (prevFavorites?.data) {
        const allFavs = [...prevFavorites.data.pinned, ...prevFavorites.data.others];
        const updatedFavs = allFavs.map(f => f.favoriteId === variables.favoriteId ? { ...f, isPinned: variables.isPinned } : f);
        
        queryClient.setQueryData(['favorites'], {
          ...prevFavorites,
          data: {
            pinned: updatedFavs.filter(f => f.isPinned),
            others: updatedFavs.filter(f => !f.isPinned)
          }
        });
      }
      
      return { prevFavorites };
    },
    onError: (err, variables, context) => {
      if (context?.prevFavorites) {
        queryClient.setQueryData(['favorites'], context.prevFavorites);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
}

export function useReorderFavorites() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (order: number[]) => 
      fetchApi('/favorites/reorder', {
        method: 'PATCH',
        body: JSON.stringify({ order }),
      }),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
}

export function useRemoveFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (favoriteId: number) => 
      fetchApi(`/favorites/${favoriteId}`, {
        method: 'DELETE',
      }),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['recentFoods'] });
      queryClient.invalidateQueries({ queryKey: ['foodSearch'] });
    },
  });
}
