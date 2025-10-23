import { useQuery } from '@tanstack/react-query';
import { getPelatihanList, getPelatihanById } from '@/integrations/supabase/pelatihanService';

export function usePelatihanList() {
  return useQuery(['pelatihanList'], getPelatihanList);
}

export function usePelatihan(id: string | undefined) {
  return useQuery(['pelatihan', id], () => getPelatihanById(id as string), { enabled: !!id });
}
