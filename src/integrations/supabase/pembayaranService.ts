import { supabase } from './client';

const table = 'pembayaran';

export async function getPembayaranByPeserta(pesertaId: string) {
  const { data, error } = await supabase.from(table).select('*').eq('peserta_id', pesertaId).order('tanggal_pembayaran', { ascending: true });
  if (error) throw error;
  return data;
}

export async function createPembayaran(payload: any) {
  const { data, error } = await supabase.from(table).insert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function deletePembayaran(id: string) {
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw error;
  return true;
}
