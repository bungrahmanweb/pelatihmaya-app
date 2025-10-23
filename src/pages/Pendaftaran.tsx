import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";

export default function Pendaftaran() {
  const { pelatihanId } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    pelatihan_id: pelatihanId || "",
    nik: "",
    nama: "",
    tempat_lahir: "",
    tanggal_lahir: undefined as Date | undefined,
    alamat: "",
    ukuran_jaket: "",
    email: "",
    telepon: "",
  });

  const { data: pelatihanList } = useQuery({
    queryKey: ["pelatihan-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pelatihan")
        .select("*")
        .order("tanggal_pelaksanaan", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.pelatihan_id || !formData.nik || !formData.nama || !formData.tempat_lahir || 
        !formData.tanggal_lahir || !formData.alamat || !formData.ukuran_jaket) {
      toast.error("Mohon lengkapi semua field yang wajib diisi");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("peserta").insert([
        {
          ...formData,
          tanggal_lahir: formData.tanggal_lahir?.toISOString().split('T')[0],
          ukuran_jaket: formData.ukuran_jaket as "XS" | "S" | "M" | "L" | "XL" | "XXL" | "XXXL",
        },
      ]);

      if (error) throw error;

      toast.success("Pendaftaran berhasil! Kami akan menghubungi Anda segera.");
      navigate("/pelatihan");
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan saat mendaftar");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />
      
      <div className="container mx-auto px-4 py-12 flex-1">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Formulir Pendaftaran</h1>
            <p className="text-muted-foreground">
              Lengkapi formulir di bawah ini untuk mendaftar pelatihan
            </p>
          </div>

          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle>Data Peserta</CardTitle>
              <CardDescription>
                Pastikan data yang Anda masukkan benar dan lengkap
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pelatihan">Pilih Pelatihan *</Label>
                  <Select
                    value={formData.pelatihan_id}
                    onValueChange={(value) =>
                      setFormData({ ...formData, pelatihan_id: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih pelatihan" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover z-50">
                      {pelatihanList?.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.nama_pelatihan} - Batch {p.batch_pelatihan}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nik">NIK *</Label>
                    <Input
                      id="nik"
                      value={formData.nik}
                      onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                      placeholder="Nomor Induk Kependudukan"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nama">Nama Lengkap *</Label>
                    <Input
                      id="nama"
                      value={formData.nama}
                      onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                      placeholder="Nama lengkap sesuai KTP"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tempat_lahir">Tempat Lahir *</Label>
                    <Input
                      id="tempat_lahir"
                      value={formData.tempat_lahir}
                      onChange={(e) =>
                        setFormData({ ...formData, tempat_lahir: e.target.value })
                      }
                      placeholder="Kota tempat lahir"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Tanggal Lahir *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.tanggal_lahir && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.tanggal_lahir ? (
                            format(formData.tanggal_lahir, "dd MMMM yyyy", { locale: id })
                          ) : (
                            <span>Pilih tanggal</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.tanggal_lahir}
                          onSelect={(date) =>
                            setFormData({ ...formData, tanggal_lahir: date })
                          }
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alamat">Alamat Lengkap *</Label>
                  <Textarea
                    id="alamat"
                    value={formData.alamat}
                    onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                    placeholder="Alamat lengkap sesuai KTP"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ukuran_jaket">Ukuran Jaket *</Label>
                    <Select
                      value={formData.ukuran_jaket}
                      onValueChange={(value) =>
                        setFormData({ ...formData, ukuran_jaket: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih ukuran" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover z-50">
                        {["XS", "S", "M", "L", "XL", "XXL", "XXXL"].map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telepon">No. Telepon</Label>
                    <Input
                      id="telepon"
                      value={formData.telepon}
                      onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                      placeholder="08123456789"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Memproses..." : "Daftar Sekarang"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <PublicFooter />
    </div>
  );
}
