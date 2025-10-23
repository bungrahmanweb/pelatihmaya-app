import { useQuery } from '@tanstack/react-query';
import { getPelatihanList, getPelatihanById } from '@/integrations/supabase/pelatihanService';
import { Pelatihan } from '@/types';

export function usePelatihanList() {
  return useQuery<Pelatihan[], Error>({
    queryKey: ['pelatihanList'],
    queryFn: getPelatihanList
  });
}

export function usePelatihan(id: string | undefined) {
  return useQuery<Pelatihan, Error>({
    queryKey: ['pelatihan', id],
    queryFn: () => getPelatihanById(id as string),
    enabled: !!id
  });
}
