import { Database } from '@/integrations/supabase/types';

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];

// Peserta with total_pembayaran
export interface Peserta extends Tables<'peserta'> {
  total_pembayaran?: number;
  pelatihan?: Tables<'pelatihan'>;
  pembayaran?: Tables<'pembayaran'>[];
}