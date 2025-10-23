import { useState } from 'react';

export function useInvoiceData() {
  const [invoiceData, setInvoiceData] = useState<any>(null);
  return { invoiceData, setInvoiceData };
}