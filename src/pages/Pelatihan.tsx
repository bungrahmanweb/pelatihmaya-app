import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, DollarSign, Search, Users } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function Pelatihan() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedKategori, setSelectedKategori] = useState<string>("all");

  const { data: pelatihan, isLoading } = useQuery({
    queryKey: ["pelatihan-public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pelatihan")
        .select("*")
        .order("tanggal_pelaksanaan", { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const filteredPelatihan = pelatihan?.filter((p) => {
    const matchesSearch = p.nama_pelatihan.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesKategori = selectedKategori === "all" || p.kategori_pelatihan === selectedKategori;
    return matchesSearch && matchesKategori;
  });

  const categories = [...new Set(pelatihan?.map((p) => p.kategori_pelatihan) || [])];

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />
      
      <div className="container mx-auto px-4 py-12 flex-1">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Program Pelatihan</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Temukan program pelatihan yang sesuai dengan kebutuhan pengembangan kompetensi Anda.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Cari pelatihan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedKategori} onValueChange={setSelectedKategori}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih Kategori" />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              <SelectItem value="all">Semua Kategori</SelectItem>
              {categories.map((kategori) => (
                <SelectItem key={kategori} value={kategori}>
                  {kategori}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Pelatihan Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Memuat data...</p>
          </div>
        ) : filteredPelatihan && filteredPelatihan.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPelatihan.map((item) => (
              <Card key={item.id} className="shadow-card hover:shadow-elegant transition-all duration-300 flex flex-col">
                {item.gambar_url && (
                  <div className="aspect-video overflow-hidden rounded-t-lg">
                    <img
                      src={item.gambar_url}
                      alt={item.nama_pelatihan}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader className="flex-1">
                  <div className="mb-2">
                    <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                      {item.kategori_pelatihan}
                    </span>
                  </div>
                  <CardTitle className="text-xl">{item.nama_pelatihan}</CardTitle>
                  <CardDescription className="line-clamp-2">{item.deskripsi}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {format(new Date(item.tanggal_pelaksanaan), "dd MMMM yyyy", { locale: id })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>Batch: {item.batch_pelatihan}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                    <DollarSign className="w-4 h-4" />
                    <span>Rp {item.harga_pelatihan.toLocaleString("id-ID")}</span>
                  </div>
                  <Link to={`/pendaftaran/${item.id}`} className="block">
                    <Button className="w-full mt-2">Daftar Sekarang</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Tidak ada pelatihan yang ditemukan.</p>
          </div>
        )}
      </div>

      <PublicFooter />
    </div>
  );
}
