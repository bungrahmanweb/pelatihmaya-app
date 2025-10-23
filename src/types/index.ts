// Pelatihan Types
export interface Pelatihan {
  id: string;
  nama_pelatihan: string;
  kategori_pelatihan: string;
  batch_pelatihan: string;
  tanggal_pelaksanaan: string;
  harga_pelatihan: number;
  created_at?: string;
  updated_at?: string;
}

// Peserta Types
export interface Peserta {
  id: string;
  nama: string;
  email: string | null;
  telepon: string | null;
  alamat: string;
  nik: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  pelatihan_id: string;
  ukuran_jaket: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL';
  total_pembayaran?: number;
  created_at?: string;
  updated_at?: string;
  pelatihan?: {
    id: string;
    nama_pelatihan: string;
    batch_pelatihan: string;
    harga_pelatihan: number;
  };
  pembayaran?: Array<{
    jumlah: number;
    tanggal_pembayaran: string;
  }>;
}

// Pembayaran Types
export interface Pembayaran {
  id: string;
  peserta_id: string;
  jumlah: number;
  tanggal_pembayaran: string;
  bukti_pembayaran?: string;
  status_pembayaran: 'pending' | 'confirmed' | 'rejected';
  created_at?: string;
  updated_at?: string;
}

// Pengeluaran Types
export interface Pengeluaran {
  id: string;
  kategori_pengeluaran: string;
  jumlah: number;
  keterangan?: string;
  tanggal_pengeluaran: string;
  created_at?: string;
  updated_at?: string;
}

// Karyawan Types
export interface Karyawan {
  id: string;
  nik: string;
  nama: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  alamat: string;
  tanggal_masuk: string;
  tanggal_keluar?: string;
  status: 'aktif' | 'tidak_aktif';
  created_at?: string;
  updated_at?: string;
}

// Report Types
export interface PelatihanSummary {
  id: string;
  nama_pelatihan: string;
  jumlah_peserta: number;
  total_pendapatan: number;
  tanggal_pelaksanaan: string;
}

export interface MonthlyReport {
  month: string;
  total_pendapatan: number;
  total_pengeluaran: number;
  total_peserta: number;
}