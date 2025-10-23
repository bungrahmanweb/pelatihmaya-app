import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (!session) {
        navigate('/auth');
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (!session) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-card border-r border-border">
          <div className="p-4">
            <h2 className="text-lg font-bold">Admin Panel</h2>
          </div>
          <nav className="space-y-1 p-2">
            <a
              href="/admin"
              className="flex items-center px-4 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground"
            >
              Dashboard
            </a>
            <a
              href="/admin/pelatihan"
              className="flex items-center px-4 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground"
            >
              Pelatihan
            </a>
            <a
              href="/admin/peserta"
              className="flex items-center px-4 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground"
            >
              Peserta
            </a>
            <a
              href="/admin/pembayaran"
              className="flex items-center px-4 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground"
            >
              Pembayaran
            </a>
            <a
              href="/admin/pengeluaran"
              className="flex items-center px-4 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground"
            >
              Pengeluaran
            </a>
            <a
              href="/admin/karyawan"
              className="flex items-center px-4 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground"
            >
              Karyawan
            </a>
            <a
              href="/admin/laporan"
              className="flex items-center px-4 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground"
            >
              Laporan
            </a>
            <button
              onClick={() => supabase.auth.signOut()}
              className="flex w-full items-center px-4 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground text-destructive"
            >
              Logout
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}