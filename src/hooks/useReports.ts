import { useQuery } from '@tanstack/react-query';
import { getPelatihanSummary, getMonthlyReport } from '@/integrations/supabase/reportsService';

export function usePelatihanSummary() {
  return useQuery({
    queryKey: ['pelatihanSummary'],
    queryFn: getPelatihanSummary
  });
}

export function useMonthlyReport() {
  return useQuery({
    queryKey: ['monthlyReport'],
    queryFn: getMonthlyReport
  });
}
