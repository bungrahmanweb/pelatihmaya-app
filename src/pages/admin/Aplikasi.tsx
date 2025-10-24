import React from "react";
import AplikasiForm from "@/components/forms/AplikasiForm";

export default function AdminAplikasi() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">⚙️ Manajemen Aplikasi</h1>
      <AplikasiForm />
    </div>
  );
}
