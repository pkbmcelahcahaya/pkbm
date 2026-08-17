import React from 'react';
import {
  BookOpen,
  Printer,
  Download,
  ShieldCheck,
  Building2,
  Calendar,
  Layers,
  ChevronRight,
  Edit3,
  FileSpreadsheet
} from 'lucide-react';
import { KurikulumProfile, User } from '../../types';
import { MASTER_LEMBAGA } from '../../data/lembagaConfig';

interface KurikulumHeaderProps {
  profile: KurikulumProfile;
  currentUser: User | null;
  onEditProfile?: () => void;
  onExportCsv?: () => void;
  onExportBackup?: () => void;
  onPrint?: () => void;
  activeTab: string;
}

export const KurikulumHeader: React.FC<KurikulumHeaderProps> = ({
  profile,
  currentUser,
  onEditProfile,
  onExportCsv,
  onExportBackup,
  onPrint,
  activeTab
}) => {
  const isAdmin = currentUser?.role === 'ADMIN';

  return (
    <div className="bg-white border-b border-gray-200 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-6 mb-6">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Academic Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 font-medium tracking-wide">
          <span className="hover:text-[#172033] transition-colors">{MASTER_LEMBAGA.nama}</span>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="hover:text-[#172033] transition-colors">Program Kesetaraan</span>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-[#C8102E] font-semibold">Silabus & Kurikulum KOSP</span>
        </nav>

        {/* Main Academic Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="space-y-2.5 max-w-4xl">
            {/* Metadata Badges */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F5F6F8] text-[#172033] font-semibold border border-gray-200">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C8102E]" />
                NPSN {MASTER_LEMBAGA.npsn}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F5F6F8] text-gray-700 font-medium border border-gray-200">
                <Building2 className="w-3.5 h-3.5 text-gray-500" />
                SK: {MASTER_LEMBAGA.sk_operasional}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F5F6F8] text-gray-700 font-medium border border-gray-200">
                <Calendar className="w-3.5 h-3.5 text-gray-500" />
                TP {profile.tahun_pelajaran} • {profile.semester_aktif}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F5F6F8] text-gray-700 font-medium border border-gray-200">
                <Layers className="w-3.5 h-3.5 text-gray-500" />
                Versi {profile.versi}
              </span>
              {isAdmin && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-semibold bg-gray-900 text-white">
                  Admin Mode
                </span>
              )}
            </div>

            {/* Academic H1 Title in Dark Navy */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#172033] leading-tight">
              Kurikulum Kesetaraan Paket B & Paket C
            </h1>

            {/* Subtitle / Description */}
            <p className="text-[15px] sm:text-base text-[#1F2937] leading-relaxed max-w-3xl font-normal">
              Pedoman Kurikulum Operasional Satuan Pendidikan (KOSP) PKBM Celah Cahaya. Dirancang berbasis capaian pembelajaran modular terstruktur, pembelajaran andragogi kontekstual, dan penguatan vokasi kewirausahaan.
            </p>
          </div>

          {/* Academic Action Buttons */}
          <div className="flex flex-wrap lg:flex-col items-stretch sm:items-start lg:items-end gap-2.5 shrink-0 pt-1">
            {isAdmin && onEditProfile && (
              <button
                type="button"
                onClick={onEditProfile}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-xs sm:text-sm font-medium bg-[#C8102E] hover:bg-[#A30D25] text-white shadow-sm transition-colors cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
                <span>Kelola Profil Kurikulum</span>
              </button>
            )}

            <div className="flex items-center gap-2">
              {onExportCsv && (
                <button
                  type="button"
                  onClick={onExportCsv}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 transition-colors shadow-xs cursor-pointer"
                  title="Unduh Struktur Kurikulum (CSV)"
                >
                  <Download className="w-3.5 h-3.5 text-gray-600" />
                  <span>Ekspor CSV</span>
                </button>
              )}

              {onPrint && (
                <button
                  type="button"
                  onClick={onPrint}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 transition-colors shadow-xs cursor-pointer"
                  title="Cetak Silabus"
                >
                  <Printer className="w-3.5 h-3.5 text-gray-600" />
                  <span>Cetak Silabus</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
