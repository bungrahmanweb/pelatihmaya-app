import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { usePelatihanSummary, useMonthlyReport } from '@/hooks/useReports';
import { usePelatihanList } from '@/hooks/usePelatihan';

const COLORS = ['#10b981', '#ef4444']; // hijau = pendapatan, merah = pengeluaran

export default function AdminDashboard() {
  const { data: pelatihanSummary, isLoading: loadingPelatihan, error: errorPelatihan } = usePelatihanSummary();
  const { data: laporan, isLoading: loadingLaporan, error: errorLaporan } = useMonthlyReport();
  const { data: pelatihanList, isLoading: loadingList } = usePelatihanList();

  const isLoading = loadingPelatihan || loadingLaporan || loadingList;

  // Hitung summary utama
  const totalPelatihan = pelatihanList?.length || 0;
  const totalPeserta = pelatihanSummary?.reduce((acc: number, p: any) => acc + (p.jumlah_peserta || 0), 0) || 0;
  const totalPendapatan = laporan?.reduce((acc: number, l: any) => acc + (l.total_pendapatan || 0), 0) || 0;
  const totalPengeluaran = laporan?.reduce((acc: number, l: any) => acc + (l.total_pengeluaran || 0), 0) || 0;

  // Data untuk grafik per bulan
  const monthlyChartData = laporan?.map((r: any) => ({
    month: r.month?.slice(0, 7) || '',
    pendapatan: r.total_pendapatan || 0,
    pengeluaran: r.total_pengeluaran || 0,
  })) || [];

  // Data donut chart
  const donutData = [
    { name: 'Pendapatan', value: totalPendapatan },
    { name: 'Pengeluaran', value: totalPengeluaran },
  ];

  if (isLoading) {
    return (
      <div className="p-8 text-center">Memuat data dashboard...</div>
    );
  }

  if (errorPelatihan || errorLaporan) {
    return (
      <div className="p-8 text-red-600">
        Error: {errorPelatihan?.message || errorLaporan?.message}
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Dashboard Admin</h1>

      {/* ====== CARDS ====== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded shadow">
          <div className="text-lg">Total Pelatihan</div>
          <div className="text-2xl font-bold">{totalPelatihan}</div>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <div className="text-lg">Total Peserta</div>
          <div className="text-2xl font-bold">{totalPeserta}</div>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <div className="text-lg">Total Pendapatan</div>
          <div className="text-2xl font-bold text-green-600">
            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalPendapatan)}
          </div>
        </div>
      </div>

      {/* ====== CHARTS ====== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grafik Tren Bulanan */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Grafik Tren Keuangan Bulanan</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={monthlyChartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value: any) =>
                    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value)
                  }
                />
                <Legend />
                <Bar dataKey="pendapatan" fill="#10b981" />
                <Bar dataKey="pengeluaran" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="bg-white p-4 rounded shadow flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold mb-4">Perbandingan Pendapatan & Pengeluaran</h3>
          <div style={{ width: 300, height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) =>
                    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value)
                  }
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
