import React, { useState } from 'react';
import { usePelatihanList } from '@/hooks/usePelatihan';
import PelatihanForm from '@/components/forms/PelatihanForm';
import { createPelatihan, updatePelatihan, deletePelatihan } from '@/integrations/supabase/pelatihanService';

export default function AdminPelatihan() {
  const { data, isLoading, refetch } = usePelatihanList();
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  const handleCreate = async (values: any) => {
    await createPelatihan(values);
    setModalOpen(false);
    refetch();
  };
  const handleEdit = async (values: any) => {
    if (!editData) return;
    await updatePelatihan(editData.id, values);
    setModalOpen(false);
    setEditData(null);
    refetch();
  };
  const handleDelete = async (id: string) => {
    if (window.confirm('Hapus pelatihan ini?')) {
      await deletePelatihan(id);
      refetch();
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Manajemen Pelatihan</h1>
      <button className="mb-4 px-4 py-2 bg-blue-600 text-white rounded" onClick={() => { setEditData(null); setModalOpen(true); }}>Tambah Pelatihan</button>
      {isLoading ? <div>Loading...</div> : (
        <table className="min-w-full border">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Kategori</th>
              <th>Batch</th>
              <th>Tanggal</th>
              <th>Harga</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((row: any) => (
              <tr key={row.id}>
                <td>{row.nama_pelatihan}</td>
                <td>{row.kategori_pelatihan}</td>
                <td>{row.batch_pelatihan}</td>
                <td>{row.tanggal_pelaksanaan}</td>
                <td>{row.harga_pelatihan}</td>
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
            <PelatihanForm
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