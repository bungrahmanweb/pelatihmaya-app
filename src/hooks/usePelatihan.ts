import { useQuery } from '@tanstack/react-query';
import { getPelatihanList, getPelatihanById } from '@/integrations/supabase/pelatihanService';

export function usePelatihanList() {
  return useQuery({
    queryKey: ['pelatihanList'],
    queryFn: getPelatihanList
  });
}

export function usePelatihan(id: string | undefined) {
  return useQuery({
    queryKey: ['pelatihan', id],
    queryFn: () => getPelatihanById(id as string),
    enabled: !!id
  });
}
