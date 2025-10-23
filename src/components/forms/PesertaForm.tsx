import React from 'react';
import { useForm } from 'react-hook-form';
import { Peserta } from '@/types';

const ukuranOptions = ['XS','S','M','L','XL','XXL','XXXL'];

type PesertaFormProps = {
  defaultValues?: Partial<Peserta>;
  onSubmit: (data: Partial<Peserta>) => Promise<void>;
  onCancel?: () => void;
};

export default function PesertaForm({ defaultValues, onSubmit, onCancel }: PesertaFormProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ 
    defaultValues 
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">NIK</label>
        <input
          type="text"
          {...register('nik', { 
            required: 'NIK wajib diisi',
            pattern: {
              value: /^\d{16}$/,
              message: 'NIK harus 16 digit angka'
            }
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
        {errors.nik && (
          <p className="mt-1 text-sm text-red-600">{errors.nik.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Nama</label>
        <input
          type="text"
          {...register('nama', { required: 'Nama wajib diisi' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
        {errors.nama && (
          <p className="mt-1 text-sm text-red-600">{errors.nama.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Tempat Lahir</label>
          <input
            type="text"
            {...register('tempat_lahir', { required: 'Tempat lahir wajib diisi' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          {errors.tempat_lahir && (
            <p className="mt-1 text-sm text-red-600">{errors.tempat_lahir.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Tanggal Lahir</label>
          <input
            type="date"
            {...register('tanggal_lahir', { required: 'Tanggal lahir wajib diisi' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          {errors.tanggal_lahir && (
            <p className="mt-1 text-sm text-red-600">{errors.tanggal_lahir.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Alamat</label>
        <textarea
          {...register('alamat', { required: 'Alamat wajib diisi' })}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
        {errors.alamat && (
          <p className="mt-1 text-sm text-red-600">{errors.alamat.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Ukuran Jaket</label>
        <select
          {...register('ukuran_jaket', { required: 'Ukuran jaket wajib dipilih' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="">Pilih ukuran</option>
          {ukuranOptions.map(o => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        {errors.ukuran_jaket && (
          <p className="mt-1 text-sm text-red-600">{errors.ukuran_jaket.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          {...register('email', { 
            required: 'Email wajib diisi',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Email tidak valid'
            }
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Telepon</label>
        <input
          type="tel"
          {...register('telepon', { 
            required: 'Nomor telepon wajib diisi',
            pattern: {
              value: /^[0-9]{10,13}$/,
              message: 'Nomor telepon tidak valid'
            }
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
        {errors.telepon && (
          <p className="mt-1 text-sm text-red-600">{errors.telepon.message}</p>
        )}
      </div>

      <div className="pt-4 flex justify-end space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Batal
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Menyimpan...' : 'Simpan'}
        </button>
      </div>
    </form>
  );
}
