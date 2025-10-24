import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getPesertaByPelatihan, getPeserta } from '@/integrations/supabase/pesertaService';

export function usePesertaByPelatihan(pelatihanId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['peserta', pelatihanId],
    queryFn: () => getPesertaByPelatihan(pelatihanId as string),
    enabled: !!pelatihanId
  });

  useEffect(() => {
    if (!pelatihanId) return;

    const channel = supabase
      .channel('peserta-realtime')
      .on(
        'postgres_changes',
        {
          event: '*', // bisa diganti jadi 'UPDATE' aja kalau mau spesifik
          schema: 'public',
          table: 'peserta',
          filter: `pelatihan_id=eq.${pelatihanId}`,
        },
        () => {
          // invalidate cache → auto refetch
          queryClient.invalidateQueries({ queryKey: ['peserta', pelatihanId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [pelatihanId, queryClient]);

  return query;
}

export function usePeserta(id?: string) {
  return useQuery({
    queryKey: ['peserta-detail', id],
    queryFn: () => getPeserta(id as string),
    enabled: !!id
  });
}
