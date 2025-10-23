import { useQuery } from '@tanstack/react-query';
import { getPesertaByPelatihan, getPeserta } from '@/integrations/supabase/pesertaService';

export function usePesertaByPelatihan(pelatihanId?: string) {
  return useQuery(['peserta', pelatihanId], () => getPesertaByPelatihan(pelatihanId as string), { enabled: !!pelatihanId });
}

export function usePeserta(id?: string) {
  return useQuery(['peserta-detail', id], () => getPeserta(id as string), { enabled: !!id });
}
