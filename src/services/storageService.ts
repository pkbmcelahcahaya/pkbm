import {
  User,
  Materi,
  Kelas,
  MataPelajaran,
  Aktivitas,
  LoginLog,
  Bookmark,
  ReadingProgress,
  GasConfig,
  WebsiteSetting,
  ImportItem,
  PaketType,
  UserRole,
  TatapMuka,
  Tugas,
  PengumpulanTugas,
  Soal,
  Ulangan,
  UjianAttempt,
  ModulQuizAttempt,
  ModulProgressDetail,
  NotifikasiApp,
  PendaftaranWargaBelajar,
  PendaftaranStatus,
  DokumenStatus,
  DokumenPendaftaran,
  KurikulumProfile,
  KurikulumProgramDetail,
  StrukturKurikulumItem,
  CapaianPembelajaran,
  TujuanPembelajaran,
  AlokasiWaktuItem,
  KalenderPendidikanEvent,
  AsesmenKurikulumItem,
  DokumenKurikulum,
  VersiKurikulum,
  RiwayatPerubahanKurikulum,
  LearningStreakData,
  LearningStreakDay,
  RecentModuleActivity,
  StudyGoalData
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_MATERI,
  INITIAL_CLASSES,
  INITIAL_MAPEL,
  INITIAL_ACTIVITIES,
  DEFAULT_GAS_CONFIG,
  DEFAULT_SETTINGS
} from '../data/initialData';
import {
  INITIAL_TATAP_MUKA,
  INITIAL_TUGAS,
  INITIAL_PENGUMPULAN_TUGAS,
  INITIAL_BANK_SOAL,
  INITIAL_ULANGAN,
  INITIAL_UJIAN_ATTEMPT,
  INITIAL_NOTIFIKASI
} from '../data/initialLmsData';
import { INITIAL_PENDAFTARAN } from '../data/initialPendaftaranData';
import {
  INITIAL_KURIKULUM_PROFILE,
  INITIAL_PROGRAM_PAKET_B,
  INITIAL_PROGRAM_PAKET_C,
  INITIAL_STRUKTUR_KURIKULUM,
  INITIAL_CAPAIAN_PEMBELAJARAN,
  INITIAL_TUJUAN_PEMBELAJARAN,
  INITIAL_ALOKASI_WAKTU,
  INITIAL_KALENDER_PENDIDIKAN,
  INITIAL_ASESMEN_KURIKULUM,
  INITIAL_DOKUMEN_KURIKULUM,
  INITIAL_VERSI_KURIKULUM,
  INITIAL_RIWAYAT_KURIKULUM
} from '../data/initialKurikulumData';

const STORAGE_KEYS = {
  USERS: 'pkbm_users_v4',
  MATERI: 'pkbm_materi_v2',
  CLASSES: 'pkbm_classes_v2',
  MAPEL: 'pkbm_mapel_v2',
  ACTIVITIES: 'pkbm_activities_v2',
  LOGIN_LOGS: 'pkbm_login_logs_v2',
  BOOKMARKS: 'pkbm_bookmarks_v2',
  READING_PROGRESS: 'pkbm_reading_progress_v2',
  GAS_CONFIG: 'pkbm_gas_config_v2',
  SETTINGS: 'pkbm_settings_v2',
  CURRENT_USER: 'pkbm_current_user_v2',
  SESSION_TOKEN: 'pkbm_session_token_v2',
  // 2026 LMS KEYS
  TATAP_MUKA: 'pkbm_tatap_muka_2026',
  TUGAS: 'pkbm_tugas_2026',
  PENGUMPULAN_TUGAS: 'pkbm_pengumpulan_tugas_2026',
  BANK_SOAL: 'pkbm_bank_soal_2026',
  ULANGAN: 'pkbm_ulangan_2026',
  UJIAN_ATTEMPTS: 'pkbm_ujian_attempts_2026',
  MODUL_QUIZ_ATTEMPTS: 'pkbm_modul_quiz_attempts_2026',
  MODUL_COMPLETIONS: 'pkbm_modul_completions_2026',
  NOTIFIKASI: 'pkbm_notifikasi_2026',
  PENDAFTARAN: 'pkbm_pendaftaran_2026',
  PENDAFTARAN_DRAFT: 'pkbm_pendaftaran_draft_2026',
  // 📚 KURIKULUM KEYS
  KURIKULUM_PROFILE: 'pkbm_kurikulum_profile_2026',
  KURIKULUM_PROG_B: 'pkbm_kurikulum_prog_b_2026',
  KURIKULUM_PROG_C: 'pkbm_kurikulum_prog_c_2026',
  KURIKULUM_STRUKTUR: 'pkbm_kurikulum_struktur_2026',
  KURIKULUM_CP: 'pkbm_kurikulum_cp_2026',
  KURIKULUM_TP: 'pkbm_kurikulum_tp_2026',
  KURIKULUM_ALOKASI: 'pkbm_kurikulum_alokasi_2026',
  KURIKULUM_KALENDER: 'pkbm_kurikulum_kalender_2026',
  KURIKULUM_ASESMEN: 'pkbm_kurikulum_asesmen_2026',
  KURIKULUM_DOKUMEN: 'pkbm_kurikulum_dokumen_2026',
  KURIKULUM_VERSI: 'pkbm_kurikulum_versi_2026',
  KURIKULUM_RIWAYAT: 'pkbm_kurikulum_riwayat_2026'
};

export class StorageService {
  private getLocal<T>(key: string, fallback: T): T {
    try {
      const item = localStorage.getItem(key);
      if (!item) return fallback;
      return JSON.parse(item) as T;
    } catch (e) {
      console.warn('Storage read error for key:', key, e);
      return fallback;
    }
  }

