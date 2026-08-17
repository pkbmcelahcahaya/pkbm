import React, { useState, useMemo } from 'react';
import {
  Video,
  Calendar,
  Clock,
  ExternalLink,
  Plus,
  Edit2,
  Trash2,
  Users,
  Search,
  CheckCircle2,
  XCircle,
  Radio,
  BookOpen,
  Filter
} from 'lucide-react';
import { TatapMuka, User, PaketType, TatapMukaStatus } from '../types';
import { storage } from '../services/storageService';
import { googleSheetsSync } from '../services/googleSheetsSyncService';

interface TatapMukaSectionProps {
  currentUser: User;
  onOpenPdf?: (materiId: string) => void;
}

export const TatapMukaSection: React.FC<TatapMukaSectionProps> = ({ currentUser }) => {
  const [sessions, setSessions] = useState<TatapMuka[]>(() =>
    storage.getTatapMuka(currentUser.role, currentUser.role === 'SISWA' ? currentUser.paket : undefined)
  );
  const [filterStatus, setFilterStatus] = useState<string>('SEMUA');
  const [filterPaket, setFilterPaket] = useState<string>('SEMUA');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<TatapMuka | null>(null);

  // Form State
  const [formJudul, setFormJudul] = useState('');
  const [formDeskripsi, setFormDeskripsi] = useState('');
  const [formMapel, setFormMapel] = useState('Bahasa Indonesia');
  const [formKelas, setFormKelas] = useState('Kelas 8 Paket B');
  const [formPaket, setFormPaket] = useState<PaketType>(currentUser.paket || 'PAKET B');
  const [formTanggal, setFormTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [formJamMulai, setFormJamMulai] = useState('09:00');
  const [formJamSelesai, setFormJamSelesai] = useState('10:30');
  const [formLinkMeet, setFormLinkMeet] = useState('https://meet.google.com/');
  const [formStatus, setFormStatus] = useState<TatapMukaStatus>('BERLANGSUNG');

  const refreshData = () => {
    setSessions(
      storage.getTatapMuka(currentUser.role, currentUser.role === 'SISWA' ? currentUser.paket : undefined)
    );
  };

  const mapelOptions = useMemo(() => storage.getMapel(), []);
  const classOptions = useMemo(() => storage.getClasses(), []);

  const filteredSessions = useMemo(() => {
    return sessions.filter(s => {
      const matchStatus = filterStatus === 'SEMUA' || s.status === filterStatus;
      const matchPaket = filterPaket === 'SEMUA' || s.paket === filterPaket;
      const matchSearch =
        s.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.mata_pelajaran.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.tutor_nama.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchPaket && matchSearch;
    });
  }, [sessions, filterStatus, filterPaket, searchQuery]);

  // Sort sessions: BERLANGSUNG first, then AKAN_DATANG, then SELESAI
  const sortedSessions = useMemo(() => {
    const statusWeight: Record<TatapMukaStatus, number> = {
      BERLANGSUNG: 1,
      AKAN_DATANG: 2,
      SELESAI: 3,
      DIBATALKAN: 4
    };
    return [...filteredSessions].sort((a, b) => {
      const wA = statusWeight[a.status] || 5;
      const wB = statusWeight[b.status] || 5;
      if (wA !== wB) return wA - wB;
      return new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime();
    });
  }, [filteredSessions]);

  const ongoingSessions = useMemo(
    () => sortedSessions.filter(s => s.status === 'BERLANGSUNG'),
    [sortedSessions]
  );

  const handleOpenModal = (session?: TatapMuka) => {
    if (session) {
      setEditingSession(session);
      setFormJudul(session.judul);
      setFormDeskripsi(session.deskripsi);
      setFormMapel(session.mata_pelajaran);
      setFormKelas(session.kelas);
      setFormPaket(session.paket);
      setFormTanggal(session.tanggal);
      setFormJamMulai(session.jam_mulai);
      setFormJamSelesai(session.jam_selesai);
      setFormLinkMeet(session.link_meet);
      setFormStatus(session.status);
    } else {
      setEditingSession(null);
      setFormJudul('');
      setFormDeskripsi('');
      setFormMapel(currentUser.mata_pelajaran?.split('&')[0].trim() || 'Bahasa Indonesia');
      setFormKelas(currentUser.kelas?.split('&')[0].trim() || 'Kelas 8 Paket B');
      setFormPaket(currentUser.paket || 'PAKET B');
      setFormTanggal(new Date().toISOString().split('T')[0]);
      setFormJamMulai('09:00');
      setFormJamSelesai('10:30');
      setFormLinkMeet('https://meet.google.com/');
      setFormStatus('BERLANGSUNG');
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formJudul.trim() || !formLinkMeet.trim()) return;

    if (editingSession) {
      const updated = storage.updateTatapMuka(editingSession.id, {
        judul: formJudul,
        deskripsi: formDeskripsi,
        mata_pelajaran: formMapel,
        kelas: formKelas,
        paket: formPaket,
        tanggal: formTanggal,
        jam_mulai: formJamMulai,
        jam_selesai: formJamSelesai,
        link_meet: formLinkMeet,
        status: formStatus
      });
      if (updated) {
        googleSheetsSync.syncTatapMuka(updated, 'update').catch(err => console.warn('Tatap Muka sync:', err));
      }
    } else {
      const created = storage.addTatapMuka({
        judul: formJudul,
        deskripsi: formDeskripsi,
        mata_pelajaran: formMapel,
        kelas: formKelas,
        paket: formPaket,
        tutor_id: currentUser.id,
        tutor_nama: currentUser.nama,
        tanggal: formTanggal,
        jam_mulai: formJamMulai,
        jam_selesai: formJamSelesai,
        link_meet: formLinkMeet,
        status: formStatus
      });
      if (created) {
        googleSheetsSync.syncTatapMuka(created, 'add').catch(err => console.warn('Tatap Muka sync:', err));
      }
    }

    setIsModalOpen(false);
    refreshData();
  };

  const handleDelete = (id: string, judul: string) => {
    if (confirm(`Hapus sesi tatap muka "${judul}"?`)) {
      const target = sessions.find(s => s.id === id);
      storage.deleteTatapMuka(id);
      if (target) {
        googleSheetsSync.syncTatapMuka(target, 'delete').catch(err => console.warn('Delete Tatap Muka sync:', err));
      }
      refreshData();
    }
  };

  const getStatusBadge = (status: TatapMukaStatus) => {
    switch (status) {
      case 'BERLANGSUNG':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-500 text-white shadow-sm animate-pulse">
            <Radio className="w-3.5 h-3.5" />
            <span>SEDANG BERLANGSUNG</span>
          </span>
        );
      case 'AKAN_DATANG':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
            <Calendar className="w-3.5 h-3.5" />
            <span>AKAN DATANG</span>
          </span>
        );
      case 'SELESAI':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>SELESAI</span>
          </span>
        );
      case 'DIBATALKAN':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-400">
            <XCircle className="w-3.5 h-3.5" />
            <span>DIBATALKAN</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Ongoing Classes Alert if any */}
      {ongoingSessions.length > 0 && (
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
              <Radio className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-white text-rose-600 uppercase tracking-wider">
                  Live Class
                </span>
                <span className="text-xs font-medium text-rose-100">
                  {ongoingSessions[0].mata_pelajaran} • {ongoingSessions[0].kelas}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
                {ongoingSessions[0].judul}
              </h3>
              <p className="text-xs text-rose-100">
                Oleh <strong>{ongoingSessions[0].tutor_nama}</strong> • Pukul {ongoingSessions[0].jam_mulai} - {ongoingSessions[0].jam_selesai} WIB
              </p>
            </div>
          </div>

          <a
            href={ongoingSessions[0].link_meet}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 bg-white hover:bg-rose-50 text-rose-600 active:scale-95 font-black text-xs sm:text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-transform cursor-pointer shrink-0"
          >
            <Video className="w-5 h-5 text-rose-600" />
            <span>🔴 GABUNG SEKARANG</span>
          </a>
        </div>
      )}

      {/* Header Controls & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Video className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Tatap Muka Online (Google Meet)</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Jadwal sesi video konferensi dan pembelajaran interaktif bersama tutor PKBM
          </p>
        </div>

        {currentUser.role !== 'SISWA' && (
          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Jadwalkan Tatap Muka</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            <option value="SEMUA">Semua Status</option>
            <option value="BERLANGSUNG">🔴 Sedang Berlangsung</option>
            <option value="AKAN_DATANG">📅 Akan Datang</option>
            <option value="SELESAI">✓ Selesai</option>
          </select>

          {currentUser.role !== 'SISWA' && (
            <select
              value={filterPaket}
              onChange={e => setFilterPaket(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              <option value="SEMUA">Semua Paket</option>
              <option value="PAKET B">Paket B (SMP)</option>
              <option value="PAKET C">Paket C (SMA)</option>
            </select>
          )}
        </div>

        <div className="relative min-w-[200px] flex-1 sm:flex-initial">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari sesi atau mata pelajaran..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Grid of Sessions */}
      {sortedSessions.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <Video className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
            Tidak ada jadwal tatap muka yang ditemukan
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Silakan cek kembali nanti atau hubungi tutor pengampu kelas Anda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {sortedSessions.map(session => {
            const isOngoing = session.status === 'BERLANGSUNG';

            return (
              <div
                key={session.id}
                className={`rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden bg-white dark:bg-slate-900 shadow-sm ${
                  isOngoing
                    ? 'border-rose-300 dark:border-rose-800 ring-2 ring-rose-500/20 shadow-md'
                    : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800'
                }`}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-md ${
                        session.paket === 'PAKET B'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-indigo-50 text-indigo-800 border border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300'
                      }`}>
                        {session.paket}
                      </span>
                      <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                        {session.mata_pelajaran}
                      </span>
                    </div>

                    {getStatusBadge(session.status)}
                  </div>

                  <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-snug">
                    {session.judul}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {session.deskripsi}
                  </p>

                  <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <Users className="w-3.5 h-3.5" />
                        Tutor Pengampu:
                      </span>
                      <span className="font-bold">{session.tutor_nama}</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <Calendar className="w-3.5 h-3.5" />
                        Jadwal:
                      </span>
                      <span className="font-semibold">{session.tanggal}</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        Waktu:
                      </span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">
                        {session.jam_mulai} - {session.jam_selesai} WIB
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-850/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  {/* Google Meet Button */}
                  {isOngoing ? (
                    <a
                      href={session.link_meet}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <Radio className="w-4 h-4 animate-pulse" />
                      <span>🔴 GABUNG SEKARANG</span>
                    </a>
                  ) : session.status === 'AKAN_DATANG' ? (
                    <a
                      href={session.link_meet}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <Video className="w-4 h-4" />
                      <span>Gabung Google Meet</span>
                    </a>
                  ) : (
                    <button
                      disabled
                      className="flex-1 py-2.5 px-4 bg-slate-200 dark:bg-slate-800 text-slate-400 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-not-allowed"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Sesi Selesai</span>
                    </button>
                  )}

                  {/* Tutor management actions */}
                  {currentUser.role !== 'SISWA' && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenModal(session)}
                        className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                        title="Edit Sesi"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(session.id, session.judul)}
                        className="p-2 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-colors cursor-pointer"
                        title="Hapus Sesi"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Tatap Muka Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mb-4">
              {editingSession ? 'Edit Sesi Tatap Muka' : 'Jadwalkan Tatap Muka Online Baru'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Judul Pertemuan / Topik
                </label>
                <input
                  type="text"
                  required
                  value={formJudul}
                  onChange={e => setFormJudul(e.target.value)}
                  placeholder="Contoh: Bedah Teks Eksplanasi & Diskusi Mandiri"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Program / Paket
                  </label>
                  <select
                    value={formPaket}
                    onChange={e => setFormPaket(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  >
                    <option value="PAKET B">PAKET B (SMP)</option>
                    <option value="PAKET C">PAKET C (SMA)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Mata Pelajaran
                  </label>
                  <select
                    value={formMapel}
                    onChange={e => setFormMapel(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                  >
                    {mapelOptions
                      .filter(m => m.paket === formPaket)
                      .map(mp => (
                        <option key={mp.id} value={mp.nama_mata_pelajaran}>
                          {mp.nama_mata_pelajaran}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    required
                    value={formTanggal}
                    onChange={e => setFormTanggal(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Jam Mulai
                  </label>
                  <input
                    type="time"
                    required
                    value={formJamMulai}
                    onChange={e => setFormJamMulai(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Jam Selesai
                  </label>
                  <input
                    type="time"
                    required
                    value={formJamSelesai}
                    onChange={e => setFormJamSelesai(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Link Google Meet
                </label>
                <input
                  type="url"
                  required
                  value={formLinkMeet}
                  onChange={e => setFormLinkMeet(e.target.value)}
                  placeholder="https://meet.google.com/xxx-xxxx-xxx"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  *Tutor membuat link di Google Meet terlebih dahulu, lalu menempelkan tautannya di sini.
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Status Pertemuan
                </label>
                <select
                  value={formStatus}
                  onChange={e => setFormStatus(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                >
                  <option value="BERLANGSUNG">🔴 Sedang Berlangsung (Aktif Sekarang)</option>
                  <option value="AKAN_DATANG">📅 Akan Datang</option>
                  <option value="SELESAI">✓ Selesai</option>
                  <option value="DIBATALKAN">✕ Dibatalkan</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Deskripsi / Agenda Pertemuan
                </label>
                <textarea
                  rows={2}
                  value={formDeskripsi}
                  onChange={e => setFormDeskripsi(e.target.value)}
                  placeholder="Ringkasan poin yang akan dibahas..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md"
                >
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
