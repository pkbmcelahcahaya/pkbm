import React, { useState } from 'react';
import { Kelas, MataPelajaran, PaketType, User } from '../../types';
import { storage } from '../../services/storageService';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  Layers, 
  BookOpen, 
  Users, 
  GraduationCap, 
  CheckCircle2, 
  X, 
  Sparkles,
  School
} from 'lucide-react';

interface AdminKelasMapelTabProps {
  currentUser: User;
  onRefresh?: () => void;
}

export const AdminKelasMapelTab: React.FC<AdminKelasMapelTabProps> = ({ currentUser, onRefresh }) => {
  const [subTab, setSubTab] = useState<'KELAS' | 'MAPEL'>('KELAS');
  
  // Data States
  const [classes, setClasses] = useState<Kelas[]>(() => storage.getClasses());
  const [mapels, setMapels] = useState<MataPelajaran[]>(() => storage.getMapel());
  const [tutors] = useState<User[]>(() => storage.getUsers('TUTOR'));

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPaket, setFilterPaket] = useState<'SEMUA' | 'PAKET B' | 'PAKET C'>('SEMUA');

  // Kelas Modal State
  const [isKelasModalOpen, setIsKelasModalOpen] = useState(false);
  const [editingKelas, setEditingKelas] = useState<Kelas | null>(null);
  const [kelasNama, setKelasNama] = useState('');
  const [kelasPaket, setKelasPaket] = useState<PaketType>('PAKET B');
  const [kelasTingkat, setKelasTingkat] = useState('3');
  const [kelasWali, setKelasWali] = useState('');
  const [kelasStatus, setKelasStatus] = useState<'AKTIF' | 'NONAKTIF'>('AKTIF');

  // Mapel Modal State
  const [isMapelModalOpen, setIsMapelModalOpen] = useState(false);
  const [editingMapel, setEditingMapel] = useState<MataPelajaran | null>(null);
  const [mapelKode, setMapelKode] = useState('');
  const [mapelNama, setMapelNama] = useState('');
  const [mapelPaket, setMapelPaket] = useState<PaketType>('PAKET B');
  const [mapelTingkat, setMapelTingkat] = useState('Derajat 3 / Kelas 7-9');
  const [mapelSkk, setMapelSkk] = useState('4');
  const [mapelKelompok, setMapelKelompok] = useState('Kelompok Umum');
  const [mapelDeskripsi, setMapelDeskripsi] = useState('');
  const [mapelStatus, setMapelStatus] = useState<'AKTIF' | 'NONAKTIF'>('AKTIF');

  const refreshData = () => {
    setClasses(storage.getClasses());
    setMapels(storage.getMapel());
    if (onRefresh) onRefresh();
  };

  // Filtered Lists
  const filteredClasses = classes.filter(c => {
    const matchPaket = filterPaket === 'SEMUA' || c.paket === filterPaket;
    const name = c.nama_kelas || c.nama || '';
    const matchSearch = !searchQuery || name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchPaket && matchSearch;
  });

  const filteredMapels = mapels.filter(m => {
    const matchPaket = filterPaket === 'SEMUA' || m.paket === filterPaket;
    const name = m.nama_mata_pelajaran || m.nama || '';
    const matchSearch =
      !searchQuery ||
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.kode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchPaket && matchSearch;
  });

  // Handlers for Kelas
  const handleOpenKelasModal = (k?: Kelas) => {
    if (k) {
      setEditingKelas(k);
      setKelasNama(k.nama_kelas || k.nama || '');
      setKelasPaket(k.paket);
      setKelasTingkat(k.tingkat || '3');
      setKelasWali(k.wali_tutor || k.wali_kelas || '');
      setKelasStatus(k.status || 'AKTIF');
    } else {
      setEditingKelas(null);
      setKelasNama('');
      setKelasPaket('PAKET B');
      setKelasTingkat('3');
      setKelasWali(tutors[0]?.nama || '');
      setKelasStatus('AKTIF');
    }
    setIsKelasModalOpen(true);
  };

  const handleSaveKelas = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kelasNama.trim()) return;

    if (editingKelas) {
      storage.updateClass(editingKelas.id, {
        nama_kelas: kelasNama.trim(),
        nama: kelasNama.trim(),
        paket: kelasPaket,
        tingkat: kelasTingkat,
        wali_tutor: kelasWali,
        wali_kelas: kelasWali,
        status: kelasStatus
      });
    } else {
      storage.addClass({
        nama_kelas: kelasNama.trim(),
        nama: kelasNama.trim(),
        paket: kelasPaket,
        tingkat: kelasTingkat,
        wali_tutor: kelasWali,
        wali_kelas: kelasWali,
        status: kelasStatus,
        jumlah_siswa: 0
      });
    }
    setIsKelasModalOpen(false);
    refreshData();
  };

  const handleDeleteKelas = (id: string, nama: string) => {
    if (confirm(`Hapus rombel/kelas "${nama}"?`)) {
      storage.deleteClass(id);
      refreshData();
    }
  };

  // Handlers for Mapel
  const handleOpenMapelModal = (m?: MataPelajaran) => {
    if (m) {
      setEditingMapel(m);
      setMapelKode(m.kode);
      setMapelNama(m.nama_mata_pelajaran || m.nama || '');
      setMapelPaket(m.paket);
      setMapelTingkat(m.tingkatan || m.tingkat || (m.paket === 'PAKET B' ? 'Kelas 7-9' : 'Kelas 10-12'));
      setMapelSkk(String(m.alokasi_skk || m.skk || 4));
      setMapelKelompok(m.kelompok || 'Kelompok Umum');
      setMapelDeskripsi(m.deskripsi || '');
      setMapelStatus(m.status || 'AKTIF');
    } else {
      setEditingMapel(null);
      setMapelKode(`MPL-${mapels.length + 1}`);
      setMapelNama('');
      setMapelPaket('PAKET B');
      setMapelTingkat('Kelas 7-9');
      setMapelSkk('4');
      setMapelKelompok('Kelompok Umum');
      setMapelDeskripsi('');
      setMapelStatus('AKTIF');
    }
    setIsMapelModalOpen(true);
  };

  const handleSaveMapel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mapelNama.trim() || !mapelKode.trim()) return;

    if (editingMapel) {
      storage.updateMapel(editingMapel.id, {
        kode: mapelKode.trim(),
        nama_mata_pelajaran: mapelNama.trim(),
        nama: mapelNama.trim(),
        paket: mapelPaket,
        tingkatan: mapelTingkat,
        tingkat: mapelTingkat,
        alokasi_skk: Number(mapelSkk) || 4,
        skk: Number(mapelSkk) || 4,
        kelompok: mapelKelompok,
        deskripsi: mapelDeskripsi,
        status: mapelStatus
      });
    } else {
      storage.addMapel({
        kode: mapelKode.trim(),
        nama_mata_pelajaran: mapelNama.trim(),
        nama: mapelNama.trim(),
        paket: mapelPaket,
        tingkatan: mapelTingkat,
        tingkat: mapelTingkat,
        alokasi_skk: Number(mapelSkk) || 4,
        skk: Number(mapelSkk) || 4,
        kelompok: mapelKelompok,
        deskripsi: mapelDeskripsi,
        icon: 'BookOpen',
        urutan: mapels.length + 1,
        status: mapelStatus
      });
    }
    setIsMapelModalOpen(false);
    refreshData();
  };

  const handleDeleteMapel = (id: string, nama: string) => {
    if (confirm(`Hapus mata pelajaran "${nama}"?`)) {
      storage.deleteMapel(id);
      refreshData();
    }
  };

  return (
    <div className="space-y-5">
      {/* Subtabs Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            onClick={() => setSubTab('KELAS')}
            className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transition-all ${
              subTab === 'KELAS'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <School className="w-4 h-4" />
            <span>Rombel / Kelas ({classes.length})</span>
          </button>

          <button
            onClick={() => setSubTab('MAPEL')}
            className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transition-all ${
              subTab === 'MAPEL'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Mata Pelajaran ({mapels.length})</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterPaket}
            onChange={e => setFilterPaket(e.target.value as any)}
            className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            <option value="SEMUA">Semua Paket</option>
            <option value="PAKET B">Paket B (SMP)</option>
            <option value="PAKET C">Paket C (SMA)</option>
          </select>

          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={`Cari ${subTab === 'KELAS' ? 'nama kelas...' : 'nama mapel / kode...'}`}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400"
            />
          </div>

          {subTab === 'KELAS' ? (
            <button
              onClick={() => handleOpenKelasModal()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm whitespace-nowrap cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Kelas</span>
            </button>
          ) : (
            <button
              onClick={() => handleOpenMapelModal()}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm whitespace-nowrap cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Mapel</span>
            </button>
          )}
        </div>
      </div>

      {/* SUBTAB 1: KELAS / ROMBEL */}
      {subTab === 'KELAS' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3.5 pl-5">Nama Rombel / Kelas</th>
                  <th className="p-3.5">Paket Program</th>
                  <th className="p-3.5">Tingkatan / Derajat</th>
                  <th className="p-3.5">Wali Kelas / Tutor Pembimbing</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5 text-right pr-5">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {filteredClasses.map(k => (
                  <tr key={k.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3.5 pl-5">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <School className="w-4 h-4 text-indigo-600" />
                        <span>{k.nama_kelas || k.nama}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">ID: {k.id}</div>
                    </td>
                    <td className="p-3.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        k.paket === 'PAKET B' ? 'bg-amber-100 text-amber-800' : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {k.paket}
                      </span>
                    </td>
                    <td className="p-3.5 font-medium text-slate-600 dark:text-slate-400">
                      Tingkat {k.tingkat || '3'} (Derajat Kesetaraan)
                    </td>
                    <td className="p-3.5 font-medium text-slate-800 dark:text-slate-200">
                      {k.wali_tutor || k.wali_kelas || 'Belum Ditentukan'}
                    </td>
                    <td className="p-3.5 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {k.status || 'AKTIF'}
                      </span>
                    </td>
                    <td className="p-3.5 pr-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenKelasModal(k)}
                          className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 hover:bg-amber-100"
                          title="Edit Kelas"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteKelas(k.id, k.nama_kelas || k.nama || '')}
                          className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 hover:bg-rose-100"
                          title="Hapus Kelas"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 2: MATA PELAJARAN */}
      {subTab === 'MAPEL' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3.5 pl-5">Kode & Nama Mata Pelajaran</th>
                  <th className="p-3.5">Paket Program</th>
                  <th className="p-3.5">Kelompok & SKK</th>
                  <th className="p-3.5">Tingkatan</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5 text-right pr-5">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {filteredMapels.map(m => (
                  <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3.5 pl-5">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-emerald-600" />
                        <span>{m.nama_mata_pelajaran || m.nama}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">Kode: {m.kode}</div>
                    </td>
                    <td className="p-3.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        m.paket === 'PAKET B' ? 'bg-amber-100 text-amber-800' : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {m.paket}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{m.kelompok || 'Kelompok Umum'}</div>
                      <div className="text-[11px] text-emerald-600 font-bold">{m.alokasi_skk || m.skk || 4} SKK</div>
                    </td>
                    <td className="p-3.5 font-medium text-slate-600 dark:text-slate-400">
                      {m.tingkatan || m.tingkat || (m.paket === 'PAKET B' ? 'Kelas 7-9' : 'Kelas 10-12')}
                    </td>
                    <td className="p-3.5 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {m.status || 'AKTIF'}
                      </span>
                    </td>
                    <td className="p-3.5 pr-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenMapelModal(m)}
                          className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 hover:bg-amber-100"
                          title="Edit Mapel"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteMapel(m.id, m.nama_mata_pelajaran || m.nama || '')}
                          className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 hover:bg-rose-100"
                          title="Hapus Mapel"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* KELAS MODAL */}
      {isKelasModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {editingKelas ? 'Edit Rombel / Kelas' : 'Tambah Rombel / Kelas Baru'}
              </h3>
              <button onClick={() => setIsKelasModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveKelas} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Kelas *
                </label>
                <input
                  type="text"
                  value={kelasNama}
                  onChange={e => setKelasNama(e.target.value)}
                  placeholder="Contoh: Kelas 7 Paket B"
                  required
                  className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Program Paket
                  </label>
                  <select
                    value={kelasPaket}
                    onChange={e => setKelasPaket(e.target.value as PaketType)}
                    className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  >
                    <option value="PAKET B">PAKET B (SMP)</option>
                    <option value="PAKET C">PAKET C (SMA)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Derajat / Tingkat
                  </label>
                  <select
                    value={kelasTingkat}
                    onChange={e => setKelasTingkat(e.target.value)}
                    className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
                  >
                    <option value="3">Tingkat 3 (Kelas 7-8)</option>
                    <option value="4">Tingkat 4 (Kelas 9)</option>
                    <option value="5">Tingkat 5 (Kelas 10-11)</option>
                    <option value="6">Tingkat 6 (Kelas 12)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Wali Kelas / Tutor Pembimbing
                </label>
                <select
                  value={kelasWali}
                  onChange={e => setKelasWali(e.target.value)}
                  className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
                >
                  <option value="">-- Pilih Tutor Pembimbing --</option>
                  {tutors.map(t => (
                    <option key={t.id} value={t.nama}>
                      {t.nama} ({t.mata_pelajaran || 'Tutor'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Status Kelas
                </label>
                <select
                  value={kelasStatus}
                  onChange={e => setKelasStatus(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
                >
                  <option value="AKTIF">AKTIF</option>
                  <option value="NONAKTIF">NONAKTIF</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsKelasModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl"
                >
                  Simpan Kelas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MAPEL MODAL */}
      {isMapelModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {editingMapel ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran Baru'}
              </h3>
              <button onClick={() => setIsMapelModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMapel} className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Kode Mapel *
                  </label>
                  <input
                    type="text"
                    value={mapelKode}
                    onChange={e => setMapelKode(e.target.value)}
                    placeholder="IND-B"
                    required
                    className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono uppercase"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nama Mata Pelajaran *
                  </label>
                  <input
                    type="text"
                    value={mapelNama}
                    onChange={e => setMapelNama(e.target.value)}
                    placeholder="Bahasa Indonesia"
                    required
                    className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Program Paket
                  </label>
                  <select
                    value={mapelPaket}
                    onChange={e => setMapelPaket(e.target.value as PaketType)}
                    className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  >
                    <option value="PAKET B">PAKET B (SMP)</option>
                    <option value="PAKET C">PAKET C (SMA)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Bobot SKK
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={mapelSkk}
                    onChange={e => setMapelSkk(e.target.value)}
                    className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Kelompok Kurikulum
                </label>
                <select
                  value={mapelKelompok}
                  onChange={e => setMapelKelompok(e.target.value)}
                  className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
                >
                  <option value="Kelompok Umum">Kelompok Umum (Wajib)</option>
                  <option value="Kelompok Peminatan">Kelompok Peminatan (IPA / IPS / Bahasa)</option>
                  <option value="Kelompok Keterampilan">Kelompok Keterampilan & Vokasi</option>
                  <option value="Kelompok Pemberdayaan">Kelompok Pemberdayaan & Muatan Lokal</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Status Mapel
                </label>
                <select
                  value={mapelStatus}
                  onChange={e => setMapelStatus(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
                >
                  <option value="AKTIF">AKTIF</option>
                  <option value="NONAKTIF">NONAKTIF</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsMapelModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
                >
                  Simpan Mapel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
