import { supabase } from "./client";

export type Aplikasi = {
  id: string;
  nama_website: string;
  tagline: string;
  logo_url: string;
  favicon_url: string;
  nama_perusahaan: string;
  layanan: string; // ubah ke string[] kalau kolomnya array
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
  updated_at?: string;
};

// ✅ Ambil satu data aplikasi (paling baru)
export async function getAplikasi() {
  const { data, error } = await supabase
    .from("aplikasi")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1)
    .single();

  if (error) throw error;
  return data as Aplikasi;
}

// ✅ Update data aplikasi dan kembalikan hasilnya
export async function updateAplikasi(id: string, values: Partial<Aplikasi>) {
  const { data, error } = await supabase
    .from("aplikasi")
    .update({ ...values, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Aplikasi;
}
