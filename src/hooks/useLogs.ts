import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';
import { AddFoodLogInput } from '@/validators/log.validator';

export function useAddFood() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddFoodLogInput) => 
      fetchApi('/logs', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['todayMeals'] });
      queryClient.invalidateQueries({ queryKey: ['foods', 'suggestions'] }); // Invalidate suggestions as recents have updated
    },
  });
}

export function useTodayMeals() {
  return useQuery<Record<string, any[]>>({
    queryKey: ['todayMeals'],
    queryFn: () => fetchApi('/logs/today'),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useDeleteFood() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => 
      fetchApi(`/logs/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['todayMeals'] });
    },
  });
}

export function useUpdateFood() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, quantity }: { id: number; quantity: number }) => 
      fetchApi(`/logs/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ quantity }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['todayMeals'] });
    },
  });
}
