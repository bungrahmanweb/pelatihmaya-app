import React from 'react';

export default function StatusBadge({ children }: any) {
  const label = String(children || '').toUpperCase();
  const base = 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold';
  const cls = label === 'SELESAI' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  return <span className={`${base} ${cls}`}>{label === 'AKAN_DATANG' ? 'Akan Datang' : 'Selesai'}</span>;
}
