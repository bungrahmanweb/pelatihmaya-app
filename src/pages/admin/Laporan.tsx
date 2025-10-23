import React, { useMemo, useState } from 'react';
import { useMonthlyReport } from '@/hooks/useReports';
import ExportButton from '@/components/ExportButton';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from 'recharts';

const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function AdminLaporan() {
  const { data, isLoading } = useMonthlyReport();
  const [selectedYear, setSelectedYear] = useState<string | 'all'>('all');
  const [selectedMonth, setSelectedMonth] = useState<string | 'all'>('all');

  // derive years and months from data
  const years = useMemo(() => {
    if (!data) return [] as string[];
    const set = new Set<string>();
    data.forEach((r: any) => {
      const y = (r.month || '').slice(0,4);
      if (y) set.add(y);
    });
    return Array.from(set).sort();
  }, [data]);

  const months = useMemo(() => {
    if (!data) return [] as string[];
    const set = new Set<string>();
    data.forEach((r: any) => {
      const m = (r.month || '').slice(5,7);
      if (m) set.add(m);
    });
    return Array.from(set).sort();
  }, [data]);

  // data for monthly chart filtered by selectedYear
  const monthlySeries = useMemo(() => {
    if (!data) return [];
    const filtered = selectedYear === 'all' ? data : data.filter((r: any) => (r.month || '').startsWith(selectedYear));
    return filtered.map((r: any) => ({ name: r.month?.slice(0,7), pendapatan: r.total_pendapatan || 0, pengeluaran: r.total_pengeluaran || 0, saldo: r.saldo || 0 }));
  }, [data, selectedYear]);

  // yearly aggregation
  const yearlySeries = useMemo(() => {
    if (!data) return [];
    const map = new Map<string, { pendapatan: number, pengeluaran: number, saldo: number }>();
    data.forEach((r: any) => {
      const y = (r.month || '').slice(0,4) || 'unknown';
      const cur = map.get(y) || { pendapatan: 0, pengeluaran: 0, saldo: 0 };
      cur.pendapatan += Number(r.total_pendapatan || 0);
      cur.pengeluaran += Number(r.total_pengeluaran || 0);
      cur.saldo = Number(r.saldo || 0);
      map.set(y, cur);
    });
    return Array.from(map.entries()).map(([year, vals]) => ({ year, ...vals })).sort((a,b) => a.year.localeCompare(b.year));
  }, [data]);

  // filtered table rows by month/year selection
  const tableRows = useMemo(() => {
    if (!data) return [];
    return data.filter((r: any) => {
      if (selectedYear !== 'all' && !(r.month||'').startsWith(selectedYear)) return false;
      if (selectedMonth !== 'all' && (r.month||'').slice(5,7) !== selectedMonth) return false;
      return true;
    });
  }, [data, selectedYear, selectedMonth]);

  const saldoAkhir = data?.length ? data[data.length - 1].saldo : 0;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Laporan Keuangan</h1>
        <div className="text-sm text-gray-600">Saldo Akhir: <span className="font-semibold">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(saldoAkhir || 0)}</span></div>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex gap-3 items-center">
          <label className="text-sm text-gray-600">Tahun</label>
          <select value={selectedYear} onChange={e => setSelectedYear(e.target.value as any)} className="border rounded p-2">
            <option value="all">Semua Tahun</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>

          <label className="text-sm text-gray-600">Bulan</label>
          <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value as any)} className="border rounded p-2">
            <option value="all">Semua Bulan</option>
            {months.map(m => <option key={m} value={m}>{(Number(m) >= 1 && Number(m) <=12) ? ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][Number(m)-1] : m}</option>)}
          </select>
        </div>

        <ExportButton data={tableRows || []} fileName={`laporan_${selectedYear}_${selectedMonth}.xlsx`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-medium mb-2">Grafik Bulanan ({selectedYear === 'all' ? 'Semua Tahun' : selectedYear})</h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={monthlySeries} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value:any) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value)} />
                <Legend />
                <Line type="monotone" dataKey="pendapatan" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="pengeluaran" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-medium mb-2">Grafik Tahunan</h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={yearlySeries} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip formatter={(value:any) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value)} />
                <Legend />
                <Bar dataKey="pendapatan" fill="#10b981" />
                <Bar dataKey="pengeluaran" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        {isLoading ? (
          <div className="p-6 text-center">Memuat data...</div>
        ) : (
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bulan</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Pendapatan</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Pengeluaran</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Saldo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tableRows.map((row: any) => (
                <tr key={row.month} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.month?.slice(0,7)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(row.total_pendapatan || 0)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(row.total_pengeluaran || 0)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(row.saldo || 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
