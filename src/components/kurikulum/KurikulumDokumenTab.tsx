import React, { useState } from 'react';
import {
  FileText,
  Download,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Eye,
  CheckCircle2,
  Clock,
  ShieldCheck,
  FolderDown,
  X
} from 'lucide-react';
import { DokumenKurikulum, KategoriDokumenKurikulum, User } from '../../types';

interface KurikulumDokumenTabProps {
  dokumenList: DokumenKurikulum[];
  currentUser: User | null;
  onSaveDokumen: (doc: Omit<DokumenKurikulum, 'id'> & { id?: string }) => void;
  onDeleteDokumen: (id: string) => void;
  onPreviewPdf?: () => void;
}

export const KurikulumDokumenTab: React.FC<KurikulumDokumenTabProps> = ({
  dokumenList,
  currentUser,
  onSaveDokumen,
  onDeleteDokumen,
  onPreviewPdf
}) => {
  const isAdmin = currentUser?.role === 'ADMIN';

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<DokumenKurikulum | null>(null);

  const [formData, setFormData] = useState<{
    nama_dokumen: string;
    kategori: KategoriDokumenKurikulum;
    program: 'SEMUA' | 'PAKET B' | 'PAKET C';
    tahun_pelajaran: string;
    deskripsi: string;
    format_file: string;
    file_url: string;
    ukuran_file: string;
    status_publikasi: 'PUBLIK' | 'INTERNAL' | 'DRAF' | 'AKTIF';
  }>({
    nama_dokumen: '',
    kategori: 'KOSP_LENGKAP',
    program: 'SEMUA',
    tahun_pelajaran: '2026/2027',
    deskripsi: '',
    format_file: 'PDF',
    file_url: '',
    ukuran_file: '1.5 MB',
    status_publikasi: 'PUBLIK'
  });

  const handleOpenAdd = () => {
    setEditingDoc(null);
    setFormData({
      nama_dokumen: '',
      kategori: 'KOSP_LENGKAP',
      program: 'SEMUA',
      tahun_pelajaran: '2026/2027',
      deskripsi: '',
      format_file: 'PDF',
      file_url: '',
      ukuran_file: '1.2 MB',
      status_publikasi: 'PUBLIK'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (doc: DokumenKurikulum) => {
    setEditingDoc(doc);
    setFormData({
      nama_dokumen: doc.nama_dokumen || doc.judul_dokumen || '',
      kategori: doc.kategori,
      program: doc.program,
      tahun_pelajaran: doc.tahun_pelajaran,
      deskripsi: doc.deskripsi || '',
      format_file: doc.format_file || 'PDF',
      file_url: doc.file_url || doc.url_file || '',
      ukuran_file: doc.ukuran_file || '1.0 MB',
      status_publikasi: (doc.status_publikasi as any) || 'PUBLIK'
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama_dokumen.trim()) return;

    onSaveDokumen({
      ...(editingDoc ? { id: editingDoc.id } : {}),
      nama_dokumen: formData.nama_dokumen.trim(),
      judul_dokumen: formData.nama_dokumen.trim(),
      kategori: formData.kategori,
      program: formData.program,
      tahun_pelajaran: formData.tahun_pelajaran,
      deskripsi: formData.deskripsi.trim(),
      format_file: formData.format_file,
      file_url: formData.file_url.trim() || '#',
      url_file: formData.file_url.trim() || '#',
      ukuran_file: formData.ukuran_file.trim(),
      status_publikasi: formData.status_publikasi,
      uploaded_by: currentUser?.name || 'Administrator',
      tanggal_unggah: new Date().toISOString().split('T')[0]
    });

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn text-[#1F2937]">
      {/* Header & Actions Bar */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-4">
          <div>
            <h2 className="text-xl font-bold text-[#172033] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#C8102E]" />
              <span>Repositori Dokumen Kurikulum & SK Resmi</span>
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Arsip berkas kurikulum operasional (KOSP), silabus, modul ajar, dan surat keputusan tim pengembang kurikulum PKBM.
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
                <span>Unggah Dokumen</span>
              </button>
            )}

            {onPreviewPdf && (
              <button
                type="button"
                onClick={onPreviewPdf}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 transition-colors shadow-xs cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-gray-600" />
                <span>Preview KOSP Resmi</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Document Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dokumenList.map((doc) => (
          <article
            key={doc.id}
            className="bg-white rounded-xl border border-gray-200 shadow-xs p-6 flex flex-col justify-between space-y-4 hover:border-gray-300 transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#F5F6F8] text-[#172033] border border-gray-200">
                    {doc.kategori}
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold text-gray-600 bg-gray-50 border border-gray-200">
                    {doc.format_file || 'PDF'}
                  </span>
                </div>

                {isAdmin && (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(doc)}
                      className="p-1.5 rounded text-gray-500 hover:text-[#172033] hover:bg-gray-100 transition-colors"
                      title="Edit Dokumen"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Hapus dokumen ${doc.nama_dokumen || doc.judul_dokumen}?`)) {
                          onDeleteDokumen(doc.id);
                        }
                      }}
                      className="p-1.5 rounded text-gray-500 hover:text-[#C8102E] hover:bg-red-50 transition-colors"
                      title="Hapus Dokumen"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <h3 className="text-base font-bold text-[#172033] leading-snug">
                {doc.nama_dokumen || doc.judul_dokumen}
              </h3>

              {doc.deskripsi && (
                <p className="text-xs text-gray-600 leading-relaxed">
                  {doc.deskripsi}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs">
              <span className="text-gray-500">
                {doc.ukuran_file} • {doc.tahun_pelajaran}
              </span>

              <a
                href={doc.file_url || doc.url_file || '#'}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-semibold text-[#C8102E] hover:underline"
              >
                <span>Unduh Dokumen</span>
                <Download className="w-3.5 h-3.5" />
              </a>
            </div>
          </article>
        ))}
      </div>

      {/* Modal Add / Edit Document */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172033]/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-200 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="text-lg font-bold text-[#172033]">
                {editingDoc ? 'Edit Data Dokumen' : 'Unggah Dokumen Kurikulum'}
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
                  Judul Dokumen *
                </label>
                <input
                  type="text"
                  required
                  placeholder="mis. KOSP PKBM Celah Cahaya 2026/2027"
                  value={formData.nama_dokumen}
                  onChange={(e) => setFormData({ ...formData, nama_dokumen: e.target.value })}
                  className="w-full text-xs rounded-md border border-gray-300 p-2.5 focus:border-[#C8102E] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Kategori Dokumen *
                  </label>
                  <select
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value as any })}
                    className="w-full text-xs rounded-md border border-gray-300 p-2.5 bg-white focus:border-[#C8102E] outline-none"
                  >
                    <option value="KOSP_LENGKAP">KOSP Lengkap</option>
                    <option value="STRUKTUR_SKK">Struktur & SKK</option>
                    <option value="CAPAIAN_PEMBELAJARAN">Capaian Pembelajaran</option>
                    <option value="ALUR_TUJUAN_PEMBELAJARAN">Alur Tujuan Pembelajaran</option>
                    <option value="MODUL_AJAR">Modul Ajar Pembelajaran</option>
                    <option value="PEDOMAN_ASESMEN">Pedoman Asesmen</option>
                    <option value="KALENDER_PENDIDIKAN">Kalender Pendidikan</option>
                    <option value="SK_TIM_PENGEMBANG">SK Tim Pengembang</option>
                    <option value="LAINNYA">Dokumen Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Format File
                  </label>
                  <input
                    type="text"
                    placeholder="mis. PDF / DOCX"
                    value={formData.format_file}
                    onChange={(e) => setFormData({ ...formData, format_file: e.target.value })}
                    className="w-full text-xs rounded-md border border-gray-300 p-2.5 focus:border-[#C8102E] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Tautan File (URL Google Drive / Cloud Storage)
                </label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/..."
                  value={formData.file_url}
                  onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                  className="w-full text-xs rounded-md border border-gray-300 p-2.5 focus:border-[#C8102E] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Keterangan Singkat
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
                  Simpan Dokumen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
