import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, Users, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function PelatihanDetail() {
  const { id: pelatihanId } = useParams();

  const { data: pelatihan, isLoading } = useQuery({
    queryKey: ["pelatihan", pelatihanId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pelatihan")
        .select("*")
        .eq("id", pelatihanId)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />
      
      <div className="container mx-auto px-4 py-12 flex-1">
        <Link to="/pelatihan">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 w-4 h-4" />
            Kembali ke Daftar Pelatihan
          </Button>
        </Link>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Memuat data...</p>
          </div>
        ) : pelatihan ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {pelatihan.gambar_url && (
                <div className="aspect-video overflow-hidden rounded-lg shadow-elegant">
                  <img
                    src={pelatihan.gambar_url}
                    alt={pelatihan.nama_pelatihan}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div>
                <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full mb-4">
                  {pelatihan.kategori_pelatihan}
                </span>
                <h1 className="text-4xl font-bold mb-4">{pelatihan.nama_pelatihan}</h1>
                <p className="text-lg text-muted-foreground">{pelatihan.deskripsi}</p>
              </div>
            </div>

            <div>
              <div className="sticky top-24 bg-card p-6 rounded-lg shadow-elegant space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Tanggal Pelaksanaan</p>
                      <p className="font-semibold">
                        {format(new Date(pelatihan.tanggal_pelaksanaan), "dd MMMM yyyy", { locale: id })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Batch</p>
                      <p className="font-semibold">{pelatihan.batch_pelatihan}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Harga</p>
                      <p className="font-semibold text-primary text-xl">
                        Rp {pelatihan.harga_pelatihan.toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                </div>

                <Link to={`/pendaftaran/${pelatihan.id}`} className="block">
                  <Button className="w-full" size="lg">
                    Daftar Sekarang
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Pelatihan tidak ditemukan.</p>
          </div>
        )}
      </div>

      <PublicFooter />
    </div>
  );
}
