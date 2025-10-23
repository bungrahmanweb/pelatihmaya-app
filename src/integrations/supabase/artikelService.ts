import { supabase } from './client';
const TABLE = 'artikel';

export async function getArtikelList() {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('tanggal', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getArtikelById(id: string) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function createArtikel(values: any) {
  const { data, error } = await supabase
    .from(TABLE)
    .insert([values])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateArtikel(id: string, values: any) {
  const { data, error } = await supabase
    .from(TABLE)
    .update(values)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteArtikel(id: string) {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('id', id);
  if (error) throw error;
  return true;
}
