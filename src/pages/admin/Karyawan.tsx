import React, { useState } from 'react';
import { getKaryawanList, createKaryawan, updateKaryawan, deleteKaryawan } from '@/integrations/supabase/karyawanService';

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
          <table className="min-w-full">
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
            <form onSubmit={e => { e.preventDefault(); const form = e.target as HTMLFormElement; const values = Object.fromEntries(new FormData(form)); const payload = { nik: values['nik'], nama: values['nama'], tempat_lahir: values['tempat_lahir'], tanggal_lahir: values['tanggal_lahir'], alamat: values['alamat'], kontrak_awal: values['kontrak_awal'], kontrak_akhir: values['kontrak_akhir'], bpjs_tk: values['bpjs_tk'], bpjs_kesehatan: values['bpjs_kesehatan'] }; (editData ? handleEdit : handleCreate)(payload); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">NIK</label>
                <input name="nik" defaultValue={editData?.nik || ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nama</label>
                <input name="nama" defaultValue={editData?.nama || ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tempat Lahir</label>
                  <input name="tempat_lahir" defaultValue={editData?.tempat_lahir || ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tanggal Lahir</label>
                  <input type="date" name="tanggal_lahir" defaultValue={editData?.tanggal_lahir || ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Alamat</label>
                <input name="alamat" defaultValue={editData?.alamat || ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Kontrak Awal</label>
                  <input type="date" name="kontrak_awal" defaultValue={editData?.kontrak_awal || ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Kontrak Akhir</label>
                  <input type="date" name="kontrak_akhir" defaultValue={editData?.kontrak_akhir || ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">BPJS TK</label>
                  <input name="bpjs_tk" defaultValue={editData?.bpjs_tk || ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">BPJS Kesehatan</label>
                  <input name="bpjs_kesehatan" defaultValue={editData?.bpjs_kesehatan || ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                </div>
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