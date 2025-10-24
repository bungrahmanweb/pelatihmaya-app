import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, Users, ArrowLeft, Award } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function PelatihanDetail() {
  const { id: slug } = useParams(); // URL pakai slug (misal: /pelatihan/scaffolding)

  const { data: pelatihan, isLoading } = useQuery({
    queryKey: ["pelatihan", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pelatihan")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PublicNav />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-red-700 to-red-500 text-white py-16 mb-10">
        <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-30"></div>
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-3">
            {isLoading ? "Memuat..." : pelatihan?.nama_pelatihan}
          </h1>
          <p className="text-red-100 text-sm md:text-base">
            Sigma Energi Indonesia – Sertifikasi {pelatihan?.sertifikat || "-"}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16 flex-1">
        <Link to="/pelatihan">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="mr-2 w-4 h-4" />
            Kembali ke Daftar Pelatihan
          </Button>
        </Link>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Memuat data pelatihan...</p>
          </div>
        ) : pelatihan ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Gambar */}
              {pelatihan.gambar_url && (
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src={pelatihan.gambar_url}
                    alt={pelatihan.nama_pelatihan}
                    className="w-full h-[400px] object-cover"
                  />
                </div>
              )}

              {/* Deskripsi */}
              <div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                    {pelatihan.kategori_pelatihan}
                  </span>
                  {pelatihan.status && (
                    <span
                      className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                        pelatihan.status === "AKAN_DATANG"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {pelatihan.status.replace("_", " ")}
                    </span>
                  )}
                </div>

                <h2 className="text-3xl font-bold mb-3 text-gray-800">
                  {pelatihan.nama_pelatihan}
                </h2>

                <div
                  className="prose max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ __html: pelatihan.deskripsi || "" }}
                />
              </div>
            </div>

            {/* Sidebar Info */}
            <aside>
              <div className="sticky top-28 bg-white rounded-2xl shadow-lg p-6 space-y-5 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                  Informasi Pelatihan
                </h3>

                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="text-gray-500">Tanggal Pelaksanaan</p>
                      <p className="font-semibold text-gray-800">
                        {pelatihan.tanggal_pelaksanaan
                          ? format(new Date(pelatihan.tanggal_pelaksanaan), "dd MMMM yyyy", { locale: id })
                          : "-"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="text-gray-500">Batch</p>
                      <p className="font-semibold text-gray-800">
                        {pelatihan.batch_pelatihan || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="text-gray-500">Sertifikasi</p>
                      <p className="font-semibold text-gray-800">
                        {pelatihan.sertifikat || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <DollarSign className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="text-gray-500">Biaya Pelatihan</p>
                      <p className="font-semibold text-red-700 text-xl">
                        Rp {Number(pelatihan.harga_pelatihan).toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                </div>

                <Link to={`/pendaftaran/${pelatihan.slug}`} className="block mt-6">
                  <Button className="w-full text-lg font-semibold">
                    Daftar Sekarang
                  </Button>
                </Link>
              </div>
            </aside>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Pelatihan tidak ditemukan.</p>
          </div>
        )}
      </div>

      <PublicFooter />
    </div>
  );
}
