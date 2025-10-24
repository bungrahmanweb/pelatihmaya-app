import React, { useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { usePeserta } from '@/hooks/usePeserta';
import { usePelatihan } from '@/hooks/usePelatihan';

interface PembayaranInvoiceProps {
  pembayaran: {
    id?: string;
    peserta_id?: string;
    jumlah?: number;
    tanggal_pembayaran?: string;
    keterangan?: string;
    // For summary view
    peserta?: any;
    pelatihan?: any;
    total_pembayaran?: number;
    sisa_pembayaran?: number;
  };
  showControls?: boolean;
}

export default function PembayaranInvoice({ pembayaran, showControls }: PembayaranInvoiceProps) {
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);
  const { data: fetchedPeserta } = usePeserta(pembayaran.peserta_id);
  const { data: fetchedPelatihan } = usePelatihan(fetchedPeserta?.pelatihan_id);

  const peserta = pembayaran.peserta || fetchedPeserta;
  const pelatihan = pembayaran.pelatihan || fetchedPelatihan;
  const isDetailView = !!pembayaran.id;

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('autoPrint') === '1') {
      const timer = setTimeout(() => {
        window.print();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto">
        {/* Print Controls - hidden when printing */}
        {showControls !== false && (
          <div className="mb-6 print:hidden flex justify-between items-center">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Kembali
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Print Invoice
            </button>
          </div>
        )}

        {/* Invoice Content */}
        <div ref={printRef} className="bg-white shadow-lg rounded-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">BUKTI PEMBAYARAN</h1>
            <p className="text-gray-600">Sigma Training Center</p>
          </div>

            {/* Invoice Details */}
            <div className="mb-8">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">No. Invoice:</p>
                  <p className="font-medium">
                    {isDetailView 
                      ? `INV-${pembayaran.id?.slice(0, 8).toUpperCase()}` 
                      : 'REKAP PEMBAYARAN'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gray-600">Tanggal:</p>
                  <p className="font-medium">
                    {isDetailView 
                      ? format(new Date(pembayaran.tanggal_pembayaran || new Date()), 'dd MMMM yyyy', { locale: id })
                      : format(new Date(), 'dd MMMM yyyy', { locale: id })}
                  </p>
                </div>
              </div>
            </div>

          {/* Peserta Details */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Informasi Peserta</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Nama:</p>
                <p className="font-medium">{peserta?.nama}</p>
              </div>
              <div>
                <p className="text-gray-600">NIK:</p>
                <p className="font-medium">{peserta?.nik}</p>
              </div>
            </div>
          </div>

          {/* Pelatihan Details */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Detail Pelatihan</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Nama Pelatihan:</p>
                <p className="font-medium">{pelatihan?.nama_pelatihan}</p>
              </div>
              <div>
                <p className="text-gray-600">Batch:</p>
                <p className="font-medium">{pelatihan?.batch_pelatihan}</p>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Detail Pembayaran</h2>
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deskripsi</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Jumlah</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isDetailView ? (
                    <tr>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {pembayaran.keterangan || 'Pembayaran Pelatihan'}
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-gray-900">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' })
                          .format(pembayaran.jumlah || 0)}
                      </td>
                    </tr>
                  ) : (
                    <>
                      <tr>
                        <td className="px-6 py-4 text-sm text-gray-900">Total Biaya Pelatihan</td>
                        <td className="px-6 py-4 text-right text-sm text-gray-900">
                          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' })
                            .format(pelatihan?.harga_pelatihan || 0)}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm text-gray-900">Total Sudah Dibayar</td>
                        <td className="px-6 py-4 text-right text-sm text-gray-900 text-green-600">
                          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' })
                            .format(pembayaran.total_pembayaran || 0)}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm text-gray-900">Sisa Pembayaran</td>
                        <td className="px-6 py-4 text-right text-sm text-gray-900 text-red-600">
                          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' })
                            .format(pembayaran.sisa_pembayaran || 0)}
                        </td>
                      </tr>
                    </>
                  )}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td className="px-6 py-3 text-sm font-semibold text-gray-900">
                      {isDetailView ? 'Total Pembayaran' : 'Status'}
                    </td>
                    <td className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                      {isDetailView ? (
                        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' })
                          .format(pembayaran.jumlah || 0)
                      ) : (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          (pembayaran.sisa_pembayaran || 0) <= 0 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {(pembayaran.sisa_pembayaran || 0) <= 0 ? 'Lunas' : 'Belum Lunas'}
                        </span>
                      )}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 text-center text-gray-600">
            <p>Terima kasih atas pembayaran Anda.</p>
            <p className="text-sm mt-2">Ini adalah bukti pembayaran yang sah.</p>
          </div>
        </div>
      </div>
    </div>
  );
}