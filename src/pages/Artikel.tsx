import { Link } from "react-router-dom";
import { useArtikelList } from "@/hooks/useArtikel";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function Artikel() {
  const { data: artikelList, isLoading } = useArtikelList();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin w-6 h-6" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PublicNav />

      <main className="flex-grow max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-center">Artikel</h1>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {artikelList?.map((artikel) => (
            <Card key={artikel.id} className="hover:shadow-lg transition-all">
              <img
                src={artikel.gambar_url}
                alt={artikel.judul}
                className="w-full h-40 object-cover rounded-t-xl"
              />
              <CardHeader>
                <CardTitle className="line-clamp-2">{artikel.judul}</CardTitle>
              </CardHeader>
              <CardContent>
                <Link
                  to={`/artikel/${artikel.slug}`}
                  className="text-primary font-semibold"
                >
                  Baca Selengkapnya →
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
