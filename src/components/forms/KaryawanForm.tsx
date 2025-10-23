import React from 'react';
import { useForm } from 'react-hook-form';

type Props = {
  defaultValues?: any;
  onSubmit: (data: any) => Promise<void> | void;
  onCancel?: () => void;
};

export default function KaryawanForm({ defaultValues, onSubmit, onCancel }: Props) {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({ defaultValues });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">NIK</label>
        <input {...register('nik')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Nama</label>
        <input {...register('nama')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Tempat Lahir</label>
          <input {...register('tempat_lahir')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Tanggal Lahir</label>
          <input type="date" {...register('tanggal_lahir')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Alamat</label>
        <input {...register('alamat')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Kontrak Awal</label>
          <input type="date" {...register('kontrak_awal')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Kontrak Akhir</label>
          <input type="date" {...register('kontrak_akhir')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">BPJS TK</label>
          <input {...register('bpjs_tk')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">BPJS Kesehatan</label>
          <input {...register('bpjs_kesehatan')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
        </div>
      </div>
      <div className="pt-4 flex justify-end space-x-3">
        {onCancel && <button type="button" onClick={onCancel} className="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md text-sm text-gray-700 bg-white">Batal</button>}
        <button type="submit" disabled={isSubmitting} className="inline-flex justify-center py-2 px-4 bg-blue-600 text-white rounded-md">{isSubmitting ? 'Menyimpan...' : 'Simpan'}</button>
      </div>
    </form>
  );
}
