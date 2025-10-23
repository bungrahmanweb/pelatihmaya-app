import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPembayaran, deletePembayaran } from '@/integrations/supabase/pembayaranService';
import { usePelatihanList } from '@/hooks/usePelatihan';
import { usePesertaByPelatihan } from '@/hooks/usePeserta';
import { usePembayaranByPeserta } from '@/hooks/usePembayaran';
import PembayaranForm from '@/components/forms/PembayaranForm';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import PembayaranInvoice from '@/components/invoice/PembayaranInvoice';

export default function AdminPembayaran() {
  const [selectedPelatihanId, setSelectedPelatihanId] = useState('');
  const [selectedPesertaId, setSelectedPesertaId] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewType, setPreviewType] = useState<'peserta' | 'pembayaran' | null>(null);
  const [previewPembayaran, setPreviewPembayaran] = useState<any>(null);

  const { 
    data: pelatihan,
    isLoading: loadingPelatihan 
  } = usePelatihanList();

  const {
    data: peserta,
    isLoading: loadingPeserta
  } = usePesertaByPelatihan(selectedPelatihanId);

  const {
    data: pembayaran,
    isLoading: loadingPembayaran,
    refetch: refetchPembayaran
  } = usePembayaranByPeserta(selectedPesertaId);

  const handleCreate = async (values: any) => {
    const result = await createPembayaran(values);
    setModalOpen(false);
    refetchPembayaran();
    return { id: result.id };
  };
  const handleDelete = async (id: string) => {
    if (window.confirm('Hapus pembayaran ini?')) {
      await deletePembayaran(id);
      refetchPembayaran();
    }
  };

  const selectedPeserta = peserta?.find(p => p.id === selectedPesertaId);
  const selectedPelatihanData = pelatihan?.find(p => p.id === selectedPelatihanId);
  
  const totalPembayaran = pembayaran?.reduce((sum, p) => sum + p.jumlah, 0) || 0;
  const sisaPembayaran = selectedPelatihanData ? selectedPelatihanData.harga_pelatihan - totalPembayaran : 0;

  if (loadingPelatihan) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-xl font-semibold mb-2">Loading...</div>
          <div className="text-gray-500">Memuat data pelatihan</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Manajemen Pembayaran</h1>
      
      {/* Pelatihan Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pilih Pelatihan
        </label>
        <select
          value={selectedPelatihanId}
          onChange={(e) => {
            setSelectedPelatihanId(e.target.value);
            setSelectedPesertaId('');
          }}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="">Pilih Pelatihan</option>
          {pelatihan?.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nama_pelatihan} - Batch {p.batch_pelatihan}
            </option>
          ))}
        </select>
      </div>

      {/* Peserta Selector */}
      {selectedPelatihanId && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pilih Peserta
          </label>
          <select
            value={selectedPesertaId}
            onChange={(e) => setSelectedPesertaId(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">Pilih Peserta</option>
            {peserta?.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nama} - {p.nik}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Info Pembayaran */}
      {selectedPeserta && selectedPelatihanData && (
        <>
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6 border">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-lg font-semibold">Informasi Pembayaran</h2>
              {totalPembayaran > 0 && (
                <div className="flex gap-2">
                  <button
                    className="px-4 py-2 bg-white text-gray-700 border rounded hover:bg-gray-50 print:hidden"
                    onClick={() => {
                      // Open modal preview for peserta summary
                      setPreviewType('peserta');
                      setPreviewOpen(true);
                    }}
                  >
                    Preview
                  </button>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Nama Peserta</p>
                <p className="font-medium">{selectedPeserta.nama}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">NIK</p>
                <p className="font-medium">{selectedPeserta.nik}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Nama Pelatihan</p>
                <p className="font-medium">{selectedPelatihanData.nama_pelatihan}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Kategori Pelatihan</p>
                <p className="font-medium">{selectedPelatihanData.kategori_pelatihan}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Biaya Pelatihan</p>
                <p className="font-medium">
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' })
                    .format(selectedPelatihanData.harga_pelatihan)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Sudah Dibayar</p>
                <p className="font-medium text-green-600">
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' })
                    .format(totalPembayaran)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Sisa Pembayaran</p>
                <p className="font-medium text-red-600">
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' })
                    .format(sisaPembayaran)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  sisaPembayaran <= 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {sisaPembayaran <= 0 ? 'Lunas' : 'Belum Lunas'}
                </span>
              </div>
            </div>
          </div>

        </>
      )}

      {/* Tabel Pembayaran */}
      {selectedPesertaId && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Riwayat Pembayaran</h2>
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors" 
              onClick={() => setModalOpen(true)}
              disabled={sisaPembayaran <= 0}
            >
              Tambah Pembayaran
            </button>
          </div>

          {loadingPembayaran ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jumlah</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Keterangan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pembayaran?.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(row.tanggal_pembayaran || new Date()), 'dd MMMM yyyy', { locale: id })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(row.jumlah)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{row.keterangan}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                        <button
                            className="text-blue-600 hover:text-blue-900"
                          onClick={() => {
                            // Open modal preview for this pembayaran
                            setPreviewType('pembayaran');
                            setPreviewPembayaran(row);
                            setPreviewOpen(true);
                          }}
                        >
                          Preview
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
                  {(!pembayaran || pembayaran.length === 0) && (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                        Belum ada riwayat pembayaran
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Modal Pembayaran */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg min-w-[450px]">
            <h3 className="text-lg font-medium mb-4">Tambah Pembayaran</h3>
            <PembayaranForm
              defaultValues={{
                peserta_id: selectedPesertaId,
                tanggal_pembayaran: new Date().toISOString().split('T')[0]
              }}
              maxPembayaran={sisaPembayaran}
              onSubmit={handleCreate}
              onCancel={() => setModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg max-w-4xl w-full">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-medium">Preview Invoice</h3>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-white border rounded" onClick={() => window.print()}>Download PDF</button>
                <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => window.open(previewType === 'pembayaran' && previewPembayaran ? `/admin/pembayaran/invoice/${previewPembayaran.id}?autoPrint=1` : `/admin/pembayaran/invoice/peserta/${selectedPesertaId}?autoPrint=1`, '_blank')}>Print</button>
                <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => setPreviewOpen(false)}>Close</button>
              </div>
            </div>
            <div className="p-6 overflow-auto max-h-[80vh]">
              <PembayaranInvoice 
                pembayaran={
                  previewType === 'pembayaran' && previewPembayaran 
                    ? previewPembayaran 
                    : {
                        peserta: selectedPeserta,
                        pelatihan: selectedPelatihanData,
                        total_pembayaran: totalPembayaran,
                        sisa_pembayaran: sisaPembayaran
                      }
                } 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}