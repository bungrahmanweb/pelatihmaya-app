import { supabase } from './client';

const table = 'karyawan';

export async function getKaryawanList() {
  const { data, error } = await supabase.from(table).select('*').order('nama', { ascending: true });
  if (error) throw error;
  return data;
}

export async function createKaryawan(payload: any) {
  const { data, error } = await supabase.from(table).insert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function updateKaryawan(id: string, payload: any) {
  const { data, error } = await supabase.from(table).update(payload).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteKaryawan(id: string) {
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw error;
  return true;
}
