import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import PublicNav from '@/components/PublicNav';
import PublicFooter from '@/components/PublicFooter';

export default function ArtikelDetail() {
  const { slug } = useParams<{ slug: string }>();

  const { data: artikel, isLoading, error } = useQuery({
    queryKey: ['artikel', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('artikel')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  if (isLoading) return <div className="text-center py-10">Memuat artikel...</div>;
  if (error) return <div className="text-center text-red-500">Gagal memuat artikel</div>;
  if (!artikel) return <div className="text-center py-10">Artikel tidak ditemukan</div>;

  return (
    <>
      <PublicNav />
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-800">{artikel.judul}</h1>
          <p className="text-sm text-gray-500">
            {new Date(artikel.tanggal).toLocaleDateString('id-ID', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}{" "}
            • {artikel.kategori}
          </p>
        </div>

        {artikel.gambar_url && (
          <img
            src={artikel.gambar_url}
            alt={artikel.judul}
            className="w-full max-h-[450px] object-cover rounded-xl shadow"
          />
        )}

        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: artikel.konten }}
        />

        <div className="pt-6 border-t">
          <Link
            to="/artikel"
            className="inline-flex items-center text-blue-600 hover:underline"
          >
            ← Kembali ke Daftar Artikel
          </Link>
        </div>
      </div>
      <PublicFooter />
    </>
  );
}
