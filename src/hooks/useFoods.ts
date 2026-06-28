import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';
import { CustomFoodInput } from '@/validators/food.validator';

export function useCreateCustomFood() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CustomFoodInput) => 
      fetchApi<{ id: number }>('/foods/custom', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      // Invalidate suggestions and search results so the new food appears immediately
      queryClient.invalidateQueries({ queryKey: ['foods'] });
    },
  });
}
