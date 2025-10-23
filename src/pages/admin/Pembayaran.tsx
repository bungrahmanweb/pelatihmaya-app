import React, { useState } from 'react';
import { getPembayaranByPeserta, createPembayaran, deletePembayaran } from '@/integrations/supabase/pembayaranService';
import PembayaranForm from '@/components/forms/PembayaranForm';

export default function AdminPembayaran() {
  // For demo, pesertaId can be hardcoded or selected from dropdown
  const pesertaId = '';
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const res = await getPembayaranByPeserta(pesertaId);
    setData(res);
    setLoading(false);
  };

  React.useEffect(() => { if (pesertaId) fetchData(); }, [pesertaId]);

  const handleCreate = async (values: any) => {
    await createPembayaran({ ...values, peserta_id: pesertaId });
    setModalOpen(false);
    fetchData();
  };
  const handleDelete = async (id: string) => {
    if (window.confirm('Hapus pembayaran ini?')) {
      await deletePembayaran(id);
      fetchData();
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Manajemen Pembayaran</h1>
      <button className="mb-4 px-4 py-2 bg-blue-600 text-white rounded" onClick={() => setModalOpen(true)}>Tambah Pembayaran</button>
      {loading ? <div>Loading...</div> : (
        <table className="min-w-full border">
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Jumlah</th>
              <th>Keterangan</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((row: any) => (
              <tr key={row.id}>
                <td>{row.tanggal_pembayaran}</td>
                <td>{row.jumlah}</td>
                <td>{row.keterangan}</td>
                <td>
                  <button className="text-red-600" onClick={() => handleDelete(row.id)}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg min-w-[350px]">
            <PembayaranForm
              defaultValues={{}}
              onSubmit={handleCreate}
            />
            <button className="mt-4 px-4 py-2 bg-gray-300 rounded" onClick={() => setModalOpen(false)}>Batal</button>
          </div>
        </div>
      )}
    </div>
  );
}