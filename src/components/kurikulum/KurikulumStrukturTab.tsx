import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Download,
  Edit2,
  Trash2,
  Copy,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  X
} from 'lucide-react';
import { StrukturKurikulumItem, PaketType, KelompokMapel, User } from '../../types';

interface KurikulumStrukturTabProps {
  strukturList: StrukturKurikulumItem[];
  currentUser: User | null;
  onSaveItem: (item: Omit<StrukturKurikulumItem, 'id'> & { id?: string }) => void;
  onDeleteItem: (id: string) => void;
  onDuplicateItem: (id: string) => void;
  onExportCsv: () => void;
}

export const KurikulumStrukturTab: React.FC<KurikulumStrukturTabProps> = ({
  strukturList,
  currentUser,
  onSaveItem,
  onDeleteItem,
  onDuplicateItem,
  onExportCsv
}) => {
  const isAdmin = currentUser?.role === 'ADMIN';

  // Filters & State
  const [selectedProgram, setSelectedProgram] = useState<PaketType | 'SEMUA'>('SEMUA');
  const [selectedKelompok, setSelectedKelompok] = useState<KelompokMapel | 'SEMUA'>('SEMUA');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StrukturKurikulumItem | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    program: PaketType;
    tingkatan: string;
    fase: string;
    kelompok: KelompokMapel;
    kode_mapel: string;
    nama_mata_pelajaran: string;
    alokasi_waktu_jam: number;
    alokasi_skk: number;
    porsi_tatap_muka_persen: number;
    porsi_tutorial_persen: number;
    porsi_mandiri_persen: number;
    urutan: number;
    status: 'AKTIF' | 'NONAKTIF' | 'ARSIP';
    catatan: string;
  }>({
    program: 'PAKET B',
    tingkatan: 'Semua Tingkatan',
    fase: 'Fase D',
    kelompok: 'UMUM',
    kode_mapel: '',
    nama_mata_pelajaran: '',
    alokasi_waktu_jam: 3,
    alokasi_skk: 12,
    porsi_tatap_muka_persen: 20,
    porsi_tutorial_persen: 30,
    porsi_mandiri_persen: 50,
    urutan: 1,
    status: 'AKTIF',
    catatan: ''
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      program: selectedProgram === 'SEMUA' ? 'PAKET B' : selectedProgram,
      tingkatan: selectedProgram === 'PAKET C' ? 'Semua Tingkatan (Kelas 10-12)' : 'Semua Tingkatan (Kelas 7-9)',
      fase: selectedProgram === 'PAKET C' ? 'Fase E & F' : 'Fase D',
      kelompok: 'UMUM',
      kode_mapel: '',
      nama_mata_pelajaran: '',
      alokasi_waktu_jam: 3,
      alokasi_skk: 12,
      porsi_tatap_muka_persen: 20,
      porsi_tutorial_persen: 30,
      porsi_mandiri_persen: 50,
      urutan: strukturList.length + 1,
      status: 'AKTIF',
      catatan: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: StrukturKurikulumItem) => {
    setEditingItem(item);
    setFormData({
      program: item.program,
      tingkatan: item.tingkatan,
      fase: item.fase || (item.program === 'PAKET B' ? 'Fase D' : 'Fase E & F'),
      kelompok: item.kelompok,
      kode_mapel: item.kode_mapel,
      nama_mata_pelajaran: item.nama_mata_pelajaran,
      alokasi_waktu_jam: item.alokasi_waktu_jam,
      alokasi_skk: item.alokasi_skk,
      porsi_tatap_muka_persen: item.porsi_tatap_muka_persen || 20,
      porsi_tutorial_persen: item.porsi_tutorial_persen || 30,
      porsi_mandiri_persen: item.porsi_mandiri_persen || 50,
      urutan: item.urutan,
      status: item.status,
      catatan: item.catatan || ''
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama_mata_pelajaran.trim() || !formData.kode_mapel.trim()) {
      return;
    }

    onSaveItem({
      ...(editingItem ? { id: editingItem.id } : {}),
      program: formData.program,
      tingkatan: formData.tingkatan,
      fase: formData.fase,
      kelompok: formData.kelompok,
      kode_mapel: formData.kode_mapel.toUpperCase().trim(),
      nama_mata_pelajaran: formData.nama_mata_pelajaran.trim(),
      alokasi_waktu_jam: Number(formData.alokasi_waktu_jam) || 0,
      alokasi_skk: Number(formData.alokasi_skk) || 0,
      porsi_tatap_muka_persen: Number(formData.porsi_tatap_muka_persen) || 20,
      porsi_tutorial_persen: Number(formData.porsi_tutorial_persen) || 30,
      porsi_mandiri_persen: Number(formData.porsi_mandiri_persen) || 50,
      urutan: Number(formData.urutan) || 1,
      status: formData.status,
      catatan: formData.catatan.trim()
    });

    setIsModalOpen(false);
  };

  // Filtered structure
  const filteredList = strukturList
    .filter((item) => {
      const matchProgram = selectedProgram === 'SEMUA' || item.program === selectedProgram;
      const matchKelompok = selectedKelompok === 'SEMUA' || item.kelompok === selectedKelompok;
      const matchQuery =
        !searchQuery.trim() ||
        item.nama_mata_pelajaran.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.kode_mapel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tingkatan.toLowerCase().includes(searchQuery.toLowerCase());
      return matchProgram && matchKelompok && matchQuery;
    })
    .sort((a, b) => a.urutan - b.urutan);

  const totalSKKFiltered = filteredList.reduce((acc, curr) => acc + (curr.alokasi_skk || 0), 0);
  const totalJPFiltered = filteredList.reduce((acc, curr) => acc + (curr.alokasi_waktu_jam || 0), 0);

  return (
    <div className="space-y-6 animate-fadeIn text-[#1F2937]">
      {/* Search, Filter & Action Bar on Pure White Canvas */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-4">
          <div>
            <h2 className="text-xl font-bold text-[#172033] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#C8102E]" />
              <span>Struktur Kurikulum & Satuan Kredit Kompetensi (SKK)</span>
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Matriks distribusi mata pelajaran, bobot SKK, dan rasio jam tatap muka, tutorial, serta mandiri.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {isAdmin && (
              <button
                type="button"
                onClick={handleOpenAdd}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-medium bg-[#C8102E] hover:bg-[#A30D25] text-white shadow-sm transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Mata Pelajaran</span>
              </button>
            )}

            <button
              type="button"
              onClick={onExportCsv}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 transition-colors shadow-xs cursor-pointer"
              title="Unduh format tabel CSV"
            >
              <Download className="w-3.5 h-3.5 text-gray-600" />
              <span className="hidden sm:inline">Ekspor CSV</span>
            </button>
          </div>
        </div>

        {/* Filter Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Program Jenjang
            </label>
            <select
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value as any)}
              className="w-full text-xs rounded-md border border-gray-300 px-3 py-2 bg-white text-[#172033] outline-none focus:border-[#C8102E]"
            >
              <option value="SEMUA">Semua Program (Paket B & C)</option>
              <option value="PAKET B">Paket B (Fase D)</option>
              <option value="PAKET C">Paket C (Fase E/F)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Kelompok Mapel
            </label>
            <select
              value={selectedKelompok}
              onChange={(e) => setSelectedKelompok(e.target.value as any)}
              className="w-full text-xs rounded-md border border-gray-300 px-3 py-2 bg-white text-[#172033] outline-none focus:border-[#C8102E]"
            >
              <option value="SEMUA">Semua Kelompok</option>
              <option value="UMUM">Kelompok Umum</option>
              <option value="PEMINATAN">Kelompok Peminatan</option>
              <option value="PEMBERDAYAAN">Kelompok Pemberdayaan</option>
              <option value="KETERAMPILAN">Kelompok Keterampilan</option>
              <option value="MUATAN_LOKAL">Muatan Lokal</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Pencarian Mata Pelajaran
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari kode mapel, nama mapel, atau tingkatan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs rounded-md border border-gray-300 pl-9 pr-3 py-2 bg-white text-[#172033] outline-none focus:border-[#C8102E]"
              />
            </div>
          </div>
        </div>

        {/* Calculated Stats Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-gray-600 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <span>Ditemukan: <strong className="text-[#172033]">{filteredList.length}</strong> mata pelajaran</span>
            <span>•</span>
            <span>Total Beban: <strong className="text-[#172033]">{totalSKKFiltered} SKK</strong></span>
            <span>•</span>
            <span>Total Alokasi: <strong className="text-[#172033]">{totalJPFiltered} JP</strong></span>
          </div>
        </div>
      </div>

      {/* Professional Academic Data Table */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead className="bg-gray-50/80 text-gray-600 font-semibold uppercase tracking-wider text-[11px] border-b border-[#E5E7EB]">
              <tr>
                <th scope="col" className="py-3.5 px-6 w-14 text-center">No</th>
                <th scope="col" className="py-3.5 px-6">Kode</th>
                <th scope="col" className="py-3.5 px-6">Mata Pelajaran</th>
                <th scope="col" className="py-3.5 px-6">Program & Fase</th>
                <th scope="col" className="py-3.5 px-6">Kelompok</th>
                <th scope="col" className="py-3.5 px-6 text-center">Alokasi SKK</th>
                <th scope="col" className="py-3.5 px-6 text-center">Rasio (TM / Tut / Man)</th>
                <th scope="col" className="py-3.5 px-6 text-center">Status</th>
                {isAdmin && <th scope="col" className="py-3.5 px-6 text-right w-32">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] text-[#1F2937]">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 9 : 8} className="py-14 px-6 text-center text-gray-400">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50 text-gray-400" />
                    <p className="font-semibold text-gray-700">Tidak ada mata pelajaran yang cocok dengan filter.</p>
                    <p className="text-xs text-gray-500 mt-1">Coba sesuaikan kata kunci pencarian atau ganti filter program.</p>
                  </td>
                </tr>
              ) : (
                filteredList.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-4.5 px-6 text-center text-gray-400 font-mono text-xs">
                      {idx + 1}
                    </td>

                    <td className="py-4.5 px-6 font-mono font-semibold text-[#172033] text-xs whitespace-nowrap">
                      {item.kode_mapel}
                    </td>

                    <td className="py-4.5 px-6">
                      <div className="font-semibold text-[#172033]">{item.nama_mata_pelajaran}</div>
                      {item.catatan && (
                        <div className="text-xs text-gray-500 mt-0.5 max-w-sm truncate">
                          {item.catatan}
                        </div>
                      )}
                    </td>

                    <td className="py-4.5 px-6">
                      <span className="font-medium text-[#172033] text-xs">{item.program}</span>
                      <span className="text-xs text-gray-500 block">{item.tingkatan}</span>
                    </td>

                    <td className="py-4.5 px-6">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-medium bg-[#F5F6F8] text-gray-700 border border-[#E5E7EB]">
                        {item.kelompok}
                      </span>
                    </td>

                    <td className="py-4.5 px-6 text-center font-bold text-[#172033]">
                      {item.alokasi_skk} SKK
                      <span className="text-xs text-gray-500 block font-normal">{item.alokasi_waktu_jam} JP</span>
                    </td>

                    <td className="py-4.5 px-6 text-center whitespace-nowrap">
                      <span className="font-mono text-xs text-gray-700">
                        {item.porsi_tatap_muka_persen}% / {item.porsi_tutorial_persen}% / {item.porsi_mandiri_persen}%
                      </span>
                    </td>

                    <td className="py-4.5 px-6 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {item.status}
                      </span>
                    </td>

                    {isAdmin && (
                      <td className="py-4.5 px-6 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 rounded text-gray-500 hover:text-[#172033] hover:bg-gray-100 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDuplicateItem(item.id)}
                            className="p-1.5 rounded text-gray-500 hover:text-[#172033] hover:bg-gray-100 transition-colors"
                            title="Duplikat"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Hapus mata pelajaran ${item.nama_mata_pelajaran}?`)) {
                                onDeleteItem(item.id);
                              }
                            }}
                            className="p-1.5 rounded text-gray-500 hover:text-[#C8102E] hover:bg-red-50 transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit Subject */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172033]/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="text-lg font-bold text-[#172033]">
                {editingItem ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Program Jenjang *
                  </label>
                  <select
                    value={formData.program}
                    onChange={(e) => {
                      const prog = e.target.value as PaketType;
                      setFormData({
                        ...formData,
                        program: prog,
                        fase: prog === 'PAKET C' ? 'Fase E & F' : 'Fase D',
                        tingkatan: prog === 'PAKET C' ? 'Semua Tingkatan (Kelas 10-12)' : 'Semua Tingkatan (Kelas 7-9)'
                      });
                    }}
                    className="w-full text-xs rounded-md border border-gray-300 p-2.5 bg-white focus:border-[#C8102E] outline-none"
                  >
                    <option value="PAKET B">Paket B (Fase D)</option>
                    <option value="PAKET C">Paket C (Fase E/F)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Kelompok Mata Pelajaran *
                  </label>
                  <select
                    value={formData.kelompok}
                    onChange={(e) => setFormData({ ...formData, kelompok: e.target.value as any })}
                    className="w-full text-xs rounded-md border border-gray-300 p-2.5 bg-white focus:border-[#C8102E] outline-none"
                  >
                    <option value="UMUM">Kelompok Umum</option>
                    <option value="PEMINATAN">Kelompok Peminatan</option>
                    <option value="PEMBERDAYAAN">Kelompok Pemberdayaan</option>
                    <option value="KETERAMPILAN">Kelompok Keterampilan</option>
                    <option value="MUATAN_LOKAL">Muatan Lokal</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Kode Mapel *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="mis. IND-B"
                    value={formData.kode_mapel}
                    onChange={(e) => setFormData({ ...formData, kode_mapel: e.target.value })}
                    className="w-full text-xs rounded-md border border-gray-300 p-2.5 uppercase font-mono focus:border-[#C8102E] outline-none"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Nama Mata Pelajaran *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="mis. Bahasa Indonesia"
                    value={formData.nama_mata_pelajaran}
                    onChange={(e) => setFormData({ ...formData, nama_mata_pelajaran: e.target.value })}
                    className="w-full text-xs rounded-md border border-gray-300 p-2.5 focus:border-[#C8102E] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Alokasi SKK *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.alokasi_skk}
                    onChange={(e) => setFormData({ ...formData, alokasi_skk: Number(e.target.value) || 0 })}
                    className="w-full text-xs rounded-md border border-gray-300 p-2.5 focus:border-[#C8102E] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Jam Pelajaran (JP / Minggu)
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.alokasi_waktu_jam}
                    onChange={(e) => setFormData({ ...formData, alokasi_waktu_jam: Number(e.target.value) || 0 })}
                    className="w-full text-xs rounded-md border border-gray-300 p-2.5 focus:border-[#C8102E] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Catatan / Keterangan Silabus
                </label>
                <textarea
                  rows={2}
                  placeholder="Catatan tambahan modul atau prasyarat..."
                  value={formData.catatan}
                  onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
                  className="w-full text-xs rounded-md border border-gray-300 p-2.5 focus:border-[#C8102E] outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md bg-white hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium text-white bg-[#C8102E] hover:bg-[#A30D25] rounded-md shadow-sm transition-colors cursor-pointer"
                >
                  Simpan Mata Pelajaran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
