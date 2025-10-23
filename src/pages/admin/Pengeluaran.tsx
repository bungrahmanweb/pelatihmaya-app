import React, { useState } from 'react';
import { getPengeluaranList, createPengeluaran, updatePengeluaran, deletePengeluaran } from '@/integrations/supabase/pengeluaranService';

export default function AdminPengeluaran() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    const res = await getPengeluaranList();
    setData(res);
    setLoading(false);
  };

  React.useEffect(() => { fetchData(); }, []);

  const handleCreate = async (values: any) => {
    await createPengeluaran(values);
    setModalOpen(false);
    fetchData();
  };
  const handleEdit = async (values: any) => {
    if (!editData) return;
    await updatePengeluaran(editData.id, values);
    setModalOpen(false);
    setEditData(null);
    fetchData();
  };
  const handleDelete = async (id: string) => {
    if (window.confirm('Hapus pengeluaran ini?')) {
      await deletePengeluaran(id);
      fetchData();
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Data Pengeluaran</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={() => { setEditData(null); setModalOpen(true); }}>Tambah Pengeluaran</button>
      </div>

      {loading ? <div>Loading...</div> : (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keterangan</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data?.map((row: any) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.tanggal_pengeluaran}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.kategori_pengeluaran}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{row.keterangan}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(row.jumlah || 0)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-4" onClick={() => { setEditData(row); setModalOpen(true); }}>Edit</button>
                    <button className="text-red-600 hover:text-red-900" onClick={() => handleDelete(row.id)}>Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">{editData ? 'Edit Pengeluaran' : 'Tambah Pengeluaran'}</h2>
            <form onSubmit={e => { e.preventDefault(); const form = e.target as HTMLFormElement; const values = Object.fromEntries(new FormData(form)); const payload = { tanggal_pengeluaran: values['tanggal_pengeluaran'], kategori_pengeluaran: values['kategori_pengeluaran'], keterangan: values['keterangan'], jumlah: Number(values['jumlah'] || 0) }; (editData ? handleEdit : handleCreate)(payload); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Tanggal</label>
                <input type="date" name="tanggal_pengeluaran" defaultValue={editData?.tanggal_pengeluaran || ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Kategori</label>
                <input name="kategori_pengeluaran" defaultValue={editData?.kategori_pengeluaran || ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Keterangan</label>
                <input name="keterangan" defaultValue={editData?.keterangan || ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Jumlah</label>
                <input type="number" name="jumlah" defaultValue={editData?.jumlah || ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
              </div>
              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => { setModalOpen(false); setEditData(null); }} className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">Batal</button>
                <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}