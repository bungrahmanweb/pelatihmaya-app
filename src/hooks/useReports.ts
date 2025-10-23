import { useQuery } from '@tanstack/react-query';
import { getPelatihanSummary, getMonthlyReport } from '@/integrations/supabase/reportsService';
import { PelatihanSummary, MonthlyReport } from '@/types';

export function usePelatihanSummary() {
  return useQuery<PelatihanSummary[], Error>({
    queryKey: ['pelatihanSummary'],
    queryFn: getPelatihanSummary
  });
}

export function useMonthlyReport() {
  return useQuery<MonthlyReport[], Error>({
    queryKey: ['monthlyReport'],
    queryFn: getMonthlyReport
  });
}
