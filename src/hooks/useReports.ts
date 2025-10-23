import { useQuery } from '@tanstack/react-query';
import { getPelatihanSummary, getMonthlyReport } from '@/integrations/supabase/reportsService';

export function usePelatihanSummary() {
  return useQuery(['pelatihanSummary'], getPelatihanSummary);
}

export function useMonthlyReport() {
  return useQuery(['monthlyReport'], getMonthlyReport);
}
