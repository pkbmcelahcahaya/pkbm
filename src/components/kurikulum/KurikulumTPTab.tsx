import React, { useState } from 'react';
import {
  Target,
  Plus,
  Search,
  Edit2,
  Trash2,
  Copy,
  BookOpen,
  CheckCircle2,
  Clock,
  ExternalLink,
  Filter,
  Layers,
  AlertCircle,
  FileCheck,
  X
} from 'lucide-react';
import { TujuanPembelajaran, CapaianPembelajaran, PaketType, User } from '../../types';

interface KurikulumTPTabProps {
  tpList: TujuanPembelajaran[];
  cpList: CapaianPembelajaran[];
  currentUser: User | null;
  selectedCpIdFilter?: string;
  onClearCpFilter?: () => void;
  onSaveTP: (tp: Omit<TujuanPembelajaran, 'id'> & { id?: string }) => void;
  onDeleteTP: (id: string) => void;
  onDuplicateTP: (id: string) => void;
  onOpenLmsMateri?: (materiJudul?: string) => void;
}

export const KurikulumTPTab: React.FC<KurikulumTPTabProps> = ({
  tpList,
  cpList,
  currentUser,
  selectedCpIdFilter,
  onClearCpFilter,
  onSaveTP,
  onDeleteTP,
  onDuplicateTP,
  onOpenLmsMateri
}) => {
  const isAdmin = currentUser?.role === 'ADMIN';

  // Filters & State
  const [selectedProgram, setSelectedProgram] = useState<PaketType | 'SEMUA'>('SEMUA');
  const [selectedSemester, setSelectedSemester] = useState<'SEMUA' | 'GANJIL' | 'GENAP'>('SEMUA');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTP, setEditingTP] = useState<TujuanPembelajaran | null>(null);

  const [formData, setFormData] = useState<{
    cp_id: string;
    kode_tp: string;
    program: PaketType;
    mata_pelajaran: string;
    tingkatan: string;
    fase: string;
    semester: 'GANJIL' | 'GENAP' | 'SEMUA';
    deskripsi_tp: string;
    indikator_ketercapaian: string;
    materi_terkait: string;
    alokasi_jp: number;
    urutan: number;
    asesmen_rekomendasi: string;
    catatan_tutor: string;
    status: 'AKTIF' | 'DRAF' | 'ARSIP';
  }>({
    cp_id: cpList[0]?.id || '',
    kode_tp: '',
    program: 'PAKET B',
    mata_pelajaran: 'Bahasa Indonesia',
    tingkatan: 'Kelas 7',
    fase: 'Fase D',
    semester: 'GANJIL',
    deskripsi_tp: '',
    indikator_ketercapaian: '',
    materi_terkait: '',
    alokasi_jp: 8,
    urutan: 1,
    asesmen_rekomendasi: 'Kuis LMS & Tugas Portofolio',
    catatan_tutor: '',
    status: 'AKTIF'
  });

  const handleOpenAdd = () => {
    setEditingTP(null);
    const targetCP = cpList.find((c) => c.id === selectedCpIdFilter) || cpList[0];
    setFormData({
      cp_id: targetCP?.id || '',
      kode_tp: `TP-${(targetCP?.mata_pelajaran || 'MAPEL').substring(0, 3).toUpperCase()}.${tpList.length + 1}`,
      program: targetCP?.program || 'PAKET B',
      mata_pelajaran: targetCP?.mata_pelajaran || 'Bahasa Indonesia',
      tingkatan: targetCP?.tingkatan || 'Kelas 7',
      fase: targetCP?.fase || 'Fase D',
      semester: 'GANJIL',
      deskripsi_tp: '',
      indikator_ketercapaian: '',
      materi_terkait: '',
      alokasi_jp: 8,
      urutan: tpList.length + 1,
      asesmen_rekomendasi: 'Kuis LMS Pilihan Ganda & Tugas Proyek',
      catatan_tutor: '',
      status: 'AKTIF'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tp: TujuanPembelajaran) => {
    setEditingTP(tp);
    setFormData({
      cp_id: tp.cp_id,
      kode_tp: tp.kode_tp,
      program: tp.program,
      mata_pelajaran: tp.mata_pelajaran,
      tingkatan: tp.tingkatan,
      fase: tp.fase,
      semester: tp.semester,
      deskripsi_tp: tp.deskripsi_tp,
      indikator_ketercapaian: tp.indikator_ketercapaian,
      materi_terkait: tp.materi_terkait || '',
      alokasi_jp: tp.alokasi_jp,
      urutan: tp.urutan,
      asesmen_rekomendasi: tp.asesmen_rekomendasi || '',
      catatan_tutor: tp.catatan_tutor || '',
      status: tp.status
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.kode_tp.trim() || !formData.deskripsi_tp.trim()) {
      return;
    }

    onSaveTP({
      ...(editingTP ? { id: editingTP.id } : {}),
      cp_id: formData.cp_id,
      kode_tp: formData.kode_tp.trim(),
      program: formData.program,
      mata_pelajaran: formData.mata_pelajaran.trim(),
      tingkatan: formData.tingkatan.trim(),
      fase: formData.fase.trim(),
      semester: formData.semester,
      deskripsi_tp: formData.deskripsi_tp.trim(),
      indikator_ketercapaian: formData.indikator_ketercapaian.trim(),
      materi_terkait: formData.materi_terkait.trim(),
      alokasi_jp: Number(formData.alokasi_jp) || 0,
      urutan: Number(formData.urutan) || 1,
      asesmen_rekomendasi: formData.asesmen_rekomendasi.trim(),
      catatan_tutor: formData.catatan_tutor.trim(),
      status: formData.status
    });

    setIsModalOpen(false);
  };

  const filteredTP = tpList
    .filter((tp) => {
      const matchCP = !selectedCpIdFilter || tp.cp_id === selectedCpIdFilter;
      const matchProgram = selectedProgram === 'SEMUA' || tp.program === selectedProgram;
      const matchSemester =
        selectedSemester === 'SEMUA' || tp.semester === selectedSemester || tp.semester === 'SEMUA';
      const matchQuery =
        !searchQuery.trim() ||
        tp.kode_tp.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tp.mata_pelajaran.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tp.deskripsi_tp.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tp.indikator_ketercapaian.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCP && matchProgram && matchSemester && matchQuery;
    })
    .sort((a, b) => a.urutan - b.urutan);

  return (
    <div className="space-y-6 animate-fadeIn text-[#1F2937]">
      {/* Search & Filter Bar */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-4">
          <div>
            <h2 className="text-xl font-bold text-[#172033] flex items-center gap-2">
              <Target className="w-5 h-5 text-[#C8102E]" />
              <span>Alur Tujuan Pembelajaran (ATP / TP)</span>
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Rangkaian tujuan pembelajaran terukur beserta indikator ketercapaian dan pemetaan modul LMS.
            </p>
          </div>

          {isAdmin && (
            <button
              type="button"
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-medium bg-[#C8102E] hover:bg-[#A30D25] text-white shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Tujuan Belajar (TP)</span>
            </button>
          )}
        </div>

        {/* Selected CP Filter Banner */}
        {selectedCpIdFilter && (
          <div className="p-3.5 rounded-lg bg-[#F5F6F8] border border-gray-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#C8102E]" />
              <span className="text-[#172033]">
                Menampilkan TP terkait Capaian Pembelajaran ID: <strong>{selectedCpIdFilter}</strong>
              </span>
            </div>
            {onClearCpFilter && (
              <button
                onClick={onClearCpFilter}
                className="text-xs text-[#C8102E] font-semibold hover:underline cursor-pointer"
              >
                Tampilkan Semua TP
              </button>
            )}
          </div>
        )}

        {/* Filter Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
              Semester
            </label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value as any)}
              className="w-full text-xs rounded-md border border-gray-300 px-3 py-2 bg-white text-[#172033] outline-none focus:border-[#C8102E]"
            >
              <option value="SEMUA">Semua Semester</option>
              <option value="GANJIL">Semester Ganjil</option>
              <option value="GENAP">Semester Genap</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Pencarian Tujuan Belajar
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari kode TP, materi, atau kata kunci..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs rounded-md border border-gray-300 pl-9 pr-3 py-2 bg-white text-[#172033] outline-none focus:border-[#C8102E]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* TP Reading Sheets List */}
      <div className="space-y-6">
        {filteredTP.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="font-semibold text-gray-700">Tidak ada Tujuan Pembelajaran yang sesuai.</p>
            <p className="text-xs mt-1">Coba atur ulang filter pencarian atau tambahkan TP baru.</p>
          </div>
        ) : (
          filteredTP.map((tp) => (
            <article
              key={tp.id}
              className="bg-white rounded-xl border border-gray-200 shadow-xs p-6 sm:p-8 space-y-5"
            >
              {/* TP Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-100 pb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-[#F5F6F8] text-[#172033] border border-gray-200">
                    {tp.kode_tp}
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-[#F5F6F8] text-[#172033] border border-gray-200">
                    {tp.program}
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-xs font-semibold text-[#172033]">
                    {tp.mata_pelajaran}
                  </span>
                  <span className="text-xs text-gray-500">
                    • {tp.tingkatan} (Semester {tp.semester})
                  </span>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto text-xs">
                  <span className="text-gray-500 font-semibold">{tp.alokasi_jp} JP</span>
                  {isAdmin && (
                    <div className="flex items-center gap-1 border-l border-gray-200 pl-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(tp)}
                        className="p-1.5 rounded text-gray-500 hover:text-[#172033] hover:bg-gray-100 transition-colors"
                        title="Edit TP"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDuplicateTP(tp.id)}
                        className="p-1.5 rounded text-gray-500 hover:text-[#172033] hover:bg-gray-100 transition-colors"
                        title="Duplikat TP"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Hapus Tujuan Pembelajaran ${tp.kode_tp}?`)) {
                            onDeleteTP(tp.id);
                          }
                        }}
                        className="p-1.5 rounded text-gray-500 hover:text-[#C8102E] hover:bg-red-50 transition-colors"
                        title="Hapus TP"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Main TP Description */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Rumusan Tujuan Pembelajaran:
                </span>
                <p className="text-[15px] sm:text-base text-[#1F2937] leading-[1.65] font-normal">
                  {tp.deskripsi_tp}
                </p>
              </div>

              {/* Indikator Ketercapaian */}
              <div className="p-4 rounded-lg bg-[#F5F6F8] border border-gray-200 space-y-1.5">
                <span className="text-xs font-bold text-[#172033] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C8102E]" />
                  <span>Kriteria Ketercapaian Tujuan Pembelajaran (KKTP):</span>
                </span>
                <p className="text-xs sm:text-[13px] text-gray-700 leading-relaxed">
                  {tp.indikator_ketercapaian}
                </p>
              </div>

              {/* Footer Meta & Asesmen Rekomendasi */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-gray-100 text-xs">
                <div className="flex flex-wrap items-center gap-2 text-gray-600">
                  <FileCheck className="w-3.5 h-3.5 text-gray-400" />
                  <span>Rekomendasi Asesmen: <strong>{tp.asesmen_rekomendasi || 'Formatif Modul & Portofolio'}</strong></span>
                </div>

                {tp.materi_terkait && onOpenLmsMateri && (
                  <button
                    type="button"
                    onClick={() => onOpenLmsMateri(tp.materi_terkait)}
                    className="inline-flex items-center gap-1 font-semibold text-[#C8102E] hover:underline cursor-pointer"
                  >
                    <span>Buka Modul Terkait di LMS</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </article>
          ))
        )}
      </div>

      {/* Modal Add / Edit TP */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172033]/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="text-lg font-bold text-[#172033]">
                {editingTP ? 'Edit Tujuan Pembelajaran' : 'Tambah Tujuan Pembelajaran (TP)'}
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
                    Kode TP *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="mis. TP-IND.1"
                    value={formData.kode_tp}
                    onChange={(e) => setFormData({ ...formData, kode_tp: e.target.value })}
                    className="w-full text-xs rounded-md border border-gray-300 p-2.5 font-mono uppercase focus:border-[#C8102E] outline-none"
                  />
                </div>

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
                        tingkatan: prog === 'PAKET C' ? 'Kelas 10' : 'Kelas 7'
                      });
                    }}
                    className="w-full text-xs rounded-md border border-gray-300 p-2.5 bg-white focus:border-[#C8102E] outline-none"
                  >
                    <option value="PAKET B">Paket B (Fase D)</option>
                    <option value="PAKET C">Paket C (Fase E/F)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Mata Pelajaran *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.mata_pelajaran}
                    onChange={(e) => setFormData({ ...formData, mata_pelajaran: e.target.value })}
                    className="w-full text-xs rounded-md border border-gray-300 p-2.5 focus:border-[#C8102E] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Semester & Alokasi JP
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={formData.semester}
                      onChange={(e) => setFormData({ ...formData, semester: e.target.value as any })}
                      className="w-full text-xs rounded-md border border-gray-300 p-2.5 bg-white focus:border-[#C8102E] outline-none"
                    >
                      <option value="GANJIL">Ganjil</option>
                      <option value="GENAP">Genap</option>
                      <option value="SEMUA">Tahunan</option>
                    </select>
                    <input
                      type="number"
                      min={1}
                      value={formData.alokasi_jp}
                      onChange={(e) => setFormData({ ...formData, alokasi_jp: Number(e.target.value) || 0 })}
                      className="w-full text-xs rounded-md border border-gray-300 p-2.5 focus:border-[#C8102E] outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Deskripsi Tujuan Pembelajaran (TP) *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Rumusan kompetensi spesifik yang diharapkan dikuasai warga belajar..."
                  value={formData.deskripsi_tp}
                  onChange={(e) => setFormData({ ...formData, deskripsi_tp: e.target.value })}
                  className="w-full text-xs rounded-md border border-gray-300 p-2.5 focus:border-[#C8102E] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Indikator Ketercapaian (KKTP) *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Kriteria bukti konkret keberhasilan pemahaman warga belajar..."
                  value={formData.indikator_ketercapaian}
                  onChange={(e) => setFormData({ ...formData, indikator_ketercapaian: e.target.value })}
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
                  Simpan Tujuan Belajar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
