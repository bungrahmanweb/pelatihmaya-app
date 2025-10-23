import React from 'react';
import { useForm } from 'react-hook-form';

const ukuranOptions = ['XS','S','M','L','XL','XXL','XXXL'];

export default function PesertaForm({ defaultValues, onSubmit }: any) {
  const { register, handleSubmit } = useForm({ defaultValues });
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>NIK</label>
      <input {...register('nik')} />

      <label>Nama</label>
      <input {...register('nama')} />

      <label>Tempat Lahir</label>
      <input {...register('tempat_lahir')} />

      <label>Tanggal Lahir</label>
      <input type="date" {...register('tanggal_lahir')} />

      <label>Alamat</label>
      <input {...register('alamat')} />

      <label>Ukuran Jaket</label>
      <select {...register('ukuran_jaket')}>
        {ukuranOptions.map(o => <option key={o} value={o}>{o}</option>)}
      </select>

      <label>Email</label>
      <input {...register('email')} />

      <label>Telepon</label>
      <input {...register('telepon')} />

      <button type="submit">Simpan</button>
    </form>
  );
}
