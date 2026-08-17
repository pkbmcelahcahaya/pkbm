import React, { useState, useEffect } from 'react';
import { User, PaketType } from '../../types';
import { MASTER_TUTOR_LIST, getAutoMataPelajaranByNama } from '../../data/tutorData';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Sparkles, 
  UserCheck, 
  GraduationCap, 
  BookOpen, 
  Shield, 
  Lock, 
  Mail, 
  Hash, 
  FileText,
  User as UserIcon,
  Check
} from 'lucide-react';

interface UserEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  defaultRole?: 'SISWA' | 'TUTOR' | 'ADMIN';
  onSave: (savedUser: Partial<User>) => void;
}

const PRESET_AVATARS = {
  SISWA_PRIA: [
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  ],
  SISWA_WANITA: [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
  ],
  TUTOR_PRIA: [
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80'
  ],
  TUTOR_WANITA: [
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
  ]
};

export const UserEditModal: React.FC<UserEditModalProps> = ({
  isOpen,
  onClose,
  user,
  defaultRole = 'SISWA',
  onSave
}) => {
  const [role, setRole] = useState<'SISWA' | 'TUTOR' | 'ADMIN'>(defaultRole);
  const [nama, setNama] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('password123');
  const [email, setEmail] = useState('');
  const [foto, setFoto] = useState('');
  const [paket, setPaket] = useState<PaketType>('PAKET B');
  const [kelas, setKelas] = useState('');
  const [nisn, setNisn] = useState('');
  const [nik, setNik] = useState('');
  const [alamat, setAlamat] = useState('');
  const [telepon, setTelepon] = useState('');
  
  // Tutor Specific Fields
  const [noSk, setNoSk] = useState('');
  const [pendidikan, setPendidikan] = useState('S1');
  const [tempatLahir, setTempatLahir] = useState('Garut');
  const [tanggalLahir, setTanggalLahir] = useState('');
  const [jenisKelamin, setJenisKelamin] = useState<'L' | 'P'>('L');
  const [mataPelajaran, setMataPelajaran] = useState('');
  const [mapelPaketB, setMapelPaketB] = useState('');
  const [mapelPaketC, setMapelPaketC] = useState('');
  const [status, setStatus] = useState<'AKTIF' | 'NONAKTIF'>('AKTIF');

  // Photo tab / mode
  const [showAvatarPresets, setShowAvatarPresets] = useState(false);

  useEffect(() => {
    if (user) {
      setRole(user.role);
      setNama(user.nama || '');
      setUsername(user.username || '');
      setPassword(user.password || 'password123');
      setEmail(user.email || '');
      setFoto(user.foto || '');
      setPaket(user.paket || 'PAKET B');
      setKelas(user.kelas || '');
      setNisn(user.nisn || '');
      setNik(user.nik || '');
      setAlamat(user.alamat || '');
      setTelepon(user.telepon || '');
      setNoSk(user.no_sk || '');
      setPendidikan(user.pendidikan || 'S1');
      setTempatLahir(user.tempat_lahir || '');
      setTanggalLahir(user.tanggal_lahir || '');
      setJenisKelamin((user.jenis_kelamin as 'L' | 'P') || 'L');
      setMataPelajaran(user.mata_pelajaran || '');
      setMapelPaketB(user.mapel_paket_b || '');
      setMapelPaketC(user.mapel_paket_c || '');
      setStatus(user.status || 'AKTIF');
    } else {
      setRole(defaultRole);
      setNama('');
      setUsername('');
      setPassword('password123');
      setEmail('');
      setFoto(
        defaultRole === 'TUTOR'
          ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      );
      setPaket('PAKET B');
      setKelas(defaultRole === 'SISWA' ? 'Kelas 8' : 'Kelas 7-9 Paket B & Kelas 10-12 Paket C');
      setNisn('');
      setNik('');
      setAlamat('');
      setTelepon('');
      setNoSk('');
      setPendidikan('S1');
      setTempatLahir('Garut');
      setTanggalLahir('');
      setJenisKelamin('L');
      setMataPelajaran(defaultRole === 'TUTOR' ? 'Bahasa Indonesia & Literasi' : '');
      setMapelPaketB(defaultRole === 'TUTOR' ? 'Bahasa Indonesia & Literasi' : '');
      setMapelPaketC(defaultRole === 'TUTOR' ? 'Bahasa Indonesia & Sastra Lanjutan' : '');
      setStatus('AKTIF');
    }
  }, [user, defaultRole, isOpen]);

  if (!isOpen) return null;

  const handleSelectMasterTutor = (namaTutor: string) => {
    const master = MASTER_TUTOR_LIST.find(m => m.nama === namaTutor);
    if (!master) return;
    const auto = getAutoMataPelajaranByNama(master.nama);
    setNama(master.nama);
    const cleanUser = master.nama.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 12);
    setUsername(`tutor.${cleanUser}`);
    setEmail(`${cleanUser}@pkbmcelahcahaya.sch.id`);
    setNoSk(master.no_sk || '');
    setPendidikan(master.pendidikan || 'S1');
    setTempatLahir(master.tempat_lahir || 'Garut');
    setTanggalLahir(master.tanggal_lahir || '');
    setJenisKelamin(master.jenis_kelamin);
    setMataPelajaran(auto.mata_pelajaran);
    setMapelPaketB(auto.mapel_paket_b);
    setMapelPaketC(auto.mapel_paket_c);
    setKelas('Kelas 7-9 Paket B & Kelas 10-12 Paket C');
    if (master.foto) {
      setFoto(master.foto);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran foto terlalu besar. Maksimal 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFoto(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !username.trim()) {
      alert('Nama dan username wajib diisi.');
      return;
    }

    const payload: Partial<User> = {
      nama: nama.trim(),
      username: username.trim().toLowerCase(),
      password: password || 'password123',
      email: email.trim() || `${username.trim().toLowerCase()}@pkbmcelahcahaya.sch.id`,
      role,
      status,
      foto: foto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    };

    if (role === 'SISWA') {
      payload.paket = paket;
      payload.kelas = kelas || (paket === 'PAKET B' ? 'Kelas 8' : 'Kelas 11');
      payload.nisn = nisn || undefined;
      payload.nik = nik || undefined;
      payload.alamat = alamat || undefined;
      payload.telepon = telepon || undefined;
      payload.tempat_lahir = tempatLahir || undefined;
      payload.tanggal_lahir = tanggalLahir || undefined;
      payload.jenis_kelamin = jenisKelamin;
    } else if (role === 'TUTOR') {
      payload.paket = paket;
      payload.kelas = kelas || 'Kelas 7-9 Paket B & Kelas 10-12 Paket C';
      payload.no_sk = noSk || undefined;
      payload.pendidikan = pendidikan || 'S1';
      payload.tempat_lahir = tempatLahir || undefined;
      payload.tanggal_lahir = tanggalLahir || undefined;
      payload.jenis_kelamin = jenisKelamin;
      payload.mata_pelajaran = mataPelajaran || `${mapelPaketB} & ${mapelPaketC}`;
      payload.mapel_paket_b = mapelPaketB;
      payload.mapel_paket_c = mapelPaketC;
      payload.telepon = telepon || undefined;
    }

    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${
              role === 'TUTOR' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
              role === 'ADMIN' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300' :
              'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
            }`}>
              {role === 'TUTOR' ? <GraduationCap className="w-5 h-5" /> :
               role === 'ADMIN' ? <Shield className="w-5 h-5" /> :
               <UserIcon className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {user ? `Edit Data ${role === 'TUTOR' ? 'Tutor' : role === 'SISWA' ? 'Warga Belajar' : 'Admin'}` : `Tambah ${role === 'TUTOR' ? 'Tutor Baru' : role === 'SISWA' ? 'Warga Belajar Baru' : 'Admin Baru'}`}
              </h3>
              <p className="text-xs text-slate-500">
                Kelola identitas, foto profil, dan penugasan kurikulum PKBM Celah Cahaya.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          {/* SECTION: FOTO PROFIL (EDITABLE & UPLOADABLE) */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative group shrink-0">
                <img
                  src={foto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt="Preview Foto"
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-500 shadow-md bg-slate-100"
                />
                <label className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-[10px] font-bold">
                  <Upload className="w-4 h-4 mr-1" />
                  Ganti
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex-1 space-y-2 w-full">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
                    Foto Profil Pengguna
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAvatarPresets(!showAvatarPresets)}
                    className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    {showAvatarPresets ? 'Tutup Preset' : 'Pilih Avatar Siap Pakai'}
                  </button>
                </div>

                <div className="flex gap-2">
                  <input
                    type="url"
                    value={foto}
                    onChange={e => setFoto(e.target.value)}
                    placeholder="URL Foto (https://...)"
                    className="flex-1 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                  <label className="px-3 py-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold rounded-xl border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 cursor-pointer flex items-center gap-1 shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Foto</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {showAvatarPresets && (
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-[10px] text-slate-500 font-semibold mb-1.5">Pilih Preset Avatar:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {Object.entries(PRESET_AVATARS).flatMap(([cat, list]) =>
                        list.map((url, idx) => (
                          <button
                            key={`${cat}-${idx}`}
                            type="button"
                            onClick={() => {
                              setFoto(url);
                              setShowAvatarPresets(false);
                            }}
                            className="relative rounded-xl overflow-hidden border-2 hover:scale-105 transition-transform"
                            style={{ borderColor: foto === url ? '#6366F1' : 'transparent' }}
                          >
                            <img src={url} alt="preset" className="w-9 h-9 object-cover" />
                            {foto === url && (
                              <div className="absolute inset-0 bg-indigo-600/30 flex items-center justify-center">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ROLE SELECTOR (IF CREATING) */}
          {!user && (
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Tipe Pengguna (Role)
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setRole('SISWA');
                    setKelas('Kelas 8 Paket B');
                  }}
                  className={`p-2.5 rounded-xl border text-center font-bold flex items-center justify-center gap-2 ${
                    role === 'SISWA'
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600'
                  }`}
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Warga Belajar</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRole('TUTOR');
                    setKelas('Kelas 7-9 Paket B & Kelas 10-12 Paket C');
                  }}
                  className={`p-2.5 rounded-xl border text-center font-bold flex items-center justify-center gap-2 ${
                    role === 'TUTOR'
                      ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Tutor Pengampu</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('ADMIN')}
                  className={`p-2.5 rounded-xl border text-center font-bold flex items-center justify-center gap-2 ${
                    role === 'ADMIN'
                      ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span>Administrator</span>
                </button>
              </div>
            </div>
          )}

          {/* PREFILL FROM 16 TUTOR SK LIST (FOR TUTOR) */}
          {role === 'TUTOR' && (
            <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <label className="block font-bold text-emerald-800 dark:text-emerald-300 mb-1 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                Pilih dari 16 Master Tutor SK 2018 (Auto-Isi Biodata & Mapel):
              </label>
              <select
                onChange={e => e.target.value && handleSelectMasterTutor(e.target.value)}
                defaultValue=""
                className="w-full p-2 bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 rounded-xl font-medium text-emerald-900 dark:text-emerald-200"
              >
                <option value="">-- Pilih Nama Tutor SK --</option>
                {MASTER_TUTOR_LIST.map((t, idx) => (
                  <option key={t.nama} value={t.nama}>
                    {idx + 1}. {t.nama} ({t.no_sk || 'Tutor'}) - {t.mata_pelajaran}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* BASIC ACCOUNT CREDENTIALS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nama Lengkap & Gelar *
              </label>
              <input
                type="text"
                value={nama}
                onChange={e => setNama(e.target.value)}
                placeholder="Contoh: Dr. Opik, M.Pd"
                required
                className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Username Login *
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Contoh: tutor.opik"
                required
                className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Password Akun
              </label>
              <input
                type="text"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="password123"
                className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email Resmi
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="nama@pkbmcelahcahaya.sch.id"
                className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
          </div>

          {/* ROLE-SPECIFIC FIELDS */}
          {role === 'SISWA' && (
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
              <h4 className="font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider text-[11px]">
                Data Akademik & Dapodik Warga Belajar
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Program Paket
                  </label>
                  <select
                    value={paket}
                    onChange={e => setPaket(e.target.value as PaketType)}
                    className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  >
                    <option value="PAKET B">PAKET B (Setara SMP)</option>
                    <option value="PAKET C">PAKET C (Setara SMA)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Rombel / Kelas
                  </label>
                  <input
                    type="text"
                    value={kelas}
                    onChange={e => setKelas(e.target.value)}
                    placeholder="Contoh: Kelas 8 Paket B"
                    className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    NISN Siswa
                  </label>
                  <input
                    type="text"
                    value={nisn}
                    onChange={e => setNisn(e.target.value)}
                    placeholder="Contoh: 0081234567"
                    className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    NIK (KTP / KK)
                  </label>
                  <input
                    type="text"
                    value={nik}
                    onChange={e => setNik(e.target.value)}
                    placeholder="16 Digit NIK"
                    className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tempat Lahir
                  </label>
                  <input
                    type="text"
                    value={tempatLahir}
                    onChange={e => setTempatLahir(e.target.value)}
                    placeholder="Garut"
                    className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tanggal Lahir
                  </label>
                  <input
                    type="text"
                    value={tanggalLahir}
                    onChange={e => setTanggalLahir(e.target.value)}
                    placeholder="12 Mei 2008"
                    className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Jenis Kelamin
                  </label>
                  <select
                    value={jenisKelamin}
                    onChange={e => setJenisKelamin(e.target.value as 'L' | 'P')}
                    className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Alamat Domisili
                </label>
                <input
                  type="text"
                  value={alamat}
                  onChange={e => setAlamat(e.target.value)}
                  placeholder="Kp. Sindangreret RT 02/05, Desa Sukamaju, Garut"
                  className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>
            </div>
          )}

          {/* TUTOR SPECIFIC FORM WITH DUAL SUBJECTS (PAKET B & PAKET C) */}
          {role === 'TUTOR' && (
            <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-3">
              <h4 className="font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                Penugasan Mata Pelajaran Wajib (Paket B & Paket C)
              </h4>

              {/* DUAL SUBJECT FIELDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-amber-50/80 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800/80">
                  <label className="block font-bold text-amber-900 dark:text-amber-300 mb-1">
                    📌 Mapel Diampu di Paket B (SMP) *
                  </label>
                  <input
                    type="text"
                    value={mapelPaketB}
                    onChange={e => setMapelPaketB(e.target.value)}
                    placeholder="Contoh: Bahasa Indonesia & Literasi"
                    required
                    className="w-full p-2 bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 rounded-lg font-bold text-amber-900 dark:text-amber-200"
                  />
                  <p className="text-[10px] text-amber-700 dark:text-amber-400 mt-1">
                    Penugasan untuk Warga Belajar Paket B (Tingkat SMP)
                  </p>
                </div>

                <div className="p-3 bg-indigo-50/80 dark:bg-indigo-950/40 rounded-xl border border-indigo-200 dark:border-indigo-800/80">
                  <label className="block font-bold text-indigo-900 dark:text-indigo-300 mb-1">
                    📌 Mapel Diampu di Paket C (SMA) *
                  </label>
                  <input
                    type="text"
                    value={mapelPaketC}
                    onChange={e => setMapelPaketC(e.target.value)}
                    placeholder="Contoh: Bahasa Indonesia & Sastra Lanjutan"
                    required
                    className="w-full p-2 bg-white dark:bg-slate-900 border border-indigo-300 dark:border-indigo-700 rounded-lg font-bold text-indigo-900 dark:text-indigo-200"
                  />
                  <p className="text-[10px] text-indigo-700 dark:text-indigo-400 mt-1">
                    Penugasan untuk Warga Belajar Paket C (Tingkat SMA)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nomor SK Penetapan Tutor
                  </label>
                  <input
                    type="text"
                    value={noSk}
                    onChange={e => setNoSk(e.target.value)}
                    placeholder="Contoh: 01/PKBM-CC/I/2018"
                    className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Pendidikan Terakhir
                  </label>
                  <select
                    value={pendidikan}
                    onChange={e => setPendidikan(e.target.value)}
                    className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
                  >
                    <option value="S2">S2 (Magister)</option>
                    <option value="S1">S1 (Sarjana)</option>
                    <option value="D3">D3 (Diploma)</option>
                    <option value="SMA">SMA / Sederajat</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tempat Lahir
                  </label>
                  <input
                    type="text"
                    value={tempatLahir}
                    onChange={e => setTempatLahir(e.target.value)}
                    placeholder="Garut"
                    className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tanggal Lahir
                  </label>
                  <input
                    type="text"
                    value={tanggalLahir}
                    onChange={e => setTanggalLahir(e.target.value)}
                    placeholder="15 Juli 1983"
                    className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Jenis Kelamin
                  </label>
                  <select
                    value={jenisKelamin}
                    onChange={e => setJenisKelamin(e.target.value as 'L' | 'P')}
                    className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STATUS */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Status Akun
            </label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as any)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
            >
              <option value="AKTIF">AKTIF (Dapat Login & Mengakses Sistem)</option>
              <option value="NONAKTIF">NONAKTIF (Dibekukan Sementara)</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm cursor-pointer"
            >
              Simpan Data Pengguna
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
