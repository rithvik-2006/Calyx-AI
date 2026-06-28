import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';
import { PlateDTO, CreatePlateInput } from '@/types/plate.types';

export function usePlates() {
  return useQuery<{ daily: PlateDTO[], custom: PlateDTO[] }>({
    queryKey: ['plates'],
    queryFn: () => fetchApi('/plates'),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
}

export function useCreatePlate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePlateInput) => 
      fetchApi('/plates', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plates'] });
    },
  });
}

export function useUpdatePlate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { plateId: number, input: CreatePlateInput }) => 
      fetchApi(`/plates/${data.plateId}`, {
        method: 'PATCH',
        body: JSON.stringify(data.input),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plates'] });
    },
  });
}

export function useDeletePlate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (plateId: number) => 
      fetchApi(`/plates/${plateId}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plates'] });
    },
  });
}

export function useLogPlate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (plateId: number) => 
      fetchApi(`/plates/${plateId}/log`, {
        method: 'POST',
      }),
    onSuccess: (res) => {
      // Re-fetch dashboard and today's meals since they changed
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['todayMeals'] });
    },
  });
}

export function useDuplicatePlate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (plateId: number) => 
      fetchApi(`/plates/${plateId}/duplicate`, {
        method: 'POST',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plates'] });
    },
  });
}
