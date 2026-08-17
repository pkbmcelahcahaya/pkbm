import React, { useState } from 'react';
import {
  Award,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  FileCheck,
  Percent,
  BookOpen,
  Scale,
  X
} from 'lucide-react';
import { AsesmenKurikulumItem, AsesmenJenis, User } from '../../types';

interface KurikulumAsesmenTabProps {
  asesmenList: AsesmenKurikulumItem[];
  currentUser: User | null;
  onSaveAsesmen: (item: Omit<AsesmenKurikulumItem, 'id'> & { id?: string }) => void;
  onDeleteAsesmen: (id: string) => void;
}

export const KurikulumAsesmenTab: React.FC<KurikulumAsesmenTabProps> = ({
  asesmenList,
  currentUser,
  onSaveAsesmen,
  onDeleteAsesmen
}) => {
  const isAdmin = currentUser?.role === 'ADMIN';

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AsesmenKurikulumItem | null>(null);

  const [formData, setFormData] = useState<{
    nama_asesmen: string;
    jenis_asesmen: AsesmenJenis;
    program: 'SEMUA' | 'PAKET B' | 'PAKET C';
    mata_pelajaran: string;
    tingkatan: string;
    tujuan_asesmen: string;
    teknik_penilaian: string;
    bentuk_instrumen: string;
    bobot_persen: number;
    kriteria_ketuntasan: string;
    catatan: string;
    status: 'AKTIF' | 'NONAKTIF';
  }>({
    nama_asesmen: '',
    jenis_asesmen: 'FORMATIF_AWAL',
    program: 'SEMUA',
    mata_pelajaran: 'Semua Mata Pelajaran',
    tingkatan: 'Semua Tingkatan',
    tujuan_asesmen: '',
    teknik_penilaian: 'Tes Tertulis & Observasi',
    bentuk_instrumen: 'Kuis LMS Pilihan Ganda & Rubrik Portofolio',
    bobot_persen: 30,
    kriteria_ketuntasan: 'Tercapainya KKTP minimal 75',
    catatan: '',
    status: 'AKTIF'
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      nama_asesmen: '',
      jenis_asesmen: 'FORMATIF_PROSES',
      program: 'SEMUA',
      mata_pelajaran: 'Semua Mata Pelajaran',
      tingkatan: 'Semua Tingkatan',
      tujuan_asesmen: '',
      teknik_penilaian: 'Tes Tertulis & Observasi',
      bentuk_instrumen: 'Kuis LMS Pilihan Ganda & Tugas Mandiri',
      bobot_persen: 30,
      kriteria_ketuntasan: 'Tercapainya KKTP minimal 75',
      catatan: '',
      status: 'AKTIF'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: AsesmenKurikulumItem) => {
    setEditingItem(item);
    setFormData({
      nama_asesmen: item.nama_asesmen,
      jenis_asesmen: item.jenis_asesmen,
      program: item.program,
      mata_pelajaran: item.mata_pelajaran || 'Semua Mata Pelajaran',
      tingkatan: item.tingkatan || 'Semua Tingkatan',
      tujuan_asesmen: item.tujuan_asesmen || item.deskripsi || '',
      teknik_penilaian: item.teknik_penilaian || '',
      bentuk_instrumen: item.bentuk_instrumen || '',
      bobot_persen: item.bobot_persen || 30,
      kriteria_ketuntasan: item.kriteria_ketuntasan,
      catatan: item.catatan || '',
      status: item.status || 'AKTIF'
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama_asesmen.trim()) return;

    onSaveAsesmen({
      ...(editingItem ? { id: editingItem.id } : {}),
      nama_asesmen: formData.nama_asesmen.trim(),
      jenis_asesmen: formData.jenis_asesmen,
      program: formData.program,
      mata_pelajaran: formData.mata_pelajaran.trim(),
      tingkatan: formData.tingkatan.trim(),
      tujuan_asesmen: formData.tujuan_asesmen.trim(),
      deskripsi: formData.tujuan_asesmen.trim(),
      teknik_penilaian: formData.teknik_penilaian.trim(),
      bentuk_instrumen: formData.bentuk_instrumen.trim(),
      bobot_persen: Number(formData.bobot_persen) || 0,
      kriteria_ketuntasan: formData.kriteria_ketuntasan.trim(),
      catatan: formData.catatan.trim(),
      status: formData.status
    });

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn text-[#1F2937]">
      {/* Header & Guidelines Overview */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-4">
          <div>
            <h2 className="text-xl font-bold text-[#172033] flex items-center gap-2">
              <Scale className="w-5 h-5 text-[#C8102E]" />
              <span>Pedoman Asesmen & Kriteria Kelulusan</span>
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Standar penilaian holistik pendidikan kesetaraan mencakup asesmen formatif awal, formatif proses, sumatif lingkup materi, dan uji kesetaraan nasional.
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
                <span>Tambah Skema Asesmen</span>
              </button>
            )}
          </div>
        </div>

        {/* 3 Academic Assessment Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-xl bg-[#F5F6F8] border border-gray-200 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-600 block">
              1. Asesmen Awal & Formatif
            </span>
            <p className="text-xs text-gray-700 leading-relaxed">
              Pemetaan kesiapan awal warga belajar, kuis berkala modul LMS, dan observasi keaktifan diskusi tutorial untuk perbaikan proses pembelajaran.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#F5F6F8] border border-gray-200 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-600 block">
              2. Asesmen Sumatif & Portofolio
            </span>
            <p className="text-xs text-gray-700 leading-relaxed">
              Penilaian akhir modul (STS/SAS), laporan karya vokasi kewirausahaan, serta portofolio keterampilan kontekstual.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#F5F6F8] border border-gray-200 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-600 block">
              3. Uji Kesetaraan Nasional
            </span>
            <p className="text-xs text-gray-700 leading-relaxed">
              Ujian standar berbasis komputer yang diselenggarakan oleh BSKAP Kemendikbudristek untuk mengukur penyetaraan kompetensi lulusan.
            </p>
          </div>
        </div>
      </div>

      {/* Asesmen List Sheet */}
      <div className="space-y-4">
        {asesmenList.map((item) => (
          <article
            key={item.id}
            className="bg-white rounded-xl border border-gray-200 shadow-xs p-6 sm:p-8 space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-100 pb-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-[#F5F6F8] text-[#172033] border border-gray-200">
                  {item.jenis_asesmen}
                </span>
                <span className="px-2.5 py-0.5 rounded text-xs font-medium bg-[#F5F6F8] text-gray-700 border border-gray-200">
                  {item.program}
                </span>
                <h3 className="text-base font-bold text-[#172033]">
                  {item.nama_asesmen}
                </h3>
              </div>

              <div className="flex items-center gap-3 text-xs">
                {item.bobot_persen !== undefined && (
                  <span className="font-bold text-[#172033] bg-[#F5F6F8] px-2.5 py-1 rounded border border-gray-200">
                    Bobot: {item.bobot_persen}%
                  </span>
                )}
                {isAdmin && (
                  <div className="flex items-center gap-1">
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
                      onClick={() => {
                        if (confirm(`Hapus skema asesmen ${item.nama_asesmen}?`)) {
                          onDeleteAsesmen(item.id);
                        }
                      }}
                      className="p-1.5 rounded text-gray-500 hover:text-[#C8102E] hover:bg-red-50 transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-[#1F2937] leading-relaxed">
              <div className="p-3.5 rounded-lg bg-[#F5F6F8] border border-gray-200">
                <span className="font-bold text-[#172033] block mb-1">Tujuan Asesmen:</span>
                <p className="text-gray-700">{item.tujuan_asesmen || item.deskripsi || '-'}</p>
              </div>

              <div className="p-3.5 rounded-lg bg-[#F5F6F8] border border-gray-200">
                <span className="font-bold text-[#172033] block mb-1">Bentuk & Instrumen Penilaian:</span>
                <p className="text-gray-700">{item.bentuk_instrumen || item.teknik_penilaian || '-'}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs text-gray-500">
              <span>Mata Pelajaran / Tingkat: <strong className="text-gray-700">{item.mata_pelajaran || 'Umum'} ({item.tingkatan || 'Semua'})</strong></span>
              <span>Kriteria Kelulusan: <strong className="text-gray-700">{item.kriteria_ketuntasan}</strong></span>
            </div>
          </article>
        ))}
      </div>

      {/* Modal Add / Edit Asesmen */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172033]/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-200 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="text-lg font-bold text-[#172033]">
                {editingItem ? 'Edit Skema Asesmen' : 'Tambah Skema Asesmen Baru'}
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
                  Nama Asesmen *
                </label>
                <input
                  type="text"
                  required
                  placeholder="mis. Asesmen Sumatif Akhir Semester (SAS)"
                  value={formData.nama_asesmen}
                  onChange={(e) => setFormData({ ...formData, nama_asesmen: e.target.value })}
                  className="w-full text-xs rounded-md border border-gray-300 p-2.5 focus:border-[#C8102E] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Jenis Asesmen *
                  </label>
                  <select
                    value={formData.jenis_asesmen}
                    onChange={(e) => setFormData({ ...formData, jenis_asesmen: e.target.value as any })}
                    className="w-full text-xs rounded-md border border-gray-300 p-2.5 bg-white focus:border-[#C8102E] outline-none"
                  >
                    <option value="FORMATIF_AWAL">Formatif Awal (Diagnostik)</option>
                    <option value="FORMATIF_PROSES">Formatif Proses (Kuis/Diskusi)</option>
                    <option value="SUMATIF_LINGKUP_MATERI">Sumatif Lingkup Materi</option>
                    <option value="SUMATIF_AKHIR_SEMESTER">Sumatif Akhir Semester</option>
                    <option value="UJI_KESETARAAN">Uji Kesetaraan Nasional</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Program Jenjang *
                  </label>
                  <select
                    value={formData.program}
                    onChange={(e) => setFormData({ ...formData, program: e.target.value as any })}
                    className="w-full text-xs rounded-md border border-gray-300 p-2.5 bg-white focus:border-[#C8102E] outline-none"
                  >
                    <option value="SEMUA">Semua Jenjang</option>
                    <option value="PAKET B">Paket B (Fase D)</option>
                    <option value="PAKET C">Paket C (Fase E/F)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Tujuan Asesmen *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.tujuan_asesmen}
                  onChange={(e) => setFormData({ ...formData, tujuan_asesmen: e.target.value })}
                  className="w-full text-xs rounded-md border border-gray-300 p-2.5 focus:border-[#C8102E] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Bentuk & Instrumen Penilaian
                </label>
                <input
                  type="text"
                  value={formData.bentuk_instrumen}
                  onChange={(e) => setFormData({ ...formData, bentuk_instrumen: e.target.value })}
                  className="w-full text-xs rounded-md border border-gray-300 p-2.5 focus:border-[#C8102E] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Bobot Penilaian (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={formData.bobot_persen}
                    onChange={(e) => setFormData({ ...formData, bobot_persen: Number(e.target.value) || 0 })}
                    className="w-full text-xs rounded-md border border-gray-300 p-2.5 focus:border-[#C8102E] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Kriteria Ketuntasan (KKTP)
                  </label>
                  <input
                    type="text"
                    value={formData.kriteria_ketuntasan}
                    onChange={(e) => setFormData({ ...formData, kriteria_ketuntasan: e.target.value })}
                    className="w-full text-xs rounded-md border border-gray-300 p-2.5 focus:border-[#C8102E] outline-none"
                  />
                </div>
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
                  Simpan Skema
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
