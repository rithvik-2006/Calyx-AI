import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';
import { FoodDTO } from '@/types/food.types';

export function useFoodSearch(query: string) {
  return useQuery({
    queryKey: ['foods', 'search', query],
    queryFn: () => fetchApi<FoodDTO[]>(`/foods/search?q=${encodeURIComponent(query)}`),
    enabled: query.trim().length > 0, // Only fetch if there is a query
    staleTime: 1000 * 60, // 1 minute cache for search results
  });
}
