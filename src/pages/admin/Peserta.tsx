import React, { useState } from 'react';
import { usePesertaByPelatihan } from '@/hooks/usePeserta';
import { usePelatihanList } from '@/hooks/usePelatihan';
import PesertaForm from '@/components/forms/PesertaForm';
import { createPeserta, updatePeserta, deletePeserta } from '@/integrations/supabase/pesertaService';
import { Peserta } from '@/types';
import * as XLSX from 'xlsx';

export default function AdminPeserta() {
  const [selectedPelatihanId, setSelectedPelatihanId] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'lunas' | 'belum-lunas'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { data: pelatihan, isLoading: loadingPelatihan } = usePelatihanList();
  const { data: peserta, isLoading, refetch } = usePesertaByPelatihan(selectedPelatihanId);

  const filteredPeserta = React.useMemo(() => {
    if (!peserta || !pelatihan) return [];

    const selectedPelatihan = pelatihan.find(p => p.id === selectedPelatihanId);
    if (!selectedPelatihan) return [];

    return peserta.filter(p => {
      const matchesStatus = filterStatus === 'all' ||
        (filterStatus === 'lunas' && p.total_pembayaran >= selectedPelatihan.harga_pelatihan) ||
        (filterStatus === 'belum-lunas' && p.total_pembayaran < selectedPelatihan.harga_pelatihan);

      const matchesSearch = !searchQuery ||
        p.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.nik.includes(searchQuery);

      return matchesStatus && matchesSearch;
    });
  }, [peserta, pelatihan, selectedPelatihanId, filterStatus, searchQuery]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<Peserta | null>(null);

  const handleExport = () => {
    if (!peserta || peserta.length === 0) {
      alert('Tidak ada data peserta untuk diekspor');
      return;
    }

    const selectedPelatihan = pelatihan?.find(p => p.id === selectedPelatihanId);
    if (!selectedPelatihan) return;

    const exportData = peserta.map(p => ({
      'NIK': p.nik,
      'Nama': p.nama,
      'Tempat Lahir': p.tempat_lahir,
      'Tanggal Lahir': p.tanggal_lahir,
      'Alamat': p.alamat,
      'Ukuran Jaket': p.ukuran_jaket,
      'Email': p.email,
      'Telepon': p.telepon,
      'Total Pembayaran': p.total_pembayaran,
      'Status': p.total_pembayaran >= selectedPelatihan.harga_pelatihan ? 'Lunas' : 'Belum Lunas'
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Set column widths
    ws['!cols'] = [
      { wch: 20 }, // NIK
      { wch: 30 }, // Nama
      { wch: 20 }, // Tempat Lahir
      { wch: 15 }, // Tanggal Lahir
      { wch: 40 }, // Alamat
      { wch: 15 }, // Ukuran Jaket
      { wch: 30 }, // Email
      { wch: 15 }, // Telepon
      { wch: 20 }, // Total Pembayaran
      { wch: 15 }  // Status
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Data Peserta');
    XLSX.writeFile(wb, `data_peserta_${selectedPelatihan.nama_pelatihan}_batch${selectedPelatihan.batch_pelatihan}.xlsx`);
  };

  const handleCreate = async (values: Partial<Peserta>) => {
    await createPeserta({ ...values, pelatihan_id: selectedPelatihanId });
    setModalOpen(false);
    refetch();
  };
  
  const handleEdit = async (values: Partial<Peserta>) => {
    if (!editData) return;
    await updatePeserta(editData.id, values);
    setModalOpen(false);
    setEditData(null);
    refetch();
  };
  
  const handleDelete = async (id: string) => {
    if (window.confirm('Hapus peserta ini?')) {
      await deletePeserta(id);
      refetch();
    }
  };

  if (loadingPelatihan) {
    return <div>Loading data pelatihan...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Data Peserta</h1>
      
      <div className="mb-4">
        <label htmlFor="pelatihan" className="block text-sm font-medium text-gray-700">
          Pilih Pelatihan
        </label>
        <select
          id="pelatihan"
          value={selectedPelatihanId}
          onChange={(e) => setSelectedPelatihanId(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="">Pilih Pelatihan</option>
          {pelatihan?.map((item) => (
            <option key={item.id} value={item.id}>
              {item.nama_pelatihan} - Batch {item.batch_pelatihan}
            </option>
          ))}
        </select>
      </div>

      {selectedPelatihanId && (
        <div className="flex space-x-4">
          <button 
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors" 
            onClick={() => { setEditData(null); setModalOpen(true); }}
          >
            Tambah Peserta
          </button>
          <button
            className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            onClick={handleExport}
            disabled={!peserta || peserta.length === 0}
          >
            Export ke Excel
          </button>
        </div>
      )}
      
      {isLoading ? <div>Loading data peserta...</div> : (
        <div className="overflow-x-auto">
          <table className="min-w-full border bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIK</th>
                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tempat Lahir</th>
                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Lahir</th>
                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alamat</th>
                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ukuran Jaket</th>
                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Pembayaran</th>
                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPeserta.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.nik}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.nama}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.tempat_lahir}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.tanggal_lahir}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{row.alamat}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.ukuran_jaket}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(row.total_pembayaran || 0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      row.total_pembayaran >= (pelatihan?.find(p => p.id === row.pelatihan_id)?.harga_pelatihan || 0)
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {row.total_pembayaran >= (pelatihan?.find(p => p.id === row.pelatihan_id)?.harga_pelatihan || 0)
                        ? 'Lunas'
                        : 'Belum Lunas'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      className="text-blue-600 hover:text-blue-900 mr-4"
                      onClick={() => { setEditData(row); setModalOpen(true); }}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleDelete(row.id)}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!isLoading && (!peserta || peserta.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              {selectedPelatihanId ? 'Belum ada peserta terdaftar' : 'Silakan pilih pelatihan terlebih dahulu'}
            </div>
          )}
        </div>
      )}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg min-w-[350px]">
            <PesertaForm
              defaultValues={editData || {}}
              onSubmit={editData ? handleEdit : handleCreate}
            />
            <button className="mt-4 px-4 py-2 bg-gray-300 rounded" onClick={() => { setModalOpen(false); setEditData(null); }}>Batal</button>
          </div>
        </div>
      )}
    </div>
  );
}