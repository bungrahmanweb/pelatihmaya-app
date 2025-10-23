-- 001_init_enums_tables.sql
-- Create enums and core tables for pelatihan app

-- Enums
CREATE TYPE IF NOT EXISTS ukuran_jaket_enum AS ENUM ('XS','S','M','L','XL','XXL','XXXL');
CREATE TYPE IF NOT EXISTS role_enum AS ENUM ('admin','kasir','akuntan','owner');

-- Pelatihan
CREATE TABLE IF NOT EXISTS public.pelatihan (
  id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  nama_pelatihan text NOT NULL,
  kategori_pelatihan text NOT NULL,
  batch_pelatihan text NOT NULL,
  tanggal_pelaksanaan date NOT NULL,
  harga_pelatihan numeric(12,2) NOT NULL DEFAULT 0,
  gambar_url text,
  deskripsi text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Peserta
CREATE TABLE IF NOT EXISTS public.peserta (
  id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  pelatihan_id uuid NOT NULL REFERENCES public.pelatihan(id) ON DELETE CASCADE,
  nik text NOT NULL,
  nama text NOT NULL,
  tempat_lahir text NOT NULL,
  tanggal_lahir date NOT NULL,
  alamat text NOT NULL,
  ukuran_jaket ukuran_jaket_enum NOT NULL,
  email text,
  telepon text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Pembayaran
CREATE TABLE IF NOT EXISTS public.pembayaran (
  id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  peserta_id uuid NOT NULL REFERENCES public.peserta(id) ON DELETE CASCADE,
  tanggal_pembayaran timestamptz DEFAULT now(),
  jumlah numeric(12,2) NOT NULL,
  keterangan text,
  created_at timestamptz DEFAULT now()
);

-- Pengeluaran
CREATE TABLE IF NOT EXISTS public.pengeluaran (
  id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  tanggal_pengeluaran date NOT NULL,
  kategori_pengeluaran text NOT NULL,
  keterangan text,
  jumlah numeric(12,2) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Karyawan
CREATE TABLE IF NOT EXISTS public.karyawan (
  id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  nik text NOT NULL UNIQUE,
  nama text NOT NULL,
  tempat_lahir text NOT NULL,
  tanggal_lahir date NOT NULL,
  alamat text NOT NULL,
  kontrak_awal date NOT NULL,
  kontrak_akhir date NOT NULL,
  bpjs_tk text,
  bpjs_kesehatan text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Profiles & user_roles (Supabase Auth integration)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id),
  nama text NOT NULL,
  email text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role role_enum NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_peserta_pelatihan ON public.peserta(pelatihan_id);
CREATE INDEX IF NOT EXISTS idx_pembayaran_peserta ON public.pembayaran(peserta_id);
CREATE INDEX IF NOT EXISTS idx_pelatihan_kategori_batch ON public.pelatihan(kategori_pelatihan, batch_pelatihan);
