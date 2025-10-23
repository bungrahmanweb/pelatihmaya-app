import React, { useState } from 'react';
import { getKaryawanList, createKaryawan, updateKaryawan, deleteKaryawan } from '@/integrations/supabase/karyawanService';
import KaryawanForm from '@/components/forms/KaryawanForm';

export default function AdminKaryawan() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    const res = await getKaryawanList();
    setData(res);
    setLoading(false);
  };

  React.useEffect(() => { fetchData(); }, []);

  const handleCreate = async (values: any) => {
    await createKaryawan(values);
    setModalOpen(false);
    fetchData();
  };
  const handleEdit = async (values: any) => {
    if (!editData) return;
    await updateKaryawan(editData.id, values);
    setModalOpen(false);
    setEditData(null);
    fetchData();
  };
  const handleDelete = async (id: string) => {
    if (window.confirm('Hapus karyawan ini?')) {
      await deleteKaryawan(id);
      fetchData();
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Data Karyawan</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={() => { setEditData(null); setModalOpen(true); }}>Tambah Karyawan</button>
      </div>

      {loading ? <div>Loading...</div> : (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIK</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tempat Lahir</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Lahir</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alamat</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kontrak Awal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kontrak Akhir</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BPJS TK</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BPJS Kesehatan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data?.map((row: any) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.nik}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.nama}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.tempat_lahir}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.tanggal_lahir}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{row.alamat}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.kontrak_awal}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.kontrak_akhir}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.bpjs_tk}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.bpjs_kesehatan}</td>
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
            <h2 className="text-xl font-semibold mb-4">{editData ? 'Edit Karyawan' : 'Tambah Karyawan'}</h2>
            <KaryawanForm
              defaultValues={editData || {}}
              onSubmit={(values: any) => {
                const payload = { nik: values.nik, nama: values.nama, tempat_lahir: values.tempat_lahir, tanggal_lahir: values.tanggal_lahir, alamat: values.alamat, kontrak_awal: values.kontrak_awal, kontrak_akhir: values.kontrak_akhir, bpjs_tk: values.bpjs_tk, bpjs_kesehatan: values.bpjs_kesehatan };
                return (editData ? handleEdit(payload) : handleCreate(payload));
              }}
              onCancel={() => { setModalOpen(false); setEditData(null); }}
            />
          </div>
        </div>
      )}
    </div>
  );
}