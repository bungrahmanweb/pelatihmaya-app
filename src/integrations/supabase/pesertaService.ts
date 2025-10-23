import { supabase } from './client';
import { Tables } from './types';

const table = 'peserta';

type Peserta = Tables<'peserta'>;

export async function getPesertaByPelatihan(pelatihanId: string) {
  try {
    const { data, error } = await supabase
      .from(table)
      .select(`
        *,
        pelatihan:pelatihan_id(id, nama_pelatihan, batch_pelatihan, harga_pelatihan),
        pembayaran(jumlah, tanggal_pembayaran)
      `)
      .eq('pelatihan_id', pelatihanId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Calculate total_pembayaran for each peserta
    const pesertaWithTotal = data.map(p => ({
      ...p,
      total_pembayaran: p.pembayaran?.reduce((total: number, pb: any) => total + (pb.jumlah || 0), 0) || 0
    }));

    return pesertaWithTotal;
  } catch (error: any) {
    console.error('Error fetching peserta:', error.message);
    throw new Error(`Failed to fetch peserta: ${error.message}`);
  }
}

export async function getPeserta(id: string) {
  try {
    const { data, error } = await supabase
      .from(table)
      .select(`
        *,
        pelatihan:pelatihan_id(id, nama_pelatihan, batch_pelatihan, harga_pelatihan),
        pembayaran(jumlah, tanggal_pembayaran)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return {
      ...data,
      total_pembayaran: data.pembayaran?.reduce((total: number, pb: any) => total + (pb.jumlah || 0), 0) || 0
    };
  } catch (error: any) {
    console.error('Error fetching peserta:', error.message);
    throw new Error(`Failed to fetch peserta: ${error.message}`);
  }
}

export async function createPeserta(payload: Partial<Peserta>) {
  try {
    const { data, error } = await supabase
      .from(table)
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error creating peserta:', error.message);
    throw new Error(`Failed to create peserta: ${error.message}`);
  }
}

export async function updatePeserta(id: string, payload: Partial<Peserta>) {
  try {
    const { data, error } = await supabase
      .from(table)
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error updating peserta:', error.message);
    throw new Error(`Failed to update peserta: ${error.message}`);
  }
}

export async function deletePeserta(id: string) {
  try {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error: any) {
    console.error('Error deleting peserta:', error.message);
    throw new Error(`Failed to delete peserta: ${error.message}`);
  }
}
