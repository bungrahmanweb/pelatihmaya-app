import React from 'react';
import { useForm } from 'react-hook-form';

type FormValues = {
  nama_pelatihan: string;
  kategori_pelatihan: string;
  batch_pelatihan: string;
  tanggal_pelaksanaan: string;
  harga_pelatihan: number;
  deskripsi?: string;
};

export default function PelatihanForm({ defaultValues, onSubmit }: any) {
  const { register, handleSubmit } = useForm<FormValues>({ defaultValues });
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>Nama Pelatihan</label>
      <input {...register('nama_pelatihan')} />

      <label>Kategori</label>
      <input {...register('kategori_pelatihan')} />

      <label>Batch</label>
      <input {...register('batch_pelatihan')} />

      <label>Tanggal</label>
      <input type="date" {...register('tanggal_pelaksanaan')} />

      <label>Harga</label>
      <input type="number" {...register('harga_pelatihan', { valueAsNumber: true })} />

      <label>Deskripsi</label>
      <textarea {...register('deskripsi')} />

      <button type="submit">Simpan</button>
    </form>
  );
}
