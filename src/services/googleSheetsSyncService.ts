/**
 * PKBM CELAH CAHAYA - Google Sheets Real-Time Synchronizer Engine
 * Menghubungkan seluruh form, kuis 100 soal, materi, tugas, ujian, PPDB, tatap muka, dan pengguna
 * ke Google Sheets secara menyeluruh tanpa ada field yang tertinggal atau hilang.
 */

import {
  ModulQuizAttempt,
  PendaftaranWargaBelajar,
  Materi,
  Tugas,
  PengumpulanTugas,
  Ulangan,
  UjianAttempt,
  User,
  ReadingProgress,
  TatapMuka,
  Aktivitas,
  WebsiteSetting
} from '../types';
import { storage } from './storageService';

export interface SyncResponse {
  success: boolean;
  message: string;
  sheetName?: string;
  rowId?: string;
  timestamp?: string;
  error?: string;
  count?: number;
}

export class GoogleSheetsSyncService {
  /**
   * Mengirim request POST ke Google Apps Script Web App
   */
  public async sendToGas(action: string, payload: Record<string, any>): Promise<SyncResponse> {
    const config = storage.getGasConfig();
    const currentUser = storage.getCurrentUser();
    const token = localStorage.getItem('pkbm_session_token_v2') || (currentUser ? `TOKEN-${currentUser.id}` : 'PUBLIC_APP_TOKEN');

    if (!config.webAppUrl) {
      console.info(`[GoogleSheetsSync] Web App URL belum dikonfigurasi. Data tersimpan aman di database lokal LMS PKBM Celah Cahaya.`);
      return {
        success: true,
        message: 'Data tersimpan di penyimpanan lokal LMS PKBM Celah Cahaya (Konfigurasikan URL GAS di Pengaturan untuk Live Sync Google Sheets).'
      };
    }

    try {
      const response = await fetch(config.webAppUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8' // CORS-safe payload for Google Apps Script Web App
        },
        body: JSON.stringify({
          action,
          token,
          user: currentUser ? { id: currentUser.id, nama: currentUser.nama, role: currentUser.role } : null,
          spreadsheetId: config.spreadsheetId || '1JMaGtYl77Qm5enl9N2A49_6oivu0mAjwCHe6QApfbQM',
          driveFolderId: config.driveFolderId || '1JWAMU6COy1S8seU2fInEYLPgTf_mH4AX',
          payload,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
      }

      const resData = await response.json();
      if (resData.success) {
        return {
          success: true,
          message: resData.message || 'Data berhasil dikirim dan tersimpan lengkap di Google Sheets.',
          sheetName: resData.sheetName,
          rowId: resData.rowId,
          timestamp: new Date().toISOString()
        };
      } else {
        console.warn('[GoogleSheetsSync] Respons server GAS:', resData.message);
        return {
          success: false,
          message: resData.message || 'Gagal menyimpan data ke Google Sheets.',
          error: resData.message
        };
      }
    } catch (err: any) {
      console.warn('[GoogleSheetsSync] Sinkronisasi online ditunda / gagal koneksi:', err.message || err);
      return {
        success: true, // Fail-open local durability
        message: `Data tersimpan di database lokal LMS (Koneksi Sheets: ${err.message || 'Offline'})`,
        error: err.toString()
      };
    }
  }

  // ==========================================
  // 1. SINKRONISASI KUIS EVALUASI 100 SOAL
  // ==========================================
  async syncQuizAttemptToGoogleSheets(attempt: ModulQuizAttempt): Promise<SyncResponse> {
    const rawAnswers = attempt.jawaban || (attempt as any).jawaban_user || {};
    return this.sendToGas('save_quiz_attempt', {
      id: attempt.id,
      materi_id: attempt.materi_id,
      materi_judul: attempt.materi_judul,
      mata_pelajaran: attempt.mata_pelajaran,
      paket: attempt.paket,
      tingkatan: attempt.tingkatan || '-',
      user_id: attempt.user_id,
      siswa_nama: attempt.siswa_nama || (attempt as any).user_nama || '-',
      siswa_nisn: attempt.siswa_nisn || (attempt as any).user_nisn || '-',
      kelas: attempt.kelas || '-',
      tutor_id: attempt.tutor_id || '-',
      tutor_nama: attempt.tutor_nama || '-',
      mulai_pada: attempt.mulai_pada,
      selesai_pada: attempt.selesai_pada,
      durasi_detik: attempt.durasi_detik,
      durasi_format: `${Math.floor(attempt.durasi_detik / 60)} Menit ${attempt.durasi_detik % 60} Detik`,
      jumlah_soal: attempt.jumlah_soal || (attempt as any).total_soal || 100,
      jumlah_benar: attempt.jumlah_benar !== undefined ? attempt.jumlah_benar : (attempt as any).total_benar || 0,
      jumlah_salah: attempt.jumlah_salah !== undefined ? attempt.jumlah_salah : (attempt as any).total_salah || 0,
      jumlah_kosong: attempt.jumlah_kosong !== undefined ? attempt.jumlah_kosong : 0,
      nilai: attempt.nilai,
      kkm: attempt.kkm || 75,
      status_kelulusan: attempt.status_kelulusan,
      percobaan_ke: attempt.percobaan_ke || 1,
      timestamp: attempt.timestamp || new Date().toISOString(),
      // Serialized 100 Answers & Keys Snapshot
      jawaban_100_json: typeof rawAnswers === 'string' ? rawAnswers : JSON.stringify(rawAnswers),
      kunci_jawaban_snapshot_json: typeof attempt.kunci_jawaban_snapshot === 'string' ? attempt.kunci_jawaban_snapshot : JSON.stringify(attempt.kunci_jawaban_snapshot || {}),
      pembahasan_snapshot_json: typeof attempt.pembahasan_snapshot === 'string' ? attempt.pembahasan_snapshot : JSON.stringify(attempt.pembahasan_snapshot || {})
    });
  }

  async syncQuizAttempt(attempt: ModulQuizAttempt): Promise<SyncResponse> {
    return this.syncQuizAttemptToGoogleSheets(attempt);
  }

  async syncAllQuizAttempts(attempts: ModulQuizAttempt[]): Promise<SyncResponse> {
    return this.sendToGas('master_bulk_sync', {
      quiz_attempts: attempts
    });
  }

  // ==========================================
  // 2. SINKRONISASI PENDAFTARAN PPDB (ALL FIELDS)
  // ==========================================
  async syncPendaftaranPPDB(p: PendaftaranWargaBelajar): Promise<SyncResponse> {
    return this.sendToGas('register_ppdb', {
      id: p.id,
      nomor_pendaftaran: p.nomor_pendaftaran,
      tahun_ajaran: p.tahun_ajaran || '2026/2027',
      gelombang: p.gelombang || 'Gelombang 1',
      program_pilihan: p.program_pilihan,
      jenis_pendaftaran: p.jenis_pendaftaran,
      status: p.status,
      tanggal_pendaftaran: p.tanggal_pendaftaran,
      // 1. Identitas Lengkap
      nama_lengkap: p.nama_lengkap,
      nisn: p.nisn || '-',
      nik: p.nik || '-',
      nomor_kk: p.nomor_kk || '-',
      jenis_kelamin: p.jenis_kelamin,
      tempat_lahir: p.tempat_lahir,
      tanggal_lahir: p.tanggal_lahir,
      agama: p.agama,
      kewarganegaraan: p.kewarganegaraan || 'WNI',
      kebutuhan_khusus: p.kebutuhan_khusus || 'Tidak Ada',
      anak_ke: p.anak_ke || 1,
      jumlah_saudara_kandung: p.jumlah_saudara_kandung || 1,
      // 2. Alamat & Kontak
      provinsi: p.provinsi,
      kabupaten_kota: p.kabupaten_kota,
      kecamatan: p.kecamatan,
      desa_kelurahan: p.desa_kelurahan,
      alamat_lengkap: p.alamat_lengkap,
      rt: p.rt || '-',
      rw: p.rw || '-',
      dusun_kampung: p.dusun_kampung || '-',
      kode_pos: p.kode_pos || '-',
      status_tempat_tinggal: p.status_tempat_tinggal || '-',
      moda_transportasi: p.moda_transportasi || '-',
      jarak_ke_pkbm: p.jarak_ke_pkbm || '-',
      waktu_tempuh_menit: p.waktu_tempuh_menit || 0,
      nomor_hp: p.nomor_hp || '-',
      nomor_wa: p.nomor_wa,
      email: p.email,
      kontak_darurat_nama: p.kontak_darurat_nama || '-',
      kontak_darurat_nomor: p.kontak_darurat_nomor || '-',
      kontak_darurat_hubungan: p.kontak_darurat_hubungan || '-',
      // 3. Orang Tua & Wali
      ayah_nama: p.ayah_nama || '-',
      ayah_nik: p.ayah_nik || '-',
      ayah_tahun_lahir: p.ayah_tahun_lahir || 0,
      ayah_pendidikan: p.ayah_pendidikan || '-',
      ayah_pekerjaan: p.ayah_pekerjaan || '-',
      ayah_penghasilan: p.ayah_penghasilan || '-',
      ayah_status: p.ayah_status || '-',
      ibu_nama: p.ibu_nama,
      ibu_nik: p.ibu_nik || '-',
      ibu_tahun_lahir: p.ibu_tahun_lahir || 0,
      ibu_pendidikan: p.ibu_pendidikan || '-',
      ibu_pekerjaan: p.ibu_pekerjaan || '-',
      ibu_penghasilan: p.ibu_penghasilan || '-',
      ibu_status: p.ibu_status || '-',
      tinggal_bersama: p.tinggal_bersama || '-',
      wali_nama: p.wali_nama || '-',
      wali_nik: p.wali_nik || '-',
      wali_tahun_lahir: p.wali_tahun_lahir || 0,
      wali_pendidikan: p.wali_pendidikan || '-',
      wali_pekerjaan: p.wali_pekerjaan || '-',
      wali_penghasilan: p.wali_penghasilan || '-',
      wali_hubungan: p.wali_hubungan || '-',
      wali_telepon: p.wali_telepon || '-',
      // 4. Periodik & Kesejahteraan
      tinggi_badan_cm: p.tinggi_badan_cm || 0,
      berat_badan_kg: p.berat_badan_kg || 0,
      lingkar_kepala_cm: p.lingkar_kepala_cm || 0,
      punya_kip: p.punya_kip ? 'YA' : 'TIDAK',
      nomor_kip: p.nomor_kip || '-',
      punya_pkh: p.punya_pkh ? 'YA' : 'TIDAK',
      nomor_pkh: p.nomor_pkh || '-',
      punya_kks: p.punya_kks ? 'YA' : 'TIDAK',
      nomor_kks: p.nomor_kks || '-',
      // 5. Pendidikan Asal
      sekolah_asal: p.sekolah_asal,
      npsn_sekolah_asal: p.npsn_sekolah_asal || '-',
      nomor_peserta_ujian: p.nomor_peserta_ujian || '-',
      nomor_seri_ijazah: p.nomor_seri_ijazah || '-',
      tahun_lulus: p.tahun_lulus || 0,
      status_pendidikan_terakhir: p.status_pendidikan_terakhir || '-',
      surat_pindah_nomor: p.surat_pindah_nomor || '-',
      surat_pindah_tanggal: p.surat_pindah_tanggal || '-',
      // 6. Dokumen & Status
      dokumen_json: JSON.stringify(p.dokumen || []),
      pas_foto_url: p.pas_foto_url || '',
      catatan_operator: p.catatan_operator || '-',
      diverifikasi_oleh: p.diverifikasi_oleh || '-',
      diverifikasi_pada: p.diverifikasi_pada || '-',
      created_at: p.created_at || new Date().toISOString(),
      updated_at: p.updated_at || new Date().toISOString()
    });
  }

  // Alias for compatibility
  async syncPPDBToGoogleSheets(p: PendaftaranWargaBelajar): Promise<SyncResponse> {
    return this.syncPendaftaranPPDB(p);
  }

  async syncAllPPDB(list: PendaftaranWargaBelajar[]): Promise<SyncResponse> {
    return this.sendToGas('master_bulk_sync', {
      pendaftaran: list
    });
  }

  // ==========================================
  // 3. SINKRONISASI E-MODUL MATERI
  // ==========================================
  async syncMateri(materi: Materi, action: 'add' | 'update' | 'delete' = 'update'): Promise<SyncResponse> {
    return this.sendToGas('sync_materi', {
      operation: action,
      id: materi.id,
      judul: materi.judul,
      deskripsi: materi.deskripsi,
      paket: materi.paket,
      mata_pelajaran: materi.mata_pelajaran,
      kategori: materi.kategori,
      tingkat: (materi as any).tingkat || materi.tingkatan || '-',
      nama_file: materi.nama_file,
      file_id: materi.file_id || '-',
      drive_url: materi.drive_url,
      preview_url: materi.preview_url || materi.drive_url,
      ukuran_file: materi.ukuran_file,
      tahun: materi.tahun,
      sumber_url: materi.sumber_url || '-',
      urutan: materi.urutan || 1,
      status: materi.status || 'PUBLISHED',
      tujuan_pembelajaran_json: JSON.stringify((materi as any).tujuan_pembelajaran || []),
      created_at: materi.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }

  async syncAllMateri(list: Materi[]): Promise<SyncResponse> {
    return this.sendToGas('master_bulk_sync', {
      materi: list
    });
  }

  // ==========================================
  // 4. SINKRONISASI TUGAS & PENGUMPULAN
  // ==========================================
  async syncTugas(tugas: Tugas, action: 'add' | 'update' | 'delete' = 'update'): Promise<SyncResponse> {
    return this.sendToGas('sync_tugas', {
      operation: action,
      id: tugas.id,
      judul: tugas.judul,
      deskripsi: tugas.deskripsi,
      deskripsi_petunjuk: tugas.deskripsi_petunjuk || '-',
      kelas: tugas.kelas || '-',
      paket: tugas.paket,
      mata_pelajaran: tugas.mata_pelajaran,
      materi_terkait_id: tugas.materi_terkait_id || '-',
      materi_terkait_judul: tugas.materi_terkait_judul || '-',
      tutor_id: tugas.tutor_id,
      tutor_nama: tugas.tutor_nama,
      batas_pengumpulan: tugas.batas_pengumpulan,
      nilai_maksimal: tugas.nilai_maksimal || 100,
      bobot_nilai: tugas.bobot_nilai || 100,
      file_lampiran_nama: tugas.file_lampiran_nama || '-',
      file_lampiran_url: tugas.file_lampiran_url || '-',
      status: tugas.status || 'PUBLISHED',
      created_at: tugas.created_at
    });
  }

  async syncPengumpulanTugas(sub: PengumpulanTugas): Promise<SyncResponse> {
    return this.sendToGas('save_pengumpulan_tugas', {
      id: sub.id,
      tugas_id: sub.tugas_id,
      user_id: sub.user_id,
      siswa_nama: sub.siswa_nama,
      siswa_paket: sub.siswa_paket,
      waktu_pengumpulan: sub.waktu_pengumpulan,
      teks_jawaban: sub.teks_jawaban || '-',
      file_nama: sub.file_nama || '-',
      file_url: sub.file_url || '-',
      file_tipe: sub.file_tipe || '-',
      file_ukuran: sub.file_ukuran || '-',
      status: sub.status,
      nilai: sub.nilai !== undefined ? sub.nilai : '-',
      feedback_tutor: sub.feedback_tutor || '-',
      dinilai_oleh: sub.dinilai_oleh || '-',
      dinilai_pada: sub.dinilai_pada || '-'
    });
  }

  async syncTugasDanUjianToGoogleSheets(type: 'tugas' | 'pengumpulan_tugas' | 'ulangan' | 'ujian_attempts', items: any[]): Promise<SyncResponse> {
    if (type === 'pengumpulan_tugas') {
      if (items.length === 1) {
        return this.syncPengumpulanTugas(items[0]);
      }
      return this.sendToGas('master_bulk_sync', { pengumpulan_tugas: items });
    } else if (type === 'tugas') {
      if (items.length === 1) {
        return this.syncTugas(items[0], 'update');
      }
      return this.sendToGas('master_bulk_sync', { tugas: items });
    } else if (type === 'ulangan') {
      if (items.length === 1) {
        return this.syncUlangan(items[0], 'update');
      }
      return this.sendToGas('master_bulk_sync', { ulangan: items });
    } else if (type === 'ujian_attempts') {
      if (items.length === 1) {
        return this.syncUjianAttempt(items[0]);
      }
      return this.sendToGas('master_bulk_sync', { ujian_attempts: items });
    }
    return { success: true, message: 'Data synced' };
  }

  // ==========================================
  // 5. SINKRONISASI ULANGAN & UJIAN
  // ==========================================
  async syncUlangan(ulangan: Ulangan, action: 'add' | 'update' | 'delete' = 'update'): Promise<SyncResponse> {
    return this.sendToGas('sync_ulangan', {
      operation: action,
      id: ulangan.id,
      judul: ulangan.judul,
      deskripsi: ulangan.deskripsi,
      petunjuk: ulangan.petunjuk || '-',
      mata_pelajaran: ulangan.mata_pelajaran,
      paket: ulangan.paket,
      kelas: ulangan.kelas || '-',
      tutor_id: ulangan.tutor_id,
      tutor_nama: ulangan.tutor_nama,
      durasi_menit: ulangan.durasi_menit,
      nilai_maksimal: ulangan.nilai_maksimal || 100,
      kkm: ulangan.kkm,
      batas_percobaan: ulangan.batas_percobaan || 1,
      status: ulangan.status || 'PUBLISHED',
      jumlah_soal: ulangan.daftar_soal ? ulangan.daftar_soal.length : 0,
      daftar_soal_json: JSON.stringify(ulangan.daftar_soal || []),
      created_at: ulangan.created_at
    });
  }

  async syncUjianAttempt(attempt: UjianAttempt): Promise<SyncResponse> {
    return this.sendToGas('save_ujian_attempt', {
      id: attempt.id,
      ulangan_id: attempt.ulangan_id,
      ulangan_judul: attempt.ulangan_judul,
      user_id: attempt.user_id,
      siswa_nama: attempt.siswa_nama,
      siswa_paket: attempt.siswa_paket,
      mulai_pada: attempt.mulai_pada,
      selesai_pada: attempt.selesai_pada || '-',
      status: attempt.status,
      nilai_otomatis: attempt.nilai_otomatis || 0,
      nilai_uraian: attempt.nilai_uraian || 0,
      nilai_total: attempt.nilai_total || 0,
      dinilai: attempt.dinilai,
      feedback_tutor: attempt.feedback_tutor || '-',
      jawaban_json: JSON.stringify(attempt.jawaban || {}),
      catatan_per_soal_json: JSON.stringify(attempt.catatan_per_soal || {})
    });
  }

  // ==========================================
  // 6. SINKRONISASI PENGGUNA (USERS)
  // ==========================================
  async syncUser(user: User, action: 'add' | 'update' | 'delete' = 'update'): Promise<SyncResponse> {
    return this.sendToGas('sync_user', {
      operation: action,
      id: user.id,
      username: user.username,
      password: user.password || 'password123',
      nama: user.nama,
      email: user.email || '-',
      telepon: user.telepon || '-',
      role: user.role,
      paket: user.paket || '-',
      kelas: user.kelas || '-',
      nisn: user.nisn || '-',
      nik: user.nik || '-',
      status: user.status,
      foto: user.foto || '',
      mata_pelajaran: user.mata_pelajaran || '-',
      mapel_paket_b: JSON.stringify(user.mapel_paket_b || []),
      mapel_paket_c: JSON.stringify(user.mapel_paket_c || []),
      no_sk: user.no_sk || '-',
      pendidikan: user.pendidikan || '-',
      nipd: user.nipd || '-',
      jenis_kelamin: user.jenis_kelamin || '-',
      tempat_lahir: user.tempat_lahir || '-',
      tanggal_lahir: user.tanggal_lahir || '-',
      agama: user.agama || '-',
      alamat: user.alamat || '-',
      rt: user.rt || '-',
      rw: user.rw || '-',
      dusun: user.dusun || '-',
      kelurahan: user.kelurahan || '-',
      kecamatan: user.kecamatan || '-',
      kode_pos: user.kode_pos || '-',
      rombel: user.rombel || '-',
      created_at: user.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }

  async syncAllUsers(users: User[]): Promise<SyncResponse> {
    return this.sendToGas('master_bulk_sync', {
      users
    });
  }

  // ==========================================
  // 7. SINKRONISASI TATAP MUKA & WEBINAR
  // ==========================================
  async syncTatapMuka(tm: TatapMuka, action: 'add' | 'update' | 'delete' = 'update'): Promise<SyncResponse> {
    return this.sendToGas('sync_tatap_muka', {
      operation: action,
      id: tm.id,
      judul: tm.judul,
      deskripsi: tm.deskripsi || '-',
      mata_pelajaran: tm.mata_pelajaran,
      kelas: tm.kelas,
      paket: tm.paket,
      tutor_id: tm.tutor_id,
      tutor_nama: tm.tutor_nama,
      tanggal: tm.tanggal,
      jam_mulai: tm.jam_mulai,
      jam_selesai: tm.jam_selesai,
      link_meet: tm.link_meet || '-',
      materi_id: tm.materi_id || '-',
      materi_judul: tm.materi_judul || '-',
      status: tm.status,
      created_at: tm.created_at
    });
  }

  // ==========================================
  // 8. SINKRONISASI PROGRES BACA MODUL
  // ==========================================
  async syncReadingProgress(progress: ReadingProgress): Promise<SyncResponse> {
    return this.sendToGas('save_reading_progress', {
      id: `${progress.user_id}_${progress.materi_id}`,
      user_id: progress.user_id,
      materi_id: progress.materi_id,
      last_page: progress.last_page,
      total_pages: progress.total_pages,
      progress_percent: progress.progress_percent,
      last_read_at: progress.last_read_at,
      completed: progress.completed ? 'YA' : 'TIDAK'
    });
  }

  // ==========================================
  // 9. SINKRONISASI PENGATURAN WEBSITE
  // ==========================================
  async syncSettings(settings: WebsiteSetting): Promise<SyncResponse> {
    return this.sendToGas('save_settings', settings);
  }

  // ==========================================
  // 10. GOOGLE DRIVE FILE UPLOADER ENGINE
  // ==========================================
  async uploadFileToDrive(
    fileBase64: string,
    fileName: string,
    mimeType: string = 'application/pdf',
    folderName: string = 'PKBM_DOKUMEN_LMS'
  ): Promise<{ success: boolean; message: string; fileUrl?: string; fileId?: string }> {
    const config = storage.getGasConfig();
    if (!config.webAppUrl) {
      return {
        success: false,
        message: 'URL Google Apps Script belum dikonfigurasi. Konfigurasikan URL di menu Pengaturan.'
      };
    }

    try {
      const response = await this.sendToGas('upload_file_to_drive', {
        fileName,
        mimeType,
        folderName,
        fileBase64,
        parentFolderId: config.driveFolderId || '1JWAMU6COy1S8seU2fInEYLPgTf_mH4AX'
      });

      if (response.success) {
        return {
          success: true,
          message: response.message || 'File berhasil diunggah ke Google Drive.',
          fileUrl: (response as any).fileUrl || (response as any).url || `https://drive.google.com/uc?id=${response.rowId || 'saved'}`,
          fileId: response.rowId
        };
      } else {
        return {
          success: false,
          message: response.message || 'Gagal mengunggah file ke Google Drive.'
        };
      }
    } catch (err: any) {
      return {
        success: false,
        message: `Terjadi kendala unggah Google Drive: ${err.message}`
      };
    }
  }

  // ==========================================
  // 11. MASTER BULK SYNC: PUSH SELURUH DATABASE
  // ==========================================
  async pushAllToGoogleSheets(): Promise<SyncResponse> {
    this.notifyStatus('SYNCING', 'Mengirim seluruh data aplikasi ke Google Sheets...');
    const data = {
      users: storage.getUsers(),
      materi: storage.getMateri(),
      quiz_attempts: storage.getModulQuizAttempts(),
      pendaftaran: storage.getPendaftaran(),
      tugas: storage.getTugas(),
      pengumpulan_tugas: storage.getPengumpulanTugas(),
      ulangan: storage.getUlangan(),
      ujian_attempts: storage.getUjianAttempts(),
      tatap_muka: storage.getTatapMuka(),
      activities: storage.getActivities(100),
      settings: storage.getSettings()
    };

    const res = await this.sendToGas('master_bulk_sync', data);
    if (res.success) {
      this.notifyStatus('SUCCESS', 'Seluruh data berhasil disinkronkan ke Google Sheets.');
    } else {
      this.notifyStatus('ERROR', res.message || 'Gagal mengirim data ke Google Sheets.');
    }
    return res;
  }

  // ==========================================
  // 12. MASTER BULK SYNC: PULL SELURUH DATABASE
  // ==========================================
  async pullAllFromGoogleSheets(): Promise<{ success: boolean; message: string; count?: number }> {
    const config = storage.getGasConfig();
    if (!config.webAppUrl) {
      this.notifyStatus('ERROR', 'Web App URL Google Apps Script belum dikonfigurasi.');
      return { success: false, message: 'Web App URL Google Apps Script belum dikonfigurasi di Pengaturan.' };
    }

    this.notifyStatus('SYNCING', 'Menarik seluruh data terbaru dari Google Sheets...');

    try {
      const response = await fetch(`${config.webAppUrl}?action=get_all_data&spreadsheetId=${config.spreadsheetId}`);
      if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
      const result = await response.json();

      if (result.success && result.data) {
        let totalCount = 0;
        if (result.data.users && Array.isArray(result.data.users) && result.data.users.length > 0) {
          localStorage.setItem('pkbm_users_v4', JSON.stringify(result.data.users));
          totalCount += result.data.users.length;
        }
        if (result.data.materi && Array.isArray(result.data.materi) && result.data.materi.length > 0) {
          localStorage.setItem('pkbm_materi_v2', JSON.stringify(result.data.materi));
          totalCount += result.data.materi.length;
        }
        if (result.data.quiz_attempts && Array.isArray(result.data.quiz_attempts)) {
          localStorage.setItem('pkbm_modul_quiz_attempts_2026', JSON.stringify(result.data.quiz_attempts));
          totalCount += result.data.quiz_attempts.length;
        }
        if (result.data.pendaftaran && Array.isArray(result.data.pendaftaran)) {
          localStorage.setItem('pkbm_pendaftaran_2026', JSON.stringify(result.data.pendaftaran));
          totalCount += result.data.pendaftaran.length;
        }
        if (result.data.tugas && Array.isArray(result.data.tugas)) {
          localStorage.setItem('pkbm_tugas_2026', JSON.stringify(result.data.tugas));
          totalCount += result.data.tugas.length;
        }
        if (result.data.pengumpulan_tugas && Array.isArray(result.data.pengumpulan_tugas)) {
          localStorage.setItem('pkbm_pengumpulan_tugas_2026', JSON.stringify(result.data.pengumpulan_tugas));
          totalCount += result.data.pengumpulan_tugas.length;
        }
        if (result.data.ulangan && Array.isArray(result.data.ulangan)) {
          localStorage.setItem('pkbm_ulangan_2026', JSON.stringify(result.data.ulangan));
          totalCount += result.data.ulangan.length;
        }
        if (result.data.ujian_attempts && Array.isArray(result.data.ujian_attempts)) {
          localStorage.setItem('pkbm_ujian_attempts_2026', JSON.stringify(result.data.ujian_attempts));
          totalCount += result.data.ujian_attempts.length;
        }
        if (result.data.tatap_muka && Array.isArray(result.data.tatap_muka)) {
          localStorage.setItem('pkbm_tatap_muka_2026', JSON.stringify(result.data.tatap_muka));
          totalCount += result.data.tatap_muka.length;
        }
        if (result.data.settings && typeof result.data.settings === 'object') {
          localStorage.setItem('pkbm_settings_v2', JSON.stringify(result.data.settings));
        }

        // Emit global refresh event
        window.dispatchEvent(new CustomEvent('pkbm_data_synced', { detail: { count: totalCount } }));

        const successMsg = `Sinkronisasi berhasil! ${totalCount} data terbaru berhasil ditarik dari Google Sheets ke dalam aplikasi.`;
        this.notifyStatus('SUCCESS', successMsg);

        return {
          success: true,
          message: successMsg,
          count: totalCount
        };
      } else {
        const failMsg = result.message || 'Gagal mengambil data dari Google Sheets.';
        this.notifyStatus('ERROR', failMsg);
        return { success: false, message: failMsg };
      }
    } catch (e: any) {
      const errDetail = `Gagal membaca Google Sheets: ${e.message}`;
      this.notifyStatus('ERROR', errDetail);
      return { success: false, message: errDetail };
    }
  }

  // ==========================================
  // 13. SYNC STATUS OBSERVER
  // ==========================================
  private statusListeners: Array<(status: 'IDLE' | 'SYNCING' | 'SUCCESS' | 'ERROR', message?: string) => void> = [];

  public subscribeStatus(listener: (status: 'IDLE' | 'SYNCING' | 'SUCCESS' | 'ERROR', message?: string) => void): () => void {
    this.statusListeners.push(listener);
    return () => {
      this.statusListeners = this.statusListeners.filter(l => l !== listener);
    };
  }

  private notifyStatus(status: 'IDLE' | 'SYNCING' | 'SUCCESS' | 'ERROR', message?: string) {
    this.statusListeners.forEach(l => {
      try {
        l(status, message);
      } catch (err) {
        console.error(err);
      }
    });
  }

  // ==========================================
  // 12. PING / TEST CONNECTION
  // ==========================================
  async testConnection(url?: string): Promise<{ success: boolean; message: string; latency?: number }> {
    const config = storage.getGasConfig();
    const targetUrl = url || config.webAppUrl;
    if (!targetUrl) {
      return { success: false, message: 'URL Web App belum diisi.' };
    }

    const t0 = performance.now();
    try {
      const resp = await fetch(`${targetUrl}?action=ping`, { method: 'GET' });
      const t1 = performance.now();
      const latency = Math.round(t1 - t0);

      if (!resp.ok) {
        return { success: false, message: `HTTP Error ${resp.status}: ${resp.statusText}`, latency };
      }
      const data = await resp.json();
      if (data.success) {
        return {
          success: true,
          message: `Koneksi Terhubung! Respons GAS diterima dalam ${latency} ms (${data.message || 'Live'}).`,
          latency
        };
      }
      return { success: false, message: data.message || 'Respons server tidak valid.', latency };
    } catch (err: any) {
      return {
        success: false,
        message: `Gagal menghubungkan ke Google Apps Script: ${err.message || 'Cek CORS atau izin deployment "Anyone".'}`
      };
    }
  }
}

export const googleSheetsSync = new GoogleSheetsSyncService();
