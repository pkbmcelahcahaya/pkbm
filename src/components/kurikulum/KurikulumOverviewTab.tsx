import React from 'react';
import {
  Sparkles,
  Award,
  Compass,
  CheckCircle2,
  BookOpen,
  Users,
  Target,
  FileText,
  Clock,
  Laptop,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  Scale,
  Building2
} from 'lucide-react';
import { KurikulumProfile, User } from '../../types';
import { MASTER_LEMBAGA } from '../../data/lembagaConfig';

interface KurikulumOverviewTabProps {
  profile: KurikulumProfile;
  currentUser: User | null;
  onNavigateTab: (tabId: string) => void;
  onEditProfile?: () => void;
}

export const KurikulumOverviewTab: React.FC<KurikulumOverviewTabProps> = ({
  profile,
  currentUser,
  onNavigateTab,
  onEditProfile
}) => {
  const isAdmin = currentUser?.role === 'ADMIN';

  return (
    <div className="space-y-8 animate-fadeIn text-[#1F2937]">
      {/* Quick Stat Highlight Summary Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-[#F5F6F8] text-[#172033]">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Jenjang Pendidikan Kesetaraan
              </span>
              <h3 className="text-base font-bold text-[#172033] mt-1">Paket B & Paket C</h3>
              <p className="text-xs text-gray-600 mt-1">
                Fase D (Setara SMP) & Fase E/F (Setara SMA)
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-[#F5F6F8] text-[#172033]">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Moda Pembelajaran Modular
              </span>
              <h3 className="text-base font-bold text-[#172033] mt-1">Blended & Andragogi</h3>
              <p className="text-xs text-gray-600 mt-1">
                Tatap Muka, Tutorial Daring & Belajar Mandiri
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-[#F5F6F8] text-[#172033]">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Legalitas & Akreditasi
              </span>
              <h3 className="text-base font-bold text-[#172033] mt-1">Izin Operasional Resmi</h3>
              <p className="text-xs text-gray-600 mt-1">
                SK Disdik: {MASTER_LEMBAGA.sk_operasional}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Document Reading Sheet: Visi, Misi & Tujuan */}
      <article className="bg-white rounded-xl border border-gray-200 shadow-xs p-6 sm:p-8 space-y-8">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <div>
            <h2 className="text-xl font-bold text-[#172033] flex items-center gap-2.5">
              <Compass className="w-5 h-5 text-[#C8102E]" />
              <span>Visi, Misi & Tujuan Kurikulum Operasional</span>
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Arah kebijakan pendidikan kesetaraan PKBM Celah Cahaya tahun ajaran {profile.tahun_pelajaran}
            </p>
          </div>
          {isAdmin && onEditProfile && (
            <button
              onClick={onEditProfile}
              className="text-xs font-semibold text-[#C8102E] hover:underline cursor-pointer"
            >
              Edit Dokumen
            </button>
          )}
        </div>

        {/* Visi Blockquote */}
        <div className="border-l-3 border-[#C8102E] pl-6 py-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#C8102E] block mb-1">
            Visi Lembaga
          </span>
          <p className="text-base sm:text-lg text-[#172033] font-medium leading-relaxed italic">
            "{profile.visi}"
          </p>
        </div>

        {/* Misi & Tujuan Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#172033] uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-2">
              <Target className="w-4 h-4 text-[#C8102E]" />
              <span>Misi Pembelajaran</span>
            </h3>
            <div className="text-[15px] text-[#1F2937] leading-relaxed whitespace-pre-line space-y-2">
              {profile.misi}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#172033] uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-2">
              <CheckCircle2 className="w-4 h-4 text-[#C8102E]" />
              <span>Tujuan Pendidikan</span>
            </h3>
            <div className="text-[15px] text-[#1F2937] leading-relaxed whitespace-pre-line space-y-2">
              {profile.tujuan}
            </div>
          </div>
        </div>
      </article>

      {/* 3 Moda Pembelajaran Kesetaraan (Proporsi Waktu) */}
      <article className="bg-white rounded-xl border border-gray-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-gray-200 pb-4">
          <div>
            <h2 className="text-xl font-bold text-[#172033] flex items-center gap-2.5">
              <Clock className="w-5 h-5 text-[#C8102E]" />
              <span>Proporsi Beban Belajar (Satuan Kredit Kompetensi)</span>
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Standar alokasi waktu pembelajaran kesetaraan berdasarkan regulasi Ditjen PAUD Dikdasmen.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('alokasi')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C8102E] hover:underline cursor-pointer self-start sm:self-auto"
          >
            <span>Rincian Jam Pelajaran</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-[#F5F6F8] border border-gray-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-600">Tatap Muka</span>
              <span className="text-lg font-black text-[#172033]">20% - 30%</span>
            </div>
            <p className="text-xs text-gray-700 leading-relaxed">
              Interaksi langsung di sanggar kegiatan belajar untuk penguatan konsep esensial, diskusi mendalam, praktikum laboratorium, dan refleksi modul.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#F5F6F8] border border-gray-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-600">Tutorial Daring</span>
              <span className="text-lg font-black text-[#172033]">30% - 40%</span>
            </div>
            <p className="text-xs text-gray-700 leading-relaxed">
              Bimbingan intensif terbimbing via platform LMS daring PKBM, Google Classroom, live meeting, serta penugasan terstruktur berbasis proyek.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#F5F6F8] border border-gray-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-600">Belajar Mandiri</span>
              <span className="text-lg font-black text-[#172033]">40% - 50%</span>
            </div>
            <p className="text-xs text-gray-700 leading-relaxed">
              Eksplorasi mandiri menggunakan modul digital terintegrasi Google Drive, e-modul Kemendikbud, serta portofolio karya kontekstual di lingkungan kerja/rumah.
            </p>
          </div>
        </div>
      </article>

      {/* Dasar Hukum & Landasan Yuridis */}
      <article className="bg-white rounded-xl border border-gray-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h2 className="text-xl font-bold text-[#172033] flex items-center gap-2.5">
            <Scale className="w-5 h-5 text-[#C8102E]" />
            <span>Dasar Hukum & Landasan Yuridis Kurikulum</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Regulasi dan ketentuan perundang-undangan penyelenggaraan Pendidikan Kesetaraan Nasional.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-700 leading-relaxed">
          <div className="p-4 rounded-lg bg-[#F5F6F8] border border-gray-200">
            <p className="font-semibold text-[#172033]">1. Undang-Undang No. 20 Tahun 2003</p>
            <p className="text-gray-600 mt-1">Tentang Sistem Pendidikan Nasional (Pasal 26 tentang Pendidikan Nonformal dan Kesetaraan).</p>
          </div>

          <div className="p-4 rounded-lg bg-[#F5F6F8] border border-gray-200">
            <p className="font-semibold text-[#172033]">2. Permendikbudristek No. 12 Tahun 2024</p>
            <p className="text-gray-600 mt-1">Tentang Kurikulum pada Pendidikan Anak Usia Dini, Jenjang Pendidikan Dasar, dan Menengah.</p>
          </div>

          <div className="p-4 rounded-lg bg-[#F5F6F8] border border-gray-200">
            <p className="font-semibold text-[#172033]">3. Kepmendikbudristek No. 262/M/2022</p>
            <p className="text-gray-600 mt-1">Tentang Perubahan Pedoman Penerapan Kurikulum dalam Rangka Pemulihan Pembelajaran.</p>
          </div>

          <div className="p-4 rounded-lg bg-[#F5F6F8] border border-gray-200">
            <p className="font-semibold text-[#172033]">4. SK Izin Operasional Disdik Garut</p>
            <p className="text-gray-600 mt-1">Nomor {MASTER_LEMBAGA.sk_operasional} tanggal {MASTER_LEMBAGA.tanggal_sk_operasional_lengkap} tentang Izin Penyelenggaraan PKBM Celah Cahaya.</p>
          </div>
        </div>
      </article>
    </div>
  );
};
