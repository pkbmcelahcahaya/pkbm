import React, { useState } from 'react';
import {
  X,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  FileText,
  Upload,
  Calendar,
  User,
  Phone,
  Mail,
  Shield,
  Printer,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Eye
} from 'lucide-react';
import { PendaftaranWargaBelajar, DokumenPendaftaran, DokumenStatus } from '../types';
import { storage } from '../services/storageService';
import { PrintPreviewModal } from './common/PrintPreviewModal';

interface CekStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenFormulir?: () => void;
}

export const CekStatusModal: React.FC<CekStatusModalProps> = ({
  isOpen,
  onClose,
  onOpenFormulir
}) => {
  const [nomorPendaftaran, setNomorPendaftaran] = useState('');
  const [tanggalLahir, setTanggalLahir] = useState('');
  const [searched, setSearched] = useState(false);
  const [hasilPendaftaran, setHasilPendaftaran] = useState<PendaftaranWargaBelajar | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [previewDoc, setPreviewDoc] = useState<DokumenPendaftaran | null>(null);
  const [uploadingDocId, setUploadingDocId] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState('');
  const [showPrintModal, setShowPrintModal] = useState(false);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessNotice('');
    setSearched(true);

    if (!nomorPendaftaran.trim()) {
      setErrorMessage('Masukkan Nomor Pendaftaran (contoh: PKBM-2026-000101)');
      setHasilPendaftaran(null);
      return;
    }

    const record = storage.getPendaftaranByNomor(nomorPendaftaran.trim());
    if (!record) {
      setErrorMessage('Data pendaftaran tidak ditemukan. Periksa kembali Nomor Pendaftaran Anda.');
      setHasilPendaftaran(null);
      return;
    }

    // If tanggal lahir provided, verify
    if (tanggalLahir && record.tanggal_lahir !== tanggalLahir) {
      setErrorMessage('Tanggal lahir tidak cocok dengan data pendaftaran tersebut.');
      setHasilPendaftaran(null);
      return;
    }

    setHasilPendaftaran(record);
  };

  const handleReuploadDoc = (docId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !hasilPendaftaran) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64Url = reader.result as string;
      const updatedDocs = hasilPendaftaran.dokumen.map(d => {
        if (d.id === docId) {
          return {
            ...d,
            url: base64Url,
            nama_file: file.name,
            tipe_file: file.type,
            ukuran_bytes: file.size,
            status_verifikasi: 'BELUM_DIVERIFIKASI' as DokumenStatus,
            uploaded_at: new Date().toISOString()
          };
        }
        return d;
      });

      const updatedRecord = storage.updatePendaftaran(hasilPendaftaran.id, {
        dokumen: updatedDocs,
        status: 'DIAJUKAN', // Set back to DIAJUKAN for operator re-verification
        catatan_operator: undefined
      });

      if (updatedRecord) {
        setHasilPendaftaran(updatedRecord);
        setSuccessNotice('Dokumen berhasil diunggah ulang! Status pendaftaran telah diperbarui untuk diverifikasi kembali oleh Operator.');
      }
    };
    reader.readAsDataURL(file);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DITERIMA':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Diterima / Terverifikasi</span>
          </span>
        );
      case 'PERLU_PERBAIKAN':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800 animate-pulse">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Perlu Perbaikan Dokumen</span>
          </span>
        );
      case 'DIVERIFIKASI':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
            <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Sedang Diverifikasi</span>
          </span>
        );
      case 'DITOLAK':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
            <X className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            <span>Tidak Memenuhi Syarat</span>
          </span>
        );
      case 'DIAJUKAN':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800">
            <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Menunggu Antrean Verifikasi</span>
          </span>
        );
    }
  };

  const handlePrintSlip = () => {
    if (hasilPendaftaran) {
      setShowPrintModal(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-50 to-indigo-50/30 dark:from-slate-900 dark:to-indigo-950/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-600/20">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Cek Status Pendaftaran PKBM
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pantau verifikasi berkas PPDB & Dapodik Celah Cahaya 2026
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="space-y-4 bg-slate-50 dark:bg-slate-800/40 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Nomor Pendaftaran <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: PKBM-2026-000101"
                  value={nomorPendaftaran}
                  onChange={(e) => setNomorPendaftaran(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-mono uppercase focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Tanggal Lahir (Opsional)
                </label>
                <input
                  type="date"
                  value={tanggalLahir}
                  onChange={(e) => setTanggalLahir(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <p className="text-[11px] text-slate-400">
                Nomor pendaftaran terdapat pada bukti registrasi saat submit.
              </p>
              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer shrink-0"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Cari Data</span>
              </button>
            </div>
          </form>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-3">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Message */}
          {successNotice && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successNotice}</span>
            </div>
          )}

          {/* Search Result */}
          {hasilPendaftaran && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Status Header Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white border border-indigo-800/40 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-black text-amber-400 uppercase tracking-wider">
                      Status Pendaftaran Warga Belajar
                    </span>
                    <h3 className="text-xl font-black text-white">
                      {hasilPendaftaran.nama_lengkap}
                    </h3>
                    <p className="text-xs text-slate-300 font-mono">
                      No: {hasilPendaftaran.nomor_pendaftaran} • {hasilPendaftaran.program_pilihan}
                    </p>
                  </div>
                  <div>{getStatusBadge(hasilPendaftaran.status)}</div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800 text-xs">
                  <div>
                    <p className="text-[10px] text-slate-400">Tahun Ajaran</p>
                    <p className="font-bold text-white">{hasilPendaftaran.tahun_ajaran}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">Jalur</p>
                    <p className="font-bold text-white">{hasilPendaftaran.jenis_pendaftaran === 'PINDAHAN' ? 'Pindahan' : 'Siswa Baru'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">Tanggal Daftar</p>
                    <p className="font-bold text-white">
                      {new Date(hasilPendaftaran.tanggal_pendaftaran).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">NIK (Tersamar)</p>
                    <p className="font-bold text-white font-mono">
                      {hasilPendaftaran.nik.substring(0, 6)}******{hasilPendaftaran.nik.substring(12)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Operator Note if Perlu Perbaikan */}
              {hasilPendaftaran.catatan_operator && (
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
                    <AlertCircle className="w-4 h-4" />
                    <span>Catatan Dari Petugas Verifikasi Dapodik:</span>
                  </div>
                  <p className="text-xs leading-relaxed bg-white/70 dark:bg-slate-900/60 p-3 rounded-xl border border-amber-200 dark:border-amber-900 font-medium">
                    "{hasilPendaftaran.catatan_operator}"
                  </p>
                  {hasilPendaftaran.status === 'PERLU_PERBAIKAN' && (
                    <p className="text-[11px] text-amber-700 dark:text-amber-300 font-semibold">
                      Silakan unggah ulang dokumen yang bermasalah pada daftar berkas di bawah ini.
                    </p>
                  )}
                </div>
              )}

              {/* Document List & Verification Status */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Daftar Dokumen Digital & Status Verifikasi</span>
                  <span className="text-[11px] font-normal text-slate-400">
                    {hasilPendaftaran.dokumen.length} Berkas
                  </span>
                </h4>

                <div className="space-y-2.5">
                  {hasilPendaftaran.dokumen.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0 font-bold">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">
                            {doc.label}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate max-w-xs">
                            {doc.nama_file} • {(doc.ukuran_bytes / 1024).toFixed(0)} KB
                          </p>
                          {doc.catatan_operator && (
                            <p className="text-[11px] text-rose-500 font-medium mt-0.5">
                              Catatan: {doc.catatan_operator}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        {/* Doc Verification Badge */}
                        {doc.status_verifikasi === 'VALID' ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            ✓ Valid
                          </span>
                        ) : doc.status_verifikasi === 'PERLU_PERBAIKAN' ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            ! Perlu Perbaikan
                          </span>
                        ) : doc.status_verifikasi === 'TIDAK_VALID' ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                            ✕ Tidak Valid
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                            Menunggu Verifikasi
                          </span>
                        )}

                        {/* View Preview Button */}
                        <button
                          onClick={() => setPreviewDoc(doc)}
                          className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Lihat</span>
                        </button>

                        {/* Re-upload button if requested */}
                        {doc.status_verifikasi === 'PERLU_PERBAIKAN' && (
                          <label className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-[11px] font-bold flex items-center gap-1.5 cursor-pointer shadow-sm">
                            <Upload className="w-3 h-3" />
                            <span>Unggah Ulang</span>
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              className="hidden"
                              onChange={(e) => handleReuploadDoc(doc.id, e)}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={handlePrintSlip}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Bukti Status</span>
                </button>

                <p className="text-[11px] text-slate-400">
                  Butuh bantuan? Hubungi WhatsApp Admin: <strong className="text-slate-600 dark:text-slate-300">0821-1936-2454</strong>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between text-xs">
          <p className="text-slate-500 dark:text-slate-400 text-[11px]">
            PKBM Celah Cahaya • Layanan Pendaftaran Kesetaraan Paket B & C
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>

      {/* Doc Preview Lightbox */}
      {previewDoc && (
        <div className="fixed inset-0 z-60 bg-slate-950/90 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-black text-slate-900 dark:text-white text-sm">
                Preview Berkas: {previewDoc.label}
              </h3>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-auto flex items-center justify-center min-h-[300px] bg-slate-100 dark:bg-slate-950 rounded-2xl p-2">
              {previewDoc.tipe_file.includes('pdf') ? (
                <iframe
                  src={previewDoc.url}
                  title={previewDoc.label}
                  className="w-full h-96 rounded-xl"
                />
              ) : (
                <img
                  src={previewDoc.url}
                  alt={previewDoc.label}
                  className="max-h-96 max-w-full object-contain rounded-xl"
                />
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{previewDoc.nama_file}</span>
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl"
              >
                Tutup Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Print Preview & Export Modal */}
      {showPrintModal && hasilPendaftaran && (
        <PrintPreviewModal
          isOpen={showPrintModal}
          onClose={() => setShowPrintModal(false)}
          defaultDocType="PPDB_SLIP"
          docData={hasilPendaftaran}
          title={`Bukti Pendaftaran - ${hasilPendaftaran.nama_lengkap}`}
        />
      )}
    </div>
  );
};