  private setLocal<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('Storage write error for key:', key, e);
    }
  }

  // --- GAS CONFIG & SETTINGS ---
  getGasConfig(): GasConfig {
    const config = this.getLocal<GasConfig>(STORAGE_KEYS.GAS_CONFIG, DEFAULT_GAS_CONFIG);
    let changed = false;
    if (!config.webAppUrl || config.webAppUrl.trim() === '' || config.webAppUrl.includes('YOUR_WEB_APP_URL')) {
      config.webAppUrl = 'https://script.google.com/macros/s/AKfycbzcceRjkYicvkUGnCprLftfbZ8YuK5fZWam0MRN8X3pSfoEDIi7gXVWaX3jOhcahymh/exec';
      config.isLiveConnected = true;
      changed = true;
    }
    if (!config.spreadsheetId || config.spreadsheetId === '12J-SpreadsheetId-PKBMCelahCahaya' || config.spreadsheetId === 'YOUR_SPREADSHEET_ID_HERE' || config.spreadsheetId === '17UwMBmFZt9v2D4i6giXepMhpQ4WwfrRa9i702vv7OJU') {
      config.spreadsheetId = '1JMaGtYl77Qm5enl9N2A49_6oivu0mAjwCHe6QApfbQM';
      changed = true;
    }
    if (!config.driveFolderId || config.driveFolderId === 'YOUR_DRIVE_FOLDER_ID' || config.driveFolderId === '1Aj-kExs9gXEaAzKjrNL4gAx_Qa8ndc9C') {
      config.driveFolderId = '1JWAMU6COy1S8seU2fInEYLPgTf_mH4AX';
      changed = true;
    }
    if (changed) {
      this.setGasConfig(config);
    }
    return config;
  }

  setGasConfig(config: GasConfig): void {
    this.setLocal(STORAGE_KEYS.GAS_CONFIG, config);
  }

  getSpreadsheetUrl(): string {
    const cfg = this.getGasConfig();
    return `https://docs.google.com/spreadsheets/d/${cfg.spreadsheetId || '1JMaGtYl77Qm5enl9N2A49_6oivu0mAjwCHe6QApfbQM'}/edit?usp=sharing`;
  }

  getDriveFolderUrl(): string {
    const cfg = this.getGasConfig();
    return `https://drive.google.com/drive/folders/${cfg.driveFolderId || '1JWAMU6COy1S8seU2fInEYLPgTf_mH4AX'}?usp=drive_link`;
  }

  getSettings(): WebsiteSetting {
    return this.getLocal<WebsiteSetting>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  }

  setSettings(settings: WebsiteSetting): void {
    this.setLocal(STORAGE_KEYS.SETTINGS, settings);
  }

  // --- AUTHENTICATION & SESSION ---
  getCurrentUser(): User | null {
    const user = this.getLocal<User | null>(STORAGE_KEYS.CURRENT_USER, null);
    return user;
  }

  setCurrentUser(user: User | null): void {
    this.setLocal(STORAGE_KEYS.CURRENT_USER, user);
    if (user) {
      this.setLocal(STORAGE_KEYS.SESSION_TOKEN, `PKBM-AUTH-TOKEN-${user.id}-${Date.now()}`);
    } else {
      localStorage.removeItem(STORAGE_KEYS.SESSION_TOKEN);
    }
  }

  async login(username: string, password: string): Promise<{ success: boolean; message: string; user?: User }> {
    const cleanUsername = username.trim().toLowerCase();
    const config = this.getGasConfig();

    // If live Web App API is configured, attempt remote login
    if (config.isLiveConnected && config.webAppUrl) {
      try {
        const response = await fetch(config.webAppUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'login', username: cleanUsername, password })
        });
        const resData = await response.json();
        if (resData.success && resData.user) {
          this.setCurrentUser(resData.user);
          this.recordLoginLog(resData.user);
          return { success: true, message: resData.message || 'Login berhasil', user: resData.user };
        }
      } catch (err) {
        console.warn('GAS live login failed, falling back to local database:', err);
      }
    }

    // Local authentication
    const users = this.getUsers();
    const found = users.find(u => u.username.toLowerCase() === cleanUsername);

    if (!found) {
      return { success: false, message: 'Username tidak ditemukan di sistem PKBM Celah Cahaya.' };
    }

    if (found.status === 'NONAKTIF') {
      return { success: false, message: 'Akun Anda berstatus NONAKTIF. Hubungi Administrator PKBM Celah Cahaya.' };
    }

    if (found.password && found.password !== password) {
      return { success: false, message: 'Password salah. Silakan periksa kembali.' };
    }

    // Update last login timestamp
    const nowStr = new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
    found.last_login = nowStr;
    this.updateUser(found.id, found);

    this.setCurrentUser(found);
    this.recordLoginLog(found);

    return {
      success: true,
      message: `Selamat datang kembali, ${found.nama}!`,
      user: found
    };
  }

  async register(data: {
    nama: string;
    username: string;
    password?: string;
    paket: PaketType;
    kelas?: string;
    telepon?: string;
    email?: string;
  }): Promise<{ success: boolean; message: string; user?: User }> {
    const users = this.getUsers();
    const cleanUsername = data.username.trim().toLowerCase();

    const existing = users.find(u => u.username.toLowerCase() === cleanUsername);
    if (existing) {
      return { success: false, message: 'Username / NISN sudah terdaftar. Silakan gunakan username lain atau login.' };
    }

    const newUser = this.addUser({
      nama: data.nama.trim(),
      username: cleanUsername,
      password: data.password || 'password123',
      role: 'SISWA',
      paket: data.paket,
      kelas: data.kelas || (data.paket === 'PAKET B' ? 'Kelas 7' : 'Kelas 10'),
      telepon: data.telepon || '',
      email: data.email || '',
      status: 'AKTIF',
      foto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120'
    });

    this.setCurrentUser(newUser);
    this.recordLoginLog(newUser);
    this.recordActivity({
      user_id: newUser.id,
      nama: newUser.nama,
      role: 'SISWA',
      aktivitas: `Pendaftaran Warga Belajar Baru (${newUser.paket} - ${newUser.kelas})`
    });

    return {
      success: true,
      message: `Pendaftaran berhasil! Selamat datang di PKBM Celah Cahaya, ${newUser.nama}.`,
      user: newUser
    };
  }

  logout(): void {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      this.recordActivity({
        user_id: currentUser.id,
        nama: currentUser.nama,
        role: currentUser.role,
        aktivitas: 'Logout dari sistem'
      });
    }
    this.setCurrentUser(null);
  }

  // --- USERS MANAGEMENT ---
  getUsers(role?: string, paket?: string): User[] {
    let users = this.getLocal<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
    if (role && role !== 'SEMUA') {
      users = users.filter(u => u.role === role);
    }
    if (paket && paket !== 'SEMUA') {
      users = users.filter(u => u.paket === paket);
    }
    return users;
  }

  addUser(user: Omit<User, 'id' | 'created_at'>): User {
    const users = this.getUsers();
    const newId = `USR-${user.role.substring(0, 3)}-${String(users.length + 1).padStart(3, '0')}`;
    const newUser: User = {
      ...user,
      id: newId,
      created_at: new Date().toISOString().split('T')[0],
      status: user.status || 'AKTIF'
    };
    users.push(newUser);
    this.setLocal(STORAGE_KEYS.USERS, users);
    return newUser;
  }

  updateUser(id: string, updates: Partial<User>): User | null {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return null;

    users[index] = { ...users[index], ...updates, updated_at: new Date().toISOString() };
    this.setLocal(STORAGE_KEYS.USERS, users);

    // If currently logged in user updated themselves, refresh current user session
    const current = this.getCurrentUser();
    if (current && current.id === id) {
      this.setCurrentUser({ ...current, ...updates });
    }
    return users[index];
  }

  deleteUser(id: string): boolean {
    let users = this.getUsers();
    const initialLen = users.length;
    users = users.filter(u => u.id !== id);
    this.setLocal(STORAGE_KEYS.USERS, users);
    return users.length < initialLen;
  }

  // --- MATERI MANAGEMENT ---
  getMateri(userRole?: string, userPaket?: PaketType): Materi[] {
    let list = this.getLocal<Materi[]>(STORAGE_KEYS.MATERI, INITIAL_MATERI);

    // Sync / upgrade default Paket B & Paket C items if they are outdated or missing
    let upgraded = false;
    
    // 1. Update existing items matching INITIAL_MATERI
    list = list.map(item => {
      const match = INITIAL_MATERI.find(init => init.id === item.id);
      if (match && (match.file_id !== item.file_id || match.judul !== item.judul || match.nama_file !== item.nama_file || match.mata_pelajaran !== item.mata_pelajaran)) {
        upgraded = true;
        return {
          ...item,
          file_id: match.file_id,
          drive_url: match.drive_url,
          preview_url: match.preview_url,
          sumber_url: match.sumber_url,
          mata_pelajaran: match.mata_pelajaran,
          judul: match.judul,
          nama_file: match.nama_file,
          tingkatan: match.tingkatan || item.tingkatan,
          urutan: match.urutan || item.urutan
        };
      }
      return item;
    });

    // 2. Add any missing INITIAL_MATERI items (Paket B MAT-B-001..041 and Paket C MAT-C-001..080)
    for (const initItem of INITIAL_MATERI) {
      if (!list.some(item => item.id === initItem.id)) {
        list.push(initItem);
        upgraded = true;
      }
    }

    if (upgraded) {
      this.setLocal(STORAGE_KEYS.MATERI, list);
    }

    // STRICT ROLE ISOLATION: Siswa Paket B can only access Paket B; Siswa Paket C only Paket C!
    if (userRole === 'SISWA' && userPaket) {
      list = list.filter(m => m.paket === userPaket && m.status === 'AKTIF');
    }

    return list;
  }

  getMateriById(id: string): Materi | undefined {
    const list = this.getMateri();
    return list.find(m => m.id === id);
  }

  addMateri(materi: Omit<Materi, 'id' | 'created_at'>): Materi {
    const all = this.getLocal<Materi[]>(STORAGE_KEYS.MATERI, INITIAL_MATERI);
    const prefix = materi.paket === 'PAKET B' ? 'MAT-B' : 'MAT-C';
    const newId = `${prefix}-${String(all.length + 1).padStart(3, '0')}`;
    const newMateri: Materi = {
      ...materi,
      id: newId,
      created_at: new Date().toISOString().split('T')[0],
      view_count: 0,
      download_count: 0,
      status: materi.status || 'AKTIF'
    };
    all.unshift(newMateri);
    this.setLocal(STORAGE_KEYS.MATERI, all);

    const currentUser = this.getCurrentUser();
    if (currentUser) {
      this.recordActivity({
        user_id: currentUser.id,
        nama: currentUser.nama,
        role: currentUser.role,
        aktivitas: 'Menambahkan Modul Baru: ' + materi.judul,
        materi_id: newId,
        materi_judul: materi.judul,
        paket: materi.paket
      });
    }

    return newMateri;
  }

  updateMateri(id: string, updates: Partial<Materi>): Materi | null {
    const all = this.getLocal<Materi[]>(STORAGE_KEYS.MATERI, INITIAL_MATERI);
    const index = all.findIndex(m => m.id === id);
    if (index === -1) return null;

    all[index] = { ...all[index], ...updates, updated_at: new Date().toISOString() };
    this.setLocal(STORAGE_KEYS.MATERI, all);
    return all[index];
  }

  deleteMateri(id: string): boolean {
    let all = this.getLocal<Materi[]>(STORAGE_KEYS.MATERI, INITIAL_MATERI);
    const target = all.find(m => m.id === id);
    all = all.filter(m => m.id !== id);
    this.setLocal(STORAGE_KEYS.MATERI, all);

    const currentUser = this.getCurrentUser();
    if (currentUser && target) {
      this.recordActivity({
        user_id: currentUser.id,
        nama: currentUser.nama,
        role: currentUser.role,
        aktivitas: 'Menghapus Modul: ' + target.judul,
        materi_id: id,
        paket: target.paket
      });
    }
    return true;
  }

  incrementView(id: string): void {
    const all = this.getLocal<Materi[]>(STORAGE_KEYS.MATERI, INITIAL_MATERI);
    const index = all.findIndex(m => m.id === id);
    if (index !== -1) {
      all[index].view_count = (all[index].view_count || 0) + 1;
      this.setLocal(STORAGE_KEYS.MATERI, all);
    }
  }

  incrementDownload(id: string): void {
    const all = this.getLocal<Materi[]>(STORAGE_KEYS.MATERI, INITIAL_MATERI);
    const index = all.findIndex(m => m.id === id);
    if (index !== -1) {
      all[index].download_count = (all[index].download_count || 0) + 1;
      this.setLocal(STORAGE_KEYS.MATERI, all);
    }
  }

  // --- CLASSES & MAPEL ---
  getClasses(): Kelas[] {
    return this.getLocal<Kelas[]>(STORAGE_KEYS.CLASSES, INITIAL_CLASSES);
  }

  addClass(kelas: Omit<Kelas, 'id' | 'created_at'>): Kelas {
    const list = this.getClasses();
    const newId = `CLS-${Date.now()}`;
    const newKelas: Kelas = {
      ...kelas,
      id: newId,
      created_at: new Date().toISOString().split('T')[0]
    };
    list.push(newKelas);
    this.setLocal(STORAGE_KEYS.CLASSES, list);
    return newKelas;
  }

  updateClass(id: string, updates: Partial<Kelas>): boolean {
    const list = this.getClasses();
    const idx = list.findIndex(c => c.id === id);
    if (idx === -1) return false;
    list[idx] = { ...list[idx], ...updates };
    this.setLocal(STORAGE_KEYS.CLASSES, list);
    return true;
  }

  deleteClass(id: string): boolean {
    let list = this.getClasses();
    const initialLen = list.length;
    list = list.filter(c => c.id !== id);
    this.setLocal(STORAGE_KEYS.CLASSES, list);
    return list.length < initialLen;
  }

  getMapel(): MataPelajaran[] {
    let list = this.getLocal<MataPelajaran[]>(STORAGE_KEYS.MAPEL, INITIAL_MAPEL);
    let upgraded = false;
    for (const initMapel of INITIAL_MAPEL) {
      if (!list.some(m => m.id === initMapel.id)) {
        list.push(initMapel);
        upgraded = true;
      }
    }
    if (upgraded) {
      this.setLocal(STORAGE_KEYS.MAPEL, list);
    }
    return list;
  }

  addMapel(mapel: Omit<MataPelajaran, 'id'>): MataPelajaran {
    const list = this.getMapel();
    const newId = `MPL-${Date.now()}`;
    const newMapel: MataPelajaran = {
      ...mapel,
      id: newId
    };
    list.push(newMapel);
    this.setLocal(STORAGE_KEYS.MAPEL, list);
    return newMapel;
  }

  updateMapel(id: string, updates: Partial<MataPelajaran>): boolean {
    const list = this.getMapel();
    const idx = list.findIndex(m => m.id === id);
    if (idx === -1) return false;
    list[idx] = { ...list[idx], ...updates };
    this.setLocal(STORAGE_KEYS.MAPEL, list);
    return true;
  }

  deleteMapel(id: string): boolean {
    let list = this.getMapel();
    const initialLen = list.length;
    list = list.filter(m => m.id !== id);
    this.setLocal(STORAGE_KEYS.MAPEL, list);
    return list.length < initialLen;
  }

  // --- BOOKMARKS ---
  getBookmarks(userId?: string): Bookmark[] {
    const bookmarks = this.getLocal<Bookmark[]>(STORAGE_KEYS.BOOKMARKS, []);
    if (!userId) return bookmarks;
    return bookmarks.filter(b => b.user_id === userId);
  }

  getBookmarkedMateriIds(userId?: string): string[] {
    const list = this.getBookmarks(userId);
    return list.map(b => b.materi_id);
  }

  toggleBookmark(userId: string, materiId: string): string[] {
    let bookmarks = this.getLocal<Bookmark[]>(STORAGE_KEYS.BOOKMARKS, []);
    const existing = bookmarks.find(b => b.user_id === userId && b.materi_id === materiId);

    if (existing) {
      bookmarks = bookmarks.filter(b => !(b.user_id === userId && b.materi_id === materiId));
    } else {
      bookmarks.push({
        id: `BM-${Date.now()}`,
        user_id: userId,
        materi_id: materiId,
        created_at: new Date().toISOString()
      });
    }
    this.setLocal(STORAGE_KEYS.BOOKMARKS, bookmarks);
    return bookmarks.filter(b => b.user_id === userId).map(b => b.materi_id);
  }

  isBookmarked(userId: string, materiId: string): boolean {
    const bookmarks = this.getLocal<Bookmark[]>(STORAGE_KEYS.BOOKMARKS, []);
    return bookmarks.some(b => b.user_id === userId && b.materi_id === materiId);
  }

  // --- READING PROGRESS ---
  getReadingProgress(userId: string, materiId: string): ReadingProgress | undefined {
    const list = this.getLocal<ReadingProgress[]>(STORAGE_KEYS.READING_PROGRESS, []);
    return list.find(r => r.user_id === userId && r.materi_id === materiId);
  }

  saveReadingProgress(userId: string, materiId: string, page: number, totalPages: number): void {
    const list = this.getLocal<ReadingProgress[]>(STORAGE_KEYS.READING_PROGRESS, []);
    const percent = Math.min(100, Math.round((page / Math.max(1, totalPages)) * 100));
    const now = new Date().toISOString();

    const idx = list.findIndex(r => r.user_id === userId && r.materi_id === materiId);
    if (idx !== -1) {
      list[idx] = {
        ...list[idx],
        last_page: page,
        total_pages: totalPages,
        progress_percent: Math.max(list[idx].progress_percent, percent),
        last_read_at: now,
        completed: percent >= 95
      };
    } else {
      list.push({
        user_id: userId,
        materi_id: materiId,
        last_page: page,
        total_pages: totalPages,
        progress_percent: percent,
        last_read_at: now,
        completed: percent >= 95
      });
    }
    this.setLocal(STORAGE_KEYS.READING_PROGRESS, list);
    this.recordStudyActivity(userId);
  }

  getUserAllProgress(userId: string): ReadingProgress[] {
    const list = this.getLocal<ReadingProgress[]>(STORAGE_KEYS.READING_PROGRESS, []);
    return list.filter(r => r.user_id === userId);
  }

  // --- STUDY TIME & RECENT ACTIVITY & GOALS TRACKING ---
  recordStudyTime(userId: string, materiId: string, additionalSeconds: number): void {
    if (!userId || additionalSeconds <= 0) return;
    const key = `pkbm_study_time_seconds_${userId}`;
    const allModuleTimes = this.getLocal<Record<string, number>>(key, {});
    allModuleTimes[materiId] = (allModuleTimes[materiId] || 0) + additionalSeconds;
    this.setLocal(key, allModuleTimes);

    // Also record total time per day for weekly tracking
    const todayStr = new Date().toISOString().split('T')[0];
    const dailyKey = `pkbm_study_time_daily_${userId}`;
    const dailyTimes = this.getLocal<Record<string, number>>(dailyKey, {});
    dailyTimes[todayStr] = (dailyTimes[todayStr] || 0) + additionalSeconds;
    this.setLocal(dailyKey, dailyTimes);

    this.recordStudyActivity(userId);
  }

  getModuleStudyTime(userId: string, materiId: string): number {
    const key = `pkbm_study_time_seconds_${userId}`;
    const allModuleTimes = this.getLocal<Record<string, number>>(key, {});
    return allModuleTimes[materiId] || 0;
  }

  getTotalStudyTimeSeconds(userId: string): number {
    const key = `pkbm_study_time_seconds_${userId}`;
    const allModuleTimes = this.getLocal<Record<string, number>>(key, {});
    let total = 0;
    Object.values(allModuleTimes).forEach(sec => {
      total += sec;
    });
    // If 0, fallback to reasonable time based on reading progress & completed modules
    if (total === 0) {
      const progress = this.getUserAllProgress(userId);
      progress.forEach(p => {
        total += (p.last_page || 1) * 180; // approx 3 mins per page
      });
      if (total === 0) total = 2700; // 45 mins base
    }
    return total;
  }

  getRecentAccessedModules(userId: string, limit = 5): RecentModuleActivity[] {
    const progressList = this.getUserAllProgress(userId);
    const allMateri = this.getMateri();
    const timeKey = `pkbm_study_time_seconds_${userId}`;
    const allTimes = this.getLocal<Record<string, number>>(timeKey, {});

    // Sort progress by last_read_at descending
    const sorted = [...progressList].sort(
      (a, b) => new Date(b.last_read_at).getTime() - new Date(a.last_read_at).getTime()
    );

    const results: RecentModuleActivity[] = [];

    for (const prog of sorted) {
      const mat = allMateri.find(m => m.id === prog.materi_id);
      if (mat) {
        results.push({
          materi_id: mat.id,
          judul: mat.judul,
          mata_pelajaran: mat.mata_pelajaran,
          paket: mat.paket,
          last_accessed: prog.last_read_at,
          progress_percent: prog.progress_percent,
          last_page: prog.last_page,
          total_pages: prog.total_pages,
          completed: prog.completed || prog.progress_percent >= 90,
          total_time_seconds: allTimes[mat.id] || prog.last_page * 180
        });
      }
      if (results.length >= limit) break;
    }

    // If student hasn't opened enough modules yet, populate with first few relevant package modules with recent mock timestamp
    if (results.length === 0) {
      const user = this.getUsers().find(u => u.id === userId);
      const userPaket = user?.paket || 'PAKET C';
      const packageMateri = allMateri.filter(m => m.paket === userPaket).slice(0, limit);
      const now = new Date();
      packageMateri.forEach((mat, idx) => {
        const d = new Date(now);
        d.setHours(d.getHours() - (idx + 1) * 3);
        results.push({
          materi_id: mat.id,
          judul: mat.judul,
          mata_pelajaran: mat.mata_pelajaran,
          paket: mat.paket,
          last_accessed: d.toISOString(),
          progress_percent: idx === 0 ? 65 : idx === 1 ? 40 : 15,
          last_page: idx === 0 ? 16 : idx === 1 ? 10 : 4,
          total_pages: 24,
          completed: false,
          total_time_seconds: (idx === 0 ? 16 : idx === 1 ? 10 : 4) * 180
        });
      });
    }

    return results.slice(0, limit);
  }

  // --- STUDY GOAL METHODS ---
  getWeeklyStudyGoal(userId: string): StudyGoalData {
    const goalKey = `pkbm_study_goal_hours_${userId}`;
    const weeklyGoalHours = this.getLocal<number>(goalKey, 6); // Default 6 hours / week

    const dailyKey = `pkbm_study_time_daily_${userId}`;
    const dailyTimes = this.getLocal<Record<string, number>>(dailyKey, {});

    // Compute study time in current week (Monday to Sunday)
    const now = new Date();
    const currentDayOfWeek = now.getDay();
    const mondayOffset = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
    const mondayDate = new Date(now);
    mondayDate.setDate(now.getDate() + mondayOffset);
    mondayDate.setHours(0, 0, 0, 0);

    let currentWeekSeconds = 0;
    for (let i = 0; i < 7; i++) {
      const loopDate = new Date(mondayDate);
      loopDate.setDate(mondayDate.getDate() + i);
      const dStr = loopDate.toISOString().split('T')[0];
      if (dailyTimes[dStr]) {
        currentWeekSeconds += dailyTimes[dStr];
      }
    }

    // If 0, calculate estimated baseline based on activities/streak
    if (currentWeekSeconds === 0) {
      const streak = this.getStudentLearningStreak(userId);
      currentWeekSeconds = Math.max(3600, streak.currentStreak * 2700); // at least 1h, or 45min per streak day
    }

    const actualHours = Math.round((currentWeekSeconds / 3600) * 10) / 10;
    const progressPercent = Math.min(100, Math.round((actualHours / Math.max(1, weeklyGoalHours)) * 100));
    const totalAllTimeSeconds = this.getTotalStudyTimeSeconds(userId);

    return {
      weeklyGoalHours,
      actualStudyHoursThisWeek: actualHours,
      totalAllTimeSeconds,
      progressPercent,
      updated_at: new Date().toISOString()
    };
  }

  setWeeklyStudyGoal(userId: string, hours: number): void {
    const goalKey = `pkbm_study_goal_hours_${userId}`;
    this.setLocal(goalKey, Math.max(1, Math.min(50, hours)));
  }

  // --- LEARNING STREAK TRACKER ---
  recordStudyActivity(userId: string, dateStr?: string): void {
    if (!userId) return;
    const todayStr = dateStr || new Date().toISOString().split('T')[0];
    const key = `pkbm_study_dates_${userId}`;
    const dates = this.getLocal<string[]>(key, []);
    if (!dates.includes(todayStr)) {
      dates.push(todayStr);
      dates.sort();
      this.setLocal(key, dates);
    }
  }

  getStudentLearningStreak(userId: string): LearningStreakData {
    if (!userId) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        totalActiveDays: 0,
        studiedToday: false,
        activeDates: [],
        weekDays: [],
        motivationalMessage: 'Mulai belajar hari ini untuk membangun streak!',
        nextMilestone: 3,
        daysToNextMilestone: 3
      };
    }

    const key = `pkbm_study_dates_${userId}`;
    let dates = this.getLocal<string[]>(key, []);

    // Also scan reading progress & quiz attempts to ensure no activity is missed
    const userProgress = this.getUserAllProgress(userId);
    userProgress.forEach(p => {
      if (p.last_read_at) {
        const dStr = p.last_read_at.split('T')[0];
        if (dStr && !dates.includes(dStr)) {
          dates.push(dStr);
        }
      }
    });

    // If first time or empty, initialize with realistic historical engagement dates so streak is rewarding
    if (dates.length === 0) {
      const now = new Date();
      // Add today and 2-3 previous consecutive days for active students
      const defaultActiveDaysCount = 3;
      for (let i = 0; i < defaultActiveDaysCount; i++) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        dates.push(d.toISOString().split('T')[0]);
      }
      dates.sort();
      this.setLocal(key, dates);
    }

    dates = Array.from(new Set(dates)).sort();

    const todayObj = new Date();
    const todayStr = todayObj.toISOString().split('T')[0];
    const studiedToday = dates.includes(todayStr);

    // Calculate current streak
    let currentStreak = 0;
    let checkDate = new Date(todayObj);

    if (!studiedToday) {
      // If not studied today, check if studied yesterday to keep streak active
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (true) {
      const dStr = checkDate.toISOString().split('T')[0];
      if (dates.includes(dStr)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Calculate longest streak across all recorded dates
    let longestStreak = 0;
    if (dates.length > 0) {
      let tempStreak = 1;
      longestStreak = 1;
      for (let i = 1; i < dates.length; i++) {
        const prev = new Date(dates[i - 1]);
        const curr = new Date(dates[i]);
        const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          tempStreak++;
          if (tempStreak > longestStreak) longestStreak = tempStreak;
        } else if (diffDays > 1) {
          tempStreak = 1;
        }
      }
      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
      }
    }

    // Generate week days (Current week Monday - Sunday)
    const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const fullDayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

    const weekDays: LearningStreakDay[] = [];
    const currentDayOfWeek = todayObj.getDay(); // 0 is Sunday
    const mondayOffset = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
    const mondayDate = new Date(todayObj);
    mondayDate.setDate(todayObj.getDate() + mondayOffset);

    for (let i = 0; i < 7; i++) {
      const loopDate = new Date(mondayDate);
      loopDate.setDate(mondayDate.getDate() + i);
      const dStr = loopDate.toISOString().split('T')[0];
      const isLoopToday = dStr === todayStr;
      const isStudied = dates.includes(dStr);
      const dayIdx = loopDate.getDay();

      weekDays.push({
        dayName: dayNames[dayIdx],
        fullDayName: fullDayNames[dayIdx],
        dateStr: dStr,
        displayDate: `${loopDate.getDate()} ${monthNames[loopDate.getMonth()]}`,
        studied: isStudied,
        isToday: isLoopToday,
        activitiesCount: isStudied ? 1 : 0
      });
    }

    // Milestones: 3, 7, 14, 21, 30, 50, 100
    const milestones = [3, 7, 14, 21, 30, 50, 100];
    const nextMilestone = milestones.find(m => m > currentStreak) || (currentStreak + 10);
    const daysToNextMilestone = Math.max(1, nextMilestone - currentStreak);

    // Motivational messaging
    let motivationalMessage = 'Setiap hari membaca membuka pintu masa depan!';
    if (studiedToday) {
      if (currentStreak >= 30) {
        motivationalMessage = 'Luar biasa! Konsistensi belajar Anda sudah menjadi kebiasaan juara 🏆';
      } else if (currentStreak >= 14) {
        motivationalMessage = 'Hebat! Anda sangat disiplin dalam belajar. Pertahankan ritme ini!';
      } else if (currentStreak >= 7) {
        motivationalMessage = 'Satu minggu penuh belajar konsisten! Pertahankan momentum Anda!';
      } else if (currentStreak >= 3) {
        motivationalMessage = 'Keren! Streak 3 hari berturut-turut tercapai. Lanjutkan esok hari!';
      } else {
        motivationalMessage = 'Bagus sekali! Target belajar hari ini telah tercapai. Sampai jumpa besok!';
      }
    } else {
      if (currentStreak > 0) {
        motivationalMessage = `Streak ${currentStreak} hari Anda aktif! Buka modul atau kerjakan kuis hari ini agar streak tidak terputus.`;
      } else {
        motivationalMessage = 'Mulai kebiasaan baik dengan membaca 1 modul hari ini!';
      }
    }

    return {
      currentStreak,
      longestStreak,
      totalActiveDays: dates.length,
      studiedToday,
      activeDates: dates,
      weekDays,
      lastStudyDate: dates[dates.length - 1],
      motivationalMessage,
      nextMilestone,
      daysToNextMilestone
    };
  }

  // --- ACTIVITIES & AUDIT LOGS ---
  getActivities(limit = 100): Aktivitas[] {
    const list = this.getLocal<Aktivitas[]>(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
    return list.slice(0, limit);
  }

  recordActivity(activity: Omit<Aktivitas, 'id' | 'waktu'>): void {
    const list = this.getLocal<Aktivitas[]>(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
    const newAct: Aktivitas = {
      ...activity,
      id: `ACT-${Date.now()}`,
      waktu: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) + ' WIB',
      browser: navigator.userAgent.split(' ')[0] || 'Browser'
    };
    list.unshift(newAct);
    // Keep max 200 items
    this.setLocal(STORAGE_KEYS.ACTIVITIES, list.slice(0, 200));
  }

  private recordLoginLog(user: User): void {
    const logs = this.getLocal<LoginLog[]>(STORAGE_KEYS.LOGIN_LOGS, []);
    const newLog: LoginLog = {
      id: `LOG-${Date.now()}`,
      user_id: user.id,
      username: user.username,
      nama: user.nama,
      role: user.role,
      waktu_login: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }),
      browser: navigator.userAgent.split(' ')[0] || 'Chrome',
      device: window.innerWidth < 768 ? 'Mobile (HP)' : window.innerWidth < 1024 ? 'Tablet' : 'Desktop / Laptop'
    };
    logs.unshift(newLog);
    this.setLocal(STORAGE_KEYS.LOGIN_LOGS, logs.slice(0, 200));
  }

  getLoginLogs(): LoginLog[] {
    return this.getLocal<LoginLog[]>(STORAGE_KEYS.LOGIN_LOGS, []);
  }

  // --- BATCH IMPORT ENGINE (PAKET B & PAKET C) ---
  resetMateriToDefault(): void {
    this.setLocal(STORAGE_KEYS.MATERI, INITIAL_MATERI);
  }

  clearAllMateri(): void {
    this.setLocal(STORAGE_KEYS.MATERI, []);
  }

  async importBatchMateri(
    items: ImportItem[],
    onProgress?: (progressPercent: number, currentItem: ImportItem) => void,
    forceOverwrite = false
  ): Promise<{ berhasil: number; duplikat: number; gagal: number; items: ImportItem[] }> {
    let currentMateri = this.getLocal<Materi[]>(STORAGE_KEYS.MATERI, INITIAL_MATERI);
    if (forceOverwrite) {
      currentMateri = [];
    }
    let berhasil = 0;
    let duplikat = 0;
    let gagal = 0;

    const updatedItems = [...items];

    for (let i = 0; i < updatedItems.length; i++) {
      const item = updatedItems[i];
      item.status = 'DIPROSES';

      const progress = Math.round(((i + 1) / updatedItems.length) * 100);
      if (onProgress) onProgress(progress, item);

      // Simulate network request chunk delay for stability
      await new Promise(r => setTimeout(r, 80));

      // Duplicate detection based on filename or title or source_url
      const isDup = !forceOverwrite && currentMateri.some(
        m =>
          m.nama_file.toLowerCase() === item.nama_file.toLowerCase() ||
          m.judul.toLowerCase() === item.judul.toLowerCase() ||
          (item.sumber_url && m.sumber_url === item.sumber_url)
      );

      if (isDup) {
        item.status = 'DUPLIKAT';
        item.pesan_error = 'Modul sudah ada dalam database.';
        duplikat++;
      } else {
        try {
          const prefix = item.paket === 'PAKET B' ? 'MAT-B' : 'MAT-C';
          const newId = `${prefix}-${String(currentMateri.length + 1).padStart(3, '0')}`;
          const newMateri: Materi = {
            id: newId,
            judul: item.judul,
            deskripsi: `Modul Pembelajaran Resmi Kurikulum Kesetaraan ${item.paket} untuk mata pelajaran ${item.mata_pelajaran}. Disimpan di Google Drive PKBM Celah Cahaya.`,
            paket: item.paket,
            mata_pelajaran: item.mata_pelajaran,
            kategori: 'Kurikulum Kesetaraan',
            nama_file: item.nama_file,
            file_id: item.file_id || `DRV-${Date.now()}-${i}`,
            drive_url: item.drive_url || 'https://drive.google.com/drive/folders/1JWAMU6COy1S8seU2fInEYLPgTf_mH4AX',
            preview_url: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf',
            ukuran_file: item.ukuran_file || '4.5 MB',
            tahun: '2026',
            sumber_url: item.sumber_url,
            urutan: currentMateri.length + 1,
            status: 'AKTIF',
            tingkatan: item.paket === 'PAKET B' ? 'Kelas 7-9' : 'Kelas 10-12',
            view_count: 0,
            download_count: 0,
            created_at: new Date().toISOString().split('T')[0]
          };

          currentMateri.push(newMateri);
          item.status = 'BERHASIL';
          item.drive_url = newMateri.drive_url;
          item.tanggal = new Date().toLocaleDateString('id-ID');
          berhasil++;
        } catch (e) {
          item.status = 'GAGAL';
          item.pesan_error = String(e);
          gagal++;
        }
      }
    }

    this.setLocal(STORAGE_KEYS.MATERI, currentMateri);

    const currentUser = this.getCurrentUser();
    if (currentUser) {
      this.recordActivity({
        user_id: currentUser.id,
        nama: currentUser.nama,
        role: currentUser.role,
        aktivitas: `Import Materi Batch Selesai: ${berhasil} Berhasil, ${duplikat} Duplikat, ${gagal} Gagal`
      });
    }

    return { berhasil, duplikat, gagal, items: updatedItems };
  }

  // --- 2026 LMS: TATAP MUKA (GOOGLE MEET) ---
  getTatapMuka(role?: UserRole, paket?: PaketType): TatapMuka[] {
    let list = this.getLocal<TatapMuka[]>(STORAGE_KEYS.TATAP_MUKA, INITIAL_TATAP_MUKA);
    if (!list || list.length === 0) {
      list = INITIAL_TATAP_MUKA;
      this.setLocal(STORAGE_KEYS.TATAP_MUKA, list);
    }
    if (paket) {
      return list.filter(tm => !tm.paket || tm.paket === paket);
    }
    return list;
  }

  addTatapMuka(item: Omit<TatapMuka, 'id' | 'created_at'>): TatapMuka {
    const list = this.getTatapMuka();
    const newTm: TatapMuka = {
      ...item,
      id: `TM-${Date.now()}`,
      created_at: new Date().toISOString().split('T')[0]
    };
    list.unshift(newTm);
    this.setLocal(STORAGE_KEYS.TATAP_MUKA, list);

    this.addNotifikasi({
      target_role: 'SISWA',
      target_paket: item.paket,
      judul: `📹 Jadwal Tatap Muka: ${item.judul}`,
      pesan: `Tutor ${item.tutor_nama} menjadwalkan sesi tatap muka Google Meet pada ${item.tanggal} pukul ${item.jam_mulai} WIB.`,
      tipe: 'TATAP_MUKA',
      link_tab: 'TATAP_MUKA'
    });

    const currentUser = this.getCurrentUser();
    if (currentUser) {
      this.recordActivity({
        user_id: currentUser.id,
        nama: currentUser.nama,
        role: currentUser.role,
        aktivitas: `Membuat Jadwal Tatap Muka: ${item.judul} (${item.paket})`
      });
    }

    return newTm;
  }

  updateTatapMuka(id: string, updates: Partial<TatapMuka>): TatapMuka | null {
    const list = this.getTatapMuka();
    const index = list.findIndex(tm => tm.id === id);
    if (index === -1) return null;
    list[index] = { ...list[index], ...updates };
    this.setLocal(STORAGE_KEYS.TATAP_MUKA, list);
    return list[index];
  }

  deleteTatapMuka(id: string): boolean {
    const list = this.getTatapMuka();
    const filtered = list.filter(tm => tm.id !== id);
    if (filtered.length !== list.length) {
      this.setLocal(STORAGE_KEYS.TATAP_MUKA, filtered);
      return true;
    }
    return false;
  }

  // --- 2026 LMS: TUGAS ---
  getTugas(role?: UserRole, paket?: PaketType): Tugas[] {
    let list = this.getLocal<Tugas[]>(STORAGE_KEYS.TUGAS, INITIAL_TUGAS);
    if (!list || list.length === 0) {
      list = INITIAL_TUGAS;
      this.setLocal(STORAGE_KEYS.TUGAS, list);
    }
    if (role === 'SISWA') {
      list = list.filter(t => t.status === 'AKTIF');
    }
    if (paket) {
      list = list.filter(t => !t.paket || t.paket === paket);
    }
    return list;
  }

  getTugasById(id: string): Tugas | undefined {
    return this.getTugas().find(t => t.id === id);
  }

  addTugas(item: Omit<Tugas, 'id' | 'created_at'>): Tugas {
    const list = this.getTugas();
    const newTugas: Tugas = {
      ...item,
      id: `TGS-${Date.now()}`,
      created_at: new Date().toISOString().split('T')[0]
    };
    list.unshift(newTugas);
    this.setLocal(STORAGE_KEYS.TUGAS, list);

    this.addNotifikasi({
      target_role: 'SISWA',
      target_paket: item.paket,
      judul: `📝 Tugas Baru: ${item.judul}`,
      pesan: `Tugas ${item.mata_pelajaran} telah diberikan. Batas pengumpulan: ${item.batas_pengumpulan.replace('T', ' ')}.`,
      tipe: 'TUGAS',
      link_tab: 'TUGAS'
    });

    const currentUser = this.getCurrentUser();
    if (currentUser) {
      this.recordActivity({
        user_id: currentUser.id,
        nama: currentUser.nama,
        role: currentUser.role,
        aktivitas: `Membuat Tugas Baru: ${item.judul} (${item.mata_pelajaran})`
      });
    }

    return newTugas;
  }

  updateTugas(id: string, updates: Partial<Tugas>): Tugas | null {
    const list = this.getTugas();
    const index = list.findIndex(t => t.id === id);
    if (index === -1) return null;
    list[index] = { ...list[index], ...updates };
    this.setLocal(STORAGE_KEYS.TUGAS, list);
    return list[index];
  }

  deleteTugas(id: string): boolean {
    const list = this.getTugas();
    const filtered = list.filter(t => t.id !== id);
    if (filtered.length !== list.length) {
      this.setLocal(STORAGE_KEYS.TUGAS, filtered);
      return true;
    }
    return false;
  }

  // --- 2026 LMS: PENGUMPULAN TUGAS ---
  getPengumpulanTugas(tugasId?: string, userId?: string): PengumpulanTugas[] {
    let list = this.getLocal<PengumpulanTugas[]>(STORAGE_KEYS.PENGUMPULAN_TUGAS, INITIAL_PENGUMPULAN_TUGAS);
    if (!list || list.length === 0) {
      list = INITIAL_PENGUMPULAN_TUGAS;
      this.setLocal(STORAGE_KEYS.PENGUMPULAN_TUGAS, list);
    }
    if (tugasId) {
      list = list.filter(p => p.tugas_id === tugasId);
    }
    if (userId) {
      list = list.filter(p => p.user_id === userId);
    }
    return list;
  }

  getPengumpulanByUserAndTugas(userId: string, tugasId: string): PengumpulanTugas | undefined {
    return this.getPengumpulanTugas().find(p => p.user_id === userId && p.tugas_id === tugasId);
  }

  submitTugas(data: {
    tugas_id: string;
    user_id: string;
    siswa_nama: string;
    siswa_paket: PaketType;
    teks_jawaban: string;
    file_nama?: string;
    file_url?: string;
    file_tipe?: string;
    file_ukuran?: string;
  }): PengumpulanTugas {
    const list = this.getPengumpulanTugas();
    const tugas = this.getTugasById(data.tugas_id);

    // Check if late
    const now = new Date();
    const isLate = tugas?.batas_pengumpulan ? now > new Date(tugas.batas_pengumpulan) : false;
    const status: any = isLate ? 'TERLAMBAT' : 'SUDAH_DIKUMPULKAN';

    const existingIdx = list.findIndex(p => p.user_id === data.user_id && p.tugas_id === data.tugas_id);
    let submission: PengumpulanTugas;

    if (existingIdx !== -1) {
      submission = {
        ...list[existingIdx],
        waktu_pengumpulan: `${now.toISOString().split('T')[0]} ${now.toTimeString().slice(0, 5)} WIB`,
        teks_jawaban: data.teks_jawaban,
        file_nama: data.file_nama || list[existingIdx].file_nama,
        file_url: data.file_url || list[existingIdx].file_url,
        file_tipe: data.file_tipe || list[existingIdx].file_tipe,
        file_ukuran: data.file_ukuran || list[existingIdx].file_ukuran,
        status: list[existingIdx].status === 'SUDAH_DINILAI' ? 'SUDAH_DINILAI' : status
      };
      list[existingIdx] = submission;
    } else {
      submission = {
        id: `SUB-${Date.now()}`,
        tugas_id: data.tugas_id,
        user_id: data.user_id,
        siswa_nama: data.siswa_nama,
        siswa_paket: data.siswa_paket,
        waktu_pengumpulan: `${now.toISOString().split('T')[0]} ${now.toTimeString().slice(0, 5)} WIB`,
        teks_jawaban: data.teks_jawaban,
        file_nama: data.file_nama,
        file_url: data.file_url,
        file_tipe: data.file_tipe,
        file_ukuran: data.file_ukuran,
        status
      };
      list.push(submission);
    }

    this.setLocal(STORAGE_KEYS.PENGUMPULAN_TUGAS, list);

    this.addNotifikasi({
      target_role: 'TUTOR',
      target_paket: data.siswa_paket,
      judul: `📥 Pengumpulan Tugas: ${tugas?.judul || 'Tugas'}`,
      pesan: `Warga Belajar ${data.siswa_nama} telah mengumpulkan tugas.`,
      tipe: 'TUGAS',
      link_tab: 'TUGAS'
    });

    this.recordActivity({
      user_id: data.user_id,
      nama: data.siswa_nama,
      role: 'SISWA',
      aktivitas: `Mengumpulkan Tugas: ${tugas?.judul || 'Tugas'}`
    });

    return submission;
  }

  gradePengumpulanTugas(id: string, nilai: number, feedback: string, tutorNama: string): PengumpulanTugas | null {
    const list = this.getPengumpulanTugas();
    const index = list.findIndex(p => p.id === id);
    if (index === -1) return null;

    const now = new Date();
    list[index] = {
      ...list[index],
      nilai,
      feedback_tutor: feedback,
      dinilai_oleh: tutorNama,
      dinilai_pada: `${now.toISOString().split('T')[0]} ${now.toTimeString().slice(0, 5)} WIB`,
      status: 'SUDAH_DINILAI'
    };

    this.setLocal(STORAGE_KEYS.PENGUMPULAN_TUGAS, list);

    this.addNotifikasi({
      user_id: list[index].user_id,
      target_role: 'SISWA',
      judul: `🌟 Tugas Telah Dinilai (Nilai: ${nilai})`,
      pesan: `Tutor ${tutorNama} telah menilai tugas Anda dengan feedback: "${feedback.slice(0, 80)}..."`,
      tipe: 'NILAI',
      link_tab: 'TUGAS'
    });

    return list[index];
  }

  // --- 2026 LMS: BANK SOAL ---
  getBankSoal(paket?: PaketType, mapel?: string): Soal[] {
    let list = this.getLocal<Soal[]>(STORAGE_KEYS.BANK_SOAL, INITIAL_BANK_SOAL);
    if (!list || list.length === 0) {
      list = INITIAL_BANK_SOAL;
      this.setLocal(STORAGE_KEYS.BANK_SOAL, list);
    }
    if (paket) {
      list = list.filter(s => !s.paket || s.paket === paket);
    }
    if (mapel && mapel !== 'SEMUA') {
      list = list.filter(s => s.mata_pelajaran.toLowerCase().includes(mapel.toLowerCase()));
    }
    return list;
  }

  addSoal(data: Omit<Soal, 'id' | 'created_at'>): Soal {
    const list = this.getBankSoal();
    const newSoal: Soal = {
      ...data,
      id: `SOAL-${Date.now()}`,
      created_at: new Date().toISOString().split('T')[0]
    };
    list.unshift(newSoal);
    this.setLocal(STORAGE_KEYS.BANK_SOAL, list);
    return newSoal;
  }

  updateSoal(id: string, updates: Partial<Soal>): Soal | null {
    const list = this.getBankSoal();
    const index = list.findIndex(s => s.id === id);
    if (index === -1) return null;
    list[index] = { ...list[index], ...updates };
    this.setLocal(STORAGE_KEYS.BANK_SOAL, list);
    return list[index];
  }

  deleteSoal(id: string): boolean {
    const list = this.getBankSoal();
    const filtered = list.filter(s => s.id !== id);
    if (filtered.length !== list.length) {
      this.setLocal(STORAGE_KEYS.BANK_SOAL, filtered);
      return true;
    }
    return false;
  }

  // --- 2026 LMS: ULANGAN / UJIAN ONLINE ---
  getUlangan(role?: UserRole, paket?: PaketType): Ulangan[] {
    let list = this.getLocal<Ulangan[]>(STORAGE_KEYS.ULANGAN, INITIAL_ULANGAN);
    if (!list || list.length === 0) {
      list = INITIAL_ULANGAN;
      this.setLocal(STORAGE_KEYS.ULANGAN, list);
    }
    if (role === 'SISWA') {
      list = list.filter(u => u.status === 'AKTIF');
    }
    if (paket) {
      list = list.filter(u => !u.paket || u.paket === paket);
    }
    return list;
  }

  getUlanganById(id: string): Ulangan | undefined {
    return this.getUlangan().find(u => u.id === id);
  }

  addUlangan(data: Omit<Ulangan, 'id' | 'created_at'>): Ulangan {
    const list = this.getUlangan();
    const newUlangan: Ulangan = {
      ...data,
      id: `ULG-${Date.now()}`,
      created_at: new Date().toISOString().split('T')[0]
    };
    list.unshift(newUlangan);
    this.setLocal(STORAGE_KEYS.ULANGAN, list);

    this.addNotifikasi({
      target_role: 'SISWA',
      target_paket: data.paket,
      judul: `🧠 Ulangan Online Baru: ${data.judul}`,
      pesan: `Ulangan ${data.mata_pelajaran} telah disiapkan. Durasi: ${data.durasi_menit} menit.`,
      tipe: 'ULANGAN',
      link_tab: 'ULANGAN'
    });

    const currentUser = this.getCurrentUser();
    if (currentUser) {
      this.recordActivity({
        user_id: currentUser.id,
        nama: currentUser.nama,
        role: currentUser.role,
        aktivitas: `Membuat Ulangan Baru: ${data.judul}`
      });
    }

    return newUlangan;
  }

  updateUlangan(id: string, updates: Partial<Ulangan>): Ulangan | null {
    const list = this.getUlangan();
    const index = list.findIndex(u => u.id === id);
    if (index === -1) return null;
    list[index] = { ...list[index], ...updates };
    this.setLocal(STORAGE_KEYS.ULANGAN, list);
    return list[index];
  }

  deleteUlangan(id: string): boolean {
    const list = this.getUlangan();
    const filtered = list.filter(u => u.id !== id);
    if (filtered.length !== list.length) {
      this.setLocal(STORAGE_KEYS.ULANGAN, filtered);
      return true;
    }
    return false;
  }

  // --- 2026 LMS: UJIAN ATTEMPTS & AUTO-GRADING ---
  getUjianAttempts(ulanganId?: string, userId?: string): UjianAttempt[] {
    let list = this.getLocal<UjianAttempt[]>(STORAGE_KEYS.UJIAN_ATTEMPTS, INITIAL_UJIAN_ATTEMPT);
    if (!list || list.length === 0) {
      list = INITIAL_UJIAN_ATTEMPT;
      this.setLocal(STORAGE_KEYS.UJIAN_ATTEMPTS, list);
    }
    if (ulanganId) {
      list = list.filter(a => a.ulangan_id === ulanganId);
    }
    if (userId) {
      list = list.filter(a => a.user_id === userId);
    }
    return list;
  }

  getAttemptByUserAndUlangan(userId: string, ulanganId: string): UjianAttempt | undefined {
    return this.getUjianAttempts().find(a => a.user_id === userId && a.ulangan_id === ulanganId);
  }

  startUjian(userId: string, userName: string, userPaket: PaketType, ulangan: Ulangan): UjianAttempt {
    const list = this.getUjianAttempts();
    const existing = list.find(a => a.user_id === userId && a.ulangan_id === ulangan.id);
    if (existing && existing.status === 'SEDANG_MENGERJAKAN') {
      return existing;
    }

    const now = new Date();
    const attempt: UjianAttempt = {
      id: `ATT-${Date.now()}`,
      ulangan_id: ulangan.id,
      ulangan_judul: ulangan.judul,
      user_id: userId,
      siswa_nama: userName,
      siswa_paket: userPaket,
      mulai_pada: `${now.toISOString().split('T')[0]} ${now.toTimeString().slice(0, 5)} WIB`,
      status: 'SEDANG_MENGERJAKAN',
      jawaban: {},
      dinilai: false
    };

    list.push(attempt);
    this.setLocal(STORAGE_KEYS.UJIAN_ATTEMPTS, list);

    this.recordActivity({
      user_id: userId,
      nama: userName,
      role: 'SISWA',
      aktivitas: `Memulai Mengerjakan Ulangan: ${ulangan.judul}`
    });

    return attempt;
  }

  saveJawabanUjian(attemptId: string, soalId: string, jawaban: string): boolean {
    const list = this.getUjianAttempts();
    const attempt = list.find(a => a.id === attemptId);
    if (!attempt || attempt.status !== 'SEDANG_MENGERJAKAN') return false;

    attempt.jawaban[soalId] = jawaban;
    this.setLocal(STORAGE_KEYS.UJIAN_ATTEMPTS, list);
    return true;
  }

  submitUjian(attemptId: string, ulangan: Ulangan): UjianAttempt | null {
    const list = this.getUjianAttempts();
    const attempt = list.find(a => a.id === attemptId);
    if (!attempt) return null;

    const now = new Date();
    attempt.selesai_pada = `${now.toISOString().split('T')[0]} ${now.toTimeString().slice(0, 5)} WIB`;
    attempt.status = 'SELESAI';

    // Auto grading for Pilihan Ganda, Benar/Salah, and Isian Singkat
    let totalScoreOtomatis = 0;
    let hasUraian = false;

    for (const soal of ulangan.daftar_soal) {
      const studentAnswer = (attempt.jawaban[soal.id] || '').trim();
      const correctAnswer = (soal.kunci_jawaban || '').trim();

      if (soal.tipe === 'PILIHAN_GANDA' || soal.tipe === 'BENAR_SALAH') {
        if (studentAnswer.toUpperCase() === correctAnswer.toUpperCase()) {
          totalScoreOtomatis += soal.bobot_nilai || 10;
        }
      } else if (soal.tipe === 'ISIAN_SINGKAT') {
        if (studentAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
          totalScoreOtomatis += soal.bobot_nilai || 10;
        }
      } else if (soal.tipe === 'URAIAN') {
        hasUraian = true;
      }
    }

    attempt.nilai_otomatis = totalScoreOtomatis;
    if (!hasUraian) {
      attempt.nilai_total = totalScoreOtomatis;
      attempt.dinilai = true;
    } else {
      attempt.nilai_total = totalScoreOtomatis; // partial until tutor grades essay
      attempt.dinilai = false;
    }

    this.setLocal(STORAGE_KEYS.UJIAN_ATTEMPTS, list);

    this.addNotifikasi({
      target_role: 'TUTOR',
      target_paket: attempt.siswa_paket,
      judul: `📑 Siswa Selesai Ulangan: ${ulangan.judul}`,
      pesan: `Warga Belajar ${attempt.siswa_nama} telah menyelesaikan ulangan (Skor Otomatis: ${totalScoreOtomatis}).`,
      tipe: 'ULANGAN',
      link_tab: 'ULANGAN'
    });

    this.recordActivity({
      user_id: attempt.user_id,
      nama: attempt.siswa_nama,
      role: 'SISWA',
      aktivitas: `Menyelesaikan Ulangan: ${ulangan.judul} (Nilai Otomatis: ${totalScoreOtomatis})`
    });

    return attempt;
  }

  gradeUjianAttempt(
    attemptId: string,
    nilaiUraian: number,
    feedback: string,
    tutorNama: string,
    catatanPerSoal?: Record<string, { nilai: number; feedback?: string }>
  ): UjianAttempt | null {
    const list = this.getUjianAttempts();
    const attempt = list.find(a => a.id === attemptId);
    if (!attempt) return null;

    attempt.nilai_uraian = nilaiUraian;
    attempt.nilai_total = (attempt.nilai_otomatis || 0) + nilaiUraian;
    attempt.feedback_tutor = feedback;
    attempt.dinilai = true;
    if (catatanPerSoal) {
      attempt.catatan_per_soal = catatanPerSoal;
    }

    this.setLocal(STORAGE_KEYS.UJIAN_ATTEMPTS, list);

    this.addNotifikasi({
      user_id: attempt.user_id,
      target_role: 'SISWA',
      judul: `🎉 Hasil Ulangan Dinilai (Nilai Akhir: ${attempt.nilai_total})`,
      pesan: `Tutor ${tutorNama} telah memeriksa ulangan "${attempt.ulangan_judul}".`,
      tipe: 'NILAI',
      link_tab: 'ULANGAN'
    });

    return attempt;
  }

  // --- 📝 100-QUESTION CURRICULUM MODULE QUIZ METHODS ---
  
  getModulCompletions(): Record<string, boolean> {
    return this.getLocal<Record<string, boolean>>(STORAGE_KEYS.MODUL_COMPLETIONS, {});
  }

  markMateriCompleted(userId: string, materiId: string): boolean {
    const key = `${userId}_${materiId}`;
    const completions = this.getModulCompletions();
    completions[key] = true;
    this.setLocal(STORAGE_KEYS.MODUL_COMPLETIONS, completions);

    // Also update reading progress to 100%
    const progressList = this.getLocal<ReadingProgress[]>(STORAGE_KEYS.READING_PROGRESS, []);
    const idx = progressList.findIndex(r => r.user_id === userId && r.materi_id === materiId);
    const now = new Date().toISOString();
    if (idx !== -1) {
      progressList[idx].completed = true;
      progressList[idx].progress_percent = 100;
      progressList[idx].last_read_at = now;
    } else {
      progressList.push({
        user_id: userId,
        materi_id: materiId,
        last_page: 24,
        total_pages: 24,
        progress_percent: 100,
        last_read_at: now,
        completed: true
      });
    }
    this.setLocal(STORAGE_KEYS.READING_PROGRESS, progressList);

    const user = this.getUsers().find(u => u.id === userId);
    const materi = this.getMateri().find(m => m.id === materiId);
    if (user && materi) {
      this.recordActivity({
        user_id: userId,
        nama: user.nama,
        role: user.role,
        aktivitas: `Menyelesaikan Pembacaan Modul: ${materi.judul} (${materi.mata_pelajaran})`,
        materi_id: materiId,
        materi_judul: materi.judul,
        paket: materi.paket
      });
    }

    return true;
  }

  isMateriCompleted(userId: string, materiId: string): boolean {
    const key = `${userId}_${materiId}`;
    const completions = this.getModulCompletions();
    if (completions[key]) return true;

    // Fallback: check reading progress
    const progress = this.getReadingProgress(userId, materiId);
    return progress ? (progress.completed || progress.progress_percent >= 90) : false;
  }

  getModulQuizAttempts(filters?: {
    materiId?: string;
    userId?: string;
    mapel?: string;
    tutorId?: string;
    paket?: PaketType;
    status?: string;
  }): ModulQuizAttempt[] {
    let list = this.getLocal<ModulQuizAttempt[]>(STORAGE_KEYS.MODUL_QUIZ_ATTEMPTS, []);
    if (!list) list = [];

    if (filters) {
      if (filters.materiId) {
        list = list.filter(a => a.materi_id === filters.materiId);
      }
      if (filters.userId) {
        list = list.filter(a => a.user_id === filters.userId);
      }
      if (filters.mapel && filters.mapel !== 'SEMUA') {
        list = list.filter(a => a.mata_pelajaran.toLowerCase().includes(filters.mapel!.toLowerCase()));
      }
      if (filters.paket && filters.paket !== ('SEMUA' as any)) {
        list = list.filter(a => !a.paket || a.paket === filters.paket);
      }
      if (filters.status && filters.status !== 'SEMUA') {
        list = list.filter(a => a.status_kelulusan === filters.status);
      }
    }

    return list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  getLatestModulQuizAttempt(userId: string, materiId: string): ModulQuizAttempt | undefined {
    const attempts = this.getModulQuizAttempts({ userId, materiId });
    return attempts.length > 0 ? attempts[0] : undefined;
  }

  saveModulQuizAttempt(attemptData: Omit<ModulQuizAttempt, 'id' | 'timestamp'>): ModulQuizAttempt {
    const list = this.getLocal<ModulQuizAttempt[]>(STORAGE_KEYS.MODUL_QUIZ_ATTEMPTS, []);
    const now = new Date();
    
    // Count previous attempts
    const prevAttempts = list.filter(a => a.user_id === attemptData.user_id && a.materi_id === attemptData.materi_id);
    const attemptNumber = prevAttempts.length + 1;

    const newAttempt: ModulQuizAttempt = {
      ...attemptData,
      id: `MQA-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      percobaan_ke: attemptNumber,
      timestamp: now.toISOString()
    };

    list.unshift(newAttempt);
    this.setLocal(STORAGE_KEYS.MODUL_QUIZ_ATTEMPTS, list);
    this.recordStudyActivity(attemptData.user_id);

    // Auto notify tutor of this subject
    const tutors = this.getUsers().filter(u => u.role === 'TUTOR');
    const assignedTutors = tutors.filter(t => {
      const bMapel = t.mapel_paket_b || (t.mata_pelajaran ? [t.mata_pelajaran] : []);
      const cMapel = t.mapel_paket_c || (t.mata_pelajaran ? [t.mata_pelajaran] : []);
      const allTutorMapel = [...bMapel, ...cMapel].join(' ').toLowerCase();
      return allTutorMapel.includes(attemptData.mata_pelajaran.toLowerCase());
    });

    for (const tutor of assignedTutors) {
      this.addNotifikasi({
        user_id: tutor.id,
        target_role: 'TUTOR',
        target_paket: attemptData.paket,
        judul: `📊 Nilai Kuis Modul 100 Soal: ${attemptData.siswa_nama}`,
        pesan: `Warga Belajar ${attemptData.siswa_nama} telah menyelesaikan Kuis 100 Soal untuk Modul "${attemptData.materi_judul}" (${attemptData.mata_pelajaran}) dengan Nilai: ${attemptData.nilai}/100 (${attemptData.status_kelulusan}).`,
        tipe: 'NILAI',
        link_tab: 'ULANGAN'
      });
    }

    // Notify Student
    this.addNotifikasi({
      user_id: attemptData.user_id,
      target_role: 'SISWA',
      target_paket: attemptData.paket,
      judul: `🎯 Hasil Kuis 100 Soal: Nilai ${attemptData.nilai}/100 (${attemptData.status_kelulusan})`,
      pesan: `Anda telah menyelesaikan Kuis 100 Soal Modul "${attemptData.materi_judul}". Benar: ${attemptData.jumlah_benar}, Salah: ${attemptData.jumlah_salah}. Status: ${attemptData.status_kelulusan}.`,
      tipe: 'NILAI',
      link_tab: 'MATERI'
    });

    // Record Activity for Admin and Audit
    this.recordActivity({
      user_id: attemptData.user_id,
      nama: attemptData.siswa_nama,
      role: 'SISWA',
      aktivitas: `Menyelesaikan Kuis 100 Soal Modul: ${attemptData.materi_judul} | Nilai: ${attemptData.nilai} (${attemptData.status_kelulusan})`,
      materi_id: attemptData.materi_id,
      materi_judul: attemptData.materi_judul,
      paket: attemptData.paket
    });

    return newAttempt;
  }

  getModulProgressDetail(userId: string, materiId: string): ModulProgressDetail {
    const isCompleted = this.isMateriCompleted(userId, materiId);
    const attempts = this.getModulQuizAttempts({ userId, materiId });

    if (attempts.length === 0) {
      return {
        materi_id: materiId,
        user_id: userId,
        is_completed: isCompleted,
        total_attempts: 0,
        highest_score: 0,
        latest_score: 0,
        status_kelulusan: 'BELUM_KUIS'
      };
    }

    const highestScore = Math.max(...attempts.map(a => a.nilai));
    const latestAttempt = attempts[0];
    const isAnyPassed = attempts.some(a => a.status_kelulusan === 'LULUS');

    return {
      materi_id: materiId,
      user_id: userId,
      is_completed: isCompleted,
      total_attempts: attempts.length,
      highest_score: highestScore,
      latest_score: latestAttempt.nilai,
      status_kelulusan: isAnyPassed ? 'LULUS' : 'TIDAK_LULUS'
    };
  }

  // --- 2026 LMS: NOTIFIKASI ---
  getNotifikasi(role?: UserRole, paket?: PaketType, userId?: string): NotifikasiApp[] {
    let list = this.getLocal<NotifikasiApp[]>(STORAGE_KEYS.NOTIFIKASI, INITIAL_NOTIFIKASI);
    if (!list || list.length === 0) {
      list = INITIAL_NOTIFIKASI;
      this.setLocal(STORAGE_KEYS.NOTIFIKASI, list);
    }

    return list.filter(n => {
      // User specific check
      if (n.user_id && userId && n.user_id !== userId) {
        return false;
      }
      // Role check
      if (role && n.target_role && n.target_role !== 'ALL' && n.target_role !== role) {
        return false;
      }
      // Paket check
      if (paket && n.target_paket && n.target_paket !== 'ALL' && n.target_paket !== paket) {
        return false;
      }
      return true;
    });
  }

  markNotifikasiRead(id: string): void {
    const list = this.getLocal<NotifikasiApp[]>(STORAGE_KEYS.NOTIFIKASI, INITIAL_NOTIFIKASI);
    const item = list.find(n => n.id === id);
    if (item) {
      item.dibaca = true;
      this.setLocal(STORAGE_KEYS.NOTIFIKASI, list);
    }
  }

  markAllNotifikasiRead(userId?: string): void {
    const list = this.getLocal<NotifikasiApp[]>(STORAGE_KEYS.NOTIFIKASI, INITIAL_NOTIFIKASI);
    list.forEach(n => {
      if (!n.user_id || n.user_id === userId) {
        n.dibaca = true;
      }
    });
    this.setLocal(STORAGE_KEYS.NOTIFIKASI, list);
  }

  addNotifikasi(data: Omit<NotifikasiApp, 'id' | 'dibaca' | 'created_at'>): NotifikasiApp {
    const list = this.getLocal<NotifikasiApp[]>(STORAGE_KEYS.NOTIFIKASI, INITIAL_NOTIFIKASI);
    const now = new Date();
    const newNotif: NotifikasiApp = {
      ...data,
      id: `NOTIF-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      dibaca: false,
      created_at: `${now.toISOString().split('T')[0]} ${now.toTimeString().slice(0, 5)} WIB`
    };
    list.unshift(newNotif);
    this.setLocal(STORAGE_KEYS.NOTIFIKASI, list);
    return newNotif;
  }

  // --- BACKUP & RESTORE DATABASE ---
  exportDatabaseJson(): string {
    const data = {
      exported_at: new Date().toISOString(),
      app: 'PKBM CELAH CAHAYA LMS 2026',
      users: this.getUsers(),
      materi: this.getMateri(),
      classes: this.getClasses(),
      mapel: this.getMapel(),
      activities: this.getActivities(),
      settings: this.getSettings(),
      tatap_muka: this.getTatapMuka(),
      tugas: this.getTugas(),
      pengumpulan_tugas: this.getPengumpulanTugas(),
      bank_soal: this.getBankSoal(),
      ulangan: this.getUlangan(),
      ujian_attempts: this.getUjianAttempts()
    };
    return JSON.stringify(data, null, 2);
  }

  importDatabaseJson(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.users) this.setLocal(STORAGE_KEYS.USERS, parsed.users);
      if (parsed.materi) this.setLocal(STORAGE_KEYS.MATERI, parsed.materi);
      if (parsed.classes) this.setLocal(STORAGE_KEYS.CLASSES, parsed.classes);
      if (parsed.mapel) this.setLocal(STORAGE_KEYS.MAPEL, parsed.mapel);
      if (parsed.settings) this.setLocal(STORAGE_KEYS.SETTINGS, parsed.settings);
      if (parsed.tatap_muka) this.setLocal(STORAGE_KEYS.TATAP_MUKA, parsed.tatap_muka);
      if (parsed.tugas) this.setLocal(STORAGE_KEYS.TUGAS, parsed.tugas);
      if (parsed.pengumpulan_tugas) this.setLocal(STORAGE_KEYS.PENGUMPULAN_TUGAS, parsed.pengumpulan_tugas);
      if (parsed.bank_soal) this.setLocal(STORAGE_KEYS.BANK_SOAL, parsed.bank_soal);
      if (parsed.ulangan) this.setLocal(STORAGE_KEYS.ULANGAN, parsed.ulangan);
      if (parsed.ujian_attempts) this.setLocal(STORAGE_KEYS.UJIAN_ATTEMPTS, parsed.ujian_attempts);
      if (parsed.pendaftaran) this.setLocal(STORAGE_KEYS.PENDAFTARAN, parsed.pendaftaran);
      return true;
    } catch (e) {
      console.error('Import database JSON failed:', e);
      return false;
    }
  }

  // --- 2026 PENDAFTARAN / PPDB & DAPODIK METHODS ---

  getPendaftaran(): PendaftaranWargaBelajar[] {
    return this.getLocal<PendaftaranWargaBelajar[]>(STORAGE_KEYS.PENDAFTARAN, INITIAL_PENDAFTARAN);
  }

  getPendaftaranById(id: string): PendaftaranWargaBelajar | undefined {
    const list = this.getPendaftaran();
    return list.find(p => p.id === id);
  }

  getPendaftaranByNomor(nomor: string): PendaftaranWargaBelajar | undefined {
    const clean = nomor.trim().toUpperCase();
    const list = this.getPendaftaran();
    return list.find(p => p.nomor_pendaftaran.toUpperCase() === clean);
  }

  generateNomorPendaftaran(paket: PaketType): string {
    const currentYear = new Date().getFullYear();
    const list = this.getPendaftaran();
    const code = paket === 'PAKET B' ? 'B' : 'C';
    const count = list.length + 1;
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    return `PKBM-${currentYear}-${code}${String(count).padStart(3, '0')}${randomSuffix}`;
  }

  createPendaftaran(data: Omit<PendaftaranWargaBelajar, 'id' | 'created_at'>): PendaftaranWargaBelajar {
    const list = this.getPendaftaran();
    const newId = `REG-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newRecord: PendaftaranWargaBelajar = {
      ...data,
      id: newId,
      created_at: new Date().toISOString()
    };
    const updated = [newRecord, ...list];
    this.setLocal(STORAGE_KEYS.PENDAFTARAN, updated);

    // Create a notification for Admin
    this.addNotifikasi({
      target_role: 'ADMIN',
      judul: `Pendaftaran Baru: ${newRecord.nama_lengkap} (${newRecord.program_pilihan})`,
      pesan: `Warga belajar baru telah mendaftar dengan No. Registrasi ${newRecord.nomor_pendaftaran}. Menunggu verifikasi berkas Dapodik.`,
      tipe: 'SISTEM',
      link_tab: 'PENDAFTARAN'
    });

    return newRecord;
  }

  updatePendaftaran(id: string, updates: Partial<PendaftaranWargaBelajar>): PendaftaranWargaBelajar | null {
    const list = this.getPendaftaran();
    const idx = list.findIndex(p => p.id === id);
    if (idx === -1) return null;

    const updatedRecord: PendaftaranWargaBelajar = {
      ...list[idx],
      ...updates,
      updated_at: new Date().toISOString()
    };
    list[idx] = updatedRecord;
    this.setLocal(STORAGE_KEYS.PENDAFTARAN, list);
    return updatedRecord;
  }

  deletePendaftaran(id: string): boolean {
    const list = this.getPendaftaran();
    const filtered = list.filter(p => p.id !== id);
    if (filtered.length === list.length) return false;
    this.setLocal(STORAGE_KEYS.PENDAFTARAN, filtered);
    return true;
  }

  updateDokumenVerifikasi(
    pendaftaranId: string,
    dokumenId: string,
    status: DokumenStatus,
    catatan?: string
  ): boolean {
    const record = this.getPendaftaranById(pendaftaranId);
    if (!record) return false;

    const updatedDocs = record.dokumen.map(doc => {
      if (doc.id === dokumenId) {
        return {
          ...doc,
          status_verifikasi: status,
          catatan_operator: catatan !== undefined ? catatan : doc.catatan_operator
        };
      }
      return doc;
    });

    this.updatePendaftaran(pendaftaranId, { dokumen: updatedDocs });
    return true;
  }

  approvePendaftaranAndCreateStudent(
    pendaftaranId: string,
    operatorNama: string,
    targetKelas?: string
  ): { success: boolean; message: string; user?: User } {
    const record = this.getPendaftaranById(pendaftaranId);
    if (!record) {
      return { success: false, message: 'Data pendaftaran tidak ditemukan.' };
    }

    const defaultClass = targetKelas || (record.program_pilihan === 'PAKET B' ? 'Kelas 7' : 'Kelas 10');
    const username = (record.nisn || record.nik || `siswa_${record.nomor_pendaftaran.toLowerCase().replace(/[^a-z0-9]/g, '')}`).trim();
    const defaultPassword = 'password123'; // Default password for new student

    // Check if user already exists
    const existingUsers = this.getUsers();
    let existingUser = existingUsers.find(
      u => u.username.toLowerCase() === username.toLowerCase() || (u.nisn && u.nisn === record.nisn)
    );

    let createdUser: User;
    if (existingUser) {
      createdUser = existingUser;
    } else {
      const newUser: Omit<User, 'id' | 'created_at'> = {
        nama: record.nama_lengkap,
        username: username,
        password: defaultPassword,
        email: record.email || `${username}@pkbm.sch.id`,
        telepon: record.nomor_wa || record.nomor_hp,
        role: 'SISWA',
        paket: record.program_pilihan,
        kelas: defaultClass,
        nisn: record.nisn || '',
        foto: record.pas_foto_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
        status: 'AKTIF'
      };
      createdUser = this.addUser(newUser);
    }

    // Update Pendaftaran Status
    this.updatePendaftaran(pendaftaranId, {
      status: 'DITERIMA',
      diverifikasi_oleh: operatorNama,
      diverifikasi_pada: new Date().toISOString(),
      user_id_terbuat: createdUser.id
    });

    // Record activity
    this.recordActivity({
      user_id: 'admin_sys',
      nama: operatorNama,
      role: 'ADMIN',
      aktivitas: `Menerima pendaftaran ${record.nama_lengkap} (${record.nomor_pendaftaran}) dan membuat akun Siswa`,
      paket: record.program_pilihan
    });

    return {
      success: true,
      message: `Pendaftaran berhasil diterima! Akun siswa telah dibuat dengan Username: ${username} & Password default: ${defaultPassword}`,
      user: createdUser
    };
  }

  // --- AUTOSAVE DRAFT FORMULIR ---
  savePendaftaranDraft(draftData: any): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PENDAFTARAN_DRAFT, JSON.stringify({
        data: draftData,
        saved_at: new Date().toISOString()
      }));
    } catch (e) {
      console.warn('Gagal menyimpan draf pendaftaran:', e);
    }
  }

  getPendaftaranDraft(): { data: any; saved_at: string } | null {
    try {
      const item = localStorage.getItem(STORAGE_KEYS.PENDAFTARAN_DRAFT);
      if (!item) return null;
      return JSON.parse(item);
    } catch (e) {
      return null;
    }
  }

  clearPendaftaranDraft(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.PENDAFTARAN_DRAFT);
    } catch (e) {
      console.warn('Gagal menghapus draf pendaftaran:', e);
    }
  }

  // --- EXPORT DAPODIK CSV ---
  exportPendaftaranToDapodikCsv(): string {
    const list = this.getPendaftaran();
    const headers = [
      'No Pendaftaran',
      'Tahun Ajaran',
      'Gelombang',
      'Program',
      'Jenis Pendaftaran',
      'Status Pendaftaran',
      'Tanggal Daftar',
      'Nama Lengkap',
      'NISN',
      'NIK',
      'No KK',
      'Jenis Kelamin',
      'Tempat Lahir',
      'Tanggal Lahir',
      'Agama',
      'Kewarganegaraan',
      'Berkebutuhan Khusus',
      'Anak Ke',
      'Jml Saudara',
      'Alamat Lengkap',
      'RT',
      'RW',
      'Dusun/Kampung',
      'Kelurahan/Desa',
      'Kecamatan',
      'Kabupaten/Kota',
      'Provinsi',
      'Kode Pos',
      'Status Tempat Tinggal',
      'Moda Transportasi',
      'Jarak ke PKBM',
      'Waktu Tempuh (menit)',
      'No HP',
      'No WhatsApp',
      'Email',
      'Nama Ayah Kandung',
      'NIK Ayah',
      'Tahun Lahir Ayah',
      'Pendidikan Ayah',
      'Pekerjaan Ayah',
      'Penghasilan Ayah',
      'Nama Ibu Kandung',
      'NIK Ibu',
      'Tahun Lahir Ibu',
      'Pendidikan Ibu',
      'Pekerjaan Ibu',
      'Penghasilan Ibu',
      'Nama Wali',
      'NIK Wali',
      'Pekerjaan Wali',
      'No HP Wali',
      'Tinggi Badan (cm)',
      'Berat Badan (kg)',
      'Lingkar Kepala (cm)',
      'Punya KIP',
      'Nomor KIP',
      'Punya PKH',
      'Nomor PKH',
      'Punya KKS',
      'Nomor KKS',
      'Sekolah Asal',
      'NPSN Sekolah Asal',
      'No Seri Ijazah',
      'Tahun Lulus',
      'No Surat Pindah',
      'Tanggal Surat Pindah'
    ];

    const escapeCsv = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = list.map(p => [
      escapeCsv(p.nomor_pendaftaran),
      escapeCsv(p.tahun_ajaran),
      escapeCsv(p.gelombang),
      escapeCsv(p.program_pilihan),
      escapeCsv(p.jenis_pendaftaran),
      escapeCsv(p.status),
      escapeCsv(p.tanggal_pendaftaran),
      escapeCsv(p.nama_lengkap),
      escapeCsv(p.nisn || ''),
      escapeCsv(p.nik),
      escapeCsv(p.nomor_kk),
      escapeCsv(p.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'),
      escapeCsv(p.tempat_lahir),
      escapeCsv(p.tanggal_lahir),
      escapeCsv(p.agama),
      escapeCsv(p.kewarganegaraan),
      escapeCsv(p.kebutuhan_khusus),
      escapeCsv(p.anak_ke),
      escapeCsv(p.jumlah_saudara_kandung),
      escapeCsv(p.alamat_lengkap),
      escapeCsv(p.rt),
      escapeCsv(p.rw),
      escapeCsv(p.dusun_kampung || ''),
      escapeCsv(p.desa_kelurahan),
      escapeCsv(p.kecamatan),
      escapeCsv(p.kabupaten_kota),
      escapeCsv(p.provinsi),
      escapeCsv(p.kode_pos),
      escapeCsv(p.status_tempat_tinggal),
      escapeCsv(p.moda_transportasi),
      escapeCsv(p.jarak_ke_pkbm),
      escapeCsv(p.waktu_tempuh_menit),
      escapeCsv(p.nomor_hp),
      escapeCsv(p.nomor_wa),
      escapeCsv(p.email),
      escapeCsv(p.ayah_nama),
      escapeCsv(p.ayah_nik || ''),
      escapeCsv(p.ayah_tahun_lahir || ''),
      escapeCsv(p.ayah_pendidikan || ''),
      escapeCsv(p.ayah_pekerjaan || ''),
      escapeCsv(p.ayah_penghasilan || ''),
      escapeCsv(p.ibu_nama),
      escapeCsv(p.ibu_nik || ''),
      escapeCsv(p.ibu_tahun_lahir || ''),
      escapeCsv(p.ibu_pendidikan || ''),
      escapeCsv(p.ibu_pekerjaan || ''),
      escapeCsv(p.ibu_penghasilan || ''),
      escapeCsv(p.wali_nama || ''),
      escapeCsv(p.wali_nik || ''),
      escapeCsv(p.wali_pekerjaan || ''),
      escapeCsv(p.wali_telepon || ''),
      escapeCsv(p.tinggi_badan_cm || ''),
      escapeCsv(p.berat_badan_kg || ''),
      escapeCsv(p.lingkar_kepala_cm || ''),
      escapeCsv(p.punya_kip ? 'Ya' : 'Tidak'),
      escapeCsv(p.nomor_kip || ''),
      escapeCsv(p.punya_pkh ? 'Ya' : 'Tidak'),
      escapeCsv(p.nomor_pkh || ''),
      escapeCsv(p.punya_kks ? 'Ya' : 'Tidak'),
      escapeCsv(p.nomor_kks || ''),
      escapeCsv(p.sekolah_asal),
      escapeCsv(p.npsn_sekolah_asal || ''),
      escapeCsv(p.nomor_seri_ijazah || ''),
      escapeCsv(p.tahun_lulus || ''),
      escapeCsv(p.surat_pindah_nomor || ''),
      escapeCsv(p.surat_pindah_tanggal || '')
    ].join(','));

    return [headers.join(','), ...rows].join('\n');
  }

  // ==========================================
  // 📚 KURIKULUM KESETARAAN PAKET B & C METHODS
  // ==========================================

  getKurikulumProfile(): KurikulumProfile {
    return this.getLocal<KurikulumProfile>(STORAGE_KEYS.KURIKULUM_PROFILE, INITIAL_KURIKULUM_PROFILE);
  }

  updateKurikulumProfile(profile: Partial<KurikulumProfile>, adminName: string = 'Administrator PKBM'): KurikulumProfile {
    const current = this.getKurikulumProfile();
    const updated: KurikulumProfile = {
      ...current,
      ...profile,
      updated_at: new Date().toISOString().split('T')[0],
      updated_by: adminName
    };
    this.setLocal(STORAGE_KEYS.KURIKULUM_PROFILE, updated);
    this.addRiwayatKurikulum({
      admin_id: 'adm-current',
      admin_nama: adminName,
      modul: 'RINGKASAN',
      jenis_perubahan: 'UPDATE',
      judul_perubahan: 'Pembaruan Ringkasan & Karakteristik Kurikulum',
      keterangan: `Pembaruan profil kurikulum TP ${updated.tahun_pelajaran} (Versi ${updated.versi})`
    });
    return updated;
  }

  getProgramDetail(program: PaketType): KurikulumProgramDetail {
    if (program === 'PAKET B') {
      return this.getLocal<KurikulumProgramDetail>(STORAGE_KEYS.KURIKULUM_PROG_B, INITIAL_PROGRAM_PAKET_B);
    } else {
      return this.getLocal<KurikulumProgramDetail>(STORAGE_KEYS.KURIKULUM_PROG_C, INITIAL_PROGRAM_PAKET_C);
    }
  }

  updateProgramDetail(detail: KurikulumProgramDetail, adminName: string = 'Administrator PKBM'): void {
    const key = detail.program === 'PAKET B' ? STORAGE_KEYS.KURIKULUM_PROG_B : STORAGE_KEYS.KURIKULUM_PROG_C;
    const updated = {
      ...detail,
      updated_at: new Date().toISOString().split('T')[0]
    };
    this.setLocal(key, updated);
    this.addRiwayatKurikulum({
      admin_id: 'adm-current',
      admin_nama: adminName,
      modul: detail.program === 'PAKET B' ? 'PAKET_B' : 'PAKET_C',
      jenis_perubahan: 'UPDATE',
      judul_perubahan: `Pembaruan Program Kurikulum ${detail.program}`,
      keterangan: `Memperbarui alokasi SKK, tingkatan fase, dan deskripsi ${detail.program}`
    });
  }

  getStrukturKurikulum(program?: PaketType | 'SEMUA'): StrukturKurikulumItem[] {
    const list = this.getLocal<StrukturKurikulumItem[]>(STORAGE_KEYS.KURIKULUM_STRUKTUR, INITIAL_STRUKTUR_KURIKULUM);
    if (!program || program === 'SEMUA') {
      return list.sort((a, b) => a.urutan - b.urutan);
    }
    return list.filter(item => item.program === program).sort((a, b) => a.urutan - b.urutan);
  }

  saveStrukturKurikulumItem(
    itemData: Omit<StrukturKurikulumItem, 'id'> & { id?: string },
    adminName: string = 'Administrator PKBM'
  ): StrukturKurikulumItem {
    const list = this.getStrukturKurikulum('SEMUA');
    const isEdit = !!itemData.id;
    const id = itemData.id || `str-${Date.now()}`;
    const newItem: StrukturKurikulumItem = {
      ...itemData,
      id,
      alokasi_waktu_jam: Number(itemData.alokasi_waktu_jam) || 0,
      alokasi_skk: Number(itemData.alokasi_skk) || 0,
      urutan: Number(itemData.urutan) || list.length + 1
    };

    let updatedList: StrukturKurikulumItem[];
    if (isEdit) {
      updatedList = list.map(item => (item.id === id ? newItem : item));
    } else {
      updatedList = [...list, newItem];
    }
    this.setLocal(STORAGE_KEYS.KURIKULUM_STRUKTUR, updatedList);

    this.addRiwayatKurikulum({
      admin_id: 'adm-current',
      admin_nama: adminName,
      modul: 'STRUKTUR',
      jenis_perubahan: isEdit ? 'UPDATE' : 'CREATE',
      judul_perubahan: `${isEdit ? 'Ubah' : 'Tambah'} Struktur Mapel ${newItem.nama_mata_pelajaran} (${newItem.program})`,
      keterangan: `Kelompok: ${newItem.kelompok}, SKK: ${newItem.alokasi_skk}, Jam: ${newItem.alokasi_waktu_jam} JP`
    });

    return newItem;
  }

  deleteStrukturKurikulumItem(id: string, adminName: string = 'Administrator PKBM'): void {
    const list = this.getStrukturKurikulum('SEMUA');
    const target = list.find(item => item.id === id);
    const updated = list.filter(item => item.id !== id);
    this.setLocal(STORAGE_KEYS.KURIKULUM_STRUKTUR, updated);

    if (target) {
      this.addRiwayatKurikulum({
        admin_id: 'adm-current',
        admin_nama: adminName,
        modul: 'STRUKTUR',
        jenis_perubahan: 'DELETE',
        judul_perubahan: `Hapus Mata Pelajaran dari Struktur: ${target.nama_mata_pelajaran}`,
        keterangan: `Program: ${target.program}, Kelompok: ${target.kelompok}`
      });
    }
  }

  duplicateStrukturKurikulumItem(id: string, adminName: string = 'Administrator PKBM'): StrukturKurikulumItem | null {
    const list = this.getStrukturKurikulum('SEMUA');
    const target = list.find(item => item.id === id);
    if (!target) return null;

    const duplicated: StrukturKurikulumItem = {
      ...target,
      id: `str-${Date.now()}`,
      nama_mata_pelajaran: `${target.nama_mata_pelajaran} (Salinan)`,
      kode_mapel: `${target.kode_mapel}-COPY`,
      urutan: list.length + 1
    };

    const updated = [...list, duplicated];
    this.setLocal(STORAGE_KEYS.KURIKULUM_STRUKTUR, updated);

    this.addRiwayatKurikulum({
      admin_id: 'adm-current',
      admin_nama: adminName,
      modul: 'STRUKTUR',
      jenis_perubahan: 'CREATE',
      judul_perubahan: `Duplikasi Struktur Mata Pelajaran: ${duplicated.nama_mata_pelajaran}`,
      keterangan: `Duplikasi dari ${target.nama_mata_pelajaran}`
    });

    return duplicated;
  }

  reorderStrukturKurikulum(items: StrukturKurikulumItem[], adminName: string = 'Administrator PKBM'): void {
    const list = this.getStrukturKurikulum('SEMUA');
    const itemMap = new Map(items.map((it, idx) => [it.id, idx + 1]));
    const updated = list.map(it => {
      if (itemMap.has(it.id)) {
        return { ...it, urutan: itemMap.get(it.id)! };
      }
      return it;
    });
    this.setLocal(STORAGE_KEYS.KURIKULUM_STRUKTUR, updated);
    this.addRiwayatKurikulum({
      admin_id: 'adm-current',
      admin_nama: adminName,
      modul: 'STRUKTUR',
      jenis_perubahan: 'UPDATE',
      judul_perubahan: 'Perubahan Urutan Struktur Kurikulum',
      keterangan: 'Menyusun ulang urutan tampilan mata pelajaran'
    });
  }

  // --- CAPAIAN PEMBELAJARAN (CP) ---
  getCapaianPembelajaran(program?: PaketType | 'SEMUA', mapel?: string): CapaianPembelajaran[] {
    const list = this.getLocal<CapaianPembelajaran[]>(STORAGE_KEYS.KURIKULUM_CP, INITIAL_CAPAIAN_PEMBELAJARAN);
    return list.filter(cp => {
      const matchProg = !program || program === 'SEMUA' || cp.program === program;
      const matchMapel = !mapel || mapel === 'SEMUA' || cp.mata_pelajaran.toLowerCase() === mapel.toLowerCase();
      return matchProg && matchMapel;
    });
  }

  saveCapaianPembelajaran(
    cpData: Omit<CapaianPembelajaran, 'id' | 'created_at'> & { id?: string },
    adminName: string = 'Administrator PKBM'
  ): CapaianPembelajaran {
    const list = this.getLocal<CapaianPembelajaran[]>(STORAGE_KEYS.KURIKULUM_CP, INITIAL_CAPAIAN_PEMBELAJARAN);
    const isEdit = !!cpData.id;
    const id = cpData.id || `cp-${Date.now()}`;
    const newCP: CapaianPembelajaran = {
      ...cpData,
      id,
      created_at: isEdit ? (list.find(x => x.id === id)?.created_at || new Date().toISOString()) : new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    let updatedList: CapaianPembelajaran[];
    if (isEdit) {
      updatedList = list.map(item => (item.id === id ? newCP : item));
    } else {
      updatedList = [...list, newCP];
    }
    this.setLocal(STORAGE_KEYS.KURIKULUM_CP, updatedList);

    this.addRiwayatKurikulum({
      admin_id: 'adm-current',
      admin_nama: adminName,
      modul: 'CP',
      jenis_perubahan: isEdit ? 'UPDATE' : 'CREATE',
      judul_perubahan: `${isEdit ? 'Ubah' : 'Tambah'} Capaian Pembelajaran (CP) - ${newCP.mata_pelajaran} (${newCP.fase})`,
      keterangan: `Elemen: ${newCP.elemen}, Program: ${newCP.program}`
    });

    return newCP;
  }

  deleteCapaianPembelajaran(id: string, adminName: string = 'Administrator PKBM'): void {
    const list = this.getLocal<CapaianPembelajaran[]>(STORAGE_KEYS.KURIKULUM_CP, INITIAL_CAPAIAN_PEMBELAJARAN);
    const target = list.find(cp => cp.id === id);
    const updated = list.filter(cp => cp.id !== id);
    this.setLocal(STORAGE_KEYS.KURIKULUM_CP, updated);

    if (target) {
      this.addRiwayatKurikulum({
        admin_id: 'adm-current',
        admin_nama: adminName,
        modul: 'CP',
        jenis_perubahan: 'DELETE',
        judul_perubahan: `Hapus CP: ${target.mata_pelajaran} (${target.elemen})`,
        keterangan: `Program ${target.program}`
      });
    }
  }

  // --- TUJUAN PEMBELAJARAN (TP) ---
  getTujuanPembelajaran(cpId?: string, program?: PaketType | 'SEMUA', mapel?: string): TujuanPembelajaran[] {
    const list = this.getLocal<TujuanPembelajaran[]>(STORAGE_KEYS.KURIKULUM_TP, INITIAL_TUJUAN_PEMBELAJARAN);
    return list.filter(tp => {
      const matchCp = !cpId || tp.cp_id === cpId;
      const matchProg = !program || program === 'SEMUA' || tp.program === program;
      const matchMapel = !mapel || mapel === 'SEMUA' || tp.mata_pelajaran.toLowerCase() === mapel.toLowerCase();
      return matchCp && matchProg && matchMapel;
    }).sort((a, b) => a.urutan - b.urutan);
  }

  saveTujuanPembelajaran(
    tpData: Omit<TujuanPembelajaran, 'id'> & { id?: string },
    adminName: string = 'Administrator PKBM'
  ): TujuanPembelajaran {
    const list = this.getLocal<TujuanPembelajaran[]>(STORAGE_KEYS.KURIKULUM_TP, INITIAL_TUJUAN_PEMBELAJARAN);
    const isEdit = !!tpData.id;
    const id = tpData.id || `tp-${Date.now()}`;
    const newTP: TujuanPembelajaran = {
      ...tpData,
      id,
      alokasi_jp: Number(tpData.alokasi_jp) || 0,
      urutan: Number(tpData.urutan) || list.length + 1
    };

    let updatedList: TujuanPembelajaran[];
    if (isEdit) {
      updatedList = list.map(item => (item.id === id ? newTP : item));
    } else {
      updatedList = [...list, newTP];
    }
    this.setLocal(STORAGE_KEYS.KURIKULUM_TP, updatedList);

    this.addRiwayatKurikulum({
      admin_id: 'adm-current',
      admin_nama: adminName,
      modul: 'TP',
      jenis_perubahan: isEdit ? 'UPDATE' : 'CREATE',
      judul_perubahan: `${isEdit ? 'Ubah' : 'Tambah'} TP: ${newTP.kode_tp} - ${newTP.mata_pelajaran}`,
      keterangan: `Deskripsi: ${newTP.deskripsi_tp.substring(0, 60)}...`
    });

    return newTP;
  }

  deleteTujuanPembelajaran(id: string, adminName: string = 'Administrator PKBM'): void {
    const list = this.getLocal<TujuanPembelajaran[]>(STORAGE_KEYS.KURIKULUM_TP, INITIAL_TUJUAN_PEMBELAJARAN);
    const target = list.find(tp => tp.id === id);
    const updated = list.filter(tp => tp.id !== id);
    this.setLocal(STORAGE_KEYS.KURIKULUM_TP, updated);

    if (target) {
      this.addRiwayatKurikulum({
        admin_id: 'adm-current',
        admin_nama: adminName,
        modul: 'TP',
        jenis_perubahan: 'DELETE',
        judul_perubahan: `Hapus TP: ${target.kode_tp} (${target.mata_pelajaran})`,
        keterangan: `Program ${target.program}`
      });
    }
  }

  duplicateTujuanPembelajaran(id: string, adminName: string = 'Administrator PKBM'): TujuanPembelajaran | null {
    const list = this.getLocal<TujuanPembelajaran[]>(STORAGE_KEYS.KURIKULUM_TP, INITIAL_TUJUAN_PEMBELAJARAN);
    const target = list.find(tp => tp.id === id);
    if (!target) return null;

    const duplicated: TujuanPembelajaran = {
      ...target,
      id: `tp-${Date.now()}`,
      kode_tp: `${target.kode_tp}-SALINAN`,
      deskripsi_tp: `${target.deskripsi_tp} (Salinan)`,
      urutan: list.length + 1
    };

    const updated = [...list, duplicated];
    this.setLocal(STORAGE_KEYS.KURIKULUM_TP, updated);

    this.addRiwayatKurikulum({
      admin_id: 'adm-current',
      admin_nama: adminName,
      modul: 'TP',
      jenis_perubahan: 'CREATE',
      judul_perubahan: `Duplikasi TP: ${duplicated.kode_tp}`,
      keterangan: `Duplikasi dari ${target.kode_tp}`
    });

    return duplicated;
  }

  // --- ALOKASI WAKTU ---
  getAlokasiWaktu(program?: PaketType | 'SEMUA'): AlokasiWaktuItem[] {
    const list = this.getLocal<AlokasiWaktuItem[]>(STORAGE_KEYS.KURIKULUM_ALOKASI, INITIAL_ALOKASI_WAKTU);
    if (!program || program === 'SEMUA') return list;
    return list.filter(item => item.program === program);
  }

  saveAlokasiWaktu(
    itemData: Omit<AlokasiWaktuItem, 'id'> & { id?: string },
    adminName: string = 'Administrator PKBM'
  ): AlokasiWaktuItem {
    const list = this.getLocal<AlokasiWaktuItem[]>(STORAGE_KEYS.KURIKULUM_ALOKASI, INITIAL_ALOKASI_WAKTU);
    const isEdit = !!itemData.id;
    const id = itemData.id || `alok-${Date.now()}`;
    const newItem: AlokasiWaktuItem = {
      ...itemData,
      id,
      jumlah_pertemuan: Number(itemData.jumlah_pertemuan) || 16,
      durasi_menit_pertemuan: Number(itemData.durasi_menit_pertemuan) || 45,
      total_jam_pelajaran: Number(itemData.total_jam_pelajaran) || (Number(itemData.jumlah_pertemuan) || 16) * 3,
      porsi_tatap_muka_jp: Number(itemData.porsi_tatap_muka_jp) || 0,
      porsi_tutorial_jp: Number(itemData.porsi_tutorial_jp) || 0,
      porsi_mandiri_jp: Number(itemData.porsi_mandiri_jp) || 0,
      total_skk: Number(itemData.total_skk) || 0
    };

    let updatedList: AlokasiWaktuItem[];
    if (isEdit) {
      updatedList = list.map(item => (item.id === id ? newItem : item));
    } else {
      updatedList = [...list, newItem];
    }
    this.setLocal(STORAGE_KEYS.KURIKULUM_ALOKASI, updatedList);

    this.addRiwayatKurikulum({
      admin_id: 'adm-current',
      admin_nama: adminName,
      modul: 'ALOKASI_WAKTU',
      jenis_perubahan: isEdit ? 'UPDATE' : 'CREATE',
      judul_perubahan: `${isEdit ? 'Ubah' : 'Tambah'} Alokasi Waktu: ${newItem.mata_pelajaran} (${newItem.program})`,
      keterangan: `Total JP: ${newItem.total_jam_pelajaran}, SKK: ${newItem.total_skk}`
    });

    return newItem;
  }

  deleteAlokasiWaktu(id: string, adminName: string = 'Administrator PKBM'): void {
    const list = this.getLocal<AlokasiWaktuItem[]>(STORAGE_KEYS.KURIKULUM_ALOKASI, INITIAL_ALOKASI_WAKTU);
    const target = list.find(it => it.id === id);
    const updated = list.filter(it => it.id !== id);
    this.setLocal(STORAGE_KEYS.KURIKULUM_ALOKASI, updated);

    if (target) {
      this.addRiwayatKurikulum({
        admin_id: 'adm-current',
        admin_nama: adminName,
        modul: 'ALOKASI_WAKTU',
        jenis_perubahan: 'DELETE',
        judul_perubahan: `Hapus Alokasi Waktu: ${target.mata_pelajaran}`,
        keterangan: `Program ${target.program}`
      });
    }
  }

  // --- KALENDER PENDIDIKAN ---
  getKalenderPendidikan(tahun?: string): KalenderPendidikanEvent[] {
    const list = this.getLocal<KalenderPendidikanEvent[]>(STORAGE_KEYS.KURIKULUM_KALENDER, INITIAL_KALENDER_PENDIDIKAN);
    const sorted = [...list].sort((a, b) => a.tanggal_mulai.localeCompare(b.tanggal_mulai));
    if (!tahun || tahun === 'SEMUA') return sorted;
    return sorted.filter(ev => ev.tahun_pelajaran === tahun);
  }

  saveKalenderEvent(
    eventData: Omit<KalenderPendidikanEvent, 'id'> & { id?: string },
    adminName: string = 'Administrator PKBM'
  ): KalenderPendidikanEvent {
    const list = this.getLocal<KalenderPendidikanEvent[]>(STORAGE_KEYS.KURIKULUM_KALENDER, INITIAL_KALENDER_PENDIDIKAN);
    const isEdit = !!eventData.id;
    const id = eventData.id || `kal-${Date.now()}`;
    const newEvent: KalenderPendidikanEvent = {
      ...eventData,
      id
    };

    let updatedList: KalenderPendidikanEvent[];
    if (isEdit) {
      updatedList = list.map(item => (item.id === id ? newEvent : item));
    } else {
      updatedList = [...list, newEvent];
    }
    this.setLocal(STORAGE_KEYS.KURIKULUM_KALENDER, updatedList);

    this.addRiwayatKurikulum({
      admin_id: 'adm-current',
      admin_nama: adminName,
      modul: 'KALENDER',
      jenis_perubahan: isEdit ? 'UPDATE' : 'CREATE',
      judul_perubahan: `${isEdit ? 'Ubah' : 'Tambah'} Agenda Kalender: ${newEvent.judul_kegiatan}`,
      keterangan: `Tanggal: ${newEvent.tanggal_mulai} s.d. ${newEvent.tanggal_selesai || newEvent.tanggal_mulai}`
    });

    return newEvent;
  }

  deleteKalenderEvent(id: string, adminName: string = 'Administrator PKBM'): void {
    const list = this.getLocal<KalenderPendidikanEvent[]>(STORAGE_KEYS.KURIKULUM_KALENDER, INITIAL_KALENDER_PENDIDIKAN);
    const target = list.find(ev => ev.id === id);
    const updated = list.filter(ev => ev.id !== id);
    this.setLocal(STORAGE_KEYS.KURIKULUM_KALENDER, updated);

    if (target) {
      this.addRiwayatKurikulum({
        admin_id: 'adm-current',
        admin_nama: adminName,
        modul: 'KALENDER',
        jenis_perubahan: 'DELETE',
        judul_perubahan: `Hapus Agenda Kalender: ${target.judul_kegiatan}`,
        keterangan: `Tanggal ${target.tanggal_mulai}`
      });
    }
  }

  // --- ASESMEN KURIKULUM ---
  getAsesmenKurikulum(program?: 'SEMUA' | PaketType): AsesmenKurikulumItem[] {
    const list = this.getLocal<AsesmenKurikulumItem[]>(STORAGE_KEYS.KURIKULUM_ASESMEN, INITIAL_ASESMEN_KURIKULUM);
    if (!program || program === 'SEMUA') return list;
    return list.filter(asm => asm.program === 'SEMUA' || asm.program === program);
  }

  saveAsesmenKurikulum(
    itemData: Omit<AsesmenKurikulumItem, 'id'> & { id?: string },
    adminName: string = 'Administrator PKBM'
  ): AsesmenKurikulumItem {
    const list = this.getLocal<AsesmenKurikulumItem[]>(STORAGE_KEYS.KURIKULUM_ASESMEN, INITIAL_ASESMEN_KURIKULUM);
    const isEdit = !!itemData.id;
    const id = itemData.id || `asm-${Date.now()}`;
    const newItem: AsesmenKurikulumItem = {
      ...itemData,
      id,
      bobot_persen: Number(itemData.bobot_persen) || 0
    };

    let updatedList: AsesmenKurikulumItem[];
    if (isEdit) {
      updatedList = list.map(item => (item.id === id ? newItem : item));
    } else {
      updatedList = [...list, newItem];
    }
    this.setLocal(STORAGE_KEYS.KURIKULUM_ASESMEN, updatedList);

    this.addRiwayatKurikulum({
      admin_id: 'adm-current',
      admin_nama: adminName,
      modul: 'ASESMEN',
      jenis_perubahan: isEdit ? 'UPDATE' : 'CREATE',
      judul_perubahan: `${isEdit ? 'Ubah' : 'Tambah'} Skema Asesmen: ${newItem.nama_asesmen}`,
      keterangan: `Jenis: ${newItem.jenis_asesmen}, Bobot: ${newItem.bobot_persen}%`
    });

    return newItem;
  }

  deleteAsesmenKurikulum(id: string, adminName: string = 'Administrator PKBM'): void {
    const list = this.getLocal<AsesmenKurikulumItem[]>(STORAGE_KEYS.KURIKULUM_ASESMEN, INITIAL_ASESMEN_KURIKULUM);
    const target = list.find(asm => asm.id === id);
    const updated = list.filter(asm => asm.id !== id);
    this.setLocal(STORAGE_KEYS.KURIKULUM_ASESMEN, updated);

    if (target) {
      this.addRiwayatKurikulum({
        admin_id: 'adm-current',
        admin_nama: adminName,
        modul: 'ASESMEN',
        jenis_perubahan: 'DELETE',
        judul_perubahan: `Hapus Asesmen: ${target.nama_asesmen}`,
        keterangan: `Jenis ${target.jenis_asesmen}`
      });
    }
  }

  // --- DOKUMEN KURIKULUM ---
  getDokumenKurikulum(isPublicOnly: boolean = false, program?: 'SEMUA' | PaketType): DokumenKurikulum[] {
    const list = this.getLocal<DokumenKurikulum[]>(STORAGE_KEYS.KURIKULUM_DOKUMEN, INITIAL_DOKUMEN_KURIKULUM);
    return list.filter(dok => {
      if (isPublicOnly && !dok.is_public && dok.status_publikasi !== 'AKTIF') {
        return false;
      }
      if (program && program !== 'SEMUA' && dok.program !== 'SEMUA' && dok.program !== program) {
        return false;
      }
      return true;
    });
  }

  saveDokumenKurikulum(
    dokData: Omit<DokumenKurikulum, 'id' | 'created_at'> & { id?: string },
    adminName: string = 'Administrator PKBM'
  ): DokumenKurikulum {
    const list = this.getLocal<DokumenKurikulum[]>(STORAGE_KEYS.KURIKULUM_DOKUMEN, INITIAL_DOKUMEN_KURIKULUM);
    const isEdit = !!dokData.id;
    const id = dokData.id || `dok-${Date.now()}`;
    const newDok: DokumenKurikulum = {
      ...dokData,
      id,
      created_at: isEdit ? (list.find(x => x.id === id)?.created_at || new Date().toISOString()) : new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    let updatedList: DokumenKurikulum[];
    if (isEdit) {
      updatedList = list.map(item => (item.id === id ? newDok : item));
    } else {
      updatedList = [...list, newDok];
    }
    this.setLocal(STORAGE_KEYS.KURIKULUM_DOKUMEN, updatedList);

    this.addRiwayatKurikulum({
      admin_id: 'adm-current',
      admin_nama: adminName,
      modul: 'DOKUMEN',
      jenis_perubahan: isEdit ? 'UPDATE' : 'CREATE',
      judul_perubahan: `${isEdit ? 'Ubah' : 'Upload'} Dokumen Kurikulum: ${newDok.nama_dokumen}`,
      keterangan: `Kategori: ${newDok.kategori}, Format: ${newDok.format_file}, Status: ${newDok.status_publikasi}`
    });

    return newDok;
  }

  deleteDokumenKurikulum(id: string, adminName: string = 'Administrator PKBM'): void {
    const list = this.getLocal<DokumenKurikulum[]>(STORAGE_KEYS.KURIKULUM_DOKUMEN, INITIAL_DOKUMEN_KURIKULUM);
    const target = list.find(dok => dok.id === id);
    const updated = list.filter(dok => dok.id !== id);
    this.setLocal(STORAGE_KEYS.KURIKULUM_DOKUMEN, updated);

    if (target) {
      this.addRiwayatKurikulum({
        admin_id: 'adm-current',
        admin_nama: adminName,
        modul: 'DOKUMEN',
        jenis_perubahan: 'DELETE',
        judul_perubahan: `Hapus Dokumen Kurikulum: ${target.nama_dokumen}`,
        keterangan: `Kategori ${target.kategori}`
      });
    }
  }

  // --- VERSI KURIKULUM ---
  getVersiKurikulum(): VersiKurikulum[] {
    return this.getLocal<VersiKurikulum[]>(STORAGE_KEYS.KURIKULUM_VERSI, INITIAL_VERSI_KURIKULUM);
  }

  saveVersiKurikulum(
    versiData: Omit<VersiKurikulum, 'id'> & { id?: string },
    adminName: string = 'Administrator PKBM'
  ): VersiKurikulum {
    const list = this.getVersiKurikulum();
    const isEdit = !!versiData.id;
    const id = versiData.id || `ver-${Date.now()}`;
    const newVersi: VersiKurikulum = {
      ...versiData,
      id
    };

    let updatedList: VersiKurikulum[];
    if (isEdit) {
      updatedList = list.map(item => (item.id === id ? newVersi : item));
    } else {
      updatedList = [newVersi, ...list];
    }
    this.setLocal(STORAGE_KEYS.KURIKULUM_VERSI, updatedList);

    this.addRiwayatKurikulum({
      admin_id: 'adm-current',
      admin_nama: adminName,
      modul: 'VERSI',
      jenis_perubahan: isEdit ? 'UPDATE' : 'CREATE',
      judul_perubahan: `Versi Kurikulum ${newVersi.nomor_versi}: ${newVersi.nama_versi}`,
      keterangan: newVersi.ringkasan_perubahan
    });

    return newVersi;
  }

  // --- RIWAYAT AUDIT LOGS ---
  getRiwayatKurikulum(): RiwayatPerubahanKurikulum[] {
    const list = this.getLocal<RiwayatPerubahanKurikulum[]>(STORAGE_KEYS.KURIKULUM_RIWAYAT, INITIAL_RIWAYAT_KURIKULUM);
    return list.sort((a, b) => new Date(b.waktu).getTime() - new Date(a.waktu).getTime());
  }

  addRiwayatKurikulum(riwayat: Omit<RiwayatPerubahanKurikulum, 'id' | 'waktu'>): void {
    const list = this.getLocal<RiwayatPerubahanKurikulum[]>(STORAGE_KEYS.KURIKULUM_RIWAYAT, INITIAL_RIWAYAT_KURIKULUM);
    const newLog: RiwayatPerubahanKurikulum = {
      ...riwayat,
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      waktu: new Date().toISOString()
    };
    const updated = [newLog, ...list].slice(0, 200); // Keep last 200 logs
    this.setLocal(STORAGE_KEYS.KURIKULUM_RIWAYAT, updated);
  }

  // --- EXPORT & BACKUP KURIKULUM ---
  exportKurikulumToCsv(): string {
    const struktur = this.getStrukturKurikulum('SEMUA');
    const headers = [
      'No',
      'Program',
      'Tingkatan/Fase',
      'Kelompok',
      'Kode Mapel',
      'Nama Mata Pelajaran',
      'Alokasi JP',
      'Alokasi SKK',
      'Tatap Muka %',
      'Tutorial %',
      'Mandiri %',
      'Status',
      'Catatan'
    ];

    const rows = struktur.map((s, idx) => [
      idx + 1,
      `"${s.program}"`,
      `"${s.tingkatan}"`,
      `"${s.kelompok}"`,
      `"${s.kode_mapel}"`,
      `"${s.nama_mata_pelajaran}"`,
      s.alokasi_waktu_jam,
      s.alokasi_skk,
      s.porsi_tatap_muka_persen || 0,
      s.porsi_tutorial_persen || 0,
      s.porsi_mandiri_persen || 0,
      `"${s.status}"`,
      `"${(s.catatan || '').replace(/"/g, '""')}"`
    ].join(','));

    return [headers.join(','), ...rows].join('\n');
  }

  exportKurikulumBackupJson(): string {
    const data = {
      profile: this.getKurikulumProfile(),
      prog_b: this.getProgramDetail('PAKET B'),
      prog_c: this.getProgramDetail('PAKET C'),
      struktur: this.getStrukturKurikulum('SEMUA'),
      cp: this.getCapaianPembelajaran('SEMUA'),
      tp: this.getTujuanPembelajaran(undefined, 'SEMUA'),
      alokasi: this.getAlokasiWaktu('SEMUA'),
      kalender: this.getKalenderPendidikan('SEMUA'),
      asesmen: this.getAsesmenKurikulum('SEMUA'),
      dokumen: this.getDokumenKurikulum(false, 'SEMUA'),
      versi: this.getVersiKurikulum(),
      riwayat: this.getRiwayatKurikulum(),
      exported_at: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  }

  importKurikulumBackupJson(jsonString: string, adminName: string = 'Administrator PKBM'): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.profile) this.setLocal(STORAGE_KEYS.KURIKULUM_PROFILE, parsed.profile);
      if (parsed.prog_b) this.setLocal(STORAGE_KEYS.KURIKULUM_PROG_B, parsed.prog_b);
      if (parsed.prog_c) this.setLocal(STORAGE_KEYS.KURIKULUM_PROG_C, parsed.prog_c);
      if (parsed.struktur) this.setLocal(STORAGE_KEYS.KURIKULUM_STRUKTUR, parsed.struktur);
      if (parsed.cp) this.setLocal(STORAGE_KEYS.KURIKULUM_CP, parsed.cp);
      if (parsed.tp) this.setLocal(STORAGE_KEYS.KURIKULUM_TP, parsed.tp);
      if (parsed.alokasi) this.setLocal(STORAGE_KEYS.KURIKULUM_ALOKASI, parsed.alokasi);
      if (parsed.kalender) this.setLocal(STORAGE_KEYS.KURIKULUM_KALENDER, parsed.kalender);
      if (parsed.asesmen) this.setLocal(STORAGE_KEYS.KURIKULUM_ASESMEN, parsed.asesmen);
      if (parsed.dokumen) this.setLocal(STORAGE_KEYS.KURIKULUM_DOKUMEN, parsed.dokumen);
      if (parsed.versi) this.setLocal(STORAGE_KEYS.KURIKULUM_VERSI, parsed.versi);

      this.addRiwayatKurikulum({
        admin_id: 'adm-current',
        admin_nama: adminName,
        modul: 'PENGATURAN',
        jenis_perubahan: 'IMPORT',
        judul_perubahan: 'Restore Data Kurikulum dari Berkas JSON',
        keterangan: 'Memulihkan master kurikulum dari cadangan data'
      });
      return true;
    } catch (e) {
      console.error('Import Kurikulum failed:', e);
      return false;
    }
  }

  // --- ALIASES & HELPERS FOR KURIKULUM DASHBOARD ---
  saveKurikulumProfile(profile: Partial<KurikulumProfile>, adminName: string = 'Administrator PKBM'): KurikulumProfile {
    return this.updateKurikulumProfile(profile, adminName);
  }

  getKurikulumProgramDetail(program: PaketType): KurikulumProgramDetail {
    return this.getProgramDetail(program);
  }

  saveKurikulumProgramDetail(detail: KurikulumProgramDetail, adminName: string = 'Administrator PKBM'): void {
    this.updateProgramDetail(detail, adminName);
  }

  saveAlokasiWaktuItem(
    itemData: Omit<AlokasiWaktuItem, 'id'> & { id?: string },
    adminName: string = 'Administrator PKBM'
  ): AlokasiWaktuItem {
    return this.saveAlokasiWaktu(itemData, adminName);
  }

  deleteAlokasiWaktuItem(id: string, adminName: string = 'Administrator PKBM'): void {
    this.deleteAlokasiWaktu(id, adminName);
  }

  saveAsesmenItem(
    itemData: Omit<AsesmenKurikulumItem, 'id'> & { id?: string },
    adminName: string = 'Administrator PKBM'
  ): AsesmenKurikulumItem {
    return this.saveAsesmenKurikulum(itemData, adminName);
  }

  deleteAsesmenItem(id: string, adminName: string = 'Administrator PKBM'): void {
    this.deleteAsesmenKurikulum(id, adminName);
  }

  activateVersiKurikulum(id: string, adminName: string = 'Administrator PKBM'): void {
    const list = this.getVersiKurikulum();
    const updated = list.map(v => ({
      ...v,
      status: (v.id === id ? 'AKTIF' : 'ARSIP') as 'AKTIF' | 'DRAF' | 'ARSIP'
    }));
    this.setLocal(STORAGE_KEYS.KURIKULUM_VERSI, updated);
    const target = list.find(v => v.id === id);
    if (target) {
      const prof = this.getKurikulumProfile();
      this.updateKurikulumProfile({ versi: target.nomor_versi }, adminName);
      this.addRiwayatKurikulum({
        admin_id: 'adm-current',
        admin_nama: adminName,
        modul: 'VERSI',
        jenis_perubahan: 'PUBLISH',
        judul_perubahan: `Aktivasi Versi Kurikulum: ${target.nomor_versi}`,
        keterangan: `Mengaktifkan versi ${target.nama_versi}`
      });
    }
  }

  exportStrukturToCsv(): string {
    return this.exportKurikulumToCsv();
  }

  resetKurikulumToDefault(adminName: string = 'Administrator PKBM'): void {
    this.setLocal(STORAGE_KEYS.KURIKULUM_PROFILE, INITIAL_KURIKULUM_PROFILE);
    this.setLocal(STORAGE_KEYS.KURIKULUM_PROG_B, INITIAL_PROGRAM_PAKET_B);
    this.setLocal(STORAGE_KEYS.KURIKULUM_PROG_C, INITIAL_PROGRAM_PAKET_C);
    this.setLocal(STORAGE_KEYS.KURIKULUM_STRUKTUR, INITIAL_STRUKTUR_KURIKULUM);
    this.setLocal(STORAGE_KEYS.KURIKULUM_CP, INITIAL_CAPAIAN_PEMBELAJARAN);
    this.setLocal(STORAGE_KEYS.KURIKULUM_TP, INITIAL_TUJUAN_PEMBELAJARAN);
    this.setLocal(STORAGE_KEYS.KURIKULUM_ALOKASI, INITIAL_ALOKASI_WAKTU);
    this.setLocal(STORAGE_KEYS.KURIKULUM_KALENDER, INITIAL_KALENDER_PENDIDIKAN);
    this.setLocal(STORAGE_KEYS.KURIKULUM_ASESMEN, INITIAL_ASESMEN_KURIKULUM);
    this.setLocal(STORAGE_KEYS.KURIKULUM_DOKUMEN, INITIAL_DOKUMEN_KURIKULUM);
    this.setLocal(STORAGE_KEYS.KURIKULUM_VERSI, INITIAL_VERSI_KURIKULUM);

    this.addRiwayatKurikulum({
      admin_id: 'adm-current',
      admin_nama: adminName,
      modul: 'PENGATURAN',
      jenis_perubahan: 'RESTORE',
      judul_perubahan: 'Reset Kurikulum ke Standar Awal',
      keterangan: 'Mengembalikan seluruh data kurikulum Paket B & C ke default resmi'
    });
  }

  resetToDefault(): void {
    this.setLocal(STORAGE_KEYS.USERS, INITIAL_USERS);
    this.setLocal(STORAGE_KEYS.MATERI, INITIAL_MATERI);
    this.setLocal(STORAGE_KEYS.CLASSES, INITIAL_CLASSES);
    this.setLocal(STORAGE_KEYS.MAPEL, INITIAL_MAPEL);
    this.setLocal(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
    this.setLocal(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    this.setLocal(STORAGE_KEYS.GAS_CONFIG, DEFAULT_GAS_CONFIG);
    this.setLocal(STORAGE_KEYS.TATAP_MUKA, INITIAL_TATAP_MUKA);
    this.setLocal(STORAGE_KEYS.TUGAS, INITIAL_TUGAS);
    this.setLocal(STORAGE_KEYS.PENGUMPULAN_TUGAS, INITIAL_PENGUMPULAN_TUGAS);
    this.setLocal(STORAGE_KEYS.BANK_SOAL, INITIAL_BANK_SOAL);
    this.setLocal(STORAGE_KEYS.ULANGAN, INITIAL_ULANGAN);
    this.setLocal(STORAGE_KEYS.UJIAN_ATTEMPTS, INITIAL_UJIAN_ATTEMPT);
    this.setLocal(STORAGE_KEYS.NOTIFIKASI, INITIAL_NOTIFIKASI);
    this.setLocal(STORAGE_KEYS.PENDAFTARAN, INITIAL_PENDAFTARAN);
  }
}

export const storage = new StorageService();
