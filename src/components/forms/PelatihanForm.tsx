import React from 'react';
import { useForm } from 'react-hook-form';

type FormValues = {
  nama_pelatihan: string;
  kategori_pelatihan: string;
  batch_pelatihan: string;
  tanggal_pelaksanaan: string;
  harga_pelatihan: number;
  deskripsi?: string;
  status?: 'SELESAI' | 'AKAN_DATANG';
};

export default function PelatihanForm({ defaultValues, onSubmit }: any) {
  const { register, handleSubmit } = useForm<FormValues>({ defaultValues });
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>Nama Pelatihan</label>
      <input className="w-full p-2 border rounded" {...register('nama_pelatihan')} />

      <label>Kategori</label>
      <input className="w-full p-2 border rounded" {...register('kategori_pelatihan')} />

      <label>Batch</label>
      <input className="w-full p-2 border rounded" {...register('batch_pelatihan')} />

      <label>Tanggal</label>
      <input className="w-full p-2 border rounded" type="date" {...register('tanggal_pelaksanaan')} />

      <label>Harga</label>
      <input className="w-full p-2 border rounded" type="number" {...register('harga_pelatihan', { valueAsNumber: true })} />

      <label>Deskripsi</label>
      <textarea className="w-full p-2 border rounded" {...register('deskripsi')} />

      <label className="mt-3">Status</label>
      <select className="w-full p-2 border rounded" {...register('status')}> 
        <option value="AKAN_DATANG">Akan Datang</option>
        <option value="SELESAI">Selesai</option>
      </select>

      <div className="mt-4 flex justify-end gap-2">
        <button type="button" className="px-3 py-2 bg-gray-200 rounded" onClick={() => window.dispatchEvent(new Event('close-modal'))}>Batal</button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Simpan</button>
      </div>
    </form>
  );
}
