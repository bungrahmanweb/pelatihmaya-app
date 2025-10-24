export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      karyawan: {
        Row: {
          alamat: string
          bpjs_kesehatan: string | null
          bpjs_tk: string | null
          created_at: string | null
          id: string
          kontrak_akhir: string
          kontrak_awal: string
          nama: string
          nik: string
          tanggal_lahir: string
          tempat_lahir: string
          updated_at: string | null
        }
        Insert: {
          alamat: string
          bpjs_kesehatan?: string | null
          bpjs_tk?: string | null
          created_at?: string | null
          id?: string
          kontrak_akhir: string
          kontrak_awal: string
          nama: string
          nik: string
          tanggal_lahir: string
          tempat_lahir: string
          updated_at?: string | null
        }
        Update: {
          alamat?: string
          bpjs_kesehatan?: string | null
          bpjs_tk?: string | null
          created_at?: string | null
          id?: string
          kontrak_akhir?: string
          kontrak_awal?: string
          nama?: string
          nik?: string
          tanggal_lahir?: string
          tempat_lahir?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      pelatihan: {
        Row: {
          batch_pelatihan: string
          created_at: string | null
          deskripsi: string | null
          gambar_url: string | null
          harga_pelatihan: number
          id: string
          kategori_pelatihan: string
          nama_pelatihan: string
          tanggal_pelaksanaan: string
          updated_at: string | null
        }
        Insert: {
          batch_pelatihan: string
          created_at?: string | null
          deskripsi?: string | null
          gambar_url?: string | null
          harga_pelatihan?: number
          id?: string
          kategori_pelatihan: string
          nama_pelatihan: string
          tanggal_pelaksanaan: string
          updated_at?: string | null
        }
        Update: {
          batch_pelatihan?: string
          created_at?: string | null
          deskripsi?: string | null
          gambar_url?: string | null
          harga_pelatihan?: number
          id?: string
          kategori_pelatihan?: string
          nama_pelatihan?: string
          tanggal_pelaksanaan?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      artikel: {
        Row: {
          id: string
          judul: string
          kategori: string
          tanggal: string
          isi: string
          gambar_url: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          judul: string
          kategori: string
          tanggal: string
          isi: string
          gambar_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          judul?: string
          kategori?: string
          tanggal?: string
          isi?: string
          gambar_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }

      pembayaran: {
        Row: {
          created_at: string | null
          id: string
          jumlah: number
          keterangan: string | null
          peserta_id: string
          tanggal_pembayaran: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          jumlah: number
          keterangan?: string | null
          peserta_id: string
          tanggal_pembayaran?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          jumlah?: number
          keterangan?: string | null
          peserta_id?: string
          tanggal_pembayaran?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pembayaran_peserta_id_fkey"
            columns: ["peserta_id"]
            isOneToOne: false
            referencedRelation: "peserta"
            referencedColumns: ["id"]
          },
        ]
      }
      pengeluaran: {
        Row: {
          created_at: string | null
          id: string
          jumlah: number
          kategori_pengeluaran: string
          keterangan: string | null
          tanggal_pengeluaran: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          jumlah: number
          kategori_pengeluaran: string
          keterangan?: string | null
          tanggal_pengeluaran: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          jumlah?: number
          kategori_pengeluaran?: string
          keterangan?: string | null
          tanggal_pengeluaran?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      peserta: {
        Row: {
          alamat: string
          created_at: string | null
          email: string | null
          id: string
          nama: string
          nik: string
          pelatihan_id: string
          tanggal_lahir: string
          telepon: string | null
          tempat_lahir: string
          ukuran_jaket: Database["public"]["Enums"]["ukuran_jaket"]
          updated_at: string | null
        }
        Insert: {
          alamat: string
          created_at?: string | null
          email?: string | null
          id?: string
          nama: string
          nik: string
          pelatihan_id: string
          tanggal_lahir: string
          telepon?: string | null
          tempat_lahir: string
          ukuran_jaket: Database["public"]["Enums"]["ukuran_jaket"]
          updated_at?: string | null
        }
        Update: {
          alamat?: string
          created_at?: string | null
          email?: string | null
          id?: string
          nama?: string
          nik?: string
          pelatihan_id?: string
          tanggal_lahir?: string
          telepon?: string | null
          tempat_lahir?: string
          ukuran_jaket?: Database["public"]["Enums"]["ukuran_jaket"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "peserta_pelatihan_id_fkey"
            columns: ["pelatihan_id"]
            isOneToOne: false
            referencedRelation: "pelatihan"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          nama: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id: string
          nama: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          nama?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "kasir" | "akuntan" | "owner"
      ukuran_jaket: "XS" | "S" | "M" | "L" | "XL" | "XXL" | "XXXL"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export type Artikel = Tables<'artikel'>


export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "kasir", "akuntan", "owner"],
      ukuran_jaket: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
    },
  },
} as const
