import React, { useState } from 'react';
import {
  Clock,
  Plus,
  Edit2,
  Trash2,
  PieChart,
  BarChart2,
  AlertCircle,
  CheckCircle2,
  Users,
  Laptop,
  BookOpen,
  X
} from 'lucide-react';
import { AlokasiWaktuItem, PaketType, User } from '../../types';

interface KurikulumAlokasiTabProps {
  alokasiList: AlokasiWaktuItem[];
  currentUser: User | null;
  onSaveAlokasi: (item: Omit<AlokasiWaktuItem, 'id'> & { id?: string }) => void;
  onDeleteAlokasi: (id: string) => void;
}

export const KurikulumAlokasiTab: React.FC<KurikulumAlokasiTabProps> = ({
  alokasiList,
  currentUser,
  onSaveAlokasi,
  onDeleteAlokasi
}) => {
  const isAdmin = currentUser?.role === 'ADMIN';

  // Filters & State
  const [selectedProgram, setSelectedProgram] = useState<PaketType | 'SEMUA'>('SEMUA');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AlokasiWaktuItem | null>(null);

  const [formData, setFormData] = useState<{
    program: PaketType;
    tingkatan: string;
    mata_pelajaran: string;
    semester: 'GANJIL' | 'GENAP' | 'TAHUNAN';
    jumlah_pertemuan: number;
    durasi_menit_pertemuan: number;
    total_jam_pelajaran: number;
    porsi_tatap_muka_jp: number;
    porsi_tutorial_jp: number;
    porsi_mandiri_jp: number;
    total_skk: number;
    catatan: string;
  }>({
    program: 'PAKET B',
    tingkatan: 'Kelas 7-9',
    mata_pelajaran: '',
    semester: 'GANJIL',
    jumlah_pertemuan: 16,
    durasi_menit_pertemuan: 45,
    total_jam_pelajaran: 48,
    porsi_tatap_muka_jp: 10,
    porsi_tutorial_jp: 14,
    porsi_mandiri_jp: 24,
    total_skk: 6,
    catatan: ''
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      program: selectedProgram === 'SEMUA' ? 'PAKET B' : selectedProgram,
      tingkatan: selectedProgram === 'PAKET C' ? 'Kelas 10-12' : 'Kelas 7-9',
      mata_pelajaran: '',
      semester: 'GANJIL',
      jumlah_pertemuan: 16,
      durasi_menit_pertemuan: 45,
      total_jam_pelajaran: 48,
      porsi_tatap_muka_jp: 10,
      porsi_tutorial_jp: 14,
      porsi_mandiri_jp: 24,
      total_skk: 6,
      catatan: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: AlokasiWaktuItem) => {
    setEditingItem(item);
    setFormData({
      program: item.program,
      tingkatan: item.tingkatan,
      mata_pelajaran: item.mata_pelajaran,
      semester: item.semester,
      jumlah_pertemuan: item.jumlah_pertemuan,
      durasi_menit_pertemuan: item.durasi_menit_pertemuan,
      total_jam_pelajaran: item.total_jam_pelajaran,
      porsi_tatap_muka_jp: item.porsi_tatap_muka_jp,
      porsi_tutorial_jp: item.porsi_tutorial_jp,
      porsi_mandiri_jp: item.porsi_mandiri_jp,
      total_skk: item.total_skk,
      catatan: item.catatan || ''
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.mata_pelajaran.trim()) return;

    onSaveAlokasi({
      ...(editingItem ? { id: editingItem.id } : {}),
      program: formData.program,
      tingkatan: formData.tingkatan,
      mata_pelajaran: formData.mata_pelajaran.trim(),
      semester: formData.semester,
      jumlah_pertemuan: Number(formData.jumlah_pertemuan) || 16,
      durasi_menit_pertemuan: Number(formData.durasi_menit_pertemuan) || 45,
      total_jam_pelajaran: Number(formData.total_jam_pelajaran) || 48,
      porsi_tatap_muka_jp: Number(formData.porsi_tatap_muka_jp) || 0,
      porsi_tutorial_jp: Number(formData.porsi_tutorial_jp) || 0,
      porsi_mandiri_jp: Number(formData.porsi_mandiri_jp) || 0,
      total_skk: Number(formData.total_skk) || 0,
      catatan: formData.catatan.trim()
    });

    setIsModalOpen(false);
  };

  const filteredAlokasi = alokasiList.filter(
    (a) => selectedProgram === 'SEMUA' || a.program === selectedProgram
  );

  const totalJPAll = filteredAlokasi.reduce((acc, curr) => acc + curr.total_jam_pelajaran, 0);
  const totalTMAll = filteredAlokasi.reduce((acc, curr) => acc + curr.porsi_tatap_muka_jp, 0);
  const totalTutAll = filteredAlokasi.reduce((acc, curr) => acc + curr.porsi_tutorial_jp, 0);
  const totalManAll = filteredAlokasi.reduce((acc, curr) => acc + curr.porsi_mandiri_jp, 0);

  return (
    <div className="space-y-6 animate-fadeIn text-[#1F2937]">
      {/* Header & Filter Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-4">
          <div>
            <h2 className="text-xl font-bold text-[#172033] flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#C8102E]" />
              <span>Matriks Alokasi Waktu & Distribusi Jam Pembelajaran</span>
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Rincian jam pembelajaran per semester: porsi tatap muka, tutorial daring, dan belajar mandiri terstruktur.
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
                <span>Tambah Alokasi Waktu</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter & Summary Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="w-full sm:w-64">
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Filter Program Jenjang
            </label>
            <select
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value as any)}
              className="w-full text-xs rounded-md border border-gray-300 px-3 py-2 bg-white text-[#172033] outline-none focus:border-[#C8102E]"
            >
              <option value="SEMUA">Semua Jenjang (Paket B & C)</option>
              <option value="PAKET B">Paket B (Fase D)</option>
              <option value="PAKET C">Paket C (Fase E/F)</option>
            </select>
          </div>

          {/* Quick Aggregate Stats */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
            <span>Total JP: <strong className="text-[#172033]">{totalJPAll} JP</strong></span>
            <span>•</span>
            <span>Tatap Muka: <strong className="text-[#172033]">{totalTMAll} JP</strong></span>
            <span>•</span>
            <span>Tutorial: <strong className="text-[#172033]">{totalTutAll} JP</strong></span>
            <span>•</span>
            <span>Mandiri: <strong className="text-[#172033]">{totalManAll} JP</strong></span>
          </div>
        </div>
      </div>

      {/* Loose Academic Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#F5F6F8] text-gray-700 font-semibold uppercase tracking-wider text-[11px] border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4">Mata Pelajaran</th>
                <th className="py-3 px-4">Program & Tingkat</th>
                <th className="py-3 px-4">Semester</th>
                <th className="py-3 px-4 text-center">Tatap Muka</th>
                <th className="py-3 px-4 text-center">Tutorial</th>
                <th className="py-3 px-4 text-center">Mandiri</th>
                <th className="py-3 px-4 text-center">Total JP</th>
                <th className="py-3 px-4 text-center">SKK</th>
                {isAdmin && <th className="py-3 px-4 text-right w-20">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-[#1F2937]">
              {filteredAlokasi.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 10 : 9} className="py-12 px-6 text-center text-gray-400">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="font-semibold text-gray-700">Tidak ada alokasi waktu yang sesuai.</p>
                  </td>
                </tr>
              ) : (
                filteredAlokasi.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-[#F5F6F8]/60 transition-colors">
                    <td className="py-4 px-4 text-center text-gray-400 font-mono text-xs">
                      {idx + 1}
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-semibold text-[#172033]">{item.mata_pelajaran}</div>
                      {item.catatan && (
                        <div className="text-xs text-gray-500 mt-0.5">{item.catatan}</div>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <span className="font-medium text-[#172033]">{item.program}</span>
                      <span className="text-xs text-gray-500 block">{item.tingkatan}</span>
                    </td>

                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#F5F6F8] text-gray-700 border border-gray-200">
                        {item.semester}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-center text-gray-700">
                      {item.porsi_tatap_muka_jp} JP
                    </td>

                    <td className="py-4 px-4 text-center text-gray-700">
                      {item.porsi_tutorial_jp} JP
                    </td>

                    <td className="py-4 px-4 text-center text-gray-700">
                      {item.porsi_mandiri_jp} JP
                    </td>

                    <td className="py-4 px-4 text-center font-bold text-[#172033]">
                      {item.total_jam_pelajaran} JP
                    </td>

                    <td className="py-4 px-4 text-center font-bold text-[#172033]">
                      {item.total_skk} SKK
                    </td>

                    {isAdmin && (
                      <td className="py-4 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
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
                              if (confirm(`Hapus alokasi waktu untuk ${item.mata_pelajaran}?`)) {
                                onDeleteAlokasi(item.id);
                              }
                            }}
                            className="p-1.5 rounded text-gray-500 hover:text-[#C8102E] hover:bg-red-50 transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit Alokasi */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172033]/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-200 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="text-lg font-bold text-[#172033]">
                {editingItem ? 'Edit Alokasi Waktu' : 'Tambah Alokasi Waktu Baru'}
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
                    Program Jenjang *
                  </label>
                  <select
                    value={formData.program}
                    onChange={(e) => {
                      const prog = e.target.value as PaketType;
                      setFormData({
                        ...formData,
                        program: prog,
                        tingkatan: prog === 'PAKET C' ? 'Kelas 10-12' : 'Kelas 7-9'
                      });
                    }}
                    className="w-full text-xs rounded-md border border-gray-300 p-2.5 bg-white focus:border-[#C8102E] outline-none"
                  >
                    <option value="PAKET B">Paket B (Fase D)</option>
                    <option value="PAKET C">Paket C (Fase E/F)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Mata Pelajaran *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="mis. Bahasa Indonesia"
                    value={formData.mata_pelajaran}
                    onChange={(e) => setFormData({ ...formData, mata_pelajaran: e.target.value })}
                    className="w-full text-xs rounded-md border border-gray-300 p-2.5 focus:border-[#C8102E] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Tatap Muka (JP)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.porsi_tatap_muka_jp}
                    onChange={(e) => {
                      const tm = Number(e.target.value) || 0;
                      setFormData({
                        ...formData,
                        porsi_tatap_muka_jp: tm,
                        total_jam_pelajaran: tm + formData.porsi_tutorial_jp + formData.porsi_mandiri_jp
                      });
                    }}
                    className="w-full text-xs rounded-md border border-gray-300 p-2.5 focus:border-[#C8102E] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Tutorial (JP)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.porsi_tutorial_jp}
                    onChange={(e) => {
                      const tut = Number(e.target.value) || 0;
                      setFormData({
                        ...formData,
                        porsi_tutorial_jp: tut,
                        total_jam_pelajaran: formData.porsi_tatap_muka_jp + tut + formData.porsi_mandiri_jp
                      });
                    }}
                    className="w-full text-xs rounded-md border border-gray-300 p-2.5 focus:border-[#C8102E] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Mandiri (JP)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.porsi_mandiri_jp}
                    onChange={(e) => {
                      const man = Number(e.target.value) || 0;
                      setFormData({
                        ...formData,
                        porsi_mandiri_jp: man,
                        total_jam_pelajaran: formData.porsi_tatap_muka_jp + formData.porsi_tutorial_jp + man
                      });
                    }}
                    className="w-full text-xs rounded-md border border-gray-300 p-2.5 focus:border-[#C8102E] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Total JP Semester
                  </label>
                  <input
                    type="number"
                    value={formData.total_jam_pelajaran}
                    readOnly
                    className="w-full text-xs rounded-md border border-gray-200 p-2.5 bg-gray-50 text-[#172033] font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Total SKK
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.total_skk}
                    onChange={(e) => setFormData({ ...formData, total_skk: Number(e.target.value) || 0 })}
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
                  Simpan Alokasi Waktu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
