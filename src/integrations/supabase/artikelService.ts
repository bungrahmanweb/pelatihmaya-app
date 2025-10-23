import { supabase } from './client';

export async function getArtikelList() {
  const { data, error } = await supabase.from('artikel').select('*').order('tanggal', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createArtikel(values: any) {
  const { error } = await supabase.from('artikel').insert(values);
  if (error) throw error;
}

export async function updateArtikel(id: string, values: any) {
  const { error } = await supabase.from('artikel').update(values).eq('id', id);
  if (error) throw error;
}

export async function deleteArtikel(id: string) {
  const { error } = await supabase.from('artikel').delete().eq('id', id);
  if (error) throw error;
}
