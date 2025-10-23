import React from 'react';
import { useMonthlyReport } from '@/hooks/useReports';
import ExportButton from '@/components/ExportButton';

export default function AdminLaporan() {
  const { data, isLoading } = useMonthlyReport();
  const saldoAkhir = data?.length ? data[data.length - 1].saldo : 0;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Laporan Keuangan</h1>
      <div className="mb-4">Saldo Akhir: <span className="font-bold">{saldoAkhir}</span></div>
      <ExportButton data={data || []} fileName="laporan-keuangan.xlsx" />
      {isLoading ? <div>Loading...</div> : (
        <table className="min-w-full border mt-4">
          <thead>
            <tr>
              <th>Bulan</th>
              <th>Pendapatan</th>
              <th>Pengeluaran</th>
              <th>Saldo</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((row: any) => (
              <tr key={row.month}>
                <td>{row.month?.slice(0, 7)}</td>
                <td>{row.total_pendapatan}</td>
                <td>{row.total_pengeluaran}</td>
                <td>{row.saldo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}