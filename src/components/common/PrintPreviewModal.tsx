import React, { useState, useRef, useMemo } from 'react';
import {
  Printer,
  Download,
  X,
  Cloud,
  CheckCircle2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Filter,
  FileText,
  RotateCw,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Building2,
  User as UserIcon,
  BookOpen,
  Calendar,
  Layers,
  Award
} from 'lucide-react';
import { MASTER_LEMBAGA, ALAMAT_LENGKAP_LEMBAGA } from '../../data/lembagaConfig';
import { LogoPKBM } from '../LogoPKBM';
import { DocumentPrintConfig, formatTanggalIndo, formatWaktuLengkapIndo } from '../../utils/printDocTemplates';
import { googleSheetsSync } from '../../services/googleSheetsSyncService';

interface PrintPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: DocumentPrintConfig | null;
}

export const PrintPreviewModal: React.FC<PrintPreviewModalProps> = ({
  isOpen,
  onClose,
  config
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [orientation, setOrientation] = useState<'PORTRAIT' | 'LANDSCAPE'>(
    config?.orientation || 'PORTRAIT'
  );
  const [filterPaket, setFilterPaket] = useState<string>(config?.filterInfo?.paket || 'SEMUA');
  const [filterKelas, setFilterKelas] = useState<string>(config?.filterInfo?.kelas || 'SEMUA');
  const [filterMapel, setFilterMapel] = useState<string>(config?.filterInfo?.mapel || 'SEMUA');
  const [isUploadingToDrive, setIsUploadingToDrive] = useState(false);
  const [driveUploadResult, setDriveUploadResult] = useState<{ url?: string; message?: string } | null>(null);

  const printAreaRef = useRef<HTMLDivElement>(null);

  // Sync orientation when config changes
  React.useEffect(() => {
    if (config?.orientation) {
      setOrientation(config.orientation);
    }
  }, [config]);

  if (!isOpen || !config) return null;

  const handleDirectPrint = () => {
    window.print();
  };

  const handleSaveToDrive = async () => {
    setIsUploadingToDrive(true);
    setDriveUploadResult(null);

    try {
      // Create document metadata snapshot to upload to Google Drive
      const docName = `${config.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_${new Date().toISOString().slice(0, 10)}.json`;
      const docPayload = {
        title: config.title,
        nomorSurat: config.nomorSurat,
        generated_at: new Date().toISOString(),
        institution: MASTER_LEMBAGA,
        data: config.data
      };

      const base64Data = btoa(unescape(encodeURIComponent(JSON.stringify(docPayload, null, 2))));
      const result = await googleSheetsSync.uploadFileToDrive(
        base64Data,
        docName,
        'application/json',
        'DOKUMEN_CETAK_LMS'
      );

      if (result.success) {
        setDriveUploadResult({
          url: result.fileUrl,
          message: 'Dokumen berhasil disimpan secara permanen di Google Drive PKBM Celah Cahaya.'
        });
      } else {
        setDriveUploadResult({
          message: result.message || 'Gagal mengunggah ke Google Drive. Pastikan URL GAS telah terkonfigurasi.'
        });
      }
    } catch (err: any) {
      setDriveUploadResult({
        message: `Terjadi kendala saat upload ke Drive: ${err.message}`
      });
    } finally {
      setIsUploadingToDrive(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-start overflow-hidden">
      {/* Top Floating Control Bar */}
      <div className="w-full bg-slate-900 border-b border-slate-800 text-white px-4 sm:px-6 py-3 flex items-center justify-between gap-4 shrink-0 shadow-lg print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white shadow-md">
            <Printer className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-white tracking-tight flex items-center gap-2">
              <span>{config.title}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 uppercase">
                {orientation}
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Dokumen Resmi PKBM Celah Cahaya • NPSN: {MASTER_LEMBAGA.npsn}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Orientation Toggle */}
          <button
            onClick={() => setOrientation(prev => (prev === 'PORTRAIT' ? 'LANDSCAPE' : 'PORTRAIT'))}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 flex items-center gap-1.5 cursor-pointer transition-colors"
            title="Ubah Orientasi Halaman"
          >
            <RotateCw className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden md:inline">{orientation === 'PORTRAIT' ? 'Landscape' : 'Portrait'}</span>
          </button>

          {/* Zoom Controls */}
          <div className="hidden sm:flex items-center bg-slate-800 rounded-xl border border-slate-700 p-0.5">
            <button
              onClick={() => setZoomLevel(prev => Math.max(50, prev - 15))}
              className="p-1.5 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer"
              title="Perkecil Preview"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 text-xs font-mono font-bold text-slate-300">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(150, prev + 15))}
              className="p-1.5 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer"
              title="Perbesar Preview"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Save to Google Drive Button */}
          <button
            onClick={handleSaveToDrive}
            disabled={isUploadingToDrive}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors disabled:opacity-50"
            title="Simpan Dokumen ke Google Drive PKBM"
          >
            <Cloud className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">{isUploadingToDrive ? 'Mengunggah...' : 'Simpan ke Drive'}</span>
          </button>

          {/* Save as PDF / Direct Print */}
          <button
            onClick={handleDirectPrint}
            className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-black shadow-md flex items-center gap-1.5 cursor-pointer transition-all"
            title="Cetak via Printer atau Simpan sebagai PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak / Simpan PDF</span>
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Tutup Pratinjau"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Drive Upload Notification */}
      {driveUploadResult && (
        <div className="w-full bg-emerald-950/80 border-b border-emerald-800 text-emerald-200 px-6 py-2 text-xs flex items-center justify-between gap-4 print:hidden">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{driveUploadResult.message}</span>
          </div>
          {driveUploadResult.url && (
            <a
              href={driveUploadResult.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-bold flex items-center gap-1 shrink-0"
            >
              <span>Buka di Google Drive</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      )}

      {/* Document Canvas Container */}
      <div className="flex-1 w-full overflow-y-auto overflow-x-auto p-4 sm:p-8 flex justify-center items-start print:p-0 print:overflow-visible">
        <div
          ref={printAreaRef}
          style={{
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: 'top center'
          }}
          className={`printable-content bg-white text-slate-900 shadow-2xl rounded-sm p-8 sm:p-12 transition-transform duration-150 border border-slate-300 print:shadow-none print:border-none print:m-0 print:p-6 print:rounded-none print:transform-none ${
            orientation === 'PORTRAIT'
              ? 'w-[210mm] min-h-[297mm]'
              : 'w-[297mm] min-h-[210mm]'
          }`}
        >
          {/* Official KOP SURAT PKBM CELAH CAHAYA */}
          <div className="border-b-[3px] border-double border-slate-900 pb-3 mb-6 flex items-center justify-between gap-4">
            <div className="w-20 h-20 shrink-0 flex items-center justify-center">
              <LogoPKBM size="lg" imageClassName="object-contain" />
            </div>

            <div className="text-center flex-1 space-y-0.5">
              <h4 className="text-xs font-bold tracking-widest text-slate-700 uppercase">
                DINAS PENDIDIKAN KABUPATEN GARUT
              </h4>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-slate-950 uppercase leading-tight font-serif">
                PUSAT KEGIATAN BELAJAR MASYARAKAT (PKBM) CELAH CAHAYA
              </h2>
              <p className="text-[11px] font-bold text-slate-800">
                IZIN OPERASIONAL: {MASTER_LEMBAGA.sk_operasional} • NPSN: {MASTER_LEMBAGA.npsn}
              </p>
              <p className="text-[10px] text-slate-600 leading-tight">
                {ALAMAT_LENGKAP_LEMBAGA} • Email: pkbmcelahcahaya@gmail.com • HP/WA: +62 821-2708-6663
              </p>
            </div>

            <div className="w-20 h-20 shrink-0 flex flex-col items-center justify-center p-1 border border-slate-300 rounded text-center">
              <span className="text-[8px] font-black text-slate-400 uppercase">AKREDITASI</span>
              <span className="text-lg font-black text-indigo-700">A</span>
              <span className="text-[8px] font-bold text-slate-500">DIKMAS</span>
            </div>
          </div>

          {/* Document Heading */}
          <div className="text-center mb-6 space-y-1">
            <h3 className="text-sm sm:text-base font-black tracking-wide uppercase text-slate-900 underline underline-offset-4 decoration-2">
              {config.title}
            </h3>
            {config.nomorSurat && (
              <p className="text-[11px] font-mono text-slate-600">
                Nomor: {config.nomorSurat}
              </p>
            )}
            {config.subtitle && (
              <p className="text-xs font-semibold text-slate-700">
                {config.subtitle}
              </p>
            )}
          </div>

          {/* Content Body Based on docType */}
          <div className="text-xs space-y-4 text-slate-800">
            {renderDocContent(config, orientation)}
          </div>

          {/* Official Signatures & Seal Section */}
          <div className="mt-12 pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 text-xs break-inside-avoid">
            <div className="space-y-1">
              <p className="text-[11px] text-slate-500">Keabsahan Dokumen Digital:</p>
              <div className="p-2 border border-slate-200 rounded-lg inline-flex items-center gap-2 bg-slate-50">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="text-[10px]">
                  <p className="font-bold text-slate-800">Tervalidasi Sistem LMS</p>
                  <p className="text-slate-500 font-mono">ID: DOC-{Date.now().toString(36).toUpperCase()}</p>
                </div>
              </div>
              <p className="text-[9px] text-slate-400 mt-1">
                Dicetak pada: {formatWaktuLengkapIndo(new Date().toISOString())}
              </p>
            </div>

            <div className="text-right space-y-1">
              <p>Garut, {formatTanggalIndo(new Date().toISOString())}</p>
              <p className="font-bold text-slate-900">Ketua PKBM Celah Cahaya,</p>
              <div className="h-16 flex items-center justify-end pr-6">
                <span className="text-[10px] font-mono text-slate-300 italic">[ Tanda Tangan & Stempel Resmi ]</span>
              </div>
              <p className="font-black text-slate-950 underline underline-offset-2">
                H. ASEP SAEPUDIN, S.Pd.
              </p>
              <p className="text-[10px] text-slate-500">NIP/NUPTK: 197805122008011005</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Renderer for different document types
 */
function renderDocContent(config: DocumentPrintConfig, orientation: 'PORTRAIT' | 'LANDSCAPE') {
  const { docType, data } = config;

  switch (docType) {
    // 1. SLIP BUKTI PENDAFTARAN PPDB
    case 'PPDB_SLIP': {
      const p = data;
      return (
        <div className="space-y-5">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500">Nomor Registrasi</span>
                <span className="col-span-2 font-black text-indigo-900 font-mono text-sm">
                  : {p.nomor_pendaftaran}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500">Nama Lengkap</span>
                <span className="col-span-2 font-bold uppercase">: {p.nama_lengkap}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500">Program Kesetaraan</span>
                <span className="col-span-2 font-bold">: {p.program_pilihan}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500">NISN / NIK</span>
                <span className="col-span-2 font-mono">: {p.nisn || '-'} / {p.nik || '-'}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500">Status Pendaftaran</span>
                <span className="col-span-2 font-black text-emerald-700">: {p.status || 'DIAJUKAN'}</span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-2 border border-slate-300 rounded-lg bg-white text-center">
              {p.pas_foto_url ? (
                <img src={p.pas_foto_url} alt={p.nama_lengkap} className="w-20 h-28 object-cover rounded border" />
              ) : (
                <div className="w-20 h-28 border border-dashed border-slate-400 flex items-center justify-center text-[10px] text-slate-400">
                  Pas Foto 3x4
                </div>
              )}
            </div>
          </div>

          <div>
            <h5 className="font-bold text-xs uppercase tracking-wider text-slate-900 mb-2 border-b pb-1">
              Rincian Biodata & Domisili Calon Warga Belajar
            </h5>
            <table className="w-full text-xs border-collapse">
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="py-1.5 w-1/3 text-slate-600 font-medium">Tempat, Tanggal Lahir</td>
                  <td className="py-1.5 font-semibold">: {p.tempat_lahir || '-'}, {formatTanggalIndo(p.tanggal_lahir)}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-1.5 text-slate-600 font-medium">Jenis Kelamin / Agama</td>
                  <td className="py-1.5 font-semibold">: {p.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'} / {p.agama || 'Islam'}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-1.5 text-slate-600 font-medium">Alamat Lengkap</td>
                  <td className="py-1.5 font-semibold">: {p.alamat_lengkap || '-'} RT {p.rt || '00'}/RW {p.rw || '00'}, {p.desa_kelurahan}, {p.kecamatan}, {p.kabupaten_kota}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-1.5 text-slate-600 font-medium">Nomor WhatsApp / HP</td>
                  <td className="py-1.5 font-mono font-semibold">: {p.nomor_wa || p.nomor_hp || '-'}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-1.5 text-slate-600 font-medium">Sekolah Asal</td>
                  <td className="py-1.5 font-semibold">: {p.sekolah_asal || '-'} (Lulus Tahun {p.tahun_lulus || '-'})</td>
                </tr>
                <tr>
                  <td className="py-1.5 text-slate-600 font-medium">Nama Orang Tua (Ibu/Ayah)</td>
                  <td className="py-1.5 font-semibold">: {p.ibu_nama || '-'} / {p.ayah_nama || '-'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-900">
            <strong>Catatan Penting:</strong> Bawa slip bukti pendaftaran ini bersama fotokopi berkas fisik (Ijazah terakhir, Akta Kelahiran, Kartu Keluarga, dan Pas Foto 3x4 sebanyak 3 lembar) ke Sekretariat PKBM Celah Cahaya untuk proses verifikasi administrasi Dapodik Kemendikbud.
          </div>
        </div>
      );
    }

    // 2. KARTU TANDA PELAJAR (KTS)
    case 'KARTU_PELAJAR': {
      const u = data;
      return (
        <div className="flex flex-col items-center justify-center py-6">
          <div className="w-[85.6mm] h-[53.98mm] bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white rounded-2xl p-4 shadow-xl border-2 border-amber-400 relative overflow-hidden flex flex-col justify-between">
            {/* Top Bar */}
            <div className="flex items-center gap-2.5 border-b border-white/20 pb-2">
              <LogoPKBM size="sm" imageClassName="bg-white p-0.5 rounded-md" />
              <div className="flex-1">
                <h5 className="text-[9px] font-black tracking-wider text-amber-400 uppercase">KARTU TANDA WARGA BELAJAR</h5>
                <h4 className="text-[10px] font-extrabold text-white tracking-tight">{MASTER_LEMBAGA.nama}</h4>
                <p className="text-[7px] text-slate-300">NPSN: {MASTER_LEMBAGA.npsn} • GARUT JAWA BARAT</p>
              </div>
            </div>

            {/* Body */}
            <div className="flex items-center gap-3 my-1">
              <img
                src={u.foto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'}
                alt={u.nama}
                className="w-14 h-18 rounded-lg object-cover border-2 border-amber-400 shrink-0 bg-white"
              />
              <div className="space-y-0.5 text-[8px] flex-1">
                <p className="text-[10px] font-black text-amber-300 uppercase leading-tight">{u.nama}</p>
                <p><span className="text-slate-400">NISN:</span> <strong className="font-mono">{u.nisn || '-'}</strong></p>
                <p><span className="text-slate-400">NIK:</span> <strong className="font-mono">{u.nik || '-'}</strong></p>
                <p><span className="text-slate-400">Program:</span> <strong>{u.paket || 'PAKET B'}</strong> ({u.kelas || 'Tingkat Terampil'})</p>
                <p><span className="text-slate-400">TTL:</span> {u.tempat_lahir || 'Garut'}, {formatTanggalIndo(u.tanggal_lahir)}</p>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="flex items-center justify-between text-[7px] text-slate-400 border-t border-white/10 pt-1">
              <span>Berlaku Selama Menjadi Warga Belajar</span>
              <span className="font-bold text-amber-400">STATUS: AKTIF DAPODIK</span>
            </div>
          </div>
        </div>
      );
    }

    // 3. REKAP MASTER DATA WARGA BELAJAR (SISWA)
    case 'REKAP_SISWA': {
      const list = Array.isArray(data) ? data : [];
      return (
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            Total Warga Belajar: <strong>{list.length} Siswa Terdaftar</strong>
          </p>
          <table className="w-full text-[10px] border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 font-bold text-slate-800 text-center">
                <th className="border border-slate-300 p-1.5 w-8">No</th>
                <th className="border border-slate-300 p-1.5">NISN / NIK</th>
                <th className="border border-slate-300 p-1.5 text-left">Nama Lengkap Siswa</th>
                <th className="border border-slate-300 p-1.5 w-8">JK</th>
                <th className="border border-slate-300 p-1.5">Paket / Rombel</th>
                <th className="border border-slate-300 p-1.5 text-left">Tempat, Tgl Lahir</th>
                <th className="border border-slate-300 p-1.5 text-left">Alamat Domisili</th>
                <th className="border border-slate-300 p-1.5 w-16">Status</th>
              </tr>
            </thead>
            <tbody>
              {list.map((s: any, idx: number) => (
                <tr key={s.id || idx} className="border-b border-slate-200 even:bg-slate-50/50">
                  <td className="border border-slate-300 p-1.5 text-center font-bold">{idx + 1}</td>
                  <td className="border border-slate-300 p-1.5 font-mono text-center">
                    {s.nisn || '-'}<br />
                    <span className="text-[8px] text-slate-500">{s.nik || '-'}</span>
                  </td>
                  <td className="border border-slate-300 p-1.5 font-bold uppercase">{s.nama}</td>
                  <td className="border border-slate-300 p-1.5 text-center">{s.jenis_kelamin || 'L'}</td>
                  <td className="border border-slate-300 p-1.5 text-center font-semibold">
                    {s.paket || '-'}<br />
                    <span className="text-[8px] text-slate-500">{s.kelas || '-'}</span>
                  </td>
                  <td className="border border-slate-300 p-1.5">
                    {s.tempat_lahir || '-'}, {formatTanggalIndo(s.tanggal_lahir)}
                  </td>
                  <td className="border border-slate-300 p-1.5">
                    {s.alamat || '-'} {s.kelurahan ? `Kel. ${s.kelurahan}` : ''}
                  </td>
                  <td className="border border-slate-300 p-1.5 text-center font-bold text-emerald-700">
                    {s.status || 'AKTIF'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    // 4. REKAPITULASI NILAI KUIS 100 SOAL
    case 'REKAP_KUIS_100': {
      const list = Array.isArray(data) ? data : [];
      return (
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            Total Evaluasi Kuis Terselesaikan: <strong>{list.length} Percobaan</strong>
          </p>
          <table className="w-full text-[10px] border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 font-bold text-slate-800 text-center">
                <th className="border border-slate-300 p-1.5 w-8">No</th>
                <th className="border border-slate-300 p-1.5 text-left">Nama Siswa</th>
                <th className="border border-slate-300 p-1.5 text-left">Judul Modul & Mapel</th>
                <th className="border border-slate-300 p-1.5">Paket</th>
                <th className="border border-slate-300 p-1.5">Benar/Salah</th>
                <th className="border border-slate-300 p-1.5 font-black">Nilai Akhir</th>
                <th className="border border-slate-300 p-1.5">Status</th>
                <th className="border border-slate-300 p-1.5">Waktu Selesai</th>
              </tr>
            </thead>
            <tbody>
              {list.map((q: any, idx: number) => (
                <tr key={q.id || idx} className="border-b border-slate-200 even:bg-slate-50/50">
                  <td className="border border-slate-300 p-1.5 text-center font-bold">{idx + 1}</td>
                  <td className="border border-slate-300 p-1.5 font-bold uppercase">{q.siswa_nama || q.user_nama}</td>
                  <td className="border border-slate-300 p-1.5">
                    <strong>{q.materi_judul}</strong><br />
                    <span className="text-[8px] text-slate-500">{q.mata_pelajaran}</span>
                  </td>
                  <td className="border border-slate-300 p-1.5 text-center font-semibold">{q.paket}</td>
                  <td className="border border-slate-300 p-1.5 text-center font-mono">
                    <span className="text-emerald-700 font-bold">{q.jumlah_benar || 0} B</span> /{' '}
                    <span className="text-rose-700 font-bold">{q.jumlah_salah || 0} S</span>
                  </td>
                  <td className="border border-slate-300 p-1.5 text-center font-black text-sm text-indigo-900">
                    {q.nilai}/100
                  </td>
                  <td className="border border-slate-300 p-1.5 text-center font-bold text-emerald-700">
                    {q.status_kelulusan || 'LULUS'}
                  </td>
                  <td className="border border-slate-300 p-1.5 text-center text-[9px] text-slate-500">
                    {formatTanggalIndo(q.selesai_pada || q.timestamp)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    // 5. REKAP DAFTAR 16 TUTOR BER-SK RESMI
    case 'REKAP_TUTOR': {
      const list = Array.isArray(data) ? data : [];
      return (
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            Daftar Resmi Tenaga Pendidik (Tutor) PKBM Celah Cahaya Berdasarkan Surat Keputusan Ketua Lembaga
          </p>
          <table className="w-full text-[10px] border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 font-bold text-slate-800 text-center">
                <th className="border border-slate-300 p-1.5 w-8">No</th>
                <th className="border border-slate-300 p-1.5 text-left">Nama Lengkap & Gelar</th>
                <th className="border border-slate-300 p-1.5">No. SK Pembagian Tugas</th>
                <th className="border border-slate-300 p-1.5 text-left">Mata Pelajaran Diampu</th>
                <th className="border border-slate-300 p-1.5">Jenjang Paket</th>
                <th className="border border-slate-300 p-1.5">Status Penugasan</th>
              </tr>
            </thead>
            <tbody>
              {list.map((t: any, idx: number) => (
                <tr key={t.id || idx} className="border-b border-slate-200 even:bg-slate-50/50">
                  <td className="border border-slate-300 p-1.5 text-center font-bold">{idx + 1}</td>
                  <td className="border border-slate-300 p-1.5 font-bold uppercase">{t.nama}</td>
                  <td className="border border-slate-300 p-1.5 text-center font-mono text-[9px]">{t.no_sk || '421.1/014-PKBM/2026'}</td>
                  <td className="border border-slate-300 p-1.5 font-medium">{t.mata_pelajaran || '-'}</td>
                  <td className="border border-slate-300 p-1.5 text-center font-semibold">Paket B & C</td>
                  <td className="border border-slate-300 p-1.5 text-center font-bold text-emerald-700">AKTIF MENGAJAR</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    // 6. SILABUS & KURIKULUM 121 E-MODUL
    case 'SILABUS_KURIKULUM': {
      const list = Array.isArray(data) ? data : [];
      return (
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            Total E-Modul Pembelajaran Kurikulum Merdeka & Kesetaraan: <strong>{list.length} Modul Terintegrasi</strong>
          </p>
          <table className="w-full text-[10px] border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 font-bold text-slate-800 text-center">
                <th className="border border-slate-300 p-1.5 w-8">No</th>
                <th className="border border-slate-300 p-1.5 text-left">Judul Modul Pembelajaran</th>
                <th className="border border-slate-300 p-1.5 text-left">Mata Pelajaran</th>
                <th className="border border-slate-300 p-1.5">Paket / Kelas</th>
                <th className="border border-slate-300 p-1.5">Tahun Terbit</th>
                <th className="border border-slate-300 p-1.5">File ID Google Drive</th>
              </tr>
            </thead>
            <tbody>
              {list.map((m: any, idx: number) => (
                <tr key={m.id || idx} className="border-b border-slate-200 even:bg-slate-50/50">
                  <td className="border border-slate-300 p-1.5 text-center font-bold">{idx + 1}</td>
                  <td className="border border-slate-300 p-1.5 font-bold">{m.judul}</td>
                  <td className="border border-slate-300 p-1.5">{m.mata_pelajaran}</td>
                  <td className="border border-slate-300 p-1.5 text-center font-semibold">{m.paket}</td>
                  <td className="border border-slate-300 p-1.5 text-center">{m.tahun || 2026}</td>
                  <td className="border border-slate-300 p-1.5 font-mono text-[9px] text-slate-500">{m.file_id || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    // 7. LEARNING REPORT (LAPORAN HASIL & DURASI BELAJAR SISWA)
    case 'LEARNING_REPORT': {
      const report = data || {};
      const modules = Array.isArray(report.modules) ? report.modules : [];
      return (
        <div className="space-y-5">
          {/* Student Profile Card */}
          <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 border border-slate-300 rounded-lg text-xs">
            <div>
              <p className="text-slate-500 text-[10px]">Nama Warga Belajar:</p>
              <p className="font-bold text-slate-900 uppercase text-sm">{report.studentName || '-'}</p>
              <p className="text-slate-500 text-[10px] mt-1">Nomor Induk Siswa Nasional (NISN):</p>
              <p className="font-mono font-bold text-slate-800">{report.nisn || '-'}</p>
            </div>
            <div>
              <p className="text-slate-500 text-[10px]">Program / Rombel:</p>
              <p className="font-bold text-slate-900">{report.paket} • {report.kelas || 'Warga Belajar Aktif'}</p>
              <p className="text-slate-500 text-[10px] mt-1">Periode Laporan:</p>
              <p className="font-bold text-indigo-700">Tahun Ajaran 2026/2027</p>
            </div>
          </div>

          {/* Metric Highlights */}
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="p-2.5 border border-slate-300 rounded bg-white">
              <p className="text-[10px] text-slate-500 font-medium">Total Jam Belajar</p>
              <p className="text-base font-black text-indigo-700 mt-0.5">{report.totalStudyHours || '0'} Jam</p>
            </div>
            <div className="p-2.5 border border-slate-300 rounded bg-white">
              <p className="text-[10px] text-slate-500 font-medium">Modul Selesai</p>
              <p className="text-base font-black text-emerald-700 mt-0.5">{report.completedCount || 0} Modul</p>
            </div>
            <div className="p-2.5 border border-slate-300 rounded bg-white">
              <p className="text-[10px] text-slate-500 font-medium">Target Mingguan</p>
              <p className="text-base font-black text-amber-700 mt-0.5">{report.weeklyGoalHours || 6} Jam</p>
            </div>
            <div className="p-2.5 border border-slate-300 rounded bg-white">
              <p className="text-[10px] text-slate-500 font-medium">Capaian Kurikulum</p>
              <p className="text-base font-black text-slate-900 mt-0.5">{report.overallProgressPercent || 0}%</p>
            </div>
          </div>

          {/* Detailed Modules Progress Table */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs mb-2 uppercase">
              Rincian Capaian E-Modul Pembelajaran ({modules.length} Modul)
            </h4>
            <table className="w-full text-[10px] border-collapse border border-slate-300">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 font-bold text-slate-800 text-center">
                  <th className="border border-slate-300 p-1.5 w-8">No</th>
                  <th className="border border-slate-300 p-1.5 text-left">Mata Pelajaran & Judul Modul</th>
                  <th className="border border-slate-300 p-1.5">Halaman Terbaca</th>
                  <th className="border border-slate-300 p-1.5">Progres Baca</th>
                  <th className="border border-slate-300 p-1.5">Durasi Belajar</th>
                  <th className="border border-slate-300 p-1.5">Status Modul</th>
                </tr>
              </thead>
              <tbody>
                {modules.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center p-4 text-slate-400">Belum ada modul yang dibaca.</td>
                  </tr>
                ) : (
                  modules.map((m: any, idx: number) => (
                    <tr key={m.materi_id || idx} className="border-b border-slate-200 even:bg-slate-50/50">
                      <td className="border border-slate-300 p-1.5 text-center font-bold">{idx + 1}</td>
                      <td className="border border-slate-300 p-1.5">
                        <span className="font-bold block uppercase">{m.mata_pelajaran}</span>
                        <span className="text-slate-600">{m.judul}</span>
                      </td>
                      <td className="border border-slate-300 p-1.5 text-center font-mono">
                        {m.last_page || 1} / {m.total_pages || 24}
                      </td>
                      <td className="border border-slate-300 p-1.5 text-center font-bold text-indigo-700">
                        {m.progress_percent || 0}%
                      </td>
                      <td className="border border-slate-300 p-1.5 text-center font-mono">
                        {m.studyTimeFormatted || `${Math.round((m.total_time_seconds || 180) / 60)} mnt`}
                      </td>
                      <td className="border border-slate-300 p-1.5 text-center">
                        {m.completed || m.progress_percent >= 90 ? (
                          <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                            SELESAI (100%)
                          </span>
                        ) : (
                          <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-300 font-semibold">
                            SEDANG BELAJAR
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // Default Fallback
    default:
      return (
        <div className="p-4 bg-slate-50 rounded-lg border">
          <pre className="text-[10px] font-mono whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
        </div>
      );
  }
}
