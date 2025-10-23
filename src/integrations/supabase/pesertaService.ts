import { supabase } from './client';

const table = 'peserta';

export async function getPesertaByPelatihan(pelatihanId: string) {
  const { data, error } = await supabase.from(table).select('*').eq('pelatihan_id', pelatihanId).order('created_at', { ascending: true });
  if (error) throw error;
  return data;
}

export async function getPeserta(id: string) {
  const { data, error } = await supabase.from(table).select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function createPeserta(payload: any) {
  const { data, error } = await supabase.from(table).insert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function updatePeserta(id: string, payload: any) {
  const { data, error } = await supabase.from(table).update(payload).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deletePeserta(id: string) {
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw error;
  return true;
}
