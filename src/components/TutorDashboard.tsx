import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Users,
  Activity,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  FileText,
  Clock,
  Download,
  ExternalLink,
  Filter,
  Eye,
  Video,
  Award,
  Layers,
  Sparkles,
  ArrowRight,
  Radio
} from 'lucide-react';
import { User, Materi, PaketType } from '../types';
import { storage } from '../services/storageService';
import { Breadcrumb } from './Breadcrumb';
import { TatapMukaSection } from './TatapMukaSection';
import { TugasSection } from './TugasSection';
import { UlanganSection } from './UlanganSection';
import { ModulQuizResultsViewer } from './ModulQuizResultsViewer';

interface TutorDashboardProps {
  currentUser: User;
  onOpenPdf: (materi: Materi) => void;
  defaultMainTab?: string;
}

export const TutorDashboard: React.FC<TutorDashboardProps> = ({
  currentUser,
  onOpenPdf,
  defaultMainTab = 'DASHBOARD'
}) => {
  const [activeTab, setActiveTab] = useState<
    'DASHBOARD' | 'MATERI' | 'TATAP_MUKA' | 'TUGAS' | 'ULANGAN' | 'KUIS_100' | 'SISWA' | 'AKTIVITAS'
  >((defaultMainTab as any) || 'DASHBOARD');

  const [searchMateri, setSearchMateri] = useState('');
  const [filterPaket, setFilterPaket] = useState<'SEMUA' | 'PAKET B' | 'PAKET C'>('SEMUA');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMateri, setEditingMateri] = useState<Materi | null>(null);

  // Form state for Add/Edit Materi
  const [formJudul, setFormJudul] = useState('');
  const [formDeskripsi, setFormDeskripsi] = useState('');
  const [formPaket, setFormPaket] = useState<PaketType>('PAKET B');
  const [formMapel, setFormMapel] = useState('Bahasa Indonesia');
  const [formDriveUrl, setFormDriveUrl] = useState('');
  const [formUkuran, setFormUkuran] = useState('4.5 MB');
  const [formTingkat, setFormTingkat] = useState('Kelas 7 / Derajat Terampil');

  const [materiList, setMateriList] = useState<Materi[]>(() => storage.getMateri());
  const [studentsList, setStudentsList] = useState<User[]>(() => storage.getUsers('SISWA'));
  const [activitiesList, setActivitiesList] = useState(() => storage.getActivities(50));

  const refreshData = () => {
    setMateriList(storage.getMateri());
    setStudentsList(storage.getUsers('SISWA'));
    setActivitiesList(storage.getActivities(50));
  };

  const mapelOptions = useMemo(() => storage.getMapel(), []);

  // 2026 LMS entities for tutor widgets
  const ongoingTatapMuka = useMemo(() => {
    return storage.getTatapMuka().filter(tm => tm.status === 'BERLANGSUNG');
  }, []);

  const allTugasList = useMemo(() => storage.getTugas(), []);
  const allSubmissions = useMemo(() => storage.getPengumpulanTugas(), []);
  const unratedSubmissions = useMemo(
    () => allSubmissions.filter(s => s.status !== 'SUDAH_DINILAI'),
    [allSubmissions]
  );

  const allUlanganList = useMemo(() => storage.getUlangan(), []);
  const allAttempts = useMemo(() => storage.getUjianAttempts(), []);

  // Stats
  const totalSiswa = studentsList.length;
  const totalMateri = materiList.length;
  const countPaketB = materiList.filter(m => m.paket === 'PAKET B').length;
  const countPaketC = materiList.filter(m => m.paket === 'PAKET C').length;

  const filteredMateri = useMemo(() => {
    return materiList.filter(m => {
      const matchPaket = filterPaket === 'SEMUA' || m.paket === filterPaket;
      const matchSearch =
        m.judul.toLowerCase().includes(searchMateri.toLowerCase()) ||
        m.mata_pelajaran.toLowerCase().includes(searchMateri.toLowerCase());
      return matchPaket && matchSearch;
    });
  }, [materiList, filterPaket, searchMateri]);

  const handleOpenAddModal = (materi?: Materi) => {
    if (materi) {
      setEditingMateri(materi);
      setFormJudul(materi.judul);
      setFormDeskripsi(materi.deskripsi);
      setFormPaket(materi.paket);
      setFormMapel(materi.mata_pelajaran);
      setFormDriveUrl(materi.drive_url);
      setFormUkuran(materi.ukuran_file);
      setFormTingkat(materi.tingkatan || 'Kelas 7');
    } else {
      setEditingMateri(null);
      setFormJudul('');
      setFormDeskripsi('');
      setFormPaket(currentUser.paket || 'PAKET B');
      setFormMapel('Bahasa Indonesia');
      setFormDriveUrl('https://drive.google.com/drive/folders/1JWAMU6COy1S8seU2fInEYLPgTf_mH4AX');
      setFormUkuran('4.5 MB');
      setFormTingkat('Kelas 7');
    }
    setIsAddModalOpen(true);
  };

  const handleSaveMateri = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formJudul.trim()) return;

    if (editingMateri) {
      storage.updateMateri(editingMateri.id, {
        judul: formJudul,
        deskripsi: formDeskripsi,
        paket: formPaket,
        mata_pelajaran: formMapel,
        drive_url: formDriveUrl,
        ukuran_file: formUkuran,
        tingkatan: formTingkat
      });
    } else {
      storage.addMateri({
        judul: formJudul,
        deskripsi: formDeskripsi,
        paket: formPaket,
        mata_pelajaran: formMapel,
        kategori: 'Kurikulum Kesetaraan',
        nama_file: formJudul + '.pdf',
        file_id: `DRV-${Date.now()}`,
        drive_url: formDriveUrl,
        preview_url: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf',
        ukuran_file: formUkuran,
        tahun: '2026',
        urutan: materiList.length + 1,
        status: 'AKTIF',
        tingkatan: formTingkat
      });
    }

    setIsAddModalOpen(false);
    refreshData();
  };

  const handleDeleteMateri = (id: string, judul: string) => {
    if (confirm(`Yakin ingin menghapus materi "${judul}"?`)) {
      storage.deleteMateri(id);
      refreshData();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Location Breadcrumb */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs px-4 py-2.5 flex items-center justify-between">
        <Breadcrumb
          homeLabel="Portal Pengampu"
          onHomeClick={() => {
            setActiveTab('DASHBOARD');
            setFilterPaket('SEMUA');
          }}
          items={[
            {
              label:
                activeTab === 'DASHBOARD'
                  ? 'Ikhtisar Pembelajaran'
                  : activeTab === 'MATERI'
                  ? 'Manajemen Modul Ajar'
                  : activeTab === 'TATAP_MUKA'
                  ? 'Kelas Tatap Muka & Presensi'
                  : activeTab === 'TUGAS'
                  ? 'Penilaian Tugas'
                  : activeTab === 'ULANGAN'
                  ? 'Ujian & Asesmen'
                  : activeTab === 'SISWA'
                  ? 'Daftar Warga Belajar'
                  : 'Log Aktivitas',
              onClick:
                filterPaket !== 'SEMUA'
                  ? () => setFilterPaket('SEMUA')
                  : undefined,
              active: filterPaket === 'SEMUA'
            },
            ...(filterPaket !== 'SEMUA'
              ? [
                  {
                    label: filterPaket,
                    active: true
                  }
                ]
              : [])
          ]}
        />
      </div>

      {/* Hero Welcome Card for Tutor */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white relative overflow-hidden shadow-xl border border-indigo-900/50">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-20 w-60 h-60 bg-emerald-500/10 rounded-full blur-2xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <img
              src={currentUser.foto || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'}
              alt={currentUser.nama}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-emerald-400/40 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-400 text-slate-950">
                  {currentUser.role === 'TUTOR' ? 'Tutor Pengampu' : 'Super Admin'}
                </span>
                <span className="text-xs font-semibold text-indigo-300">
                  {currentUser.mata_pelajaran || 'Pengajar Kesetaraan'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white mt-1">
                Portal Tutor: {currentUser.nama}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Manajemen Kelas, Modul PDF, Tatap Muka Google Meet, Penugasan & Ujian Online 2026
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleOpenAddModal()}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Modul PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main LMS 2026 Navigation Bar for Tutor */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-xs font-bold">
        {[
          { key: 'DASHBOARD', label: '📊 Dashboard & Ikhtisar', icon: Layers },
          { key: 'MATERI', label: `📚 Manajemen E-Modul (${totalMateri})`, icon: BookOpen },
          {
            key: 'TATAP_MUKA',
            label: `📹 Tatap Muka Meet ${ongoingTatapMuka.length > 0 ? '🔴 LIVE' : ''}`,
            icon: Video
          },
          {
            key: 'TUGAS',
            label: `📝 Penugasan Siswa ${unratedSubmissions.length > 0 ? `(${unratedSubmissions.length} Perlu Dinilai)` : ''}`,
            icon: FileText
          },
          {
            key: 'ULANGAN',
            label: `🧠 Pusat Ujian & Bank Soal (${allUlanganList.length})`,
            icon: Award
          },
          {
            key: 'KUIS_100',
            label: '💯 Rekap Kuis 100 Soal',
            icon: Award
          },
          { key: 'SISWA', label: `👥 Data Siswa (${totalSiswa})`, icon: Users },
          { key: 'AKTIVITAS', label: '⏱ Log Aktivitas', icon: Activity }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2.5 rounded-xl flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: DASHBOARD OVERVIEW */}
      {activeTab === 'DASHBOARD' && (
        <div className="space-y-6">
          {/* Ongoing Live Meeting Alert */}
          {ongoingTatapMuka.length > 0 && (
            <div className="p-5 rounded-3xl bg-gradient-to-r from-rose-600 to-amber-500 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <Radio className="w-5 h-5 animate-pulse text-white" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase bg-white text-rose-600 px-2 py-0.5 rounded">
                    Sesi Tatap Muka Sedang Aktif
                  </span>
                  <h3 className="font-bold text-sm sm:text-base text-white mt-1">
                    {ongoingTatapMuka[0].judul} ({ongoingTatapMuka[0].mata_pelajaran})
                  </h3>
                  <p className="text-xs text-rose-100">
                    Tutor: {ongoingTatapMuka[0].tutor_nama} • {ongoingTatapMuka[0].jam_mulai} - {ongoingTatapMuka[0].jam_selesai} WIB
                  </p>
                </div>
              </div>

              <a
                href={ongoingTatapMuka[0].link_meet}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 bg-white hover:bg-rose-50 text-rose-600 font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <Video className="w-4 h-4" />
                <span>🔴 MASUK GOOGLE MEET</span>
              </a>
            </div>
          )}

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            <div
              onClick={() => setActiveTab('MATERI')}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:border-indigo-300 transition-colors"
            >
              <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400 mb-3">
                <BookOpen className="w-6 h-6" />
                <span className="text-xs font-bold bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">Modul</span>
              </div>
              <p className="text-xs text-slate-500">Total E-Modul</p>
              <h4 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                {totalMateri}
              </h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Paket B: {countPaketB} • Paket C: {countPaketC}
              </p>
            </div>

            <div
              onClick={() => setActiveTab('TUGAS')}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:border-indigo-300 transition-colors"
            >
              <div className="flex items-center justify-between text-blue-600 dark:text-blue-400 mb-3">
                <FileText className="w-6 h-6" />
                <span className="text-xs font-bold bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">Tugas</span>
              </div>
              <p className="text-xs text-slate-500">Pengumpulan Tugas</p>
              <h4 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                {allSubmissions.length}
              </h4>
              <p className="text-[11px] text-amber-600 font-bold mt-1">
                {unratedSubmissions.length} Tugas Menunggu Penilaian
              </p>
            </div>

            <div
              onClick={() => setActiveTab('ULANGAN')}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:border-indigo-300 transition-colors"
            >
              <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 mb-3">
                <Award className="w-6 h-6" />
                <span className="text-xs font-bold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">Ujian</span>
              </div>
              <p className="text-xs text-slate-500">Paket Ulangan & Ujian</p>
              <h4 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                {allUlanganList.length}
              </h4>
              <p className="text-[11px] text-slate-400 mt-1">
                {allAttempts.length} Siswa Telah Mengerjakan
              </p>
            </div>

            <div
              onClick={() => setActiveTab('SISWA')}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:border-indigo-300 transition-colors"
            >
              <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 mb-3">
                <Users className="w-6 h-6" />
                <span className="text-xs font-bold bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded">Siswa</span>
              </div>
              <p className="text-xs text-slate-500">Warga Belajar Aktif</p>
              <h4 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                {totalSiswa}
              </h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Akses Terisolasi Paket B & C
              </p>
            </div>
          </div>

          {/* Quick Action Navigation Panels */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              onClick={() => setActiveTab('TATAP_MUKA')}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 transition-all cursor-pointer space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
                  <Video className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Jadwal Tatap Muka Online</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Buat link Google Meet dan jadwalkan sesi tatap muka interaktif bersama siswa.
              </p>
            </div>

            <div
              onClick={() => setActiveTab('TUGAS')}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 transition-all cursor-pointer space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                  <FileText className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Periksa Tugas Siswa</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Beri nilai 0-100 dan feedback langsung pada tugas yang dikumpulkan siswa.
              </p>
            </div>

            <div
              onClick={() => setActiveTab('ULANGAN')}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 transition-all cursor-pointer space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                  <Award className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Bank Soal & Ujian</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Susun butir soal pilihan ganda & esai serta terbitkan ujian online.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MATERI E-MODUL */}
      {activeTab === 'MATERI' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <select
                value={filterPaket}
                onChange={e => setFilterPaket(e.target.value as any)}
                className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
              >
                <option value="SEMUA">Semua Paket ({materiList.length})</option>
                <option value="PAKET B">PAKET B (SMP) ({countPaketB})</option>
                <option value="PAKET C">PAKET C (SMA) ({countPaketC})</option>
              </select>
            </div>

            <div className="relative min-w-[200px] flex-1 sm:flex-initial">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchMateri}
                onChange={e => setSearchMateri(e.target.value)}
                placeholder="Cari materi atau mapel..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMateri.map(materi => (
              <div
                key={materi.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                      materi.paket === 'PAKET B' ? 'bg-amber-100 text-amber-900' : 'bg-indigo-100 text-indigo-900'
                    }`}>
                      {materi.paket}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {materi.mata_pelajaran}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2">
                    {materi.judul}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {materi.deskripsi || materi.nama_file}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onOpenPdf(materi)}
                    className="flex-1 py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Buka PDF</span>
                  </button>

                  <button
                    onClick={() => handleOpenAddModal(materi)}
                    className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    title="Edit Materi"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDeleteMateri(materi.id, materi.judul)}
                    className="p-2 border border-rose-200 dark:border-rose-900 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 cursor-pointer"
                    title="Hapus Materi"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: TATAP MUKA (GOOGLE MEET) */}
      {activeTab === 'TATAP_MUKA' && (
        <TatapMukaSection currentUser={currentUser} />
      )}

      {/* TAB 4: TUGAS */}
      {activeTab === 'TUGAS' && (
        <TugasSection currentUser={currentUser} />
      )}

      {/* TAB 5: ULANGAN & BANK SOAL */}
      {activeTab === 'ULANGAN' && (
        <UlanganSection currentUser={currentUser} />
      )}

      {/* TAB: REKAP KUIS MODUL 100 SOAL */}
      {activeTab === 'KUIS_100' && (
        <ModulQuizResultsViewer currentUser={currentUser} />
      )}

      {/* TAB 6: DATA SISWA */}
      {activeTab === 'SISWA' && (
        <div className="space-y-3">
          <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3">
              Daftar Warga Belajar Terdaftar ({studentsList.length} Siswa)
            </h3>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {studentsList.map(s => (
                <div key={s.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={s.foto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                      alt={s.nama}
                      className="w-9 h-9 rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">{s.nama}</h4>
                      <p className="text-slate-400">
                        Username: <strong>{s.username}</strong> • NISN: {s.nisn || '-'}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="px-2.5 py-0.5 rounded-full font-black text-[10px] bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                      {s.paket}
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">{s.kelas}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: LOG AKTIVITAS */}
      {activeTab === 'AKTIVITAS' && (
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Log Aktivitas Pembelajaran Terkini
          </h3>

          <div className="space-y-2">
            {activitiesList.map(a => (
              <div
                key={a.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">{a.nama}</span>
                    <span className="text-slate-500 mx-1">•</span>
                    <span className="text-slate-600 dark:text-slate-300">{a.aktivitas}</span>
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 shrink-0">{a.waktu}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add / Edit Materi Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              {editingMateri ? 'Edit Modul Pembelajaran' : 'Tambah Modul Pembelajaran Baru'}
            </h3>

            <form onSubmit={handleSaveMateri} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Judul Modul
                </label>
                <input
                  type="text"
                  required
                  value={formJudul}
                  onChange={e => setFormJudul(e.target.value)}
                  placeholder="Contoh: Matematika Modul 3: Persamaan Garis Lurus"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Paket
                  </label>
                  <select
                    value={formPaket}
                    onChange={e => setFormPaket(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
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
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
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

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tingkatan / Kelas
                </label>
                <input
                  type="text"
                  value={formTingkat}
                  onChange={e => setFormTingkat(e.target.value)}
                  placeholder="Contoh: Kelas 8 / Kelas 11"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  URL Google Drive / Berkas PDF
                </label>
                <input
                  type="url"
                  required
                  value={formDriveUrl}
                  onChange={e => setFormDriveUrl(e.target.value)}
                  placeholder="https://drive.google.com/file/d/..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Deskripsi Singkat
                </label>
                <textarea
                  rows={3}
                  value={formDeskripsi}
                  onChange={e => setFormDeskripsi(e.target.value)}
                  placeholder="Rangkuman kompetensi dan capaian pembelajaran..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl cursor-pointer"
                >
                  Simpan Modul
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
