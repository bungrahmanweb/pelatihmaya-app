import React, { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import PembayaranInvoice from '@/components/invoice/PembayaranInvoice';
import { usePembayaranById } from '@/hooks/usePembayaranById';

export default function InvoicePembayaranPage() {
  const { id } = useParams();
  const { data: pembayaran, isLoading } = usePembayaranById(id as string);

  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const autoPrint = params.get('autoPrint');

  useEffect(() => {
    if (autoPrint) {
      const t = setTimeout(() => window.print(), 500);
      return () => clearTimeout(t);
    }
  }, [autoPrint]);

  if (isLoading || !pembayaran) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div>
      <div className="p-4 print:hidden flex justify-end">
        <button onClick={() => window.print()} className="px-3 py-2 bg-blue-600 text-white rounded">Download PDF</button>
      </div>
      <PembayaranInvoice pembayaran={pembayaran} />
    </div>
  );
}
