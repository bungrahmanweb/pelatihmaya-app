import React, { useRef, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useStorage } from '@/hooks/useStorage';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

type FormValues = {
  nama_pelatihan: string;
  slug: string;
  kategori_pelatihan: string;
  batch_pelatihan: string;
  tanggal_pelaksanaan: string;
  harga_pelatihan: number;
  deskripsi?: string;
  status?: 'SELESAI' | 'AKAN_DATANG';
  sertifikat?: 'Kemnaker-RI' | 'BNSP' | 'Lokal';
  gambar_url?: string;
};

export default function PelatihanForm({ defaultValues, onSubmit, onCancel }: any) {
  const { register, handleSubmit, setValue, watch, reset } = useForm<FormValues>({
    defaultValues,
  });
  const { uploadImage, deleteImage } = useStorage();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentImage = watch('gambar_url');
  const namaPelatihan = watch('nama_pelatihan');

  // Reset form jika ada defaultValues
  useEffect(() => {
    if (defaultValues) reset(defaultValues);
  }, [defaultValues, reset]);

  // Generate slug otomatis dari nama_pelatihan
  useEffect(() => {
    if (namaPelatihan) {
      const slug = namaPelatihan
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '');
      setValue('slug', slug);
    }
  }, [namaPelatihan, setValue]);

  // Auto-resize editor
  useEffect(() => {
    const editor = document.querySelector('.ql-editor');
    if (!editor) return;

    const resizeEditor = () => {
      editor.style.height = 'auto';
      editor.style.height = editor.scrollHeight + 'px';
    };

    editor.addEventListener('input', resizeEditor);
    return () => editor.removeEventListener('input', resizeEditor);
  }, []);

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

  // ReactQuill toolbar
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  const quillFormats = [
    'header', 'bold', 'italic', 'underline', 'blockquote',
    'list', 'bullet', 'link', 'image'
  ];

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data))}
      className="space-y-4"
    >
      {/* Hidden fields */}
      <input type="hidden" {...register('gambar_url')} />
      <input type="hidden" {...register('slug')} />

      <label>Nama Pelatihan</label>
      <input
        className="w-full p-2 border rounded"
        {...register('nama_pelatihan', { required: true })}
      />

      <label>Kategori</label>
      <input
        className="w-full p-2 border rounded"
        {...register('kategori_pelatihan', { required: true })}
      />

      <label>Batch</label>
      <input
        className="w-full p-2 border rounded"
        {...register('batch_pelatihan', { required: true })}
      />

      <label>Tanggal Pelaksanaan</label>
      <input
        className="w-full p-2 border rounded"
        type="date"
        {...register('tanggal_pelaksanaan', { required: true })}
      />

      <label>Harga Pelatihan</label>
      <input
        className="w-full p-2 border rounded"
        type="number"
        {...register('harga_pelatihan', { valueAsNumber: true })}
      />

      <label className="block mt-3 font-medium">Deskripsi</label>
      <div className="bg-white border rounded" style={{ resize: 'vertical', overflow: 'auto' }}>
        <ReactQuill
          theme="snow"
          modules={quillModules}
          formats={quillFormats}
          value={watch('deskripsi') || ''}
          onChange={(val) => setValue('deskripsi', val)}
          style={{ minHeight: '200px' }}
        />
      </div>

      <label className="mt-3 block">Gambar Pelatihan</label>
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

      <label className="mt-3">Status</label>
      <select className="w-full p-2 border rounded" {...register('status')}>
        <option value="AKAN_DATANG">Akan Datang</option>
        <option value="SELESAI">Selesai</option>
      </select>

      <label className="mt-3">Sertifikat</label>
      <select className="w-full p-2 border rounded" {...register('sertifikat', { required: true })}>
        <option value="Kemnaker-RI">Kemnaker-RI</option>
        <option value="BNSP">BNSP</option>
        <option value="Lokal">Lokal</option>
      </select>

      <div className="mt-4 flex justify-end gap-2">
        <button type="button" className="px-3 py-2 bg-gray-200 rounded" onClick={onCancel}>
          Batal
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
          disabled={isUploading}
        >
          {isUploading ? 'Mengunggah...' : 'Simpan'}
        </button>
      </div>
    </form>
  );
}
