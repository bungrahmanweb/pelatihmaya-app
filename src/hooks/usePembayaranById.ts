import { useQuery } from '@tanstack/react-query';
import { getPembayaranById } from '@/integrations/supabase/pembayaranService';

export function usePembayaranById(id?: string) {
  return useQuery({
    queryKey: ['pembayaran', 'byId', id],
    queryFn: () => getPembayaranById(id as string),
    enabled: !!id,
  });
}
