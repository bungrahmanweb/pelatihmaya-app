import React from 'react';
import { usePelatihanSummary } from '@/hooks/useReports';
import { useMonthlyReport } from '@/hooks/useReports';

export default function AdminDashboard() {
  const { data: pelatihan, isLoading: loadingPelatihan } = usePelatihanSummary();
  const { data: laporan, isLoading: loadingLaporan } = useMonthlyReport();
  const totalPeserta = pelatihan?.reduce((acc: number, p: any) => acc + (p.jumlah_peserta || 0), 0) || 0;
  const totalPendapatan = pelatihan?.reduce((acc: number, p: any) => acc + (p.total_pendapatan || 0), 0) || 0;
  const totalPengeluaran = laporan?.reduce((acc: number, l: any) => acc + (l.total_pengeluaran || 0), 0) || 0;
  const saldoAkhir = totalPendapatan - totalPengeluaran;
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded shadow">
          <div className="text-lg">Total Peserta</div>
          <div className="text-2xl font-bold">{totalPeserta}</div>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <div className="text-lg">Total Pendapatan</div>
          <div className="text-2xl font-bold">{totalPendapatan}</div>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <div className="text-lg">Total Pengeluaran</div>
          <div className="text-2xl font-bold">{totalPengeluaran}</div>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <div className="text-lg">Saldo Akhir</div>
          <div className="text-2xl font-bold">{saldoAkhir}</div>
        </div>
      </div>
      {/* You can add chart here using recharts or chart.js */}
    </div>
  );
}