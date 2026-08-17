import React from 'react';
import {
  GraduationCap,
  Layers,
  BookOpen,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
  Edit3,
  FileText,
  Briefcase,
  TrendingUp
} from 'lucide-react';
import { KurikulumProgramDetail, StrukturKurikulumItem, User } from '../../types';

interface KurikulumPaketCTabProps {
  programDetail: KurikulumProgramDetail;
  strukturMapel: StrukturKurikulumItem[];
  currentUser: User | null;
  onEditProgram?: () => void;
  onNavigateTab: (tabId: string) => void;
}

export const KurikulumPaketCTab: React.FC<KurikulumPaketCTabProps> = ({
  programDetail,
  strukturMapel,
  currentUser,
  onEditProgram,
  onNavigateTab
}) => {
  const isAdmin = currentUser?.role === 'ADMIN';
  const mapelPaketC = strukturMapel.filter(item => item.program === 'PAKET C');
  const totalSkk = mapelPaketC.reduce((acc, curr) => acc + (curr.alokasi_skk || 0), 0);

  return (
    <div className="space-y-8 animate-fadeIn text-[#1F2937]">
      {/* Program Summary Header */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-6 sm:p-8 space-y-4">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="space-y-2.5 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-[#F5F6F8] text-[#172033] text-xs font-semibold border border-gray-200">
                Pendidikan Menengah Atas
              </span>
              <span className="px-2.5 py-1 rounded bg-[#F5F6F8] text-[#172033] text-xs font-semibold border border-gray-200">
                {programDetail.fase}
              </span>
              <span className="px-2.5 py-1 rounded bg-[#F5F6F8] text-gray-700 text-xs font-medium border border-gray-200">
                Tingkatan 5 & 6 (Kelas 10 - 12)
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-[#172033]">
              {programDetail.nama_resmi}
            </h2>

            <p className="text-[15px] sm:text-base text-[#1F2937] leading-relaxed">
              {programDetail.deskripsi_program}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <div className="bg-[#F5F6F8] rounded-xl p-5 border border-gray-200 text-center min-w-[180px]">
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider block">
                Total Beban Belajar
              </span>
              <span className="text-3xl font-black text-[#172033] my-1 block">
                {programDetail.beban_belajar_skk || totalSkk}
              </span>
              <span className="text-xs text-gray-600 font-medium block">
                Satuan Kredit Kompetensi (SKK)
              </span>
            </div>

            {isAdmin && onEditProgram && (
              <button
                type="button"
                onClick={onEditProgram}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-xs font-medium bg-[#C8102E] hover:bg-[#A30D25] text-white shadow-sm transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Program Paket C</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Peminatan IPS & Vokasi Kewirausahaan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-6 space-y-4">
          <h3 className="text-base font-bold text-[#172033] flex items-center gap-2 border-b border-gray-100 pb-3">
            <TrendingUp className="w-4 h-4 text-[#C8102E]" />
            <span>Peminatan Ilmu Pengetahuan Sosial (IPS)</span>
          </h3>
          <div className="space-y-3 text-xs sm:text-sm text-[#1F2937] leading-relaxed pt-1">
            <div className="p-3.5 rounded-lg bg-[#F5F6F8] border border-gray-200">
              <span className="font-bold text-[#172033] block mb-1">Mata Pelajaran Pilihan:</span>
              <p className="text-gray-700">Sosiologi, Ekonomi, Geografi, dan Sejarah Tingkat Lanjut berbasis analisis isu kontekstual dan pemberdayaan masyarakat desa.</p>
            </div>
            <div className="p-3.5 rounded-lg bg-[#F5F6F8] border border-gray-200">
              <span className="font-bold text-[#172033] block mb-1">Fokus Kemandirian:</span>
              <p className="text-gray-700">Analisis peluang usaha agribisnis, literasi keuangan mikro, dan pemetaan sosial potensi lokal Singajaya Garut.</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-6 space-y-4">
          <h3 className="text-base font-bold text-[#172033] flex items-center gap-2 border-b border-gray-100 pb-3">
            <Briefcase className="w-4 h-4 text-[#C8102E]" />
            <span>Keterampilan Vokasi & Digital Marketing</span>
          </h3>
          <div className="space-y-3 text-xs sm:text-sm text-[#1F2937] leading-relaxed pt-1">
            <div className="p-3.5 rounded-lg bg-[#F5F6F8] border border-gray-200">
              <span className="font-bold text-[#172033] block mb-1">Vokasi Pilihan:</span>
              <p className="text-gray-700">Pemasaran Digital (Digital Marketing), Pengolahan Hasil Pertanian Kopi & Teh Garut, serta Tata Kelola Usaha Mikro.</p>
            </div>
            <div className="p-3.5 rounded-lg bg-[#F5F6F8] border border-gray-200">
              <span className="font-bold text-[#172033] block mb-1">Sertifikasi & Portofolio:</span>
              <p className="text-gray-700">Setiap warga belajar Paket C wajib menyelesaikan proyek nyata portofolio kewirausahaan atau gelar karya akhir semester.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mata Pelajaran Paket C Overview */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-200 pb-4">
          <div>
            <h3 className="text-lg font-bold text-[#172033] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#C8102E]" />
              <span>Daftar Mata Pelajaran Program Paket C</span>
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Sebanyak {mapelPaketC.length} mata pelajaran terbagi ke dalam Kelompok Umum, Peminatan IPS, dan Vokasi Keterampilan.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('struktur')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C8102E] hover:underline cursor-pointer"
          >
            <span>Buka Struktur & SKK Lengkap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Professional Academic Data Table */}
        <div className="overflow-x-auto rounded-xl border border-[#E5E7EB] shadow-xs">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead className="bg-gray-50/80 text-gray-600 font-semibold uppercase tracking-wider text-[11px] border-b border-[#E5E7EB]">
              <tr>
                <th scope="col" className="py-3.5 px-6 w-14 text-center">No</th>
                <th scope="col" className="py-3.5 px-6">Kode</th>
                <th scope="col" className="py-3.5 px-6">Mata Pelajaran</th>
                <th scope="col" className="py-3.5 px-6">Kelompok</th>
                <th scope="col" className="py-3.5 px-6 text-center">Alokasi SKK</th>
                <th scope="col" className="py-3.5 px-6 text-center">Jam / Minggu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] text-[#1F2937]">
              {mapelPaketC.map((item, idx) => (
                <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-4.5 px-6 text-center text-gray-400 font-mono text-xs">
                    {idx + 1}
                  </td>
                  <td className="py-4.5 px-6 font-mono font-semibold text-[#172033] text-xs whitespace-nowrap">
                    {item.kode_mapel}
                  </td>
                  <td className="py-4.5 px-6">
                    <span className="font-semibold text-[#172033]">{item.nama_mata_pelajaran}</span>
                    {item.catatan && (
                      <span className="text-xs text-gray-500 block mt-0.5">{item.catatan}</span>
                    )}
                  </td>
                  <td className="py-4.5 px-6">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-medium bg-[#F5F6F8] text-gray-700 border border-[#E5E7EB]">
                      {item.kelompok}
                    </span>
                  </td>
                  <td className="py-4.5 px-6 text-center font-bold text-[#172033]">
                    {item.alokasi_skk} SKK
                  </td>
                  <td className="py-4.5 px-6 text-center text-gray-600">
                    {item.alokasi_waktu_jam} JP
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
