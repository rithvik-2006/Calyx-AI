import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';
import { FoodDTO } from '@/types/food.types';

export function useFoodSuggestions() {
  return useQuery({
    queryKey: ['foods', 'suggestions'],
    queryFn: () => fetchApi<FoodDTO[]>('/foods/suggestions'),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
}
