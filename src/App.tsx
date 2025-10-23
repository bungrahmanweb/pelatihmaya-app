import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Public Pages
import Index from "@/pages/Index";
import Pelatihan from "@/pages/Pelatihan";
import PelatihanDetail from "@/pages/PelatihanDetail";
import Pendaftaran from "@/pages/Pendaftaran";
import TentangKami from "@/pages/TentangKami";
import Kontak from "@/pages/Kontak";
import Auth from "@/pages/Auth";

// Admin Pages
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminPelatihan from "@/pages/admin/Pelatihan";
import AdminPeserta from "@/pages/admin/Peserta";
import AdminPembayaran from "@/pages/admin/Pembayaran";
import AdminPengeluaran from "@/pages/admin/Pengeluaran";
import AdminKaryawan from "@/pages/admin/Karyawan";
import AdminLaporan from "@/pages/admin/Laporan";
import AdminUsers from "@/pages/admin/Users";

import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/pelatihan" element={<Pelatihan />} />
          <Route path="/pelatihan/:id" element={<PelatihanDetail />} />
          <Route path="/pendaftaran" element={<Pendaftaran />} />
          <Route path="/pendaftaran/:pelatihanId" element={<Pendaftaran />} />
          <Route path="/tentang" element={<TentangKami />} />
          <Route path="/kontak" element={<Kontak />} />
          <Route path="/auth" element={<Auth />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/pelatihan" element={<AdminPelatihan />} />
          <Route path="/admin/peserta" element={<AdminPeserta />} />
          <Route path="/admin/pembayaran" element={<AdminPembayaran />} />
          <Route path="/admin/pengeluaran" element={<AdminPengeluaran />} />
          <Route path="/admin/karyawan" element={<AdminKaryawan />} />
          <Route path="/admin/laporan" element={<AdminLaporan />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
