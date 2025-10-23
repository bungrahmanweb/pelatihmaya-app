import React, { useState } from 'react';
import ArtikelForm from '@/components/forms/ArtikelForm';
import { createArtikel, updateArtikel, deleteArtikel } from '@/integrations/supabase/artikelService';
import { Artikel } from '@/types'
import { useArtikelList } from '@/hooks/useArtikel';
import { toast } from 'sonner';

export default function AdminArtikel() {
  const { data, isLoading, error, refetch } = useArtikelList();
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  const handleCreate = async (values: any) => {
    await createArtikel(values);
    toast.success('Artikel berhasil ditambahkan');
    setModalOpen(false);
    refetch();
  };

  const handleEdit = async (values: any) => {
    if (!editData) return;
    await updateArtikel(editData.id, values);
    toast.success('Artikel berhasil diperbarui');
    setModalOpen(false);
    setEditData(null);
    refetch();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Yakin ingin menghapus artikel ini?')) {
      await deleteArtikel(id);
      toast.success('Artikel dihapus');
      refetch();
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Manajemen Artikel</h1>
      <div className="flex items-center justify-between mb-4">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => { setEditData(null); setModalOpen(true); }}
        >
          Tambah Artikel
        </button>
        <div className="text-sm text-muted">Total: <span className="font-semibold">{data?.length || 0}</span></div>
      </div>

      {isLoading ? <div>Loading...</div> : (
        <div className="grid gap-4">
          {data?.map((row: any) => (
            <div key={row.id} className="p-4 bg-white rounded shadow flex justify-between">
              <div>
                <div className="text-lg font-semibold">{row.judul}</div>
                <div className="text-sm text-gray-600">{row.kategori} • {new Date(row.tanggal).toLocaleDateString('id-ID')}</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1 text-sm bg-gray-100 rounded"
                  onClick={() => { setEditData(row); setModalOpen(true); }}
                >
                  Edit
                </button>
                <button
                  className="px-3 py-1 text-sm text-red-600"
                  onClick={() => handleDelete(row.id)}
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg min-w-[350px]">
            <ArtikelForm
              defaultValues={editData || {}}
              onSubmit={editData ? handleEdit : handleCreate}
              onCancel={() => { setModalOpen(false); setEditData(null); }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
