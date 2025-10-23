import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useStorage } from '@/hooks/useStorage';

type FormValues = {
  judul: string;
  kategori: string;
  isi: string;
  penulis?: string;
  gambar_url?: string;
};

export default function ArtikelForm({ defaultValues, onSubmit, onCancel }: any) {
  const { register, handleSubmit, setValue, watch, reset } = useForm<FormValues>({ defaultValues });
  const { uploadImage, deleteImage } = useStorage('media', 'artikel'); // ✅ folder: media/artikel/
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentImage = watch('gambar_url');

  useEffect(() => {
    if (defaultValues) reset(defaultValues);
  }, [defaultValues, reset]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      if (currentImage) await deleteImage(currentImage);
      const url = await uploadImage(file);
      setValue('gambar_url', url);
    } catch (err) {
      console.error(err);
      alert('Gagal mengunggah gambar');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!currentImage) return;
    try {
      await deleteImage(currentImage);
      setValue('gambar_url', '');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 bg-white p-4 rounded-lg shadow">
      <input type="hidden" {...register('gambar_url')} />

      <label>Judul Artikel</label>
      <input className="w-full p-2 border rounded" {...register('judul', { required: true })} />

      <label>Kategori</label>
      <input className="w-full p-2 border rounded" {...register('kategori')} />

      <label>Isi Artikel</label>
      <textarea
        className="w-full p-2 border rounded min-h-[120px]"
        {...register('isi', { required: true })}
      />

      <label>Penulis</label>
      <input className="w-full p-2 border rounded" {...register('penulis')} />

      <label className="block mt-3">Gambar Artikel</label>
      <div className="space-y-2">
        {currentImage && (
          <div className="relative w-40 h-28 bg-gray-100 rounded overflow-hidden">
            <img src={currentImage} alt="Preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              ✕
            </button>
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="w-full"
          disabled={isUploading}
        />
        {isUploading && <div className="text-sm text-blue-600">Mengunggah gambar...</div>}
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button type="button" onClick={onCancel} className="px-3 py-2 bg-gray-200 rounded">
          Batal
        </button>
        <button
          type="submit"
          disabled={isUploading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {isUploading ? 'Menyimpan...' : 'Simpan'}
        </button>
      </div>
    </form>
  );
}
