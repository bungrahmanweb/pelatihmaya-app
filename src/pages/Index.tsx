import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import { GraduationCap, Newspaper } from "lucide-react";
import { useArtikelList } from "@/hooks/useArtikel";
import { usePelatihanList } from "@/hooks/usePelatihan";

export default function Index() {
  const { data: artikels, isLoading: loadingArtikel } = useArtikelList();
  const { data: pelatihans, isLoading: loadingPelatihan } = usePelatihanList();

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Selamat Datang di Sistem Informasi Pelatihan
          </h1>
          <p className="text-lg text-blue-100 mb-6">
            Jelajahi artikel menarik dan pelatihan bersertifikat untuk pengembangan kompetensimu.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link to="/pelatihan">Lihat Pelatihan</Link>
          </Button>
        </div>
      </section>

      {/* Pelatihan Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-2 mb-8">
            <GraduationCap className="text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">Pelatihan Tersedia</h2>
          </div>

          {loadingPelatihan ? (
            <p className="text-gray-500">Memuat data pelatihan...</p>
          ) : pelatihans && pelatihans.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {pelatihans.slice(0, 6).map((p) => (
                <Card key={p.id} className="hover:shadow-lg transition-shadow duration-300">
                  {p.gambar_url && (
                    <img
                      src={p.gambar_url}
                      alt={p.nama_pelatihan}
                      className="w-full h-48 object-cover rounded-t-lg"
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
                        Rp {p.harga_pelatihan.toLocaleString("id-ID")}
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
            <p className="text-gray-500">Belum ada pelatihan tersedia.</p>
          )}
        </div>
      </section>

      {/* Artikel Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-2 mb-8">
            <Newspaper className="text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">Artikel Terbaru</h2>
          </div>

          {loadingArtikel ? (
            <p className="text-gray-500">Memuat artikel...</p>
          ) : artikels && artikels.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {artikels.slice(0, 6).map((a) => (
                <Card key={a.id} className="hover:shadow-lg transition-shadow duration-300">
                  {a.gambar_url && (
                    <img
                      src={a.gambar_url}
                      alt={a.judul}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  )}
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold line-clamp-2">{a.judul}</CardTitle>
                    <CardDescription>{new Date(a.created_at).toLocaleDateString("id-ID")}</CardDescription>
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
            <p className="text-gray-500">Belum ada artikel tersedia.</p>
          )}
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
