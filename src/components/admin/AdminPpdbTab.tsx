import React, { useState } from 'react';
import { PendaftaranWargaBelajar, PaketType, User } from '../../types';
import { storage } from '../../services/storageService';
import { googleSheetsSync } from '../../services/googleSheetsSyncService';
import { 
  Users, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Eye, 
  Trash2, 
  UserPlus, 
  FileText, 
  Check, 
  X, 
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Calendar,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

interface AdminPpdbTabProps {
  currentUser: User;
  onRefresh?: () => void;
}

export const AdminPpdbTab: React.FC<AdminPpdbTabProps> = ({ currentUser, onRefresh }) => {
  const [pendaftaranList, setPendaftaranList] = useState<PendaftaranWargaBelajar[]>(() => storage.getPendaftaran());
  const [filterStatus, setFilterStatus] = useState<string>('SEMUA');
  const [filterPaket, setFilterPaket] = useState<string>('SEMUA');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDetail, setSelectedDetail] = useState<PendaftaranWargaBelajar | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  const refreshData = () => {
    setPendaftaranList(storage.getPendaftaran());
    if (onRefresh) onRefresh();
  };

  const handleSyncToSheets = async () => {
    setIsSyncing(true);
    setSyncMessage(null);
    try {
      const res = await googleSheetsSync.syncAllPPDB(pendaftaranList);
      if (res.success) {
        setSyncMessage({ text: `✅ Berhasil sinkron ${pendaftaranList.length} data pendaftaran ke Google Sheets!` });
      } else {
        setSyncMessage({ text: `⚠️ ${res.message}`, isError: true });
      }
    } catch (err: any) {
      setSyncMessage({ text: `❌ Gagal sinkronisasi: ${err.message}`, isError: true });
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncMessage(null), 5000);
    }
  };

  const filtered = pendaftaranList.filter(p => {
    const status = p.status || p.status_pendaftaran || 'MENUNGGU_VERIFIKASI';
    const matchStatus =
      filterStatus === 'SEMUA' ||
      (filterStatus === 'MENUNGGU_VERIFIKASI' && (status === 'MENUNGGU_VERIFIKASI' || status === 'DIAJUKAN' || status === 'DRAFT')) ||
      status === filterStatus;
    const matchPaket = filterPaket === 'SEMUA' || p.program_pilihan === filterPaket;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      p.nama_lengkap.toLowerCase().includes(q) ||
      p.nomor_pendaftaran.toLowerCase().includes(q) ||
      (p.nik && p.nik.toLowerCase().includes(q)) ||
      (p.nisn && p.nisn.toLowerCase().includes(q)) ||
      (p.email && p.email.toLowerCase().includes(q));
    return matchStatus && matchPaket && matchSearch;
  });

  const handleUpdateStatus = (id: string, newStatus: any) => {
    const updated = storage.updatePendaftaran(id, { status: newStatus, status_pendaftaran: newStatus });
    if (updated) {
      googleSheetsSync.syncPPDBToGoogleSheets(updated).catch(err => console.warn('PPDB status sync:', err));
    }
    refreshData();
    if (selectedDetail && selectedDetail.id === id) {
      setSelectedDetail({ ...selectedDetail, status: newStatus, status_pendaftaran: newStatus });
    }
  };

  const handleApproveAndCreateAccount = (p: PendaftaranWargaBelajar) => {
    if (confirm(`Verifikasi dan buatkan akun Siswa otomatis untuk ${p.nama_lengkap}?`)) {
      // 1. Update pendaftaran status to DITERIMA
      const updated = storage.updatePendaftaran(p.id, { status: 'DITERIMA', status_pendaftaran: 'DITERIMA' });
      if (updated) {
        googleSheetsSync.syncPPDBToGoogleSheets(updated).catch(err => console.warn('PPDB update sync:', err));
      }

      // 2. Generate Siswa User
      const username = (p.nisn || p.nomor_pendaftaran.replace(/[^a-zA-Z0-9]/g, '')).toLowerCase().slice(0, 12);
      const existingUser = storage.getUsers().find(u => u.username === username);
      
      if (!existingUser) {
        const newUser = storage.addUser({
          nama: p.nama_lengkap,
          username: username,
          password: 'password123',
          email: p.email || `${username}@pkbmcelahcahaya.sch.id`,
          role: 'SISWA',
          paket: p.program_pilihan,
          kelas: p.program_pilihan === 'PAKET B' ? 'Kelas 7' : 'Kelas 10',
          nisn: p.nisn || undefined,
          nik: p.nik || undefined,
          telepon: p.nomor_hp || undefined,
          alamat: p.alamat_lengkap || p.alamat_domisili?.alamat_lengkap || undefined,
          kelurahan: p.desa_kelurahan || p.alamat_domisili?.desa_kelurahan || undefined,
          kecamatan: p.kecamatan || p.alamat_domisili?.kecamatan || undefined,
          kode_pos: p.kode_pos || p.alamat_domisili?.kode_pos || undefined,
          tempat_lahir: p.tempat_lahir || undefined,
          tanggal_lahir: p.tanggal_lahir || undefined,
          jenis_kelamin: p.jenis_kelamin,
          status: 'AKTIF',
          foto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
        });
        if (newUser) {
          googleSheetsSync.syncUser(newUser, 'add').catch(err => console.warn('User create sync:', err));
        }
        alert(`✅ Pendaftaran ${p.nama_lengkap} BERHASIL DITERIMA!\nAkun Siswa aktif telah dibuat:\nUsername: ${username}\nPassword: password123`);
      } else {
        alert(`✅ Pendaftaran ${p.nama_lengkap} telah diubah menjadi DITERIMA.`);
      }

      refreshData();
    }
  };

  const handleDeletePendaftaran = (id: string, nama: string) => {
    if (confirm(`Hapus berkas pendaftaran "${nama}"?`)) {
      storage.deletePendaftaran(id);
      refreshData();
      if (selectedDetail && selectedDetail.id === id) {
        setSelectedDetail(null);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Filter & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            <option value="SEMUA">Semua Status PPDB</option>
            <option value="MENUNGGU_VERIFIKASI">Menunggu Verifikasi</option>
            <option value="DITERIMA">Diterima (Siswa Aktif)</option>
            <option value="DITOLAK">Ditolak / Berkas Kurang</option>
          </select>

          <select
            value={filterPaket}
            onChange={e => setFilterPaket(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            <option value="SEMUA">Semua Paket Program</option>
            <option value="PAKET B">Paket B (SMP)</option>
            <option value="PAKET C">Paket C (SMA)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSyncToSheets}
            disabled={isSyncing}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
            title="Kirim dan sinkronkan semua berkas PPDB ke Google Sheets"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Menyinkronkan...' : 'Sinkron ke Sheets'}</span>
          </button>

          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari nama pendaftar, No. Reg, NISN, NIK..."
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      {syncMessage && (
        <div
          className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
            syncMessage.isError
              ? 'bg-rose-500/15 text-rose-600 dark:text-rose-300 border border-rose-500/30'
              : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30'
          }`}
        >
          <span>{syncMessage.text}</span>
        </div>
      )}

      {/* Pendaftaran Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3.5 pl-5">Nomor & Nama Pendaftar</th>
                <th className="p-3.5">Program Pilihan</th>
                <th className="p-3.5">Kontak & NIK / NISN</th>
                <th className="p-3.5">Tanggal Daftar</th>
                <th className="p-3.5 text-center">Status Verifikasi</th>
                <th className="p-3.5 text-right pr-5">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    Tidak ada data pendaftaran warga belajar yang sesuai.
                  </td>
                </tr>
              ) : (
                filtered.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3.5 pl-5">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>{p.nama_lengkap}</span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          ({p.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'})
                        </span>
                      </div>
                      <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-mono font-semibold">
                        {p.nomor_pendaftaran}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        p.program_pilihan === 'PAKET B' ? 'bg-amber-100 text-amber-800' : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {p.program_pilihan}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="text-slate-800 dark:text-slate-200 font-medium flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{p.nomor_hp || '-'}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        NIK: {p.nik || '-'} {p.nisn ? `• NISN: ${p.nisn}` : ''}
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-500 font-mono text-[11px]">
                      {p.created_at ? new Date(p.created_at).toLocaleDateString('id-ID') : '-'}
                    </td>
                    <td className="p-3.5 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        (p.status === 'DITERIMA' || p.status_pendaftaran === 'DITERIMA') ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                        (p.status === 'DITOLAK' || p.status_pendaftaran === 'DITOLAK') ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                        'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {(p.status === 'DITERIMA' || p.status_pendaftaran === 'DITERIMA') ? '✓ DITERIMA' :
                         (p.status === 'DITOLAK' || p.status_pendaftaran === 'DITOLAK') ? '✕ DITOLAK' : '⏳ MENUNGGU VERIFIKASI'}
                      </span>
                    </td>
                    <td className="p-3.5 pr-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedDetail(p)}
                          className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100"
                          title="Lihat Berkas & Detail Dapodik"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {p.status !== 'DITERIMA' && p.status_pendaftaran !== 'DITERIMA' && (
                          <button
                            onClick={() => handleApproveAndCreateAccount(p)}
                            className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100"
                            title="Terima & Buatkan Akun Siswa"
                          >
                            <UserPlus className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeletePendaftaran(p.id, p.nama_lengkap)}
                          className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 hover:bg-rose-100"
                          title="Hapus Berkas Pendaftaran"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-bold">
                  {selectedDetail.nomor_pendaftaran}
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                  {selectedDetail.nama_lengkap}
                </h3>
                <p className="text-xs text-slate-500">
                  Program: <span className="font-bold text-indigo-600">{selectedDetail.program_pilihan}</span>
                </p>
              </div>

              <button
                onClick={() => setSelectedDetail(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 text-[11px] block">NIK KTP/KK:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{selectedDetail.nik || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">NISN:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{selectedDetail.nisn || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Tempat, Tgl Lahir:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedDetail.tempat_lahir}, {selectedDetail.tanggal_lahir}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">No. HP / WhatsApp:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedDetail.nomor_hp || '-'}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 text-[11px] block">Alamat Domisili:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedDetail.alamat_lengkap || selectedDetail.alamat_domisili?.alamat_lengkap || '-'}
                    {(selectedDetail.desa_kelurahan || selectedDetail.alamat_domisili?.desa_kelurahan) ? `, ${selectedDetail.desa_kelurahan || selectedDetail.alamat_domisili?.desa_kelurahan}` : ''}
                    {(selectedDetail.kecamatan || selectedDetail.alamat_domisili?.kecamatan) ? `, Kec. ${selectedDetail.kecamatan || selectedDetail.alamat_domisili?.kecamatan}` : ''}
                    {(selectedDetail.kabupaten_kota) ? `, ${selectedDetail.kabupaten_kota}` : ''}
                  </span>
                </div>
              </div>

              {/* Status Actions */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-600 dark:text-slate-300">Ubah Status:</span>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedDetail.id, 'DITERIMA')}
                    className="px-3 py-1.5 bg-emerald-100 text-emerald-800 font-bold rounded-lg hover:bg-emerald-200"
                  >
                    Set Diterima
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedDetail.id, 'DITOLAK')}
                    className="px-3 py-1.5 bg-rose-100 text-rose-800 font-bold rounded-lg hover:bg-rose-200"
                  >
                    Set Ditolak
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedDetail.id, 'MENUNGGU_VERIFIKASI')}
                    className="px-3 py-1.5 bg-amber-100 text-amber-800 font-bold rounded-lg hover:bg-amber-200"
                  >
                    Set Menunggu
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedDetail(null)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
