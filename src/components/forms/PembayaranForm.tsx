import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

interface PembayaranFormProps {
  defaultValues: {
    peserta_id: string;
    tanggal_pembayaran: string;
    jumlah?: number;
    keterangan?: string;
  };
  maxPembayaran: number;
  onSubmit: (data: any) => Promise<{ id: string }>;
  onCancel: () => void;
}

export default function PembayaranForm({ defaultValues, maxPembayaran, onSubmit, onCancel }: PembayaranFormProps) {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ 
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(async (data) => {
      const result = await onSubmit(data);
      navigate(`/pembayaran/${result.id}/invoice`);
    })} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tanggal Pembayaran
        </label>
        <input
          type="date"
          {...register('tanggal_pembayaran', { required: 'Tanggal pembayaran wajib diisi' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
        {errors.tanggal_pembayaran && (
          <p className="mt-1 text-sm text-red-600">{errors.tanggal_pembayaran.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Jumlah Pembayaran
          <span className="text-gray-500 text-xs ml-1">
            (Maks: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(maxPembayaran)})
          </span>
        </label>
        <input
          type="number"
          {...register('jumlah', { 
            required: 'Jumlah pembayaran wajib diisi',
            valueAsNumber: true,
            min: {
              value: 1,
              message: 'Jumlah pembayaran harus lebih dari 0'
            },
            max: {
              value: maxPembayaran,
              message: `Jumlah pembayaran tidak boleh melebihi ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(maxPembayaran)}`
            }
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
        {errors.jumlah && (
          <p className="mt-1 text-sm text-red-600">{errors.jumlah.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Keterangan
        </label>
        <textarea
          {...register('keterangan')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Contoh: Pembayaran pertama, Pelunasan, dll."
        />
      </div>

      <div className="pt-4 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Menyimpan...' : 'Simpan Pembayaran'}
        </button>
      </div>
    </form>
  );
}
