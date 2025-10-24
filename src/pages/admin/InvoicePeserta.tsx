import React, { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { usePeserta } from '@/hooks/usePeserta';
import { usePelatihan } from '@/hooks/usePelatihan';
import { usePembayaranByPeserta } from '@/hooks/usePembayaran';

export default function InvoicePesertaPage() {
  const { pesertaId } = useParams();
  const { data: peserta } = usePeserta(pesertaId as string);
  const { data: pembayaran } = usePembayaranByPeserta(pesertaId as string);
  const { data: pelatihan } = usePelatihan(peserta?.pelatihan_id);

  // Render print-friendly summary similar to the hidden print block
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const autoPrint = params.get('autoPrint');

  useEffect(() => {
    if (autoPrint) {
      const t = setTimeout(() => window.print(), 500);
      return () => clearTimeout(t);
    }
  }, [autoPrint]);
  return (
    <div>
      <div className="p-4 print:hidden flex justify-end">
        <button onClick={() => window.print()} className="px-3 py-2 bg-red-600 text-white rounded">Download PDF</button>
      </div>
      <div className="min-h-screen bg-white p-8">
        <h2 style={{ fontWeight: 700, fontSize: 22, marginBottom: 16 }}>INVOICE PEMBAYARAN</h2>
      <div style={{ marginBottom: 12 }}>
        <strong>Nama Peserta:</strong> {peserta?.nama}<br />
        <strong>NIK:</strong> {peserta?.nik}<br />
        <strong>Nama Pelatihan:</strong> {pelatihan?.nama_pelatihan}<br />
        <strong>Kategori Pelatihan:</strong> {pelatihan?.kategori_pelatihan}<br />
      </div>
      <div style={{ marginBottom: 12 }}>
        <strong>Total Biaya Pelatihan:</strong> {pelatihan ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(pelatihan.harga_pelatihan) : '-'}<br />
        <strong>Total Sudah Dibayar:</strong> {pembayaran ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(pembayaran.reduce((s:any, p:any) => s + p.jumlah, 0)) : '-'}<br />
        <strong>Sisa Pembayaran:</strong> {pelatihan ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format((pelatihan.harga_pelatihan || 0) - (pembayaran ? pembayaran.reduce((s:any, p:any) => s + p.jumlah, 0) : 0)) : '-'}<br />
      </div>
      <div style={{ marginTop: 24, fontSize: 12, color: '#888' }}>
        Dicetak pada: {new Date().toLocaleString('id-ID')}
      </div>
    </div>
  </div>
  );
}
