import React from "react";
import AplikasiForm from "@/components/forms/AplikasiForm";

export default function AdminAplikasi() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">⚙️ Manajemen Aplikasi</h1>
      <p className="text-gray-600 mb-6">
        Atur informasi website, perusahaan, sertifikat, dan integrasi di sini.
      </p>
      <AplikasiForm />
    </div>
  );
}
