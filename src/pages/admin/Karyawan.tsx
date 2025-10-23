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
      <h1 className="text-3xl font-bold mb-4">Data Karyawan</h1>
      <button className="mb-4 px-4 py-2 bg-blue-600 text-white rounded" onClick={() => { setEditData(null); setModalOpen(true); }}>Tambah Karyawan</button>
      {loading ? <div>Loading...</div> : (
        <table className="min-w-full border">
          <thead>
            <tr>
              <th>NIK</th>
              <th>Nama</th>
              <th>Tempat Lahir</th>
              <th>Tanggal Lahir</th>
              <th>Alamat</th>
              <th>Kontrak Awal</th>
              <th>Kontrak Akhir</th>
              <th>BPJS TK</th>
              <th>BPJS Kesehatan</th>
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
                <td>{row.alamat}</td>
                <td>{row.kontrak_awal}</td>
                <td>{row.kontrak_akhir}</td>
                <td>{row.bpjs_tk}</td>
                <td>{row.bpjs_kesehatan}</td>
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
            {/* You can create KaryawanForm similar to PelatihanForm */}
            <form onSubmit={e => { e.preventDefault(); const form = e.target as HTMLFormElement; const values = Object.fromEntries(new FormData(form)); (editData ? handleEdit : handleCreate)(values); }}>
              <label>NIK</label>
              <input name="nik" defaultValue={editData?.nik || ''} />
              <label>Nama</label>
              <input name="nama" defaultValue={editData?.nama || ''} />
              <label>Tempat Lahir</label>
              <input name="tempat_lahir" defaultValue={editData?.tempat_lahir || ''} />
              <label>Tanggal Lahir</label>
              <input type="date" name="tanggal_lahir" defaultValue={editData?.tanggal_lahir || ''} />
              <label>Alamat</label>
              <input name="alamat" defaultValue={editData?.alamat || ''} />
              <label>Kontrak Awal</label>
              <input type="date" name="kontrak_awal" defaultValue={editData?.kontrak_awal || ''} />
              <label>Kontrak Akhir</label>
              <input type="date" name="kontrak_akhir" defaultValue={editData?.kontrak_akhir || ''} />
              <label>BPJS TK</label>
              <input name="bpjs_tk" defaultValue={editData?.bpjs_tk || ''} />
              <label>BPJS Kesehatan</label>
              <input name="bpjs_kesehatan" defaultValue={editData?.bpjs_kesehatan || ''} />
              <button type="submit">Simpan</button>
            </form>
            <button className="mt-4 px-4 py-2 bg-gray-300 rounded" onClick={() => { setModalOpen(false); setEditData(null); }}>Batal</button>
          </div>
        </div>
      )}
    </div>
  );
}