import React from 'react';
import {
  X,
  Building2,
  MapPin,
  FileCheck2,
  GraduationCap,
  ShieldCheck,
  Calendar,
  Layers,
  Award,
  BookOpen,
  Share2,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { MASTER_LEMBAGA, ALAMAT_LENGKAP_LEMBAGA } from '../data/lembagaConfig';
import { LogoPKBM } from './LogoPKBM';

interface ProfilLembagaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPendaftaran?: () => void;
}

export const ProfilLembagaModal: React.FC<ProfilLembagaModalProps> = ({
  isOpen,
  onClose,
  onOpenPendaftaran
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="profil-lembaga-overlay"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 sm:p-6 text-white flex items-center justify-between border-b border-indigo-900/40 shrink-0">
          <div className="flex items-center gap-3">
            <LogoPKBM size="md" imageClassName="bg-white p-0.5 rounded-lg" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg sm:text-xl text-white tracking-tight">
                  PROFIL LEMBAGA
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-400 text-slate-950 uppercase">
                  DIKMAS RESMI
                </span>
              </div>
              <p className="text-xs text-indigo-200">
                {MASTER_LEMBAGA.nama} • NPSN: {MASTER_LEMBAGA.npsn}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 text-slate-700 dark:text-slate-200">
          {/* Hero Identity Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-amber-50 dark:from-indigo-950/40 dark:to-amber-950/30 border border-indigo-100 dark:border-indigo-900/50 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <LogoPKBM size="xl" imageClassName="bg-white p-1 rounded-2xl shadow" />
            <div className="space-y-1.5 flex-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-600 text-white uppercase tracking-wider">
                Pusat Kegiatan Belajar Masyarakat
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {MASTER_LEMBAGA.nama}
              </h2>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                {MASTER_LEMBAGA.tagline} ({MASTER_LEMBAGA.subjudul})
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-xs font-bold border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                  NPSN: <span className="text-indigo-600 dark:text-indigo-400 font-mono">{MASTER_LEMBAGA.npsn}</span>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-xs font-bold border border-slate-200 dark:border-slate-700 text-emerald-600 dark:text-emerald-400">
                  Status: {MASTER_LEMBAGA.status}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-xs font-bold border border-slate-200 dark:border-slate-700 text-amber-600 dark:text-amber-400">
                  Jenjang: {MASTER_LEMBAGA.jenjang}
                </span>
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {/* Card 1: Identitas & Bentuk Pendidikan */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                <Building2 className="w-4 h-4" />
                <h4>Identitas Lembaga</h4>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                <div className="py-2 flex justify-between gap-2">
                  <span className="text-slate-400">Nama Lembaga</span>
                  <span className="font-bold text-slate-900 dark:text-white text-right">{MASTER_LEMBAGA.nama}</span>
                </div>
                <div className="py-2 flex justify-between gap-2">
                  <span className="text-slate-400">NPSN</span>
                  <span className="font-mono font-black text-indigo-600 dark:text-indigo-400">{MASTER_LEMBAGA.npsn}</span>
                </div>
                <div className="py-2 flex justify-between gap-2">
                  <span className="text-slate-400">Bentuk Pendidikan</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{MASTER_LEMBAGA.bentuk_pendidikan}</span>
                </div>
                <div className="py-2 flex justify-between gap-2">
                  <span className="text-slate-400">Jenjang Pendidikan</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{MASTER_LEMBAGA.jenjang}</span>
                </div>
                <div className="py-2 flex justify-between gap-2">
                  <span className="text-slate-400">Status Sekolah</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{MASTER_LEMBAGA.status}</span>
                </div>
              </div>
            </div>

            {/* Card 2: Alamat & Wilayah */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
                <MapPin className="w-4 h-4" />
                <h4>Alamat & Domisili</h4>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                <div className="py-2 flex justify-between gap-2">
                  <span className="text-slate-400">Alamat</span>
                  <span className="font-bold text-slate-900 dark:text-white text-right">{MASTER_LEMBAGA.alamat}</span>
                </div>
                <div className="py-2 flex justify-between gap-2">
                  <span className="text-slate-400">Desa / Kelurahan</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{MASTER_LEMBAGA.desa_kelurahan}</span>
                </div>
                <div className="py-2 flex justify-between gap-2">
                  <span className="text-slate-400">Kecamatan</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{MASTER_LEMBAGA.kecamatan}</span>
                </div>
                <div className="py-2 flex justify-between gap-2">
                  <span className="text-slate-400">Kabupaten</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{MASTER_LEMBAGA.kabupaten}</span>
                </div>
                <div className="py-2 flex justify-between gap-2">
                  <span className="text-slate-400">Provinsi</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{MASTER_LEMBAGA.provinsi}</span>
                </div>
              </div>
            </div>

            {/* Card 3: Program & Layanan */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                <GraduationCap className="w-4 h-4" />
                <h4>Program & Layanan</h4>
              </div>
              <div className="space-y-2.5">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
                    B
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-900 dark:text-white">Program Paket B</h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Pendidikan Kesetaraan Tingkat Menengah Pertama (Setara SMP/MTs, Kelas 7, 8, 9).</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
                    C
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-900 dark:text-white">Program Paket C</h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Pendidikan Kesetaraan Tingkat Menengah Atas (Setara SMA/MA/SMK, Kelas 10, 11, 12).</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: Legalitas & SK Operasional */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-sm">
                <ShieldCheck className="w-4 h-4" />
                <h4>Legalitas Resmi Lembaga</h4>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                <div className="py-2.5">
                  <div className="text-slate-400 text-[11px]">Surat Keputusan (SK) Pendirian:</div>
                  <div className="font-mono font-bold text-slate-900 dark:text-white text-xs mt-0.5">
                    {MASTER_LEMBAGA.sk_pendirian}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-purple-500" />
                    <span>Tanggal: {MASTER_LEMBAGA.tanggal_sk_pendirian_lengkap} ({MASTER_LEMBAGA.tanggal_sk_pendirian})</span>
                  </div>
                </div>

                <div className="py-2.5">
                  <div className="text-slate-400 text-[11px]">Surat Keputusan (SK) Izin Operasional:</div>
                  <div className="font-mono font-bold text-slate-900 dark:text-white text-xs mt-0.5">
                    {MASTER_LEMBAGA.sk_operasional}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-purple-500" />
                    <span>Tanggal: {MASTER_LEMBAGA.tanggal_sk_operasional_lengkap} ({MASTER_LEMBAGA.tanggal_sk_operasional})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Full Address Card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h5 className="font-bold text-xs text-slate-900 dark:text-white">Alamat Lengkap Resmi</h5>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed font-medium">
                {ALAMAT_LENGKAP_LEMBAGA}
              </p>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <p className="text-[11px] text-slate-400">
            {MASTER_LEMBAGA.copyright}
          </p>

          <div className="flex items-center gap-2">
            {onOpenPendaftaran && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPendaftaran();
                }}
                className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-1.5 transition-all"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Pendaftaran PPDB 2026</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-bold text-xs rounded-xl cursor-pointer transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
