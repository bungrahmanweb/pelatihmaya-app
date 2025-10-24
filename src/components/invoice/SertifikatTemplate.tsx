import React from 'react';

export default function SertifikatTemplate({ peserta, pelatihan }: any) {
  if (!peserta || !pelatihan) return null;

  return (
    <div className="flex justify-center items-center bg-gray-100 p-4">
      <div
        className="relative bg-white border-[12px] border-yellow-500 p-12 text-center font-serif shadow-lg"
        style={{
          width: '297mm',
          height: '210mm', // A4 size
          boxSizing: 'border-box',
        }}
      >
        <h1 className="text-4xl font-bold mb-6">SERTIFIKAT PELATIHAN</h1>

        <p className="text-lg mb-4">Diberikan kepada:</p>
        <h2 className="text-3xl font-semibold mb-4">{peserta.nama}</h2>

        <p className="mb-2 text-gray-700">NIK: {peserta.nik}</p>
        <p className="text-lg mb-6">Atas partisipasinya dalam pelatihan:</p>

        <h3 className="text-2xl font-semibold text-red-700 mb-2">
          {pelatihan.nama_pelatihan}
        </h3>
        <p className="text-gray-700 mb-8">Batch {pelatihan.batch_pelatihan}</p>

        <p className="text-sm text-gray-500">
          Tanggal: {new Date(pelatihan.tanggal_pelaksanaan).toLocaleDateString('id-ID')}
        </p>

        <div className="absolute bottom-16 left-0 right-0 flex justify-between px-20">
          <div>
            <p className="font-semibold">Instruktur</p>
            <div className="border-t border-gray-400 w-40 mx-auto mt-8"></div>
          </div>
          <div>
            <p className="font-semibold">Penyelenggara</p>
            <div className="border-t border-gray-400 w-40 mx-auto mt-8"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
