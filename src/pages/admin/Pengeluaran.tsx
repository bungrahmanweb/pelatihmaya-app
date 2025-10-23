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
      <h1 className="text-3xl font-bold mb-4">Data Pengeluaran</h1>
      <button className="mb-4 px-4 py-2 bg-blue-600 text-white rounded" onClick={() => { setEditData(null); setModalOpen(true); }}>Tambah Pengeluaran</button>
      {loading ? <div>Loading...</div> : (
        <table className="min-w-full border">
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Kategori</th>
              <th>Keterangan</th>
              <th>Jumlah</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((row: any) => (
              <tr key={row.id}>
                <td>{row.tanggal_pengeluaran}</td>
                <td>{row.kategori_pengeluaran}</td>
                <td>{row.keterangan}</td>
                <td>{row.jumlah}</td>
                <td>
                  <button className="mr-2 text-blue-600" onClick={() => { setEditData(row); setModalOpen(true); }}>Edit</button>
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
            {/* You can create PengeluaranForm similar to PelatihanForm */}
            <form onSubmit={e => { e.preventDefault(); const form = e.target as HTMLFormElement; const values = Object.fromEntries(new FormData(form)); (editData ? handleEdit : handleCreate)(values); }}>
              <label>Tanggal</label>
              <input type="date" name="tanggal_pengeluaran" defaultValue={editData?.tanggal_pengeluaran || ''} />
              <label>Kategori</label>
              <input name="kategori_pengeluaran" defaultValue={editData?.kategori_pengeluaran || ''} />
              <label>Keterangan</label>
              <input name="keterangan" defaultValue={editData?.keterangan || ''} />
              <label>Jumlah</label>
              <input type="number" name="jumlah" defaultValue={editData?.jumlah || ''} />
              <button type="submit">Simpan</button>
            </form>
            <button className="mt-4 px-4 py-2 bg-gray-300 rounded" onClick={() => { setModalOpen(false); setEditData(null); }}>Batal</button>
          </div>
        </div>
      )}
    </div>
  );
}