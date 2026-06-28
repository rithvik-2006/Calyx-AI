import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';
import { DashboardResponseDTO } from '@/types/dashboard.types';

export function useDashboard(date?: string) {
  const queryParam = date ? `?date=${date}` : '';
  return useQuery({
    queryKey: ['dashboard', date || 'today'],
    queryFn: () => fetchApi<DashboardResponseDTO>(`/dashboard${queryParam}`),
  });
}
