import { supabase } from './client';

const table = 'pengeluaran';

export async function getPengeluaranList() {
  const { data, error } = await supabase.from(table).select('*').order('tanggal_pengeluaran', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createPengeluaran(payload: any) {
  const { data, error } = await supabase.from(table).insert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function updatePengeluaran(id: string, payload: any) {
  const { data, error } = await supabase.from(table).update(payload).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deletePengeluaran(id: string) {
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw error;
  return true;
}
