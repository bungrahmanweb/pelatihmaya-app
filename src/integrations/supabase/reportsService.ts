import { supabase } from './client';

export async function getPelatihanSummary() {
  const { data, error } = await supabase.from('pelatihan_summary').select('*').order('tanggal_pelaksanaan', { ascending: true });
  if (error) throw error;
  return data;
}

export async function getMonthlyReport() {
  const { data, error } = await supabase.from('monthly_report').select('*').order('month', { ascending: true });
  if (error) throw error;
  return data;
}

export async function getFinancialsBetween(start: string, end: string) {
  // Example: use pembayaran & pengeluaran tables
  const { data: pendapatan, error: e1 } = await supabase
    .from('pembayaran')
    .select('sum(jumlah) as total')
    .gte('tanggal_pembayaran', start)
    .lte('tanggal_pembayaran', end);
  if (e1) throw e1;
  const { data: pengeluaran, error: e2 } = await supabase
    .from('pengeluaran')
    .select('sum(jumlah) as total')
    .gte('tanggal_pengeluaran', start)
    .lte('tanggal_pengeluaran', end);
  if (e2) throw e2;
  return { pendapatan: pendapatan?.[0]?.total ?? 0, pengeluaran: pengeluaran?.[0]?.total ?? 0 };
}
