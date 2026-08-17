import React, { useState } from 'react';
import {
  CalendarDays,
  Plus,
  Edit2,
  Trash2,
  Calendar as CalendarIcon,
  Tag,
  MapPin,
  AlertCircle,
  X
} from 'lucide-react';
import { KalenderPendidikanEvent, User } from '../../types';

interface KurikulumKalenderTabProps {
  kalenderList: KalenderPendidikanEvent[];
  currentUser: User | null;
  onSaveEvent: (event: Omit<KalenderPendidikanEvent, 'id'> & { id?: string }) => void;
  onDeleteEvent: (id: string) => void;
}

export const KurikulumKalenderTab: React.FC<KurikulumKalenderTabProps> = ({
  kalenderList,
  currentUser,
  onSaveEvent,
  onDeleteEvent
}) => {
  const isAdmin = currentUser?.role === 'ADMIN';

  // Filters & State
  const [selectedSemester, setSelectedSemester] = useState<'SEMUA' | 'GANJIL' | 'GENAP'>('SEMUA');
  const [selectedKategori, setSelectedKategori] = useState<string>('SEMUA');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<KalenderPendidikanEvent | null>(null);

  const [formData, setFormData] = useState<{
    nama_kegiatan: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
    semester: 'GANJIL' | 'GENAP' | 'SEMUA';
    kategori: string;
    deskripsi: string;
    target_program: 'SEMUA' | 'PAKET B' | 'PAKET C';
    tahun_pelajaran: string;
  }>({
    nama_kegiatan: '',
    tanggal_mulai: '2026-07-15',
    tanggal_selesai: '2026-07-20',
    semester: 'GANJIL',
    kategori: 'PEMBELAJARAN',
    deskripsi: '',
    target_program: 'SEMUA',
    tahun_pelajaran: '2026/2027'
  });

  const handleOpenAdd = () => {
    setEditingEvent(null);
    setFormData({
      nama_kegiatan: '',
      tanggal_mulai: new Date().toISOString().split('T')[0],
      tanggal_selesai: new Date().toISOString().split('T')[0],
      semester: selectedSemester === 'GENAP' ? 'GENAP' : 'GANJIL',
      kategori: 'PEMBELAJARAN',
      deskripsi: '',
      target_program: 'SEMUA',
      tahun_pelajaran: '2026/2027'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ev: KalenderPendidikanEvent) => {
    setEditingEvent(ev);
    setFormData({
      nama_kegiatan: ev.nama_kegiatan || ev.judul_kegiatan || '',
      tanggal_mulai: ev.tanggal_mulai,
      tanggal_selesai: ev.tanggal_selesai || ev.tanggal_mulai,
      semester: ev.semester,
      kategori: ev.kategori,
      deskripsi: ev.deskripsi || ev.keterangan || '',
      target_program: ev.target_program || ev.program_terkait || 'SEMUA',
      tahun_pelajaran: ev.tahun_pelajaran || '2026/2027'
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama_kegiatan.trim()) return;

    onSaveEvent({
      ...(editingEvent ? { id: editingEvent.id } : {}),
      nama_kegiatan: formData.nama_kegiatan.trim(),
      judul_kegiatan: formData.nama_kegiatan.trim(),
      tanggal_mulai: formData.tanggal_mulai,
      tanggal_selesai: formData.tanggal_selesai,
      semester: formData.semester,
      kategori: formData.kategori,
      deskripsi: formData.deskripsi.trim(),
      keterangan: formData.deskripsi.trim(),
      target_program: formData.target_program,
      program_terkait: formData.target_program,
      tahun_pelajaran: formData.tahun_pelajaran
    });

    setIsModalOpen(false);
  };

  const filteredEvents = kalenderList
    .filter((ev) => {
      const matchSem = selectedSemester === 'SEMUA' || ev.semester === selectedSemester || ev.semester === 'SEMUA';
      const matchKat = selectedKategori === 'SEMUA' || ev.kategori === selectedKategori;
      return matchSem && matchKat;
    })
    .sort((a, b) => new Date(a.tanggal_mulai).getTime() - new Date(b.tanggal_mulai).getTime());

  return (
    <div className="space-y-6 animate-fadeIn text-[#1F2937]">
      {/* Header & Filter Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-4">
          <div>
            <h2 className="text-xl font-bold text-[#172033] flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-[#C8102E]" />
              <span>Kalender Akademik & Agenda Pembelajaran</span>
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Jadwal pelaksanaan Masa Pengenalan Lingkungan Belajar (MPLB), modul pembelajaran, PTS, PAS, dan Uji Kesetaraan.
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
                <span>Tambah Agenda</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Filter Semester
            </label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value as any)}
              className="w-full text-xs rounded-md border border-gray-300 px-3 py-2 bg-white text-[#172033] outline-none focus:border-[#C8102E]"
            >
              <option value="SEMUA">Semua Semester (Ganjil & Genap)</option>
              <option value="GANJIL">Semester Ganjil</option>
              <option value="GENAP">Semester Genap</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Filter Kategori Kegiatan
            </label>
            <select
              value={selectedKategori}
              onChange={(e) => setSelectedKategori(e.target.value)}
              className="w-full text-xs rounded-md border border-gray-300 px-3 py-2 bg-white text-[#172033] outline-none focus:border-[#C8102E]"
            >
              <option value="SEMUA">Semua Kategori Kegiatan</option>
              <option value="PEMBELAJARAN">Pembelajaran & Modul</option>
              <option value="ASESMEN">Asesmen & Ujian</option>
              <option value="PPDB">Penerimaan Warga Belajar (PPDB)</option>
              <option value="LIBUR">Libur Semester</option>
              <option value="UPACARA">Peringatan Hari Besar</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events Timeline / Academic List */}
      <div className="space-y-4">
        {filteredEvents.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="font-semibold text-gray-700">Tidak ada agenda akademik dalam filter ini.</p>
          </div>
        ) : (
          filteredEvents.map((ev) => (
            <article
              key={ev.id}
              className="bg-white rounded-xl border border-gray-200 shadow-xs p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:border-gray-300"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-[#F5F6F8] text-[#172033] border border-gray-200">
                    Semester {ev.semester}
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-medium bg-[#F5F6F8] text-gray-700 border border-gray-200">
                    {ev.kategori}
                  </span>
                  {ev.target_program && (
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-medium bg-gray-50 text-gray-600 border border-gray-200">
                      {ev.target_program}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-[#172033]">
                  {ev.nama_kegiatan || ev.judul_kegiatan}
                </h3>

                {(ev.deskripsi || ev.keterangan) && (
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {ev.deskripsi || ev.keterangan}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-1">
                  <span className="flex items-center gap-1">
                    <CalendarIcon className="w-3.5 h-3.5 text-gray-400" />
                    {ev.tanggal_mulai} {ev.tanggal_selesai && ev.tanggal_selesai !== ev.tanggal_mulai ? `s.d. ${ev.tanggal_selesai}` : ''}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    PKBM Celah Cahaya & LMS
                  </span>
                </div>
              </div>

              {isAdmin && (
                <div className="flex items-center gap-1 self-end sm:self-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-100">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(ev)}
                    className="p-2 rounded text-gray-500 hover:text-[#172033] hover:bg-gray-100 transition-colors"
                    title="Edit Agenda"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Hapus agenda ${ev.nama_kegiatan || ev.judul_kegiatan}?`)) {
                        onDeleteEvent(ev.id);
                      }
                    }}
                    className="p-2 rounded text-gray-500 hover:text-[#C8102E] hover:bg-red-50 transition-colors"
                    title="Hapus Agenda"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </article>
          ))
        )}
      </div>

      {/* Modal Add / Edit Event */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172033]/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-200 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="text-lg font-bold text-[#172033]">
                {editingEvent ? 'Edit Agenda Akademik' : 'Tambah Agenda Akademik Baru'}
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
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Nama Kegiatan / Agenda *
                </label>
                <input
                  type="text"
                  required
                  placeholder="mis. Masa Pengenalan Lingkungan Belajar (MPLB)"
                  value={formData.nama_kegiatan}
                  onChange={(e) => setFormData({ ...formData, nama_kegiatan: e.target.value })}
                  className="w-full text-xs rounded-md border border-gray-300 p-2.5 focus:border-[#C8102E] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Tanggal Mulai *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.tanggal_mulai}
                    onChange={(e) => setFormData({ ...formData, tanggal_mulai: e.target.value })}
                    className="w-full text-xs rounded-md border border-gray-300 p-2.5 focus:border-[#C8102E] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Tanggal Selesai
                  </label>
                  <input
                    type="date"
                    value={formData.tanggal_selesai}
                    onChange={(e) => setFormData({ ...formData, tanggal_selesai: e.target.value })}
                    className="w-full text-xs rounded-md border border-gray-300 p-2.5 focus:border-[#C8102E] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Semester
                  </label>
                  <select
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value as any })}
                    className="w-full text-xs rounded-md border border-gray-300 p-2.5 bg-white focus:border-[#C8102E] outline-none"
                  >
                    <option value="GANJIL">Semester Ganjil</option>
                    <option value="GENAP">Semester Genap</option>
                    <option value="SEMUA">Semua Semester</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Kategori Agenda
                  </label>
                  <select
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                    className="w-full text-xs rounded-md border border-gray-300 p-2.5 bg-white focus:border-[#C8102E] outline-none"
                  >
                    <option value="PEMBELAJARAN">Pembelajaran & Modul</option>
                    <option value="ASESMEN">Asesmen & Ujian</option>
                    <option value="PPDB">Penerimaan Warga Belajar (PPDB)</option>
                    <option value="LIBUR">Libur Semester</option>
                    <option value="UPACARA">Peringatan Hari Besar</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Deskripsi Kegiatan
                </label>
                <textarea
                  rows={2}
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
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
                  Simpan Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
