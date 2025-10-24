import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import { GraduationCap, Globe, Users, Star } from "lucide-react";
import { useArtikelList } from "@/hooks/useArtikel";
import { usePelatihanList } from "@/hooks/usePelatihan";

export default function Index() {
  const { data: artikels, isLoading: loadingArtikel } = useArtikelList();
  const { data: pelatihans, isLoading: loadingPelatihan } = usePelatihanList();

  // 🔥 Filter hanya pelatihan dengan status "AKAN_DATANG"
  const pelatihanAkanDatang = pelatihans?.filter(
    (p) => p.status === "AKAN_DATANG"
  ) || [];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicNav />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-700 to-blue-500 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-30"></div>
        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
            Sigma Energi Indonesia
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-6 italic">
            Serving People Professionally
          </p>
          <p className="text-md md:text-lg max-w-2xl mx-auto text-blue-100 mb-8">
            Adalah Perusahaan K3 yang menyediakan Pelatihan, Pembinaan, dan Sertifikasi 
            dari Kementerian Ketenagakerjaan RI serta BNSP.
          </p>
          <Button asChild size="lg" variant="secondary" className="font-semibold">
            <Link to="/pelatihan">Lihat Pelatihan</Link>
          </Button>
        </div>
      </section>

      {/* Statistik Section */}
      <section className="bg-white -mt-10 z-10 relative">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 px-6 py-10">
          {[
            { icon: <Users className="w-8 h-8 text-blue-700" />, label: "Alumni", value: "4000+" },
            { icon: <Globe className="w-8 h-8 text-blue-700" />, label: "Jenis Pelatihan", value: "50+" },
            { icon: <GraduationCap className="w-8 h-8 text-blue-700" />, label: "Batch", value: "60+" },
            { icon: <Star className="w-8 h-8 text-yellow-500" />, label: "Pelayanan", value: "Terbaik" },
          ].map((item, i) => (
            <Card
              key={i}
              className="text-center py-6 shadow-md hover:shadow-lg transition-shadow duration-300 rounded-2xl"
            >
              <CardContent className="flex flex-col items-center justify-center space-y-2">
                {item.icon}
                <h3 className="text-2xl font-bold text-gray-800">{item.value}</h3>
                <p className="text-gray-600 text-sm">{item.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Pelatihan Bulan Ini */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">
            Pelatihan Bulan Ini
          </h2>
          <p className="text-center text-gray-500 mb-8">
            Segera amankan seat-mu sekarang juga!
          </p>

          {loadingPelatihan ? (
            <p className="text-center text-gray-500">Memuat data pelatihan...</p>
          ) : pelatihanAkanDatang.length > 0 ? (
            <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
              {pelatihanAkanDatang.slice(0, 6).map((p) => (
                <Card
                  key={p.id}
                  className="min-w-[280px] md:min-w-[320px] hover:shadow-xl transition-all rounded-xl bg-white"
                >
                  {p.gambar_url && (
                    <img
                      src={p.gambar_url}
                      alt={p.nama_pelatihan}
                      className="w-full h-48 object-cover rounded-t-xl"
                    />
                  )}
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold line-clamp-2">
                      {p.nama_pelatihan}
                    </CardTitle>
                    <CardDescription>
                      Batch {p.batch_pelatihan} • {p.tanggal_pelaksanaan}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p
                      className="text-sm text-gray-600 line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: p.deskripsi || "" }}
                    />
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-blue-700 font-semibold">
                        Rp {Number(p.harga_pelatihan).toLocaleString("id-ID")}
                      </span>
                      <Link
                        to={`/pelatihan/${p.slug}`}
                        className="text-sm text-white bg-blue-600 px-3 py-1.5 rounded hover:bg-blue-700"
                      >
                        Detail
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">Belum ada pelatihan akan datang.</p>
          )}
        </div>
      </section>

      {/* Artikel Terbaru */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">
            Artikel Terbaru
          </h2>

          {loadingArtikel ? (
            <p className="text-center text-gray-500">Memuat artikel...</p>
          ) : artikels && artikels.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {artikels.slice(0, 6).map((a) => (
                <Card
                  key={a.id}
                  className="hover:shadow-lg transition-shadow duration-300 rounded-xl"
                >
                  {a.gambar_url && (
                    <img
                      src={a.gambar_url}
                      alt={a.judul}
                      className="w-full h-48 object-cover rounded-t-xl"
                    />
                  )}
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold line-clamp-2">
                      {a.judul}
                    </CardTitle>
                    <CardDescription>
                      {new Date(a.created_at).toLocaleDateString("id-ID")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p
                      className="text-sm text-gray-600 line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: a.konten || "" }}
                    />
                    <div className="mt-4 flex justify-end">
                      <Link
                        to={`/artikel/${a.slug}`}
                        className="text-sm text-white bg-blue-600 px-3 py-1.5 rounded hover:bg-blue-700"
                      >
                        Baca
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">Belum ada artikel tersedia.</p>
          )}
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
