import React, { useRef, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useStorage } from '@/hooks/useStorage';
import { supabase } from '@/integrations/supabase/client';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

type FormValues = {
  judul: string;
  slug: string;
  kategori: string;
  tanggal: string;
  konten: string;
  gambar_url?: string;
};

export default function ArtikelForm({ defaultValues, onSubmit, onCancel }: any) {
  const { register, handleSubmit, setValue, watch, reset } = useForm<FormValues>({ defaultValues });
  const { uploadImage, deleteImage } = useStorage();
  const [isUploading, setIsUploading] = useState(false);
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentImage = watch('gambar_url');
  const judul = watch('judul');

  // Reset form ketika defaultValues berubah
  useEffect(() => {
    if (defaultValues) reset(defaultValues);
  }, [defaultValues, reset]);

  // Generate slug unik otomatis
  useEffect(() => {
    const generateUniqueSlug = async (base: string) => {
      setIsCheckingSlug(true);
      let slugBase = base
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '');

      let slug = slugBase;
      let counter = 1;

      while (true) {
        const { data, error } = await supabase
          .from('artikel')
          .select('id')
          .eq('slug', slug)
          .maybeSingle();

        if (error) {
          console.error('Error checking slug:', error);
          break;
        }

        if (!data) break; // slug unik → langsung pakai
        slug = `${slugBase}-${counter++}`; // slug sudah ada → tambahkan angka
      }

      setValue('slug', slug);
      setIsCheckingSlug(false);
    };

    if (judul) {
      generateUniqueSlug(judul);
    }
  }, [judul, setValue]);

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

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'blockquote',
    'list', 'bullet',
    'link', 'image',
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input type="hidden" {...register('gambar_url')} />
      <input type="hidden" {...register('konten')} />
      <input type="hidden" {...register('slug')} />

      <label>Judul Artikel</label>
      <input
        className="w-full p-2 border rounded"
        {...register('judul', { required: true })}
        placeholder="Masukkan judul artikel"
      />
      {isCheckingSlug && <p className="text-sm text-blue-500">Mengecek slug unik...</p>}

      <label>Kategori</label>
      <input
        className="w-full p-2 border rounded"
        {...register('kategori', { required: true })}
        placeholder="Contoh: Tips, Teknologi, Umum"
      />

      <label>Tanggal</label>
      <input
        type="date"
        className="w-full p-2 border rounded"
        {...register('tanggal', { required: true })}
      />

      <label className="block mt-3 font-medium">Isi Artikel</label>
      <div className="bg-white border rounded">
        <ReactQuill
          theme="snow"
          modules={modules}
          formats={formats}
          value={watch('konten') || ''}
          onChange={(val) => setValue('konten', val)}
          placeholder="Tulis isi artikel di sini..."
          style={{ minHeight: '200px' }}
        />
      </div>

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
        <button type="button" className="px-3 py-2 bg-gray-200 rounded" onClick={onCancel}>
          Batal
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
          disabled={isUploading || isCheckingSlug}
        >
          {isUploading ? 'Mengunggah...' : 'Simpan'}
        </button>
      </div>
    </form>
  );
}
