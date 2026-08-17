import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Search,
  Edit2,
  Trash2,
  BookOpen,
  ArrowRight,
  Sparkles,
  Tag,
  Calendar,
  AlertCircle,
  X
} from 'lucide-react';
import { CapaianPembelajaran, PaketType, User } from '../../types';
import { TextToSpeechButton } from '../common/TextToSpeechButton';

interface KurikulumCPTabProps {
  cpList: CapaianPembelajaran[];
  currentUser: User | null;
  onSaveCP: (cp: Omit<CapaianPembelajaran, 'id' | 'created_at'> & { id?: string }) => void;
  onDeleteCP: (id: string) => void;
  onNavigateToTP: (cpId: string) => void;
}

export const KurikulumCPTab: React.FC<KurikulumCPTabProps> = ({
  cpList,
  currentUser,
  onSaveCP,
  onDeleteCP,
  onNavigateToTP
}) => {
  const isAdmin = currentUser?.role === 'ADMIN';

  // Filters & State
  const [selectedProgram, setSelectedProgram] = useState<PaketType | 'SEMUA'>('SEMUA');
  const [selectedMapel, setSelectedMapel] = useState<string>('SEMUA');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCP, setEditingCP] = useState<CapaianPembelajaran | null>(null);

  const [formData, setFormData] = useState<{
    program: PaketType;
    mata_pelajaran: string;
    fase: string;
    tingkatan: string;
    elemen: string;
    deskripsi_cp: string;
    tahun_pelajaran: string;
    status: 'AKTIF' | 'DRAF' | 'ARSIP';
  }>({
    program: 'PAKET B',
    mata_pelajaran: 'Bahasa Indonesia',
    fase: 'Fase D',
    tingkatan: 'Kelas 7-9',
    elemen: 'Membaca dan Memirsa',
    deskripsi_cp: '',
    tahun_pelajaran: '2026/2027',
    status: 'AKTIF'
  });

  const mapelOptions = Array.from(new Set(cpList.map((cp) => cp.mata_pelajaran)));

  const handleOpenAdd = () => {
    setEditingCP(null);
    setFormData({
      program: selectedProgram === 'SEMUA' ? 'PAKET B' : selectedProgram,
      mata_pelajaran:
        selectedMapel === 'SEMUA' ? mapelOptions[0] || 'Bahasa Indonesia' : selectedMapel,
      fase: selectedProgram === 'PAKET C' ? 'Fase E & F' : 'Fase D',
      tingkatan: selectedProgram === 'PAKET C' ? 'Kelas 10-12' : 'Kelas 7-9',
      elemen: 'Pemahaman Konsep',
      deskripsi_cp: '',
      tahun_pelajaran: '2026/2027',
      status: 'AKTIF'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cp: CapaianPembelajaran) => {
    setEditingCP(cp);
    setFormData({
      program: cp.program,
      mata_pelajaran: cp.mata_pelajaran,
      fase: cp.fase,
      tingkatan: cp.tingkatan,
      elemen: cp.elemen,
      deskripsi_cp: cp.deskripsi_cp,
      tahun_pelajaran: cp.tahun_pelajaran,
      status: cp.status
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.mata_pelajaran.trim() || !formData.deskripsi_cp.trim()) {
      return;
    }

    onSaveCP({
      ...(editingCP ? { id: editingCP.id } : {}),
      program: formData.program,
      mata_pelajaran: formData.mata_pelajaran.trim(),
      fase: formData.fase.trim(),
      tingkatan: formData.tingkatan.trim(),
      elemen: formData.elemen.trim(),
      deskripsi_cp: formData.deskripsi_cp.trim(),
      tahun_pelajaran: formData.tahun_pelajaran.trim(),
      status: formData.status
    });

    setIsModalOpen(false);
  };

  const filteredCP = cpList.filter((cp) => {
    const matchProg = selectedProgram === 'SEMUA' || cp.program === selectedProgram;
    const matchMapel =
      selectedMapel === 'SEMUA' || cp.mata_pelajaran.toLowerCase() === selectedMapel.toLowerCase();
    const matchQ =
      !searchQuery.trim() ||
      cp.mata_pelajaran.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cp.elemen.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cp.deskripsi_cp.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cp.fase.toLowerCase().includes(searchQuery.toLowerCase());
    return matchProg && matchMapel && matchQ;
  });

  return (
    <div className="space-y-6 animate-fadeIn text-[#1F2937]">
      {/* Search & Filter Bar */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-4">
          <div>
            <h2 className="text-xl font-bold text-[#172033] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#C8102E]" />
              <span>Capaian Pembelajaran (CP) Kesetaraan</span>
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Rumusan kompetensi akhir fase yang harus dicapai warga belajar per mata pelajaran dan elemen.
            </p>
          </div>

          {isAdmin && (
            <button
              type="button"
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-medium bg-[#C8102E] hover:bg-[#A30D25] text-white shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Capaian Belajar</span>
            </button>
          )}
        </div>

        {/* Filter Controls */}
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
              <option value="SEMUA">Semua Jenjang</option>
              <option value="PAKET B">Paket B (Fase D)</option>
              <option value="PAKET C">Paket C (Fase E/F)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Mata Pelajaran
            </label>
            <select
              value={selectedMapel}
              onChange={(e) => setSelectedMapel(e.target.value)}
              className="w-full text-xs rounded-md border border-gray-300 px-3 py-2 bg-white text-[#172033] outline-none focus:border-[#C8102E]"
            >
              <option value="SEMUA">Semua Mata Pelajaran</option>
              {mapelOptions.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Pencarian Deskripsi atau Elemen CP
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari rumusan kompetensi, elemen, atau kata kunci..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs rounded-md border border-gray-300 pl-9 pr-3 py-2 bg-white text-[#172033] outline-none focus:border-[#C8102E]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* CP Reading Sheets (Content-Centric Academic Document Layout) */}
      <div className="space-y-6">
        {filteredCP.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="font-semibold text-gray-700">Tidak ada Capaian Pembelajaran yang ditemukan.</p>
            <p className="text-xs mt-1">Coba sesuaikan filter pencarian atau tambahkan CP baru.</p>
          </div>
        ) : (
          filteredCP.map((cp) => (
            <article
              key={cp.id}
              className="bg-white rounded-xl border border-gray-200 shadow-xs p-6 sm:p-8 space-y-5"
            >
              {/* Document Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-100 pb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-[#F5F6F8] text-[#172033] border border-gray-200">
                    {cp.program} ({cp.fase})
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-xs font-semibold text-[#172033]">
                    {cp.mata_pelajaran}
                  </span>
                  <span className="text-xs text-gray-500">
                    • {cp.tingkatan}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  <TextToSpeechButton
                    text={`Capaian Pembelajaran ${cp.mata_pelajaran}, ${cp.program} ${cp.fase}. Elemen: ${cp.elemen}. Rumusan: ${cp.deskripsi_cp}`}
                    title={`CP ${cp.mata_pelajaran}`}
                    variant="compact"
                    size="xs"
                  />
                  {isAdmin && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(cp)}
                        className="p-1.5 rounded text-gray-500 hover:text-[#172033] hover:bg-gray-100 transition-colors"
                        title="Edit Capaian"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Hapus Capaian Pembelajaran ${cp.mata_pelajaran} (${cp.elemen})?`)) {
                            onDeleteCP(cp.id);
                          }
                        }}
                        className="p-1.5 rounded text-gray-500 hover:text-[#C8102E] hover:bg-red-50 transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Elemen & Deskripsi CP Body */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Elemen Kompetensi:
                  </span>
                  <span className="text-sm font-bold text-[#172033]">{cp.elemen}</span>
                </div>

                <div className="text-[15px] text-[#1F2937] leading-[1.65] pt-1">
                  {cp.deskripsi_cp}
                </div>
              </div>

              {/* Footer Meta & Navigation to TP */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-gray-100 text-xs">
                <span className="text-gray-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  Tahun Pelajaran: {cp.tahun_pelajaran}
                </span>

                <button
                  type="button"
                  onClick={() => onNavigateToTP(cp.id)}
                  className="inline-flex items-center gap-1.5 font-semibold text-[#C8102E] hover:underline cursor-pointer"
                >
                  <span>Lihat Tujuan Pembelajaran (ATP/TP) Terkait</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))
        )}
      </div>

      {/* Modal Add / Edit CP (Admin) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172033]/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-200 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="text-lg font-bold text-[#172033]">
                {editingCP ? 'Edit Capaian Pembelajaran' : 'Tambah Capaian Pembelajaran Baru'}
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
                        tingkatan: prog === 'PAKET C' ? 'Kelas 10-12' : 'Kelas 7-9'
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
                    Mata Pelajaran *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="mis. Bahasa Indonesia"
                    value={formData.mata_pelajaran}
                    onChange={(e) => setFormData({ ...formData, mata_pelajaran: e.target.value })}
                    className="w-full text-xs rounded-md border border-gray-300 p-2.5 focus:border-[#C8102E] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Fase & Tingkatan *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fase}
                    onChange={(e) => setFormData({ ...formData, fase: e.target.value })}
                    className="w-full text-xs rounded-md border border-gray-300 p-2.5 focus:border-[#C8102E] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Elemen Kompetensi *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="mis. Membaca dan Memirsa"
                    value={formData.elemen}
                    onChange={(e) => setFormData({ ...formData, elemen: e.target.value })}
                    className="w-full text-xs rounded-md border border-gray-300 p-2.5 focus:border-[#C8102E] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Deskripsi Capaian Pembelajaran (CP) *
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Tuliskan rumusan capaian pembelajaran secara lengkap..."
                  value={formData.deskripsi_cp}
                  onChange={(e) => setFormData({ ...formData, deskripsi_cp: e.target.value })}
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
                  Simpan Capaian Belajar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
