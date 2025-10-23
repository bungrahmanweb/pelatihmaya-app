import { useEffect, useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { LayoutDashboard, GraduationCap, Users, CreditCard, DollarSign, Briefcase, FileText, LogOut } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Current session:', session);
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
      console.log('Auth state changed:', event, session);
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
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground ${
                  isActive ? 'bg-accent text-accent-foreground' : ''
                }`
              }
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </NavLink>
            <NavLink
              to="/admin/pelatihan"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground ${
                  isActive ? 'bg-accent text-accent-foreground' : ''
                }`
              }
            >
              <GraduationCap className="w-4 h-4" />
              Pelatihan
            </NavLink>
            <NavLink
              to="/admin/peserta"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground ${
                  isActive ? 'bg-accent text-accent-foreground' : ''
                }`
              }
            >
              <Users className="w-4 h-4" />
              Peserta
            </NavLink>
            <NavLink
              to="/admin/pembayaran"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground ${
                  isActive ? 'bg-accent text-accent-foreground' : ''
                }`
              }
            >
              <CreditCard className="w-4 h-4" />
              Pembayaran
            </NavLink>
            <NavLink
              to="/admin/pengeluaran"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground ${
                  isActive ? 'bg-accent text-accent-foreground' : ''
                }`
              }
            >
              <DollarSign className="w-4 h-4" />
              Pengeluaran
            </NavLink>
            <NavLink
              to="/admin/karyawan"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground ${
                  isActive ? 'bg-accent text-accent-foreground' : ''
                }`
              }
            >
              <Briefcase className="w-4 h-4" />
              Karyawan
            </NavLink>
            <NavLink
              to="/admin/laporan"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground ${
                  isActive ? 'bg-accent text-accent-foreground' : ''
                }`
              }
            >
              <FileText className="w-4 h-4" />
              Laporan
            </NavLink>
            <button
              onClick={() => supabase.auth.signOut()}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground text-destructive"
            >
              <LogOut className="w-4 h-4" />
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