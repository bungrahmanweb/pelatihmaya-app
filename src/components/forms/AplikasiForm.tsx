import React, { useRef, useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useStorage } from "@/hooks/useStorage";
import { useAplikasi } from "@/hooks/useAplikasi";
import { toast } from "sonner";

type FormValues = {
  nama_website: string;
  tagline: string;
  logo_url: string;
  favicon_url: string;
  nama_perusahaan: string;
  layanan: string[];
  facebook: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  whatsapp: string;
  sertifikat_bg_url: string;
  webhook_starsender: string;
  api_key_starsender: string;
  smtp_host: string;
  smtp_port: number;
  smtp_username: string;
  smtp_password: string;
  smtp_from_email: string;
};

export default function AplikasiForm({ onCancel }: { onCancel?: () => void }) {
  const { data, loading, saving, save } = useAplikasi();
  const { uploadImage, deleteImage } = useStorage();
  const [isUploading, setIsUploading] = useState(false);

  const { register, handleSubmit, control, setValue, reset, watch } =
    useForm<FormValues>({
      defaultValues: data || {},
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "layanan",
  });

  const logoRef = useRef<HTMLInputElement>(null);
  const faviconRef = useRef<HTMLInputElement>(null);
  const sertifikatRef = useRef<HTMLInputElement>(null);

  const logo = watch("logo_url");
  const favicon = watch("favicon_url");
  const sertifikat = watch("sertifikat_bg_url");

  // 🔄 Reset form saat data dari hook selesai dimuat
  useEffect(() => {
    if (data) {
      reset({
        ...data,
        layanan: Array.isArray(data.layanan)
          ? data.layanan
          : data.layanan
          ? JSON.parse(data.layanan)
          : [],
      });
    }
  }, [data, reset]);

  // 🟢 Upload file handler
  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof FormValues
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const url = await uploadImage(file, `aplikasi/${file.name}`);
      const current = watch(field);
      if (current) await deleteImage(current);
      setValue(field, url);
      toast.success("File berhasil diunggah");
    } catch (err) {
      console.error(err);
      toast.error("Gagal upload file");
    } finally {
      setIsUploading(false);
    }
  };

  // 🟢 Hapus file
  const handleRemoveFile = async (field: keyof FormValues) => {
    const current = watch(field);
    if (!current) return;
    try {
      await deleteImage(current);
      setValue(field, "");
      toast.success("File dihapus");
    } catch (err) {
      console.error(err);
      toast.error("Gagal menghapus file");
    }
  };

  // 🟢 Submit handler
  const onSubmit = async (formData: FormValues) => {
    await save({
      ...formData,
      layanan: JSON.stringify(formData.layanan || []),
    });
  };

  if (loading) return <div>Memuat data aplikasi...</div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* 🌐 WEBSITE */}
      <section className="border rounded-lg p-5">
        <h2 className="text-xl font-semibold mb-3">🌐 Manajemen Website</h2>
        <label>Nama Website</label>
        <input className="w-full border p-2 rounded" {...register("nama_website")} />

        <label className="block mt-3">Tagline</label>
        <input className="w-full border p-2 rounded" {...register("tagline")} />

        {/* Logo */}
        <div className="mt-3">
          <label>Logo Website</label>
          {logo && (
            <div className="relative mt-2 w-32">
              <img src={logo} alt="Logo" className="rounded shadow" />
              <button
                type="button"
                onClick={() => handleRemoveFile("logo_url")}
                className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded"
              >
                ✕
              </button>
            </div>
          )}
          <input
            ref={logoRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleUpload(e, "logo_url")}
            className="w-full mt-2"
          />
        </div>

        {/* Favicon */}
        <div className="mt-3">
          <label>Favicon</label>
          {favicon && (
            <div className="relative mt-2 w-16">
              <img src={favicon} alt="Favicon" className="rounded shadow" />
              <button
                type="button"
                onClick={() => handleRemoveFile("favicon_url")}
                className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded"
              >
                ✕
              </button>
            </div>
          )}
          <input
            ref={faviconRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleUpload(e, "favicon_url")}
            className="w-full mt-2"
          />
        </div>
      </section>

      {/* 🏢 PERUSAHAAN */}
      <section className="border rounded-lg p-5">
        <h2 className="text-xl font-semibold mb-3">🏢 Manajemen Perusahaan</h2>

        <label>Nama Perusahaan</label>
        <input className="w-full border p-2 rounded" {...register("nama_perusahaan")} />

        <div className="mt-4">
          <label>Layanan</label>
          <div className="space-y-2 mt-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <input
                  className="flex-1 border p-2 rounded"
                  {...register(`layanan.${index}` as const)}
                />
                <button
                  type="button"
                  className="px-3 py-1 bg-red-500 text-white rounded"
                  onClick={() => remove(index)}
                >
                  Hapus
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => append("")}
              className="px-3 py-1 bg-blue-500 text-white rounded"
            >
              + Tambah Layanan
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <input placeholder="Facebook" className="border p-2 rounded" {...register("facebook")} />
          <input placeholder="Instagram" className="border p-2 rounded" {...register("instagram")} />
          <input placeholder="LinkedIn" className="border p-2 rounded" {...register("linkedin")} />
          <input placeholder="YouTube" className="border p-2 rounded" {...register("youtube")} />
          <input placeholder="WhatsApp" className="border p-2 rounded" {...register("whatsapp")} />
        </div>
      </section>

      {/* 📜 BACKGROUND SERTIFIKAT */}
      <section className="border rounded-lg p-5">
        <h2 className="text-xl font-semibold mb-3">📜 Background Sertifikat</h2>
        {sertifikat && (
          <div className="relative mt-2 w-64">
            <img src={sertifikat} className="rounded shadow" alt="Sertifikat" />
            <button
              type="button"
              onClick={() => handleRemoveFile("sertifikat_bg_url")}
              className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded"
            >
              ✕
            </button>
          </div>
        )}
        <input
          ref={sertifikatRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleUpload(e, "sertifikat_bg_url")}
          className="w-full mt-2"
        />
      </section>

      {/* 🔗 INTEGRASI */}
      <section className="border rounded-lg p-5">
        <h2 className="text-xl font-semibold mb-3">🔗 Integrasi WhatsApp & Email</h2>

        <label>Webhook Starsender</label>
        <input className="w-full border p-2 rounded" {...register("webhook_starsender")} />

        <label className="mt-3">API Key Starsender</label>
        <input className="w-full border p-2 rounded" {...register("api_key_starsender")} />

        <h3 className="mt-4 font-medium">SMTP Email</h3>
        <input placeholder="Host" className="w-full border p-2 rounded" {...register("smtp_host")} />
        <input
          placeholder="Port"
          type="number"
          className="w-full border p-2 rounded"
          {...register("smtp_port", { valueAsNumber: true })}
        />
        <input placeholder="Username" className="w-full border p-2 rounded" {...register("smtp_username")} />
        <input placeholder="Password" type="password" className="w-full border p-2 rounded" {...register("smtp_password")} />
        <input placeholder="From Email" className="w-full border p-2 rounded" {...register("smtp_from_email")} />
      </section>

      {/* 🧩 BUTTONS */}
      <div className="flex justify-end gap-2 mt-6">
        {onCancel && (
          <button
            type="button"
            className="px-4 py-2 bg-gray-200 rounded"
            onClick={onCancel}
          >
            Batal
          </button>
        )}
        <button
          type="submit"
          disabled={saving || isUploading}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {saving || isUploading ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </form>
  );
}
