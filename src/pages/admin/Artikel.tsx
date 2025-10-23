import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import ArtikelForm from '@/components/forms/ArtikelForm';
import { Plus, Edit, Trash2 } from 'lucide-react';

type Artikel = {
  id?: number;
  judul: string;
  kategori: string;
  isi: string;
  penulis?: string;
  gambar_url?: string;
  created_at?: string;
};

export default function Artikel() {
  const [artikels, setArtikels] = useState<Artikel[]>([]);
  const [selected, setSelected] = useState<Artikel | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchArtikels = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('artikels')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching articles:', error);
    else setArtikels(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchArtikels();
  }, []);

  const handleSave = async (formData: Artikel) => {
    let res;
    if (selected) {
      res = await supabase.from('artikels').update(formData).eq('id', selected.id);
    } else {
      res = await supabase.from('artikels').insert([formData]);
    }

    if (res.error) {
      alert('Gagal menyimpan artikel');
      console.error(res.error);
    } else {
      fetchArtikels();
      setShowForm(false);
      setSelected(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin hapus artikel ini?')) return;
    const { error } = await supabase.from('artikels').delete().eq('id', id);
    if (error) alert('Gagal menghapus');
    else fetchArtikels();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Manajemen Artikel</h1>
        <button
          onClick={() => { setShowForm(true); setSelected(null); }}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <Plus size={18} /> Tambah Artikel
        </button>
      </div>

      {showForm ? (
        <ArtikelForm
          defaultValues={selected || {}}
          onSubmit={handleSave}
          onCancel={() => { setShowForm(false); setSelected(null); }}
        />
      ) : loading ? (
        <div>Memuat data...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">Judul</th>
                <th className="p-3">Kategori</th>
                <th className="p-3">Penulis</th>
                <th className="p-3">Gambar</th>
                <th className="p-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {artikels.map((a) => (
                <tr key={a.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{a.judul}</td>
                  <td className="p-3">{a.kategori}</td>
                  <td className="p-3">{a.penulis || '-'}</td>
                  <td className="p-3">
                    {a.gambar_url ? (
                      <img
                        src={a.gambar_url}
                        alt={a.judul}
                        className="w-16 h-12 object-cover rounded"
                      />
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => { setSelected(a); setShowForm(true); }}
                      className="p-2 bg-yellow-400 rounded hover:bg-yellow-500"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(a.id!)}
                      className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}

              {artikels.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center p-4 text-gray-500">
                    Belum ada artikel
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
