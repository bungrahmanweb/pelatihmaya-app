import React, { useRef, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useStorage } from '@/hooks/useStorage';

type FormValues = {
  judul: string;
  kategori: string;
  tanggal: string;
  konten: string;
  gambar_url?: string;
};


export default function ArtikelForm({ defaultValues, onSubmit, onCancel }: any) {
  const { register, handleSubmit, setValue, watch, reset } = useForm<FormValues>({ defaultValues });
  const { uploadImage, deleteImage } = useStorage();
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
    } catch (error) {
      console.error('Error uploading image:', error);
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
    } catch (error) {
      console.error('Error removing image:', error);
      alert('Gagal menghapus gambar');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="hidden" {...register('gambar_url')} />

      <label>Judul Artikel</label>
      <input className="w-full p-2 border rounded" {...register('judul')} />

      <label>Kategori</label>
      <input className="w-full p-2 border rounded" {...register('kategori')} />

      <label>Tanggal</label>
      <input type="date" className="w-full p-2 border rounded" {...register('tanggal')} />

      <label>Isi Artikel</label>
      <textarea className="w-full p-2 border rounded min-h-[120px]" {...register('konten')} />

      <label className="mt-3 block">Gambar Artikel</label>
      <div className="mt-2 space-y-2">
        {currentImage && (
          <div className="relative w-40 h-28 bg-gray-100 rounded-lg overflow-hidden">
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

      <div className="mt-4 flex justify-end gap-2">
        <button type="button" className="px-3 py-2 bg-gray-200 rounded" onClick={onCancel}>Batal</button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={isUploading}>
          {isUploading ? 'Mengunggah...' : 'Simpan'}
        </button>
      </div>
    </form>
  );
}
