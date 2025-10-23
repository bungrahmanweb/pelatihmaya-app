import { useQuery } from '@tanstack/react-query';
import { getArtikelList, getArtikelById } from '@/integrations/supabase/artikelService';
import { Artikel } from '@/types';

export function useArtikelList() {
  return useQuery<Artikel[], Error>({
    queryKey: ['artikelList'],
    queryFn: getArtikelList,
  });
}

export function useArtikel(id: string | undefined) {
  return useQuery<Artikel, Error>({
    queryKey: ['artikel', id],
    queryFn: () => getArtikelById(id as string),
    enabled: !!id,
  });
}
