import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Target, Users, Zap } from "lucide-react";

export default function TentangKami() {
  const values = [
    {
      icon: Target,
      title: "Visi",
      description:
        "Menjadi lembaga pelatihan terpercaya yang menghasilkan tenaga profesional berkualitas tinggi.",
    },
    {
      icon: Zap,
      title: "Misi",
      description:
        "Memberikan pelatihan berkualitas dengan metode pembelajaran yang inovatif dan aplikatif.",
    },
    {
      icon: Users,
      title: "Komitmen",
      description:
        "Berkomitmen untuk terus meningkatkan kualitas pelatihan dan kepuasan peserta.",
    },
    {
      icon: Award,
      title: "Kualitas",
      description:
        "Menjaga standar kualitas tinggi dalam setiap program pelatihan yang kami selenggarakan.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />
      
      <div className="container mx-auto px-4 py-12 flex-1">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Tentang Kami</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Mengenal lebih dekat lembaga pelatihan yang berkomitmen untuk pengembangan kompetensi profesional.
          </p>
        </div>

        {/* About Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="shadow-elegant">
            <CardContent className="p-8 md:p-12">
              <h2 className="text-2xl font-bold mb-4">Profil Lembaga</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Kami adalah lembaga pelatihan profesional yang berdedikasi untuk meningkatkan kompetensi dan keterampilan individu maupun organisasi. Dengan pengalaman lebih dari 10 tahun, kami telah membantu ribuan peserta mencapai tujuan karir mereka.
                </p>
                <p>
                  Program pelatihan kami dirancang oleh para ahli di bidangnya masing-masing, dengan kurikulum yang selalu diperbarui mengikuti perkembangan industri. Kami menggunakan metode pembelajaran yang interaktif dan praktis, memastikan peserta mendapatkan keterampilan yang langsung dapat diterapkan.
                </p>
                <p>
                  Fasilitas pelatihan kami dilengkapi dengan teknologi modern dan instruktur berpengalaman yang siap membimbing Anda menuju kesuksesan. Setiap peserta yang menyelesaikan program akan mendapatkan sertifikat resmi yang diakui oleh industri.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Values */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-8">Visi, Misi & Nilai Kami</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="shadow-card hover:shadow-elegant transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mb-4">
                    <value.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <PublicFooter />
    </div>
  );
}
