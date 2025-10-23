-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'kasir', 'akuntan', 'owner');

-- Create enum for jacket sizes
CREATE TYPE public.ukuran_jaket AS ENUM ('XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nama TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create user_roles table (CRITICAL: separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Create pelatihan table
CREATE TABLE public.pelatihan (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nama_pelatihan TEXT NOT NULL,
  kategori_pelatihan TEXT NOT NULL,
  batch_pelatihan TEXT NOT NULL,
  tanggal_pelaksanaan DATE NOT NULL,
  harga_pelatihan DECIMAL(15,2) NOT NULL DEFAULT 0,
  gambar_url TEXT,
  deskripsi TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.pelatihan ENABLE ROW LEVEL SECURITY;

-- Public can view pelatihan
CREATE POLICY "Anyone can view pelatihan"
  ON public.pelatihan FOR SELECT
  USING (true);

-- Admin and Kasir can manage pelatihan
CREATE POLICY "Admin can manage pelatihan"
  ON public.pelatihan FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Create peserta table
CREATE TABLE public.peserta (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pelatihan_id UUID REFERENCES public.pelatihan(id) ON DELETE CASCADE NOT NULL,
  nik TEXT NOT NULL,
  nama TEXT NOT NULL,
  tempat_lahir TEXT NOT NULL,
  tanggal_lahir DATE NOT NULL,
  alamat TEXT NOT NULL,
  ukuran_jaket ukuran_jaket NOT NULL,
  email TEXT,
  telepon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.peserta ENABLE ROW LEVEL SECURITY;

-- Admin, Kasir can view and manage peserta
CREATE POLICY "Admin and Kasir can view peserta"
  ON public.peserta FOR SELECT
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'kasir') OR
    public.has_role(auth.uid(), 'akuntan') OR
    public.has_role(auth.uid(), 'owner')
  );

CREATE POLICY "Admin and Kasir can manage peserta"
  ON public.peserta FOR ALL
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'kasir')
  );

-- Create pembayaran table (for payment history)
CREATE TABLE public.pembayaran (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  peserta_id UUID REFERENCES public.peserta(id) ON DELETE CASCADE NOT NULL,
  tanggal_pembayaran TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  jumlah DECIMAL(15,2) NOT NULL,
  keterangan TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.pembayaran ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin, Kasir, Akuntan can view pembayaran"
  ON public.pembayaran FOR SELECT
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'kasir') OR
    public.has_role(auth.uid(), 'akuntan') OR
    public.has_role(auth.uid(), 'owner')
  );

CREATE POLICY "Admin and Kasir can manage pembayaran"
  ON public.pembayaran FOR ALL
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'kasir')
  );

-- Create pengeluaran table
CREATE TABLE public.pengeluaran (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tanggal_pengeluaran DATE NOT NULL,
  kategori_pengeluaran TEXT NOT NULL,
  keterangan TEXT,
  jumlah DECIMAL(15,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.pengeluaran ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin, Akuntan, Owner can view pengeluaran"
  ON public.pengeluaran FOR SELECT
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'akuntan') OR
    public.has_role(auth.uid(), 'owner')
  );

CREATE POLICY "Admin and Akuntan can manage pengeluaran"
  ON public.pengeluaran FOR ALL
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'akuntan')
  );

-- Create karyawan table
CREATE TABLE public.karyawan (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nik TEXT NOT NULL UNIQUE,
  nama TEXT NOT NULL,
  tempat_lahir TEXT NOT NULL,
  tanggal_lahir DATE NOT NULL,
  alamat TEXT NOT NULL,
  kontrak_awal DATE NOT NULL,
  kontrak_akhir DATE NOT NULL,
  bpjs_tk TEXT,
  bpjs_kesehatan TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.karyawan ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can view and manage karyawan"
  ON public.karyawan FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pelatihan_updated_at
  BEFORE UPDATE ON public.pelatihan
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_peserta_updated_at
  BEFORE UPDATE ON public.peserta
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pengeluaran_updated_at
  BEFORE UPDATE ON public.pengeluaran
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_karyawan_updated_at
  BEFORE UPDATE ON public.karyawan
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, nama, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nama', NEW.email),
    NEW.email
  );
  RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();