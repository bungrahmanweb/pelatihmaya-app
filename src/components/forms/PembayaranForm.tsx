import React from 'react';
import { useForm } from 'react-hook-form';

export default function PembayaranForm({ defaultValues, onSubmit }: any) {
  const { register, handleSubmit } = useForm({ defaultValues });
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>Jumlah</label>
      <input type="number" {...register('jumlah', { valueAsNumber: true })} />

      <label>Keterangan</label>
      <input {...register('keterangan')} />

      <button type="submit">Simpan Pembayaran</button>
    </form>
  );
}
