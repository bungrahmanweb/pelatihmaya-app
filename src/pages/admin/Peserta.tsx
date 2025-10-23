import React, { useState } from 'react';
import { usePesertaByPelatihan } from '@/hooks/usePeserta';
import PesertaForm from '@/components/forms/PesertaForm';
import { createPeserta, updatePeserta, deletePeserta } from '@/integrations/supabase/pesertaService';

export default function AdminPeserta() {
  // For demo, pelatihanId can be hardcoded or selected from dropdown
  const pelatihanId = '';
  const { data, isLoading, refetch } = usePesertaByPelatihan(pelatihanId);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  const handleCreate = async (values: any) => {
    await createPeserta({ ...values, pelatihan_id: pelatihanId });
    setModalOpen(false);
    refetch();
  };
  const handleEdit = async (values: any) => {
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

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Data Peserta</h1>
      <button className="mb-4 px-4 py-2 bg-blue-600 text-white rounded" onClick={() => { setEditData(null); setModalOpen(true); }}>Tambah Peserta</button>
      {isLoading ? <div>Loading...</div> : (
        <table className="min-w-full border">
          <thead>
            <tr>
              <th>NIK</th>
              <th>Nama</th>
              <th>Tempat Lahir</th>
              <th>Tanggal Lahir</th>
              <th>Ukuran Jaket</th>
              <th>Email</th>
              <th>Telepon</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((row: any) => (
              <tr key={row.id}>
                <td>{row.nik}</td>
                <td>{row.nama}</td>
                <td>{row.tempat_lahir}</td>
                <td>{row.tanggal_lahir}</td>
                <td>{row.ukuran_jaket}</td>
                <td>{row.email}</td>
                <td>{row.telepon}</td>
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