import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getAplikasi, updateAplikasi, Aplikasi } from "@/integrations/supabase/aplikasiService";

export function useAplikasi() {
  const [data, setData] = useState<Aplikasi | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 🔄 Ambil data pertama kali
  useEffect(() => {
    (async () => {
      try {
        const result = await getAplikasi();
        setData(result);
      } catch (err) {
        console.error(err);
        toast.error("Gagal memuat data aplikasi");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 💾 Simpan perubahan
  const save = async (values: Partial<Aplikasi>) => {
    if (!data?.id) return;
    try {
      setSaving(true);
      const updated = await updateAplikasi(data.id, values);
      setData(updated);
      toast.success("✅ Data berhasil disimpan!");
    } catch (err) {
      console.error(err);
      toast.error("❌ Gagal menyimpan perubahan");
    } finally {
      setSaving(false);
    }
  };

  return { data, loading, saving, save };
}
