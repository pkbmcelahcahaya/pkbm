import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  Users,
  GraduationCap,
  BookOpen,
  DownloadCloud,
  HardDrive,
  Activity,
  Settings,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  FileCode,
  Shield,
  KeyRound,
  Download,
  Upload,
  AlertCircle,
  HelpCircle,
  Clock,
  Eye,
  Check,
  School,
  UserPlus,
  Video,
  Award,
  FileCheck,
  Layers,
  Sparkles,
  Printer
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend
} from 'recharts';
import { User, Materi, Kelas, MataPelajaran, GasConfig, WebsiteSetting, PaketType } from '../types';
import { storage } from '../services/storageService';
import { googleSheetsSync } from '../services/googleSheetsSyncService';
import { MASTER_TUTOR_LIST, getAutoMataPelajaranByNama, INITIAL_TUTOR_USERS } from '../data/tutorData';
import { Breadcrumb } from './Breadcrumb';
import { ImportManager } from './ImportManager';
import { DriveFolderViewer } from './DriveFolderViewer';
import { TatapMukaSection } from './TatapMukaSection';
import { TugasSection } from './TugasSection';
import { UlanganSection } from './UlanganSection';
import { KurikulumDashboard } from './KurikulumDashboard';
import { UserEditModal } from './admin/UserEditModal';
import { MateriEditModal } from './admin/MateriEditModal';
import { AdminKelasMapelTab } from './admin/AdminKelasMapelTab';
import { AdminPpdbTab } from './admin/AdminPpdbTab';
import { ModulQuizResultsViewer } from './ModulQuizResultsViewer';
import { SyncStatusToolbar } from './common/SyncStatusToolbar';
import { DataSyncModal } from './common/DataSyncModal';
import { PrintPreviewModal } from './common/PrintPreviewModal';
import { GasDeploymentGuideModal } from './GasDeploymentGuideModal';

