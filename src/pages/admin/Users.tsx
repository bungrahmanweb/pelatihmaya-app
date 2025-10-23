import React, { useEffect, useState } from 'react';
import { getUserRoles } from '@/integrations/supabase/authService';

export default function AdminUsers() {
  // For demo, userId can be hardcoded or fetched from Supabase
  const userId = '';
  const [roles, setRoles] = useState<any[]>([]);
  useEffect(() => {
    if (userId) getUserRoles(userId).then(setRoles);
  }, [userId]);
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Manajemen Pengguna</h1>
      <div>User ID: {userId}</div>
      <div>Roles:</div>
      <ul>
        {roles.map((r: any) => <li key={r.id}>{r.role}</li>)}
      </ul>
    </div>
  );
}