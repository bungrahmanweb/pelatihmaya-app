import { useQuery } from '@tanstack/react-query';
import { getPesertaByPelatihan, getPeserta } from '@/integrations/supabase/pesertaService';

export function usePesertaByPelatihan(pelatihanId?: string) {
  return useQuery({
    queryKey: ['peserta', pelatihanId],
    queryFn: () => getPesertaByPelatihan(pelatihanId as string),
    enabled: !!pelatihanId
  });
}

export function usePeserta(id?: string) {
  return useQuery({
    queryKey: ['peserta-detail', id],
    queryFn: () => getPeserta(id as string),
    enabled: !!id
  });
}
