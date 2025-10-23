import { useQuery } from '@tanstack/react-query';
import { getPembayaranByPeserta } from '@/integrations/supabase/pembayaranService';

export function usePembayaranByPeserta(pesertaId?: string) {
  return useQuery({
    queryKey: ['pembayaran', pesertaId],
    queryFn: () => getPembayaranByPeserta(pesertaId as string),
    enabled: !!pesertaId
  });
}