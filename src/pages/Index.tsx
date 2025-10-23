import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import { GraduationCap, Users, Award, TrendingUp, ArrowRight } from "lucide-react";

export default function Index() {
  const features = [
    {
      icon: GraduationCap,
      title: "Pelatihan Berkualitas",
      description: "Program pelatihan terstruktur dengan instruktur berpengalaman dan bersertifikat.",
    },
    {
      icon: Users,
      title: "Komunitas Profesional",
      description: "Bergabung dengan ribuan profesional yang telah meningkatkan kompetensi mereka.",
    },
    {
      icon: Award,
      title: "Sertifikat Resmi",
      description: "Dapatkan sertifikat resmi yang diakui industri setelah menyelesaikan pelatihan.",
    },
    {
      icon: TrendingUp,
      title: "Karir Meningkat",
      description: "Tingkatkan peluang karir dan kembangkan keterampilan yang dibutuhkan pasar.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />
      
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
              Bergabunglah dengan program pelatihan berkualitas yang dirancang untuk meningkatkan keterampilan dan kompetensi profesional Anda.
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

      <PublicFooter />
    </div>
  );
}
