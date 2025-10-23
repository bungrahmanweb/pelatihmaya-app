import { supabase } from './client';

const table = 'pelatihan';

export async function getPelatihanList() {
  const { data, error } = await supabase.from('pelatihan').select('*').order('tanggal_pelaksanaan', { ascending: true });
  if (error) throw error;
  return data;
}

export async function getPelatihanById(id: string) {
  const { data, error } = await supabase.from(table).select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function createPelatihan(payload: any) {
  const { data, error } = await supabase.from(table).insert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function updatePelatihan(id: string, payload: any) {
  const { data, error } = await supabase.from(table).update(payload).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deletePelatihan(id: string) {
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw error;
  return true;
}
