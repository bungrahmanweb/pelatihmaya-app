import React, { useState, useEffect } from 'react';
import { usePelatihanList } from '@/hooks/usePelatihan';
import PelatihanForm from '@/components/forms/PelatihanForm';
import { createPelatihan, updatePelatihan, deletePelatihan } from '@/integrations/supabase/pelatihanService';
import { Pelatihan } from '@/types';
import StatusBadge from '@/components/StatusBadge';
import { toast } from 'sonner';

export default function AdminPelatihan() {
  const { data, isLoading, error, refetch } = usePelatihanList();
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
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={() => { setEditData(null); setModalOpen(true); }}>Tambah Pelatihan</button>
          <div className="text-sm text-muted">Total: <span className="font-semibold">{data?.length || 0}</span></div>
        </div>
      </div>

      {isLoading ? <div>Loading...</div> : (
        <div className="grid gap-4">
          {data?.map((row: any) => (
            <div key={row.id} className="p-4 bg-white rounded shadow flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold">{row.nama_pelatihan} <span className="text-sm text-gray-500">- Batch {row.batch_pelatihan}</span></div>
                <div className="text-sm text-gray-600">{row.kategori_pelatihan} • {row.tanggal_pelaksanaan}</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm text-gray-500">Harga</div>
                  <div className="font-medium">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(row.harga_pelatihan || 0)}</div>
                </div>
                <StatusBadge>{row.status || 'AKAN_DATANG'}</StatusBadge>
                <div className="flex flex-col gap-2">
                  <button className="px-3 py-1 text-sm bg-gray-100 rounded" onClick={() => { setEditData(row); setModalOpen(true); }}>Edit</button>
                  <button className="px-3 py-1 text-sm text-red-600" onClick={() => handleDelete(row.id)}>Hapus</button>
                </div>
              </div>
            </div>
          ))}
        </div>
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