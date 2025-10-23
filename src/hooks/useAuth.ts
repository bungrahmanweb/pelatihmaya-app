import { useQuery } from '@tanstack/react-query';
import { getProfile, getUserRoles } from '@/integrations/supabase/authService';
import { supabase } from '@/integrations/supabase/client';

export function useProfile() {
  return useQuery(['profile'], async () => {
    const { data: userData } = await supabase.auth.getUser();
    const u = userData.user;
    if (!u) return null;
    const profile = await getProfile(u.id);
    return profile;
  });
}

export function useRoles() {
  return useQuery(['roles'], async () => {
    const { data: userData } = await supabase.auth.getUser();
    const u = userData.user;
    if (!u) return [];
    return await getUserRoles(u.id);
  });
}
