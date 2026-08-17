import React, { useState } from 'react';
import {
  History,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  User as UserIcon,
  ShieldCheck,
  FileCheck,
  Tag,
  Download,
  Upload,
  RefreshCw,
  X
} from 'lucide-react';
import { VersiKurikulum, RiwayatPerubahanKurikulum, KurikulumProfile, User } from '../../types';

interface KurikulumAuditVersiTabProps {
  profile: KurikulumProfile;
  versiList: VersiKurikulum[];
  riwayatList: RiwayatPerubahanKurikulum[];
  currentUser: User | null;
  onSaveVersi: (versi: Omit<VersiKurikulum, 'id' | 'created_at'> & { id?: string }) => void;
  onActivateVersi: (id: string) => void;
  onExportBackup: () => void;
  onImportBackup: (jsonData: any) => void;
  onResetDefault: () => void;
}

export const KurikulumAuditVersiTab: React.FC<KurikulumAuditVersiTabProps> = ({
  profile,
  versiList,
  riwayatList,
  currentUser,
  onSaveVersi,
  onActivateVersi,
  onExportBackup,
  onImportBackup,
  onResetDefault
}) => {
  const isAdmin = currentUser?.role === 'ADMIN';

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVersi, setEditingVersi] = useState<VersiKurikulum | null>(null);

  const [formData, setFormData] = useState<{
    nomor_versi: string;
    nama_versi: string;
    tahun_pelajaran: string;
    tanggal_rilis: string;
    pengubah_nama: string;
    ringkasan_perubahan: string;
    status: 'AKTIF' | 'DRAF' | 'ARSIP';
    catatan: string;
  }>({
    nomor_versi: '',
    nama_versi: 'Revisi KOSP Kurikulum Merdeka',
    tahun_pelajaran: '2026/2027',
    tanggal_rilis: new Date().toISOString().split('T')[0],
    pengubah_nama: currentUser?.name || 'Administrator',
    ringkasan_perubahan: '',
    status: 'AKTIF',
    catatan: ''
  });

  const handleOpenAdd = () => {
    setEditingVersi(null);
    setFormData({
      nomor_versi: `2.${versiList.length + 1}`,
      nama_versi: `Penyempurnaan KOSP Semester ${profile.semester_aktif || 'Ganjil'}`,
      tahun_pelajaran: profile.tahun_pelajaran || '2026/2027',
      tanggal_rilis: new Date().toISOString().split('T')[0],
      pengubah_nama: currentUser?.name || 'Administrator',
      ringkasan_perubahan: '',
      status: 'AKTIF',
      catatan: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (v: VersiKurikulum) => {
    setEditingVersi(v);
    setFormData({
      nomor_versi: v.nomor_versi,
      nama_versi: v.nama_versi,
      tahun_pelajaran: v.tahun_pelajaran,
      tanggal_rilis: v.tanggal_rilis,
      pengubah_nama: v.pengubah_nama,
      ringkasan_perubahan: v.ringkasan_perubahan,
      status: v.status,
      catatan: v.catatan || ''
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nomor_versi.trim() || !formData.ringkasan_perubahan.trim()) return;

    onSaveVersi({
      ...(editingVersi ? { id: editingVersi.id } : {}),
      nomor_versi: formData.nomor_versi.trim(),
      nama_versi: formData.nama_versi.trim(),
      tahun_pelajaran: formData.tahun_pelajaran,
      tanggal_rilis: formData.tanggal_rilis,
      pengubah_nama: formData.pengubah_nama,
      ringkasan_perubahan: formData.ringkasan_perubahan.trim(),
      status: formData.status,
      catatan: formData.catatan.trim()
    });

    setIsModalOpen(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const json = JSON.parse(evt.target?.result as string);
        onImportBackup(json);
      } catch (err) {
        alert('Format file JSON tidak valid!');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 animate-fadeIn text-[#1F2937]">
      {/* Header & Backup Actions Bar */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-4">
          <div>
            <h2 className="text-xl font-bold text-[#172033] flex items-center gap-2">
              <History className="w-5 h-5 text-[#C8102E]" />
              <span>Riwayat Versi & Audit Trail Kurikulum</span>
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Catatan perubahan berkala struktur kurikulum, silabus, dan legalitas SK penetapan operasional.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            {isAdmin && (
              <button
                type="button"
                onClick={handleOpenAdd}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-medium bg-[#C8102E] hover:bg-[#A30D25] text-white shadow-sm transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Rilis Versi Baru</span>
              </button>
            )}

            <button
              type="button"
              onClick={onExportBackup}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 transition-colors shadow-xs cursor-pointer"
              title="Backup Data JSON"
            >
              <Download className="w-3.5 h-3.5 text-gray-600" />
              <span>Backup JSON</span>
            </button>

            {isAdmin && (
              <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 transition-colors shadow-xs cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-gray-600" />
                <span>Restore</span>
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleFileInput}
                />
              </label>
            )}
          </div>
        </div>
      </div>

      {/* Version List Timeline */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-[#172033] flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-[#C8102E]" />
          <span>Daftar Versi Rilis Kurikulum</span>
        </h3>

        {versiList.map((v) => (
          <article
            key={v.id}
            className="bg-white rounded-xl border border-gray-200 shadow-xs p-6 sm:p-8 space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-100 pb-3">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 rounded-md text-xs font-bold bg-[#172033] text-white font-mono">
                  v{v.nomor_versi}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded text-[11px] font-semibold border ${
                    v.status === 'AKTIF'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-gray-50 text-gray-700 border-gray-200'
                  }`}
                >
                  {v.status}
                </span>
                <h4 className="text-sm font-bold text-[#172033]">
                  {v.nama_versi}
                </h4>
              </div>

              <div className="flex items-center gap-2 text-xs">
                {v.status !== 'AKTIF' && isAdmin && (
                  <button
                    type="button"
                    onClick={() => onActivateVersi(v.id)}
                    className="px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded hover:bg-emerald-100 cursor-pointer"
                  >
                    Aktifkan Versi
                  </button>
                )}
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(v)}
                    className="p-1.5 rounded text-gray-500 hover:text-[#172033] hover:bg-gray-100 transition-colors"
                    title="Edit Versi"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block">
                Catatan Perubahan & Pembaruan:
              </span>
              <p className="text-[15px] text-[#1F2937] leading-relaxed whitespace-pre-line">
                {v.ringkasan_perubahan}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-gray-100 text-xs text-gray-500">
              <span>Tahun Ajaran: <strong className="text-gray-700">{v.tahun_pelajaran}</strong></span>
              <span>Rilis: <strong className="text-gray-700">{v.tanggal_rilis}</strong> oleh <strong className="text-gray-700">{v.pengubah_nama}</strong></span>
            </div>
          </article>
        ))}
      </div>

      {/* Riwayat Log Aktivitas Audit */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-6 sm:p-8 space-y-4">
        <h3 className="text-base font-bold text-[#172033] flex items-center gap-2 border-b border-gray-100 pb-3">
          <Clock className="w-4 h-4 text-[#C8102E]" />
          <span>Audit Log Aktivitas Perubahan ({riwayatList.length} Entri)</span>
        </h3>

        <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
          {riwayatList.slice(0, 25).map((log) => (
            <div
              key={log.id}
              className="p-3.5 rounded-lg bg-[#F5F6F8] border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-[#172033] border border-gray-200">
                    {log.modul}
                  </span>
                  <span className="font-semibold text-[#172033]">
                    {log.judul_perubahan}
                  </span>
                </div>
                <p className="text-gray-600">{log.keterangan}</p>
              </div>

              <div className="text-right sm:text-right shrink-0 text-gray-500 text-[11px]">
                <span className="block font-medium text-gray-700">{log.admin_nama}</span>
                <span>{log.waktu}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Add / Edit Versi */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172033]/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-200 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="text-lg font-bold text-[#172033]">
                {editingVersi ? 'Edit Catatan Versi' : 'Rilis Versi Kurikulum Baru'}
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
                    Nomor Versi *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="mis. 2.1"
                    value={formData.nomor_versi}
                    onChange={(e) => setFormData({ ...formData, nomor_versi: e.target.value })}
                    className="w-full text-xs rounded-md border border-gray-300 p-2.5 font-mono focus:border-[#C8102E] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Status Dokumen *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full text-xs rounded-md border border-gray-300 p-2.5 bg-white focus:border-[#C8102E] outline-none"
                  >
                    <option value="AKTIF">AKTIF (Berlaku)</option>
                    <option value="DRAF">DRAF (Pengembangan)</option>
                    <option value="ARSIP">ARSIP (Terdahulu)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Nama / Label Versi *
                </label>
                <input
                  type="text"
                  required
                  placeholder="mis. Revisi KOSP Semester Genap 2026/2027"
                  value={formData.nama_versi}
                  onChange={(e) => setFormData({ ...formData, nama_versi: e.target.value })}
                  className="w-full text-xs rounded-md border border-gray-300 p-2.5 focus:border-[#C8102E] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Tanggal Rilis
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.tanggal_rilis}
                    onChange={(e) => setFormData({ ...formData, tanggal_rilis: e.target.value })}
                    className="w-full text-xs rounded-md border border-gray-300 p-2.5 focus:border-[#C8102E] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Tahun Pelajaran
                  </label>
                  <input
                    type="text"
                    value={formData.tahun_pelajaran}
                    onChange={(e) => setFormData({ ...formData, tahun_pelajaran: e.target.value })}
                    className="w-full text-xs rounded-md border border-gray-300 p-2.5 focus:border-[#C8102E] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Ringkasan Perubahan *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tuliskan poin-poin perubahan kurikulum..."
                  value={formData.ringkasan_perubahan}
                  onChange={(e) => setFormData({ ...formData, ringkasan_perubahan: e.target.value })}
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
                  Simpan Versi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
