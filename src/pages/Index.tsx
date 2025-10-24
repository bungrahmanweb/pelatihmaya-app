import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import { GraduationCap, Users, Award, TrendingUp, ArrowRight } from "lucide-react";

// Mock data contoh (nanti diganti pakai data dari database)
const pelatihanList = [
  {
    id: "pel-1",
    judul: "Pelatihan Digital Marketing",
    deskripsi:
      "Pelajari strategi pemasaran digital efektif untuk meningkatkan bisnis Anda.",
    gambar: "https://source.unsplash.com/600x400/?marketing,digital",
  },
  {
    id: "pel-2",
    judul: "Pelatihan Desain Grafis",
    deskripsi:
      "Kuasai teknik desain modern dengan tools profesional seperti Adobe Illustrator.",
    gambar: "https://source.unsplash.com/600x400/?design,graphic",
  },
  {
    id: "pel-3",
    judul: "Pelatihan Manajemen Proyek",
    deskripsi:
      "Bangun kemampuan memimpin tim dan mengelola proyek secara efisien.",
    gambar: "https://source.unsplash.com/600x400/?project,management",
  },
];

const artikelList = [
  {
    id: "art-1",
    judul: "Tips Menyusun CV Profesional",
    kategori: "Karir",
    tanggal: "2025-10-10",
    gambar: "https://source.unsplash.com/600x400/?resume,career",
  },
  {
    id: "art-2",
    judul: "Menguasai Soft Skill dalam Dunia Kerja",
    kategori: "Pengembangan Diri",
    tanggal: "2025-10-15",
    gambar: "https://source.unsplash.com/600x400/?softskills,work",
  },
  {
    id: "art-3",
    judul: "Mengenal Tren Teknologi 2025",
    kategori: "Teknologi",
    tanggal: "2025-10-20",
    gambar: "https://source.unsplash.com/600x400/?technology,future",
  },
];

export default function Index() {
  const features = [
    {
      icon: GraduationCap,
      title: "Pelatihan Berkualitas",
      description:
        "Program pelatihan terstruktur dengan instruktur berpengalaman dan bersertifikat.",
    },
    {
      icon: Users,
      title: "Komunitas Profesional",
      description:
        "Bergabung dengan ribuan profesional yang telah meningkatkan kompetensi mereka.",
    },
    {
      icon: Award,
      title: "Sertifikat Resmi",
      description:
        "Dapatkan sertifikat resmi yang diakui industri setelah menyelesaikan pelatihan.",
    },
    {
      icon: TrendingUp,
      title: "Karir Meningkat",
      description:
        "Tingkatkan peluang karir dan kembangkan keterampilan yang dibutuhkan pasar.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 gradient-subtle opacity-50"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold">
              Tingkatkan Kompetensi dengan{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Pelatihan Profesional
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Bergabunglah dengan program pelatihan berkualitas yang dirancang
              untuk meningkatkan keterampilan dan kompetensi profesional Anda.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/pelatihan">
                <Button size="lg" className="w-full sm:w-auto shadow-elegant">
                  Lihat Pelatihan
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/tentang">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Tentang Kami
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Fitur Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Mengapa Memilih Kami?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Kami berkomitmen memberikan pelatihan terbaik dengan fasilitas lengkap dan instruktur profesional.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-card hover:shadow-elegant transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pelatihan Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">Pelatihan Terbaru</h2>
            <Link to="/pelatihan">
              <Button variant="outline" size="sm">
                Lihat Semua
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pelatihanList.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                <img src={item.gambar} alt={item.judul} className="w-full h-48 object-cover" />
                <CardHeader>
                  <CardTitle>{item.judul}</CardTitle>
                  <CardDescription>{item.deskripsi}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to={`/pelatihan/${item.id}`}>
                    <Button className="w-full mt-3">Lihat Detail →</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Artikel Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">Artikel Terbaru</h2>
            <Link to="/artikel">
              <Button variant="outline" size="sm">
                Lihat Semua
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {artikelList.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                <img src={item.gambar} alt={item.judul} className="w-full h-48 object-cover" />
                <CardHeader>
                  <CardTitle>{item.judul}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    {item.kategori} •{" "}
                    {new Date(item.tanggal).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to={`/artikel/${item.id}`}>
                    <Button variant="ghost" className="w-full">
                      Baca Selengkapnya →
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
