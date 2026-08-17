import React, { useState } from 'react';
import {
  X,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  GraduationCap,
  Shield,
  BookOpen,
  HelpCircle,
  Sparkles,
  ArrowRight,
  UserPlus,
  LogIn,
  Phone,
  Mail,
  School,
  AlertCircle,
  Building2
} from 'lucide-react';
import { storage } from '../services/storageService';
import { User, PaketType } from '../types';
import { MASTER_LEMBAGA } from '../data/lembagaConfig';
import { LogoPKBM } from './LogoPKBM';
import { useI18n } from '../services/i18n';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  defaultRoleHint?: 'SISWA' | 'TUTOR' | 'ADMIN';
  lockNotice?: string;
  initialTab?: 'LOGIN' | 'REGISTER';
  onOpenPanduan?: () => void;
  onOpenProfil?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  lockNotice,
  initialTab = 'LOGIN',
  onOpenPanduan,
  onOpenProfil
}) => {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<'LOGIN' | 'REGISTER'>(initialTab);

  // Login State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register State
  const [regNama, setRegNama] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPaket, setRegPaket] = useState<PaketType>('PAKET B');
  const [regKelas, setRegKelas] = useState('Kelas 7');
  const [regTelepon, setRegTelepon] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showHelp, setShowHelp] = useState(false);

  // Sync tab when initialTab or isOpen changes
  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setErrorMessage('');
    }
  }, [isOpen, initialTab]);

  // Update classes when paket changes
  const handlePaketChange = (paket: PaketType) => {
    setRegPaket(paket);
    if (paket === 'PAKET B') {
      setRegKelas('Kelas 7');
    } else {
      setRegKelas('Kelas 10');
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const result = await storage.login(username, password);
      if (result.success && result.user) {
        onLoginSuccess(result.user);
        onClose();
      } else {
        setErrorMessage(result.message || 'Login gagal. Silakan periksa kembali akun Anda.');
      }
    } catch (err) {
      setErrorMessage('Terjadi kendala saat menghubungkan ke sistem. Coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!regNama.trim() || !regUsername.trim()) {
      setErrorMessage('Mohon lengkapi Nama Lengkap dan Username / NISN.');
      return;
    }

    if (regPassword.length < 4) {
      setErrorMessage('Password minimal 4 karakter.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await storage.register({
        nama: regNama.trim(),
        username: regUsername.trim(),
        password: regPassword,
        paket: regPaket,
        kelas: regKelas,
        telepon: regTelepon.trim()
      });

      if (result.success && result.user) {
        onLoginSuccess(result.user);
        onClose();
      } else {
        setErrorMessage(result.message || 'Pendaftaran gagal.');
      }
    } catch (err) {
      setErrorMessage('Terjadi kesalahan saat memproses pendaftaran.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="login-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
        {/* Left Side: Institutional Information */}
        <div className="md:col-span-5 bg-slate-950 p-6 sm:p-8 text-white flex flex-col justify-between relative overflow-hidden border-b md:border-b-0 md:border-r border-indigo-900/50">
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            {/* Logo & Header */}
            <div className="flex items-center gap-3 mb-4">
              <LogoPKBM size="md" imageClassName="bg-white p-1 rounded-2xl shadow-md" />
              <div>
                <h3 className="font-extrabold text-base tracking-tight text-white leading-tight">
                  {MASTER_LEMBAGA.nama}
                </h3>
                <p className="text-[11px] text-amber-300 font-bold">
                  Sistem Pembelajaran Digital 2026
                </p>
                <p className="text-[10px] text-indigo-200">
                  {Array.isArray(MASTER_LEMBAGA.program_layanan)
                    ? MASTER_LEMBAGA.program_layanan.join(' & ')
                    : MASTER_LEMBAGA.program_layanan}
                </p>
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-3 mb-4 text-xs text-indigo-100/90 leading-relaxed border border-white/10 space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-indigo-200">NPSN Resmi:</span>
                <span className="font-mono font-bold text-amber-300">{MASTER_LEMBAGA.npsn}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-indigo-200">Lokasi:</span>
                <span className="text-white font-medium">Kp. Sukawangi, Singajaya, Garut</span>
              </div>
            </div>

            {/* Layanan Pembelajaran Resmi */}
            <div className="space-y-2.5">
              <p className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Layanan Pendidikan Kesetaraan
              </p>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    B
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs">Paket B (Setara SMP/MTs)</div>
                    <p className="text-[11px] text-indigo-200 leading-snug">
                      Kurikulum Merdeka Derajat Terampil 1 & 2 dengan 35 E-Modul Pembelajaran Mandiri & Tatap Muka.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 pt-2 border-t border-white/10">
                  <div className="w-6 h-6 rounded-lg bg-indigo-400/20 text-indigo-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    C
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs">Paket C (Setara SMA/MA)</div>
                    <p className="text-[11px] text-indigo-200 leading-snug">
                      Kurikulum Merdeka Derajat Mahir 1 & 2 (Peminatan IPS) dengan 44 E-Modul & Evaluasi Kuis 100 Soal.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 pt-2 border-t border-white/10">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    <Shield className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs">Sistem Data Terintegrasi</div>
                    <p className="text-[11px] text-indigo-200 leading-snug">
                      Data administrasi dan pembelajaran PKBM Celah Cahaya dikelola secara terpusat, terstruktur, dan tersinkronisasi, sehingga memudahkan pengelolaan data warga belajar, modul, serta kebutuhan administrasi secara efisien dan aman.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-indigo-800/60 flex items-center justify-between text-[11px] text-indigo-300">
            {onOpenPanduan && (
              <button
                type="button"
                onClick={onOpenPanduan}
                className="text-amber-300 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <HelpCircle className="w-3 h-3" />
                <span>{t('nav.guide', 'Panduan')}</span>
              </button>
            )}
            {onOpenProfil && (
              <button
                type="button"
                onClick={onOpenProfil}
                className="text-indigo-200 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Building2 className="w-3 h-3" />
                <span>{t('nav.profile', 'Profil')}</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Side: Form (Login / Register Tabs) */}
        <div className="md:col-span-7 p-6 sm:p-8 md:p-10 flex flex-col justify-between bg-white dark:bg-slate-900 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div>
            {/* Lock / Requirement notice if triggered from clicking a locked module */}
            {lockNotice && (
              <div className="mb-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs flex items-center gap-2.5">
                <Lock className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="font-medium">{lockNotice}</span>
              </div>
            )}

            {/* Tabs Header: Masuk vs Daftar */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-6 max-w-sm">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('LOGIN');
                  setErrorMessage('');
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'LOGIN'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{t('auth.login', 'Masuk Akun')}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('REGISTER');
                  setErrorMessage('');
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'REGISTER'
                    ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{t('auth.register', 'Daftar Baru')}</span>
              </button>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* TAB 1: LOGIN FORM */}
            {activeTab === 'LOGIN' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    {t('auth.welcomeBack', 'Masuk ke Portal LMS')}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Silakan masukkan username dan kata sandi akun Anda.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    {t('auth.username', 'Username / NISN')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <input
                      id="input-login-username"
                      type="text"
                      required
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      placeholder="Contoh: siswa.budi / admin"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    {t('auth.password', 'Kata Sandi')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="input-login-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-11 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>{t('auth.rememberMe', 'Ingat saya')}</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => setShowHelp(true)}
                    className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>{t('nav.guide', 'Bantuan')}</span>
                  </button>
                </div>

                <button
                  id="btn-submit-login"
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-sm shadow-2xs transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer mt-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{t('auth.login', 'Masuk ke Portal')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* TAB 2: REGISTER FORM */}
            {activeTab === 'REGISTER' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    {t('auth.register', 'Pendaftaran Warga Belajar')}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Daftar akun siswa baru untuk membuka dan membaca seluruh modul resmi.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      required
                      value={regNama}
                      onChange={e => setRegNama(e.target.value)}
                      placeholder="Contoh: Rahmat Hidayat"
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Username / NISN *
                    </label>
                    <input
                      type="text"
                      required
                      value={regUsername}
                      onChange={e => setRegUsername(e.target.value)}
                      placeholder="Contoh: rahmat.pkbm"
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Pilihan Program *
                    </label>
                    <select
                      value={regPaket}
                      onChange={e => handlePaketChange(e.target.value as PaketType)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                    >
                      <option value="PAKET B">Paket B (Setara SMP)</option>
                      <option value="PAKET C">Paket C (Setara SMA)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Tingkat Kelas *
                    </label>
                    <select
                      value={regKelas}
                      onChange={e => setRegKelas(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                    >
                      {regPaket === 'PAKET B' ? (
                        <>
                          <option value="Kelas 7">Kelas 7 (Derajat Terampil 1)</option>
                          <option value="Kelas 8">Kelas 8 (Derajat Terampil 1)</option>
                          <option value="Kelas 9">Kelas 9 (Derajat Terampil 2)</option>
                        </>
                      ) : (
                        <>
                          <option value="Kelas 10">Kelas 10 (Derajat Mahir 1)</option>
                          <option value="Kelas 11">Kelas 11 (Derajat Mahir 1)</option>
                          <option value="Kelas 12">Kelas 12 (Derajat Mahir 2)</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      No. WhatsApp / HP
                    </label>
                    <input
                      type="tel"
                      value={regTelepon}
                      onChange={e => setRegTelepon(e.target.value)}
                      placeholder="0812xxxxxxxx"
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Buat Kata Sandi *
                    </label>
                    <div className="relative">
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        required
                        value={regPassword}
                        onChange={e => setRegPassword(e.target.value)}
                        placeholder="Min. 4 karakter"
                        className="w-full pl-3.5 pr-10 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      >
                        {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{t('auth.register', 'Daftar Sekarang & Masuk')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>PKBM Celah Cahaya © 2026</span>
            <span>Akses Terenkripsi & Aman</span>
          </div>
        </div>
      </div>

      {/* Help Modal Popup */}
      {showHelp && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h4 className="font-bold text-base text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-indigo-600" />
              Petunjuk Akses Login Siswa & Tutor
            </h4>
            <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
              <p>
                <strong>Warga Belajar & Siswa:</strong> Masuk menggunakan Username / NISN dan Password resmi yang telah didaftarkan atau diberikan oleh pihak sekolah.
              </p>
              <p>
                <strong>Pendaftaran Baru:</strong> Calon siswa dapat langsung mendaftar secara mandiri melalui tab <em>Daftar Baru</em> di atas atau melalui formulir PPDB.
              </p>
              <p>
                <strong>Tutor & Administrator:</strong> Gunakan akun kredensial resmi terdaftar untuk mengakses panel manajemen kelas, bank soal, dan evaluasi hasil kuis.
              </p>
              <p>
                <strong>Bantuan Layanan:</strong> Hubungi Sekretariat PKBM Celah Cahaya jika mengalami kendala login atau lupa kata sandi.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowHelp(false)}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-xs cursor-pointer shadow-2xs"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
