import React from 'react';
import { exportToExcel } from '@/utils/exportExcel';

export default function ExportButton({ data, fileName }: any) {
  return (
    <button onClick={() => exportToExcel(data, fileName)}>Export Excel</button>
  );
}
