import React from 'react';
import { useForm } from 'react-hook-form';

type Props = {
  defaultValues?: any;
  onSubmit: (data: any) => Promise<void> | void;
  onCancel?: () => void;
};

export default function PengeluaranForm({ defaultValues, onSubmit, onCancel }: Props) {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({ defaultValues });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Tanggal</label>
        <input type="date" {...register('tanggal_pengeluaran')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Kategori</label>
        <input {...register('kategori_pengeluaran')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Keterangan</label>
        <input {...register('keterangan')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Jumlah</label>
        <input type="number" {...register('jumlah')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
      </div>
      <div className="pt-4 flex justify-end space-x-3">
        {onCancel && <button type="button" onClick={onCancel} className="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md text-sm text-gray-700 bg-white">Batal</button>}
        <button type="submit" disabled={isSubmitting} className="inline-flex justify-center py-2 px-4 bg-blue-600 text-white rounded-md">{isSubmitting ? 'Menyimpan...' : 'Simpan'}</button>
      </div>
    </form>
  );
}
