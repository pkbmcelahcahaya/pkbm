import React, { useState, useEffect } from 'react';
import { Materi, PaketType } from '../../types';
import { X, BookOpen, HardDrive, FileText, Link, Layers, CheckCircle2 } from 'lucide-react';

interface MateriEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  materi: Materi | null;
  onSave: (savedMateri: Partial<Materi>) => void;
}

export const MateriEditModal: React.FC<MateriEditModalProps> = ({
  isOpen,
  onClose,
  materi,
  onSave
}) => {
  const [judul, setJudul] = useState('');
  const [paket, setPaket] = useState<PaketType>('PAKET B');
  const [mataPelajaran, setMataPelajaran] = useState('');
  const [tingkatan, setTingkatan] = useState('Kelas 7-9');
  const [namaFile, setNamaFile] = useState('');
  const [ukuranFile, setUkuranFile] = useState('4.5 MB');
  const [driveUrl, setDriveUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [sumberUrl, setSumberUrl] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [status, setStatus] = useState<'AKTIF' | 'NONAKTIF'>('AKTIF');

  useEffect(() => {
    if (materi) {
      setJudul(materi.judul || '');
      setPaket(materi.paket || 'PAKET B');
      setMataPelajaran(materi.mata_pelajaran || '');
      setTingkatan(materi.tingkatan || (materi.paket === 'PAKET B' ? 'Kelas 7-9' : 'Kelas 10-12'));
      setNamaFile(materi.nama_file || '');
      setUkuranFile(materi.ukuran_file || '4.5 MB');
      setDriveUrl(materi.drive_url || '');
      setPreviewUrl(materi.preview_url || '');
      setSumberUrl(materi.sumber_url || '');
      setDeskripsi(materi.deskripsi || '');
      setStatus(materi.status || 'AKTIF');
    } else {
      setJudul('');
      setPaket('PAKET B');
      setMataPelajaran('Bahasa Indonesia');
      setTingkatan('Kelas 7-9');
      setNamaFile('');
      setUkuranFile('4.2 MB');
      setDriveUrl('https://drive.google.com/drive/folders/1JWAMU6COy1S8seU2fInEYLPgTf_mH4AX');
      setPreviewUrl('https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf');
      setSumberUrl('');
      setDeskripsi('');
      setStatus('AKTIF');
    }
  }, [materi, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul.trim() || !mataPelajaran.trim()) {
      alert('Judul modul dan mata pelajaran wajib diisi.');
      return;
    }

    const payload: Partial<Materi> = {
      judul: judul.trim(),
      paket,
      mata_pelajaran: mataPelajaran.trim(),
      tingkatan,
      nama_file: namaFile.trim() || `${judul.trim().replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
      ukuran_file: ukuranFile.trim() || '4.5 MB',
      drive_url: driveUrl.trim() || 'https://drive.google.com/drive/folders/1JWAMU6COy1S8seU2fInEYLPgTf_mH4AX',
      preview_url: previewUrl.trim() || driveUrl.trim() || 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf',
      sumber_url: sumberUrl.trim() || undefined,
      deskripsi: deskripsi.trim() || `Modul Kurikulum Kesetaraan ${paket} untuk mata pelajaran ${mataPelajaran}.`,
      status,
      kategori: 'Kurikulum Kesetaraan'
    };

    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {materi ? 'Edit Modul Pembelajaran' : 'Tambah Modul Pembelajaran Baru'}
              </h3>
              <p className="text-xs text-slate-500">
                LMS Modul Digital PKBM Celah Cahaya Terintegrasi Google Drive.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Judul Modul Lengkap *
            </label>
            <input
              type="text"
              value={judul}
              onChange={e => setJudul(e.target.value)}
              placeholder="Contoh: Modul 1 - Indahnya Negeriku"
              required
              className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Program Paket *
              </label>
              <select
                value={paket}
                onChange={e => {
                  const p = e.target.value as PaketType;
                  setPaket(p);
                  setTingkatan(p === 'PAKET B' ? 'Kelas 7-9' : 'Kelas 10-12');
                }}
                className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
              >
                <option value="PAKET B">PAKET B (Setara SMP)</option>
                <option value="PAKET C">PAKET C (Setara SMA)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Tingkatan / Derajat
              </label>
              <input
                type="text"
                value={tingkatan}
                onChange={e => setTingkatan(e.target.value)}
                placeholder="Contoh: Kelas 7-9 / Derajat 3"
                className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Mata Pelajaran *
              </label>
              <input
                type="text"
                value={mataPelajaran}
                onChange={e => setMataPelajaran(e.target.value)}
                placeholder="Contoh: Bahasa Indonesia"
                required
                className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Ukuran File (Estimasi)
              </label>
              <input
                type="text"
                value={ukuranFile}
                onChange={e => setUkuranFile(e.target.value)}
                placeholder="Contoh: 4.8 MB"
                className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Nama File Dokumen PDF
            </label>
            <input
              type="text"
              value={namaFile}
              onChange={e => setNamaFile(e.target.value)}
              placeholder="Contoh: B-Bahasa_Indonesia-Modul_1.pdf"
              className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-[11px]"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Link File Google Drive / PDF
            </label>
            <input
              type="url"
              value={driveUrl}
              onChange={e => setDriveUrl(e.target.value)}
              placeholder="https://drive.google.com/file/d/.../view"
              className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-[11px]"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Deskripsi / Ringkasan Materi
            </label>
            <textarea
              rows={2}
              value={deskripsi}
              onChange={e => setDeskripsi(e.target.value)}
              placeholder="Tuliskan ringkasan pokok bahasan dalam modul ini..."
              className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl resize-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Status Modul
            </label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as any)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
            >
              <option value="AKTIF">AKTIF (Dapat Dibaca Warga Belajar)</option>
              <option value="NONAKTIF">NONAKTIF (Disembunyikan / Draf)</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm cursor-pointer"
            >
              Simpan Modul
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