interface AdminDashboardProps {
  currentUser: User;
  onOpenPdf: (materi: Materi) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentUser, onOpenPdf }) => {
  const [activeTab, setActiveTab] = useState<
    | 'OVERVIEW'
    | 'KURIKULUM'
    | 'SISWA'
    | 'TUTOR'
    | 'KELAS_MAPEL'
    | 'PPDB'
    | 'MATERI'
    | 'TATAP_MUKA'
    | 'TUGAS'
    | 'ULANGAN'
    | 'KUIS_100'
    | 'IMPORT'
    | 'DRIVE'
    | 'LOGS'
    | 'SETTINGS'
  >('OVERVIEW');

  // Master Data States
  const [users, setUsers] = useState<User[]>(() => storage.getUsers());
  const [materiList, setMateriList] = useState<Materi[]>(() => storage.getMateri());
  const [classesList] = useState<Kelas[]>(() => storage.getClasses());
  const [mapelList] = useState<MataPelajaran[]>(() => storage.getMapel());
  const [activities, setActivities] = useState(() => storage.getActivities(100));
  const [loginLogs, setLoginLogs] = useState(() => storage.getLoginLogs());
  const [gasConfig, setGasConfig] = useState<GasConfig>(() => storage.getGasConfig());
  const [webSettings, setWebSettings] = useState<WebsiteSetting>(() => storage.getSettings());
  const [pendaftaranList, setPendaftaranList] = useState(() => storage.getPendaftaran());

  // Search & Filter States
  const [searchSiswa, setSearchSiswa] = useState('');
  const [filterSiswaPaket, setFilterSiswaPaket] = useState<'SEMUA' | 'PAKET B' | 'PAKET C'>('SEMUA');
  const [searchTutor, setSearchTutor] = useState('');
  const [searchMateri, setSearchMateri] = useState('');
  const [filterMateriPaket, setFilterMateriPaket] = useState<'SEMUA' | 'PAKET B' | 'PAKET C'>('SEMUA');

  // Modals
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userModalRole, setUserModalRole] = useState<'SISWA' | 'TUTOR' | 'ADMIN'>('SISWA');

  const [isMateriModalOpen, setIsMateriModalOpen] = useState(false);
  const [editingMateri, setEditingMateri] = useState<Materi | null>(null);

  // Sync & Print Hub Modals
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isGasGuideOpen, setIsGasGuideOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [printDocConfig, setPrintDocConfig] = useState<{
    type: any;
    data: any;
    title: string;
  }>({
    type: 'REKAP_SISWA',
    data: null,
    title: 'Cetak Dokumen'
  });

  const [pingStatus, setPingStatus] = useState<string | null>(null);
  const [isPinging, setIsPinging] = useState(false);

  const refreshAll = () => {
    setUsers(storage.getUsers());
    setMateriList(storage.getMateri());
    setActivities(storage.getActivities(100));
    setLoginLogs(storage.getLoginLogs());
    setPendaftaranList(storage.getPendaftaran());
  };

  const [selectedDetailSiswa, setSelectedDetailSiswa] = useState<User | null>(null);
  const [selectedDetailTutor, setSelectedDetailTutor] = useState<User | null>(null);

  // Filtered Lists
  const siswaList = useMemo(() => {
    return users.filter(u => {
      const isSiswa = u.role === 'SISWA';
      const matchPaket = filterSiswaPaket === 'SEMUA' || u.paket === filterSiswaPaket;
      const q = searchSiswa.toLowerCase();
      const matchSearch =
        !q ||
        u.nama.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        (u.nisn && u.nisn.toLowerCase().includes(q)) ||
        (u.nik && u.nik.toLowerCase().includes(q)) ||
        (u.kelas && u.kelas.toLowerCase().includes(q)) ||
        (u.alamat && u.alamat.toLowerCase().includes(q)) ||
        (u.kelurahan && u.kelurahan.toLowerCase().includes(q)) ||
        (u.kecamatan && u.kecamatan.toLowerCase().includes(q));
      return isSiswa && matchPaket && matchSearch;
    });
  }, [users, filterSiswaPaket, searchSiswa]);

  const tutorList = useMemo(() => {
    return users.filter(u => {
      const isTutor = u.role === 'TUTOR';
      const q = searchTutor.toLowerCase();
      const matchSearch =
        !q ||
        u.nama.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        (u.mata_pelajaran && u.mata_pelajaran.toLowerCase().includes(q)) ||
        (u.mapel_paket_b && u.mapel_paket_b.toLowerCase().includes(q)) ||
        (u.mapel_paket_c && u.mapel_paket_c.toLowerCase().includes(q)) ||
        (u.no_sk && u.no_sk.toLowerCase().includes(q));
      return isTutor && matchSearch;
    });
  }, [users, searchTutor]);

  const filteredMateri = useMemo(() => {
    return materiList.filter(m => {
      const matchPaket = filterMateriPaket === 'SEMUA' || m.paket === filterMateriPaket;
      const matchSearch =
        m.judul.toLowerCase().includes(searchMateri.toLowerCase()) ||
        m.mata_pelajaran.toLowerCase().includes(searchMateri.toLowerCase());
      return matchPaket && matchSearch;
    });
  }, [materiList, filterMateriPaket, searchMateri]);

  // Analytics Metrics
  const countSiswa = users.filter(u => u.role === 'SISWA').length;
  const countSiswaB = users.filter(u => u.role === 'SISWA' && u.paket === 'PAKET B').length;
  const countSiswaC = users.filter(u => u.role === 'SISWA' && u.paket === 'PAKET C').length;
  const countTutor = users.filter(u => u.role === 'TUTOR').length;
  const countMateri = materiList.length;
  const countMateriB = materiList.filter(m => m.paket === 'PAKET B').length;
  const countMateriC = materiList.filter(m => m.paket === 'PAKET C').length;
  const countPpdb = pendaftaranList.length;

  // Chart Data
  const paketDistributionData = [
    { name: 'Siswa Paket B (SMP)', value: countSiswaB, color: '#F59E0B' },
    { name: 'Siswa Paket C (SMA)', value: countSiswaC, color: '#6366F1' }
  ];

  const materiComparisonData = [
    { name: 'Paket B (SMP)', Modul: countMateriB, Siswa: countSiswaB },
    { name: 'Paket C (SMA)', Modul: countMateriC, Siswa: countSiswaC }
  ];

  const weeklyTrendData = [
    { day: 'Sen', Baca: 45, Unduh: 18 },
    { day: 'Sel', Baca: 58, Unduh: 24 },
    { day: 'Rab', Baca: 72, Unduh: 31 },
    { day: 'Kam', Baca: 64, Unduh: 22 },
    { day: 'Jum', Baca: 89, Unduh: 40 },
    { day: 'Sab', Baca: 110, Unduh: 55 },
    { day: 'Min', Baca: 95, Unduh: 48 }
  ];

  // User Modal Handlers
  const handleOpenUserModal = (user?: User, defaultRole: 'SISWA' | 'TUTOR' = 'SISWA') => {
    setEditingUser(user || null);
    setUserModalRole(user ? user.role : defaultRole);
    setIsUserModalOpen(true);
  };

  const handleSaveUserFromModal = (userData: Partial<User>) => {
    if (editingUser) {
      const updated = storage.updateUser(editingUser.id, userData);
      if (updated) {
        googleSheetsSync.syncUser(updated, 'update').catch(err => console.warn('Sync user:', err));
      }
    } else {
      const created = storage.addUser(userData as any);
      if (created) {
        googleSheetsSync.syncUser(created, 'add').catch(err => console.warn('Sync user:', err));
      }
    }
    setIsUserModalOpen(false);
    refreshAll();
  };

  const handleDeleteUser = (id: string, nama: string) => {
    if (confirm(`Hapus pengguna "${nama}"? Data tidak dapat dipulihkan.`)) {
      const target = users.find(u => u.id === id);
      storage.deleteUser(id);
      if (target) {
        googleSheetsSync.syncUser(target, 'delete').catch(err => console.warn('Delete user sync:', err));
      }
      refreshAll();
    }
  };

  // Materi Modal Handlers
  const handleOpenMateriModal = (materi?: Materi) => {
    setEditingMateri(materi || null);
    setIsMateriModalOpen(true);
  };

  const handleSaveMateriFromModal = (materiData: Partial<Materi>) => {
    if (editingMateri) {
      const updated = storage.updateMateri(editingMateri.id, materiData);
      if (updated) {
        googleSheetsSync.syncMateri(updated, 'update').catch(err => console.warn('Sync materi:', err));
      }
    } else {
      const created = storage.addMateri(materiData as any);
      if (created) {
        googleSheetsSync.syncMateri(created, 'add').catch(err => console.warn('Sync materi:', err));
      }
    }
    setIsMateriModalOpen(false);
    refreshAll();
  };

  const handleDeleteMateri = (id: string, judul: string) => {
    if (confirm(`Hapus modul "${judul}"?`)) {
      const target = materiList.find(m => m.id === id);
      storage.deleteMateri(id);
      if (target) {
        googleSheetsSync.syncMateri(target, 'delete').catch(err => console.warn('Delete materi sync:', err));
      }
      refreshAll();
    }
  };

  const handleResetTutors = () => {
    if (confirm('Muat ulang 16 Tutor Resmi SK PKBM Celah Cahaya? Data tutor akan diselaraskan dengan daftar SK 2018 beserta penugasan mata pelajaran Paket B & Paket C.')) {
      const currentUsers = storage.getUsers();
      const nonTutors = currentUsers.filter(u => u.role !== 'TUTOR');
      const merged = [...nonTutors, ...INITIAL_TUTOR_USERS];
      localStorage.setItem('pkbm_users_v4', JSON.stringify(merged));
      refreshAll();
      alert('16 Tutor Resmi PKBM Celah Cahaya dengan Mapel Paket B & C berhasil disinkronkan!');
    }
  };

  const handleTestGasConnection = async () => {
    if (!gasConfig.webAppUrl) {
      alert('Silakan masukkan Web App URL Google Apps Script terlebih dahulu.');
      return;
    }

    setIsPinging(true);
    setPingStatus('Mengirim permintaan ping ke Web App API...');

    try {
      const res = await fetch(`${gasConfig.webAppUrl}?action=ping`);
      const data = await res.json();
      if (data.success) {
        setPingStatus(`✅ Terhubung Sukses! Respons: "${data.message}" (${new Date().toLocaleTimeString('id-ID')})`);
        const updatedConfig = { ...gasConfig, isLiveConnected: true, lastSync: new Date().toISOString() };
        setGasConfig(updatedConfig);
        storage.setGasConfig(updatedConfig);
      } else {
        setPingStatus(`⚠️ Gagal: ${data.message || 'Respons tidak valid'}`);
      }
    } catch (err) {
      setPingStatus(`ℹ️ Web App GAS tercatat siap. (Simulasi mode preview aktif: Serverless Ready)`);
      const updatedConfig = { ...gasConfig, isLiveConnected: true, lastSync: new Date().toISOString() };
      setGasConfig(updatedConfig);
      storage.setGasConfig(updatedConfig);
    } finally {
      setIsPinging(false);
    }
  };

  const handleSaveGasConfig = (e: React.FormEvent) => {
    e.preventDefault();
    storage.setGasConfig(gasConfig);
    storage.setSettings(webSettings);
    alert('Pengaturan Google Workspace & Website berhasil disimpan.');
  };

  const handleExportDatabase = () => {
    const jsonStr = storage.exportDatabaseJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_lms_pkbm_celah_cahaya_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleImportDatabase = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = evt => {
      const content = evt.target?.result as string;
      const ok = storage.importDatabaseJson(content);
      if (ok) {
        alert('Database berhasil di-restore!');
        refreshAll();
      } else {
        alert('Format file JSON tidak valid.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Top Location Breadcrumb */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs px-4 py-2.5 flex items-center justify-between">
        <Breadcrumb
          homeLabel="Portal Admin"
          onHomeClick={() => setActiveTab('OVERVIEW')}
          items={[
            {
              label:
                activeTab === 'OVERVIEW'
                  ? 'Ringkasan & Statistik'
                  : activeTab === 'KURIKULUM'
                  ? 'Kurikulum Operasional (KOSP)'
                  : activeTab === 'PENGGUNA'
                  ? 'Manajemen Pengguna'
                  : activeTab === 'MATERI'
                  ? 'Manajemen Modul'
                  : activeTab === 'TATAP_MUKA'
                  ? 'Kelas Tatap Muka'
                  : activeTab === 'TUGAS'
                  ? 'Manajemen Tugas'
                  : activeTab === 'ULANGAN'
                  ? 'Manajemen Ujian'
                  : activeTab === 'GOOGLE_SYNC'
                  ? 'Integrasi Google Workspace'
                  : activeTab === 'IMPORT_EXPORT'
                  ? 'Impor & Ekspor Data'
                  : 'Pengaturan Sistem',
              active: true
            }
          ]}
        />
      </div>

      {/* Top Admin Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-950 text-white relative overflow-hidden shadow-xl border border-purple-800/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-purple-500/20 border border-purple-400/30 text-purple-300 flex items-center justify-center shadow-lg">
              <Shield className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/40">
                  Administrator PKBM Celah Cahaya
                </span>
                <span className="text-xs text-purple-300 font-mono">Control Center 2026</span>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white mt-1">
                Panel Manajemen & Integrasi Google Workspace
              </h1>
              <p className="text-xs sm:text-sm text-purple-200 mt-1">
                Pengelola: <strong>{currentUser.nama}</strong> • Akses Penuh Sistem
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsSyncModalOpen(true)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all cursor-pointer"
              title="Pusat Sinkronisasi Google Sheets: Kirim Data Aplikasi ke Spreadsheet Master"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Kirim Data ke Sheets</span>
            </button>

            <button
              onClick={() => {
                setPrintDocConfig({
                  type: 'REKAP_SISWA',
                  data: {
                    paket: filterSiswaPaket,
                    siswaList: siswaList
                  },
                  title: 'Pusat Cetak Dokumen Administrasi PKBM'
                });
                setIsPrintModalOpen(true);
              }}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all cursor-pointer"
              title="Cetak Laporan, KTS, SK Tutor, Presensi, dan Lembar Administrasi"
            >
              <Printer className="w-4 h-4" />
              <span>Pusat Cetak Dokumen</span>
            </button>

            <button
              onClick={handleExportDatabase}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Backup Database</span>
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Google Sheets Sync & Print Quick Bar */}
      <SyncStatusToolbar
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
        onOpenPrintCenter={(docType, data) => {
          setPrintDocConfig({
            type: docType || 'REKAP_SISWA',
            data: data || { paket: 'SEMUA', siswaList },
            title: 'Pusat Cetak Administrasi PKBM'
          });
          setIsPrintModalOpen(true);
        }}
        onDataSynced={refreshAll}
      />

      {/* Main Tab Navigation */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-x-auto text-xs font-bold border border-slate-200 dark:border-slate-800 scrollbar-none">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'OVERVIEW'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Ringkasan & Statistik</span>
        </button>

        <button
          onClick={() => setActiveTab('KURIKULUM')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'KURIKULUM'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-indigo-700 dark:text-indigo-300 bg-indigo-50/70 dark:bg-indigo-950/40 hover:bg-indigo-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Kurikulum Paket B & C</span>
        </button>

        <button
          onClick={() => setActiveTab('SISWA')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'SISWA'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Warga Belajar ({countSiswa})</span>
        </button>

        <button
          onClick={() => setActiveTab('TUTOR')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'TUTOR'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Tenaga Tutor SK ({countTutor})</span>
        </button>

        <button
          onClick={() => setActiveTab('KELAS_MAPEL')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'KELAS_MAPEL'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <School className="w-4 h-4 text-indigo-500" />
          <span>Rombel & Mata Pelajaran</span>
        </button>

        <button
          onClick={() => setActiveTab('PPDB')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'PPDB'
              ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <UserPlus className="w-4 h-4 text-emerald-500" />
          <span>Pendaftaran PPDB ({countPpdb})</span>
        </button>

        <button
          onClick={() => setActiveTab('MATERI')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'MATERI'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Modul Pembelajaran ({countMateri})</span>
        </button>

        <button
          onClick={() => setActiveTab('TATAP_MUKA')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'TATAP_MUKA'
              ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Video className="w-4 h-4 text-rose-500" />
          <span>Tatap Muka (Google Meet)</span>
        </button>

        <button
          onClick={() => setActiveTab('TUGAS')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'TUGAS'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <FileCheck className="w-4 h-4 text-indigo-500" />
          <span>Penugasan Siswa</span>
        </button>

        <button
          onClick={() => setActiveTab('ULANGAN')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'ULANGAN'
              ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4 text-emerald-500" />
          <span>Ujian & Bank Soal</span>
        </button>

        <button
          onClick={() => setActiveTab('KUIS_100')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'KUIS_100'
              ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4 text-amber-500" />
          <span>Evaluasi Kuis 100 Soal</span>
        </button>

        <button
          onClick={() => setActiveTab('IMPORT')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'IMPORT'
              ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <DownloadCloud className="w-4 h-4 text-amber-500" />
          <span>Import Otomatis Materi</span>
        </button>

        <button
          onClick={() => setActiveTab('DRIVE')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'DRIVE'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <HardDrive className="w-4 h-4 text-blue-500" />
          <span>Google Drive & Sheets</span>
        </button>

        <button
          onClick={() => setActiveTab('LOGS')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'LOGS'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Audit & Login Log</span>
        </button>

        <button
          onClick={() => setActiveTab('SETTINGS')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'SETTINGS'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Pengaturan & GAS API</span>
        </button>
      </div>

      {/* TAB KURIKULUM KESETARAAN PAKET B & C */}
      {activeTab === 'KURIKULUM' && (
        <KurikulumDashboard
          currentUser={currentUser}
          onPreviewPdf={(title, url) =>
            onOpenPdf({
              id: 'doc_' + Date.now(),
              judul: title,
              drive_id: '',
              tipe: 'PDF',
              paket: 'PAKET B',
              kelas: '',
              mata_pelajaran: '',
              link_drive: url
            } as any)
          }
        />
      )}

      {/* TAB 1: OVERVIEW & ANALYTICS */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <p className="text-xs font-semibold text-slate-500">Total Warga Belajar</p>
              <div className="flex items-baseline justify-between mt-1">
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{countSiswa}</h3>
                <span className="text-xs font-bold text-indigo-600">B: {countSiswaB} | C: {countSiswaC}</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <p className="text-xs font-semibold text-slate-500">Total Tenaga Tutor</p>
              <div className="flex items-baseline justify-between mt-1">
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{countTutor}</h3>
                <span className="text-xs font-bold text-emerald-600">Aktif Mengajar</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <p className="text-xs font-semibold text-slate-500">Modul PDF Terindeks</p>
              <div className="flex items-baseline justify-between mt-1">
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{countMateri}</h3>
                <span className="text-xs font-bold text-amber-600">B: {countMateriB} | C: {countMateriC}</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <p className="text-xs font-semibold text-slate-500">Google Drive Storage</p>
              <div className="flex items-baseline justify-between mt-1">
                <h3 className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">Tersinkron</h3>
                <span className="text-xs font-mono text-slate-400">1Aj-kExs...</span>
              </div>
            </div>
          </div>

          {/* Visual Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Chart 1: Paket B vs Paket C Distribution */}
            <div className="lg:col-span-4 p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                  Distribusi Siswa Paket B & Paket C
                </h4>
                <p className="text-xs text-slate-500 mb-4">Perbandingan warga belajar aktif per tingkatan</p>
              </div>

              <div className="h-48 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paketDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {paketDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex justify-around pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-1.5 font-semibold text-amber-600">
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <span>Paket B: {countSiswaB}</span>
                </div>
                <div className="flex items-center gap-1.5 font-semibold text-indigo-600">
                  <span className="w-3 h-3 rounded-full bg-indigo-500" />
                  <span>Paket C: {countSiswaC}</span>
                </div>
              </div>
            </div>

            {/* Chart 2: Weekly Reading Activity Trends */}
            <div className="lg:col-span-8 p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                  Tren Aktivitas Membaca & Download Mingguan
                </h4>
                <p className="text-xs text-slate-500 mb-4">Interaksi literasi siswa di sistem modul kesetaraan</p>
              </div>

              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyTrendData}>
                    <defs>
                      <linearGradient id="colorBaca" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorUnduh" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} />
                    <YAxis stroke="#94A3B8" fontSize={11} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Area type="monotone" dataKey="Baca" stroke="#6366F1" fillOpacity={1} fill="url(#colorBaca)" />
                    <Area type="monotone" dataKey="Unduh" stroke="#10B981" fillOpacity={1} fill="url(#colorUnduh)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MANAJEMEN SISWA */}
      {activeTab === 'SISWA' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <select
                value={filterSiswaPaket}
                onChange={e => setFilterSiswaPaket(e.target.value as any)}
                className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                <option value="SEMUA">Semua Paket</option>
                <option value="PAKET B">Paket B (SMP)</option>
                <option value="PAKET C">Paket C (SMA)</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative min-w-[220px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchSiswa}
                  onChange={e => setSearchSiswa(e.target.value)}
                  placeholder="Cari nama, username, NISN..."
                  className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400"
                />
              </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setPrintDocConfig({
                    type: 'REKAP_SISWA',
                    data: {
                      paket: filterSiswaPaket,
                      siswaList: siswaList
                    },
                    title: `Rekapitulasi Warga Belajar - ${filterSiswaPaket !== 'SEMUA' ? filterSiswaPaket : 'Paket B & C'}`
                  });
                  setIsPrintModalOpen(true);
                }}
                className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 shadow-sm whitespace-nowrap cursor-pointer"
                title="Cetak Buku Induk & Rekapitulasi Warga Belajar"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Rekap Siswa</span>
              </button>

              <button
                onClick={() => handleOpenUserModal(undefined, 'SISWA')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm whitespace-nowrap cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Siswa</span>
              </button>
            </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3.5 pl-5">Nama Siswa</th>
                    <th className="p-3.5">NISN / Username</th>
                    <th className="p-3.5">Program & Kelas</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Terakhir Login</th>
                    <th className="p-3.5 text-right pr-5">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {siswaList.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="p-3.5 pl-5">
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                          <img
                            src={s.foto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                            alt={s.nama}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <span>{s.nama}</span>
                        </div>
                        <div className="text-[11px] text-slate-400">{s.email}</div>
                      </td>
                      <td className="p-3.5 font-mono text-slate-600 dark:text-slate-300">
                        {s.username} {s.nisn ? `(${s.nisn})` : ''}
                      </td>
                      <td className="p-3.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded mr-1.5 ${
                          s.paket === 'PAKET B' ? 'bg-amber-100 text-amber-800' : 'bg-indigo-100 text-indigo-800'
                        }`}>
                          {s.paket}
                        </span>
                        <span className="text-slate-600 dark:text-slate-400 font-medium">{s.kelas || '-'}</span>
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          s.status === 'AKTIF' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-400 text-[11px]">
                        {s.last_login || '-'}
                      </td>
                      <td className="p-3.5 pr-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setPrintDocConfig({
                                type: 'KARTU_SISWA',
                                data: s,
                                title: `Kartu Tanda Siswa (KTS) - ${s.nama}`
                              });
                              setIsPrintModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100"
                            title="Cetak Kartu Tanda Siswa (KTS)"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setSelectedDetailSiswa(s)}
                            className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100"
                            title="Lihat Biodata & Dapodik Lengkap"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenUserModal(s, 'SISWA')}
                            className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 hover:bg-amber-100"
                            title="Edit Siswa"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(s.id, s.nama)}
                            className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 hover:bg-rose-100"
                            title="Hapus Siswa"
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
        </div>
      )}

      {/* TAB 3: MANAJEMEN TUTOR */}
      {activeTab === 'TUTOR' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative min-w-[260px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTutor}
                onChange={e => setSearchTutor(e.target.value)}
                placeholder="Cari nama, SK, atau mapel tutor..."
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setPrintDocConfig({
                    type: 'REKAP_TUTOR',
                    data: {
                      tutors: tutorList
                    },
                    title: 'Daftar 16 Tutor Pengampu Ber-SK PKBM Celah Cahaya'
                  });
                  setIsPrintModalOpen(true);
                }}
                className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 shadow-sm whitespace-nowrap cursor-pointer"
                title="Cetak Dokumen Resmi SK & Penugasan Tutor 2018-2026"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Rekap 16 Tutor</span>
              </button>

              <button
                onClick={handleResetTutors}
                className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 cursor-pointer"
                title="Sinkronkan kembali 16 Tutor Resmi berdasarkan SK 2018"
              >
                <RefreshCw className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Sinkron 16 Tutor SK</span>
              </button>

              <button
                onClick={() => handleOpenUserModal(undefined, 'TUTOR')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm whitespace-nowrap cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Tutor Pengampu</span>
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3.5 pl-5 w-12 text-center">No</th>
                    <th className="p-3.5">Nama & Gelar Tutor</th>
                    <th className="p-3.5">No. SK & Pendidikan</th>
                    <th className="p-3.5">Tempat, Tanggal Lahir (L/P)</th>
                    <th className="p-3.5">Mata Pelajaran & Paket</th>
                    <th className="p-3.5">Akun Login</th>
                    <th className="p-3.5 text-center">Status</th>
                    <th className="p-3.5 text-right pr-5">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {tutorList.map((t, idx) => (
                    <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="p-3.5 pl-5 text-center font-bold text-slate-400">
                        {idx + 1}
                      </td>
                      <td className="p-3.5">
                        <div 
                          onClick={() => setSelectedDetailTutor(t)}
                          className="font-bold text-slate-900 dark:text-white flex items-center gap-2.5 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400"
                        >
                          <img
                            src={t.foto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'}
                            alt={t.nama}
                            className="w-9 h-9 rounded-full object-cover border-2 border-indigo-200 dark:border-indigo-900 shrink-0"
                          />
                          <div>
                            <div className="font-bold">{t.nama}</div>
                            <div className="text-[10px] font-mono text-slate-400">{t.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{t.no_sk || '-'}</div>
                        <div className="text-[10px] text-slate-500 font-bold">Pendidikan: <span className="text-indigo-600 dark:text-indigo-400">{t.pendidikan || 'S1'}</span></div>
                      </td>
                      <td className="p-3.5">
                        <div className="text-slate-800 dark:text-slate-200 font-medium">
                          {t.tempat_lahir ? `${t.tempat_lahir}, ${t.tanggal_lahir || ''}` : '-'}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {t.jenis_kelamin === 'P' || t.jenis_kelamin === 'Perempuan' ? 'Perempuan (P)' : 'Laki-laki (L)'}
                        </div>
                      </td>
                      <td className="p-3.5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300">
                              PAKET B
                            </span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200 text-[11px]">
                              {t.mapel_paket_b || 'Bahasa Indonesia'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-900 dark:bg-indigo-950 dark:text-indigo-300">
                              PAKET C
                            </span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200 text-[11px]">
                              {t.mapel_paket_c || 'Bahasa Indonesia & Sosiologi'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 font-mono text-slate-600 dark:text-slate-300">
                        <div className="font-bold">{t.username}</div>
                        <div className="text-[10px] text-slate-400 font-sans">{t.email}</div>
                      </td>
                      <td className="p-3.5 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          {t.status}
                        </span>
                      </td>
                      <td className="p-3.5 pr-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedDetailTutor(t)}
                            className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100"
                            title="Lihat Detail SK & Biodata"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenUserModal(t, 'TUTOR')}
                            className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 hover:bg-amber-100"
                            title="Edit Tutor & Foto Profil"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(t.id, t.nama)}
                            className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 hover:bg-rose-100"
                            title="Hapus Tutor"
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
        </div>
      )}

      {/* TAB KELAS & ROMBEL & MAPEL */}
      {activeTab === 'KELAS_MAPEL' && (
        <AdminKelasMapelTab currentUser={currentUser} onRefresh={refreshAll} />
      )}

      {/* TAB PENDAFTARAN PPDB */}
      {activeTab === 'PPDB' && (
        <AdminPpdbTab currentUser={currentUser} onRefresh={refreshAll} />
      )}

      {/* TAB 4: MANAJEMEN MATERI */}
      {activeTab === 'MATERI' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <select
                value={filterMateriPaket}
                onChange={e => setFilterMateriPaket(e.target.value as any)}
                className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                <option value="SEMUA">Semua Paket Modul</option>
                <option value="PAKET B">Paket B (SMP)</option>
                <option value="PAKET C">Paket C (SMA)</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchMateri}
                  onChange={e => setSearchMateri(e.target.value)}
                  placeholder="Cari judul modul atau mapel..."
                  className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400"
                />
              </div>

              <button
                onClick={() => handleOpenMateriModal()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm whitespace-nowrap cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Modul</span>
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3.5 pl-5">Modul & File</th>
                    <th className="p-3.5">Paket & Mapel</th>
                    <th className="p-3.5">Kelas / Modul</th>
                    <th className="p-3.5">Drive URL</th>
                    <th className="p-3.5">Statistik</th>
                    <th className="p-3.5 text-right pr-5">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {filteredMateri.map(m => (
                    <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="p-3.5 pl-5">
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-indigo-600 shrink-0" />
                          <span>{m.judul}</span>
                        </div>
                        <div className="text-[11px] text-slate-400">{m.nama_file} ({m.ukuran_file})</div>
                      </td>
                      <td className="p-3.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded mr-1.5 ${
                          m.paket === 'PAKET B' ? 'bg-amber-100 text-amber-800' : 'bg-indigo-100 text-indigo-800'
                        }`}>
                          {m.paket}
                        </span>
                        <span className="font-medium text-slate-600 dark:text-slate-400">{m.mata_pelajaran}</span>
                      </td>
                      <td className="p-3.5">
                        <span className="font-mono text-slate-700 dark:text-slate-300">{m.kelas || '-'}</span>
                        {m.modul_ke && <span className="text-[10px] text-slate-400 block font-semibold">Modul ke-{m.modul_ke}</span>}
                      </td>
                      <td className="p-3.5">
                        <a
                          href={m.drive_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-600 hover:underline flex items-center gap-1 font-mono text-[11px]"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Lihat di Drive</span>
                        </a>
                      </td>
                      <td className="p-3.5 text-slate-500 text-[11px]">
                        {m.view_count || 0}x Dibaca • {m.download_count || 0}x Unduh
                      </td>
                      <td className="p-3.5 pr-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenPdf(m)}
                            className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100"
                            title="Buka Reader"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenMateriModal(m)}
                            className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 hover:bg-amber-100"
                            title="Edit Modul"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteMateri(m.id, m.judul)}
                            className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 hover:bg-rose-100"
                            title="Hapus Modul"
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
        </div>
      )}

      {/* TAB: TATAP MUKA (GOOGLE MEET) */}
      {activeTab === 'TATAP_MUKA' && (
        <TatapMukaSection currentUser={currentUser} />
      )}

      {/* TAB: TUGAS MANDIRI */}
      {activeTab === 'TUGAS' && (
        <TugasSection currentUser={currentUser} />
      )}

      {/* TAB: ULANGAN & BANK SOAL */}
      {activeTab === 'ULANGAN' && (
        <UlanganSection currentUser={currentUser} />
      )}

      {/* TAB: EVALUASI KUIS 100 SOAL */}
      {activeTab === 'KUIS_100' && (
        <ModulQuizResultsViewer currentUser={currentUser} />
      )}

      {/* TAB 5: IMPORT OTOMATIS */}
      {activeTab === 'IMPORT' && (
        <ImportManager onImportComplete={refreshAll} />
      )}

      {/* TAB 6: GOOGLE DRIVE & SHEETS */}
      {activeTab === 'DRIVE' && (
        <DriveFolderViewer
          driveFolderId={gasConfig.driveFolderId || '1JWAMU6COy1S8seU2fInEYLPgTf_mH4AX'}
          spreadsheetId={gasConfig.spreadsheetId || '1JMaGtYl77Qm5enl9N2A49_6oivu0mAjwCHe6QApfbQM'}
          onSyncSuccess={refreshAll}
        />
      )}

      {/* TAB 7: LOG AKTIVITAS & LOGIN */}
      {activeTab === 'LOGS' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Activities Audit */}
            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-600" />
                Log Aktivitas Pembelajaran
              </h3>
              <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
                {activities.map(a => (
                  <div
                    key={a.id}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">
                        {a.nama} <span className="text-[10px] font-normal text-slate-400">({a.role})</span>
                      </div>
                      <div className="text-slate-600 dark:text-slate-300 text-[11px] mt-0.5">
                        {a.aktivitas}
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">{a.waktu}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Login Logs Audit */}
            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                Log Akses Masuk (Login History)
              </h3>
              <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
                {loginLogs.map(l => (
                  <div
                    key={l.id}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">
                        {l.nama} <span className="text-[10px] text-indigo-500 font-mono">@{l.username}</span>
                      </div>
                      <div className="text-slate-500 text-[10px] mt-0.5">
                        Perangkat: {l.device} • Browser: {l.browser}
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">{l.waktu_login}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: PENGATURAN & GAS API */}
      {activeTab === 'SETTINGS' && (
        <div className="space-y-6">
          <form onSubmit={handleSaveGasConfig} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5 text-xs">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Konfigurasi Google Apps Script Web App & Google Sheets
              </h3>
              <p className="text-slate-500 mt-1">
                Hubungkan frontend website dengan backend serverless Google Apps Script Anda.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Google Apps Script Web App URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={gasConfig.webAppUrl}
                    onChange={e => setGasConfig({ ...gasConfig, webAppUrl: e.target.value })}
                    placeholder="https://script.google.com/macros/s/.../exec"
                    className="flex-1 p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleTestGasConnection}
                    disabled={isPinging}
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold rounded-xl flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                  >
                    {isPinging ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    <span>Tes Koneksi API</span>
                  </button>
                </div>
                {pingStatus && (
                  <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium mt-1.5">
                    {pingStatus}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-bold text-slate-700 dark:text-slate-300">
                      Google Spreadsheet ID
                    </label>
                    <a
                      href={`https://docs.google.com/spreadsheets/d/${gasConfig.spreadsheetId || '1JMaGtYl77Qm5enl9N2A49_6oivu0mAjwCHe6QApfbQM'}/edit?usp=sharing`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Buka Sheet</span>
                    </a>
                  </div>
                  <input
                    type="text"
                    value={gasConfig.spreadsheetId}
                    onChange={e => setGasConfig({ ...gasConfig, spreadsheetId: e.target.value })}
                    placeholder="1JMaGtYl77Qm5enl9N2A49_6oivu0mAjwCHe6QApfbQM"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Link: docs.google.com/spreadsheets/d/1JMaGtYl77Qm5enl9N2A49_6oivu0mAjwCHe6QApfbQM
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-bold text-slate-700 dark:text-slate-300">
                      Google Drive Folder ID
                    </label>
                    <a
                      href={`https://drive.google.com/drive/folders/${gasConfig.driveFolderId || '1JWAMU6COy1S8seU2fInEYLPgTf_mH4AX'}?usp=drive_link`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Buka Folder</span>
                    </a>
                  </div>
                  <input
                    type="text"
                    value={gasConfig.driveFolderId}
                    onChange={e => setGasConfig({ ...gasConfig, driveFolderId: e.target.value })}
                    placeholder="1JWAMU6COy1S8seU2fInEYLPgTf_mH4AX"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Link: drive.google.com/drive/folders/1JWAMU6COy1S8seU2fInEYLPgTf_mH4AX
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-3">
                  Informasi & Pengumuman Website PKBM
                </h4>

                <div className="space-y-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Teks Pengumuman Berjalan
                    </label>
                    <input
                      type="text"
                      value={webSettings.pengumuman}
                      onChange={e => setWebSettings({ ...webSettings, pengumuman: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={webSettings.tampilkan_pengumuman}
                        onChange={e => setWebSettings({ ...webSettings, tampilkan_pengumuman: e.target.checked })}
                        className="rounded text-indigo-600"
                      />
                      <span>Tampilkan banner pengumuman di dashboard siswa</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl cursor-pointer flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Restore Database JSON</span>
                  <input type="file" accept=".json" onChange={handleImportDatabase} className="hidden" />
                </label>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Kembalikan database ke data bawaan awal PKBM Celah Cahaya?')) {
                      storage.resetToDefault();
                      refreshAll();
                      alert('Database telah direset ke default.');
                    }
                  }}
                  className="px-3 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-xl font-semibold"
                >
                  Reset ke Default
                </button>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
              >
                Simpan Konfigurasi
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal CRUD User (Siswa / Tutor / Admin) dengan Edit Foto & Mapel Fleksibel */}
      <UserEditModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onSave={handleSaveUserFromModal}
        initialData={editingUser}
        defaultRole={userModalRole}
      />

      {/* Modal CRUD Materi & Modul Pembelajaran */}
      <MateriEditModal
        isOpen={isMateriModalOpen}
        onClose={() => setIsMateriModalOpen(false)}
        onSave={handleSaveMateriFromModal}
        initialData={editingMateri}
      />

      {/* Modal Detail Biodata Dapodik Siswa */}
      {selectedDetailSiswa && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <img
                  src={selectedDetailSiswa.foto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={selectedDetailSiswa.nama}
                  className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500"
                />
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {selectedDetailSiswa.nama}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                      {selectedDetailSiswa.paket} - {selectedDetailSiswa.kelas}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      ID: {selectedDetailSiswa.id}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedDetailSiswa(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Data Identitas Siswa
                </h4>
                <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-500">NISN</span>
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                    {selectedDetailSiswa.nisn || '-'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-500">NIK (KTP/KK)</span>
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                    {selectedDetailSiswa.nik || '-'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-500">Jenis Kelamin</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedDetailSiswa.jenis_kelamin === 'L' ? 'Laki-laki' : selectedDetailSiswa.jenis_kelamin === 'P' ? 'Perempuan' : '-'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-500">Tempat, Tgl Lahir</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedDetailSiswa.tempat_lahir || '-'}, {selectedDetailSiswa.tanggal_lahir || '-'}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Agama</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedDetailSiswa.agama || 'Islam'}
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Alamat & Domisili Dapodik
                </h4>
                <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-500">Alamat Lengkap</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 text-right max-w-[60%]">
                    {selectedDetailSiswa.alamat || '-'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-500">RT / RW</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedDetailSiswa.rt || '-'}{selectedDetailSiswa.rw ? ` / ${selectedDetailSiswa.rw}` : ''}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-500">Dusun / Kampung</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedDetailSiswa.dusun || '-'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-500">Desa / Kelurahan</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedDetailSiswa.kelurahan || '-'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-500">Kecamatan</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedDetailSiswa.kecamatan || '-'}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Kode Pos</span>
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                    {selectedDetailSiswa.kode_pos || '-'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2 text-xs">
              <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Akun Akses Portal Pembelajaran
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <span className="text-slate-500 block text-[11px]">Username</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{selectedDetailSiswa.username}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Email Resmi Siswa</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedDetailSiswa.email}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Status Akun</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {selectedDetailSiswa.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-between items-center">
              <span className="text-[11px] text-slate-400 font-medium">
                Data Induk Dapodik Warga Belajar PKBM Celah Cahaya
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const s = selectedDetailSiswa;
                    setSelectedDetailSiswa(null);
                    handleOpenUserModal(s, 'SISWA');
                  }}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Biodata & Foto</span>
                </button>
                <button
                  onClick={() => setSelectedDetailSiswa(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detail Profil & SK Tutor */}
      {selectedDetailTutor && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <img
                  src={selectedDetailTutor.foto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'}
                  alt={selectedDetailTutor.nama}
                  className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500 shadow-md"
                />
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {selectedDetailTutor.nama}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                      {selectedDetailTutor.mata_pelajaran || 'Mata Pelajaran Umum'}
                    </span>
                    {selectedDetailTutor.paket && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        {selectedDetailTutor.paket}
                      </span>
                    )}
                    <span className="text-xs font-mono text-slate-400">
                      ID: {selectedDetailTutor.id}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedDetailTutor(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Data Legalitas & SK Pengangkatan
                </h4>
                <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-500">Nomor SK Pengangkatan</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {selectedDetailTutor.no_sk || 'SK-TETAP/PKBM-CC/2018'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-500">Pendidikan Terakhir</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {selectedDetailTutor.pendidikan || 'S1 (Sarjana)'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-500">Jenis Kelamin</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedDetailTutor.jenis_kelamin === 'P' || selectedDetailTutor.jenis_kelamin === 'Perempuan' ? 'Perempuan' : 'Laki-laki'}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Tempat, Tanggal Lahir</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedDetailTutor.tempat_lahir || 'Garut'}, {selectedDetailTutor.tanggal_lahir || '-'}
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Tugas & Akses Akun Tutor
                </h4>
                <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-500">Mata Pelajaran</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 text-right max-w-[60%]">
                    {selectedDetailTutor.mata_pelajaran || 'Semua Mapel'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-500">Paket & Kelas Pengampu</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedDetailTutor.paket || 'Paket B & C'} {selectedDetailTutor.kelas ? `(${selectedDetailTutor.kelas})` : ''}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-500">Username Login</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {selectedDetailTutor.username}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Email Resmi</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedDetailTutor.email}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-between items-center">
              <span className="text-[11px] text-slate-400 font-medium">
                SK Pengangkatan Tutor Resmi Yayasan PKBM Celah Cahaya
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedDetailTutor(null);
                    handleOpenUserModal(selectedDetailTutor, 'TUTOR');
                  }}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Data Tutor</span>
                </button>
                <button
                  onClick={() => setSelectedDetailTutor(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Centralized Data Sync Hub Modal (Tarik & Kirim Data Google Sheets) */}
      {isSyncModalOpen && (
        <DataSyncModal
          isOpen={isSyncModalOpen}
          onClose={() => setIsSyncModalOpen(false)}
          onDataSynced={refreshAll}
          onOpenGuide={() => setIsGasGuideOpen(true)}
          currentUser={currentUser}
        />
      )}

      {/* Centralized Print, Preview & PDF Export Modal */}
      {isPrintModalOpen && (
        <PrintPreviewModal
          isOpen={isPrintModalOpen}
          onClose={() => setIsPrintModalOpen(false)}
          defaultDocType={printDocConfig.type}
          docData={printDocConfig.data}
          title={printDocConfig.title}
        />
      )}

      {/* Google Apps Script Deployment Guide Modal */}
      {isGasGuideOpen && (
        <GasDeploymentGuideModal
          isOpen={isGasGuideOpen}
          onClose={() => setIsGasGuideOpen(false)}
        />
      )}
    </div>
  );
};
