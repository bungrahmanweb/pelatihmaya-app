import { supabase } from './client';
import { Tables } from './types';

const table = 'pembayaran';

type Pembayaran = Tables<'pembayaran'>;

export async function getPembayaranByPeserta(pesertaId: string) {
  try {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('peserta_id', pesertaId)
      .order('tanggal_pembayaran', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error fetching pembayaran:', error.message);
    throw new Error(`Failed to fetch pembayaran: ${error.message}`);
  }
}

export async function createPembayaran(payload: Partial<Pembayaran>) {
  try {
    // Set tanggal_pembayaran if not provided
    if (!payload.tanggal_pembayaran) {
      payload.tanggal_pembayaran = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from(table)
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error creating pembayaran:', error.message);
    throw new Error(`Failed to create pembayaran: ${error.message}`);
  }
}

export async function deletePembayaran(id: string) {
  try {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error: any) {
    console.error('Error deleting pembayaran:', error.message);
    throw new Error(`Failed to delete pembayaran: ${error.message}`);
  }
}
