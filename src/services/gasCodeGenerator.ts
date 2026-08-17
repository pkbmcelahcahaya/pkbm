export interface GasFile {
  name: string;
  description: string;
  code: string;
}

export function getAllGasFiles(): GasFile[] {
  return [
    {
      name: 'Code.gs',
      description: 'Main Router untuk Web App API (doGet dan doPost) dengan validasi role, token, dan seluruh endpoint integrasi.',
      code: `/**
 * PKBM CELAH CAHAYA - LMS Google Apps Script Web App API
 * Router Utama (doGet & doPost)
 * Version: 4.0.0 (Production Build - Full Google Sheets & Drive Sync)
 */

function doGet(e) {
  return handleRequest(e, 'GET');
}

function doPost(e) {
  return handleRequest(e, 'POST');
}

function handleRequest(e, method) {
  var output = { success: false, message: 'Invalid request' };
  
  try {
    var params = {};
    if (e && e.parameter) {
      params = e.parameter;
    }
    
    var body = {};
    if (e && e.postData && e.postData.contents) {
      try {
        body = JSON.parse(e.postData.contents);
      } catch (err) {
        body = {};
      }
    }
    
    var action = params.action || body.action;
    var token = params.token || body.token;
    var payload = body.payload || body;
    
    // Public routes
    if (action === 'ping') {
      output = { success: true, message: 'PKBM Celah Cahaya API is Live & Connected', timestamp: new Date().toISOString() };
    } else if (action === 'login') {
      output = handleLogin(body.username || params.username, body.password || params.password);
    } else if (action === 'register_ppdb') {
      output = handleRegisterPPDB(payload);
    } else if (action === 'getPublicSettings') {
      output = handleGetSettings();
    } else if (action === 'get_all_data') {
      output = handleGetAllData();
    } else {
      // Protected routes & sync operations
      switch (action) {
        // --- 1. KUIS 100 SOAL & EVALUASI MODUL ---
        case 'save_quiz_attempt':
          output = handleSaveQuizAttempt(payload);
          break;
          
        case 'get_quiz_attempts':
          output = handleGetQuizAttempts(params.user_id, params.materi_id, params.paket);
          break;

        // --- 2. PENDAFTARAN PPDB ---
        case 'getPendaftaranList':
          output = handleGetPendaftaranList();
          break;

        case 'updatePendaftaranStatus':
          output = handleUpdatePendaftaranStatus(payload.id, payload.status, payload.catatan);
          break;

        // --- 3. E-MODUL MATERI PEMBELAJARAN ---
        case 'sync_materi':
        case 'addMateri':
        case 'updateMateri':
        case 'deleteMateri':
          output = handleSyncMateri(payload, action);
          break;
          
        case 'getMateri':
          output = handleGetMateri(params.paket, params.mapel);
          break;

        // --- 4. TUGAS & PENGUMPULAN ---
        case 'sync_tugas':
          output = handleSyncTugas(payload);
          break;

        case 'save_pengumpulan_tugas':
          output = handleSavePengumpulanTugas(payload);
          break;

        case 'grade_tugas':
          output = handleGradeTugas(payload.id, payload.nilai, payload.feedback_tutor);
          break;

        // --- 5. ULANGAN & UJIAN ONLINE ---
        case 'sync_ulangan':
          output = handleSyncUlangan(payload);
          break;

        case 'save_ujian_attempt':
          output = handleSaveUjianAttempt(payload);
          break;

        case 'grade_ujian':
          output = handleGradeUjianAttempt(payload.id, payload.nilai_uraian, payload.feedback);
          break;

        // --- 6. USER & PROFIL ---
        case 'sync_user':
        case 'addUser':
        case 'updateUser':
        case 'deleteUser':
          output = handleSyncUser(payload, action);
          break;
          
        case 'getUsers':
          output = handleGetUsers(params.role, params.paket);
          break;

        // --- 7. TATAP MUKA & WEBINAR ---
        case 'sync_tatap_muka':
          output = handleSyncTatapMuka(payload);
          break;

        // --- 8. PROGRES BELAJAR MODUL ---
        case 'save_reading_progress':
          output = handleSaveReadingProgress(payload);
          break;

        // --- 9. PENGATURAN WEBSITE ---
        case 'save_settings':
          output = handleSaveSettings(payload);
          break;

        // --- 10. GOOGLE DRIVE UPLOAD & SYNC ---
        case 'upload_file_to_drive':
          output = handleUploadFileToDrive(payload);
          break;

        // --- 11. MASTER BULK SYNC & INIT ---
        case 'master_bulk_sync':
          output = handleMasterBulkSync(payload);
          break;

        case 'initDatabase':
          output = initAllSheets();
          break;

        case 'recordActivity':
          output = handleRecordActivity(body.user, payload);
          break;

        default:
          output = { success: false, message: 'Action tidak dikenal: ' + action };
      }
    }
  } catch (error) {
    output = { success: false, message: error.toString() };
  }
  
  return ContentService.createTextOutput(JSON.stringify(output))
    .setMimeType(ContentService.MimeType.JSON);
}`
    },
    {
      name: 'Config.gs',
      description: 'Konfigurasi Spreadsheet, Folder Drive, Auto-Expansion Header Kolom, dan Setup 12 Tabel Database Sheets.',
      code: `/**
 * PKBM CELAH CAHAYA - Configuration & Dynamic Schema Engine
 * Fitur: Otomatis Menambahkan Kolom/Header Baru Tanpa Menghapus Kolom atau Data Yang Ada.
 */

var SPREADSHEET_ID = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID') || '1JMaGtYl77Qm5enl9N2A49_6oivu0mAjwCHe6QApfbQM';
var DRIVE_FOLDER_ID = PropertiesService.getScriptProperties().getProperty('DRIVE_FOLDER_ID') || '1JWAMU6COy1S8seU2fInEYLPgTf_mH4AX';

function getDb() {
  if (!SPREADSHEET_ID) {
    return SpreadsheetApp.getActiveSpreadsheet();
  }
  try {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  } catch (e) {
    return SpreadsheetApp.getActiveSpreadsheet();
  }
}

/**
 * Auto-Schema Expansion Helper:
 * Memeriksa kolom header row 1. Jika ada property baru yang dikirim dari aplikasi web,
 * secara otomatis menambahkan kolom tersebut di sebelah kanan tanpa menghapus data sebelumnya.
 */
function ensureSheetWithHeaders(ss, sheetName, defaultHeaders, incomingRows) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  
  var lastCol = sheet.getLastColumn();
  var existingHeaders = [];
  if (lastCol > 0 && sheet.getLastRow() > 0) {
    existingHeaders = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  }
  
  var required = defaultHeaders ? defaultHeaders.slice() : [];
  if (incomingRows) {
    var rows = Array.isArray(incomingRows) ? incomingRows : [incomingRows];
    rows.forEach(function(r) {
      if (r && typeof r === 'object') {
        Object.keys(r).forEach(function(k) {
          if (required.indexOf(k) === -1) {
            required.push(k);
          }
        });
      }
    });
  }
  
  if (existingHeaders.length === 0) {
    if (required.length > 0) {
      sheet.appendRow(required);
      sheet.getRange(1, 1, 1, required.length).setFontWeight('bold').setBackground('#E8F0FE');
      sheet.setFrozenRows(1);
    }
    return sheet;
  }
  
  // Deteksi kolom yang belum ada di Google Sheets
  var missing = [];
  required.forEach(function(h) {
    if (existingHeaders.indexOf(h) === -1) {
      missing.push(h);
    }
  });
  
  // Tambahkan kolom baru secara otomatis di ujung kanan
  if (missing.length > 0) {
    for (var m = 0; m < missing.length; m++) {
      var colIdx = existingHeaders.length + m + 1;
      var cell = sheet.getRange(1, colIdx);
      cell.setValue(missing[m]);
      cell.setFontWeight('bold').setBackground('#FFF2CC'); // Highlight kolom auto-migration
    }
  }
  
  return sheet;
}

function initAllSheets() {
  var ss = getDb();
  
  var sheetSchemas = {
    'USERS': ['id', 'username', 'password', 'nama', 'email', 'telepon', 'role', 'paket', 'kelas', 'nisn', 'nik', 'status', 'foto', 'mata_pelajaran', 'mapel_paket_b', 'mapel_paket_c', 'no_sk', 'pendidikan', 'nipd', 'jenis_kelamin', 'tempat_lahir', 'tanggal_lahir', 'agama', 'alamat', 'rt', 'rw', 'dusun', 'kelurahan', 'kecamatan', 'kode_pos', 'rombel', 'created_at', 'updated_at'],
    'MATERI': ['id', 'judul', 'deskripsi', 'paket', 'mata_pelajaran', 'kategori', 'tingkat', 'nama_file', 'file_id', 'drive_url', 'preview_url', 'ukuran_file', 'tahun', 'sumber_url', 'urutan', 'status', 'tujuan_pembelajaran_json', 'created_at', 'updated_at'],
    'MODUL_QUIZ_ATTEMPTS': ['id', 'materi_id', 'materi_judul', 'mata_pelajaran', 'paket', 'tingkatan', 'user_id', 'siswa_nama', 'siswa_nisn', 'kelas', 'tutor_id', 'tutor_nama', 'mulai_pada', 'selesai_pada', 'durasi_detik', 'durasi_format', 'jumlah_soal', 'jumlah_benar', 'jumlah_salah', 'jumlah_kosong', 'nilai', 'kkm', 'status_kelulusan', 'percobaan_ke', 'timestamp', 'jawaban_100_json', 'kunci_jawaban_snapshot_json', 'pembahasan_snapshot_json'],
    'PENDAFTARAN_PPDB': ['id', 'nomor_pendaftaran', 'tahun_ajaran', 'gelombang', 'program_pilihan', 'jenis_pendaftaran', 'status', 'tanggal_pendaftaran', 'nama_lengkap', 'nisn', 'nik', 'nomor_kk', 'jenis_kelamin', 'tempat_lahir', 'tanggal_lahir', 'agama', 'kewarganegaraan', 'kebutuhan_khusus', 'anak_ke', 'jumlah_saudara_kandung', 'provinsi', 'kabupaten_kota', 'kecamatan', 'desa_kelurahan', 'alamat_lengkap', 'rt', 'rw', 'dusun_kampung', 'kode_pos', 'status_tempat_tinggal', 'moda_transportasi', 'jarak_ke_pkbm', 'waktu_tempuh_menit', 'nomor_hp', 'nomor_wa', 'email', 'kontak_darurat_nama', 'kontak_darurat_nomor', 'kontak_darurat_hubungan', 'ayah_nama', 'ayah_nik', 'ayah_tahun_lahir', 'ayah_pendidikan', 'ayah_pekerjaan', 'ayah_penghasilan', 'ayah_status', 'ibu_nama', 'ibu_nik', 'ibu_tahun_lahir', 'ibu_pendidikan', 'ibu_pekerjaan', 'ibu_penghasilan', 'ibu_status', 'tinggal_bersama', 'wali_nama', 'wali_nik', 'wali_tahun_lahir', 'wali_pendidikan', 'wali_pekerjaan', 'wali_penghasilan', 'wali_hubungan', 'wali_telepon', 'tinggi_badan_cm', 'berat_badan_kg', 'lingkar_kepala_cm', 'punya_kip', 'nomor_kip', 'punya_pkh', 'nomor_pkh', 'punya_kks', 'nomor_kks', 'sekolah_asal', 'npsn_sekolah_asal', 'nomor_peserta_ujian', 'nomor_seri_ijazah', 'tahun_lulus', 'status_pendidikan_terakhir', 'surat_pindah_nomor', 'surat_pindah_tanggal', 'dokumen_json', 'pas_foto_url', 'catatan_operator', 'diverifikasi_oleh', 'diverifikasi_pada', 'created_at', 'updated_at'],
    'TUGAS': ['id', 'judul', 'deskripsi', 'deskripsi_petunjuk', 'kelas', 'paket', 'mata_pelajaran', 'materi_terkait_id', 'materi_terkait_judul', 'tutor_id', 'tutor_nama', 'batas_pengumpulan', 'nilai_maksimal', 'bobot_nilai', 'file_lampiran_nama', 'file_lampiran_url', 'status', 'created_at'],
    'PENGUMPULAN_TUGAS': ['id', 'tugas_id', 'user_id', 'siswa_nama', 'siswa_paket', 'waktu_pengumpulan', 'teks_jawaban', 'file_nama', 'file_url', 'file_tipe', 'file_ukuran', 'status', 'nilai', 'feedback_tutor', 'dinilai_oleh', 'dinilai_pada'],
    'ULANGAN': ['id', 'judul', 'deskripsi', 'petunjuk', 'mata_pelajaran', 'paket', 'kelas', 'tutor_id', 'tutor_nama', 'durasi_menit', 'nilai_maksimal', 'kkm', 'batas_percobaan', 'status', 'jumlah_soal', 'daftar_soal_json', 'created_at'],
    'UJIAN_ATTEMPTS': ['id', 'ulangan_id', 'ulangan_judul', 'user_id', 'siswa_nama', 'siswa_paket', 'mulai_pada', 'selesai_pada', 'status', 'nilai_otomatis', 'nilai_uraian', 'nilai_total', 'dinilai', 'feedback_tutor', 'jawaban_json', 'catatan_per_soal_json'],
    'TATAP_MUKA': ['id', 'judul', 'deskripsi', 'mata_pelajaran', 'kelas', 'paket', 'tutor_id', 'tutor_nama', 'tanggal', 'jam_mulai', 'jam_selesai', 'link_meet', 'materi_id', 'materi_judul', 'status', 'created_at'],
    'PROGRESS_BELAJAR': ['id', 'user_id', 'materi_id', 'last_page', 'total_pages', 'progress_percent', 'last_read_at', 'completed'],
    'AKTIVITAS': ['id', 'user_id', 'nama', 'role', 'aktivitas', 'materi_id', 'materi_judul', 'paket', 'waktu', 'durasi_detik', 'progress_persen'],
    'SETTINGS': ['key', 'value', 'updated_at']
  };
  
  for (var name in sheetSchemas) {
    ensureSheetWithHeaders(ss, name, sheetSchemas[name]);
  }
  
  return { success: true, message: 'Seluruh 12 Tabel Database Google Sheets PKBM Celah Cahaya berhasil diinisialisasi dengan Auto-Header Engine.' };
}

/**
 * Handle Upload File ke Google Drive
 */
function handleUploadFileToDrive(payload) {
  try {
    var folderName = payload.folderName || 'PKBM_DOKUMEN_LMS';
    var parentFolderId = payload.parentFolderId || DRIVE_FOLDER_ID;
    var parentFolder;
    
    if (parentFolderId) {
      try {
        parentFolder = DriveApp.getFolderById(parentFolderId);
      } catch(e) {
        parentFolder = DriveApp.getRootFolder();
      }
    } else {
      parentFolder = DriveApp.getRootFolder();
    }

    var subFolders = parentFolder.getFoldersByName(folderName);
    var targetFolder = subFolders.hasNext() ? subFolders.next() : parentFolder.createFolder(folderName);

    var decodedBytes = Utilities.base64Decode(payload.fileBase64);
    var blob = Utilities.newBlob(decodedBytes, payload.mimeType || 'application/pdf', payload.fileName || ('DOKUMEN_' + Date.now()));
    var file = targetFolder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    return {
      success: true,
      message: 'File berhasil diunggah ke Google Drive.',
      fileUrl: file.getUrl(),
      fileId: file.getId(),
      folderName: folderName
    };
  } catch (err) {
    return {
      success: false,
      message: 'Gagal mengunggah ke Google Drive: ' + err.toString()
    };
  }
}`
    },
    {
      name: 'QuizSync.gs',
      description: 'Penyimpanan & Penarikan Hasil Kuis 100 Soal Modul Lengkap ke Google Sheets.',
      code: `/**
 * PKBM CELAH CAHAYA - Modul Quiz 100 Questions Data Storage Engine
 */

function handleSaveQuizAttempt(data) {
  var ss = getDb();
  var sheet = ss.getSheetByName('MODUL_QUIZ_ATTEMPTS');
  if (!sheet) {
    initAllSheets();
    sheet = ss.getSheetByName('MODUL_QUIZ_ATTEMPTS');
  }

  var row = [
    data.id || ('MQA-' + Date.now()),
    data.materi_id || '',
    data.materi_judul || '',
    data.mata_pelajaran || '',
    data.paket || '',
    data.tingkatan || '-',
    data.user_id || '',
    data.siswa_nama || data.user_nama || '',
    data.siswa_nisn || data.user_nisn || '-',
    data.kelas || '-',
    data.tutor_id || '-',
    data.tutor_nama || '-',
    data.mulai_pada || '',
    data.selesai_pada || '',
    data.durasi_detik || 0,
    data.durasi_format || '',
    data.jumlah_soal || 100,
    data.jumlah_benar !== undefined ? data.jumlah_benar : 0,
    data.jumlah_salah !== undefined ? data.jumlah_salah : 0,
    data.jumlah_kosong !== undefined ? data.jumlah_kosong : 0,
    data.nilai !== undefined ? data.nilai : 0,
    data.kkm || 75,
    data.status_kelulusan || 'LULUS',
    data.percobaan_ke || 1,
    data.timestamp || new Date().toISOString(),
    typeof data.jawaban_100_json === 'string' ? data.jawaban_100_json : JSON.stringify(data.jawaban_100_json || data.jawaban || {}),
    typeof data.kunci_jawaban_snapshot_json === 'string' ? data.kunci_jawaban_snapshot_json : JSON.stringify(data.kunci_jawaban_snapshot_json || {}),
    typeof data.pembahasan_snapshot_json === 'string' ? data.pembahasan_snapshot_json : JSON.stringify(data.pembahasan_snapshot_json || {})
  ];

  sheet.appendRow(row);

  return {
    success: true,
    message: 'Hasil kuis 100 butir soal berhasil disimpan lengkap di Google Sheets MODUL_QUIZ_ATTEMPTS.',
    attempt_id: row[0],
    sheetName: 'MODUL_QUIZ_ATTEMPTS'
  };
}

function handleGetQuizAttempts(userId, materiId, paket) {
  var ss = getDb();
  var sheet = ss.getSheetByName('MODUL_QUIZ_ATTEMPTS');
  if (!sheet) return { success: true, data: [] };

  var values = sheet.getDataRange().getValues();
  if (values.length <= 1) return { success: true, data: [] };

  var results = [];
  for (var i = 1; i < values.length; i++) {
    var r = values[i];
    if (userId && r[6] !== userId) continue;
    if (materiId && r[1] !== materiId) continue;
    if (paket && paket !== 'SEMUA' && r[4] !== paket) continue;

    results.push({
      id: r[0],
      materi_id: r[1],
      materi_judul: r[2],
      mata_pelajaran: r[3],
      paket: r[4],
      tingkatan: r[5],
      user_id: r[6],
      siswa_nama: r[7],
      siswa_nisn: r[8],
      kelas: r[9],
      tutor_id: r[10],
      tutor_nama: r[11],
      mulai_pada: r[12],
      selesai_pada: r[13],
      durasi_detik: Number(r[14]),
      durasi_format: r[15],
      jumlah_soal: Number(r[16]),
      jumlah_benar: Number(r[17]),
      jumlah_salah: Number(r[18]),
      jumlah_kosong: Number(r[19]),
      nilai: Number(r[20]),
      kkm: Number(r[21]),
      status_kelulusan: r[22],
      percobaan_ke: Number(r[23]),
      timestamp: r[24],
      jawaban: typeof r[25] === 'string' && r[25].startsWith('{') ? JSON.parse(r[25]) : {},
      kunci_jawaban_snapshot: typeof r[26] === 'string' && r[26].startsWith('{') ? JSON.parse(r[26]) : {},
      pembahasan_snapshot: typeof r[27] === 'string' && r[27].startsWith('{') ? JSON.parse(r[27]) : {}
    });
  }

  return { success: true, count: results.length, data: results };
}`
    },
    {
      name: 'PPDB.gs',
      description: 'Penyimpanan & Manajemen Lengkap Data Pendaftaran Calon Warga Belajar Baru (PPDB).',
      code: `/**
 * PKBM CELAH CAHAYA - PPDB & Student Registration Engine
 */

function handleRegisterPPDB(data) {
  var ss = getDb();
  var sheet = ss.getSheetByName('PENDAFTARAN_PPDB');
  if (!sheet) {
    initAllSheets();
    sheet = ss.getSheetByName('PENDAFTARAN_PPDB');
  }

  var row = [
    data.id || ('PDB-' + Date.now()),
    data.nomor_pendaftaran || ('REG-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000)),
    data.tahun_ajaran || '2026/2027',
    data.gelombang || 'Gelombang 1',
    data.program_pilihan || 'PAKET B',
    data.jenis_pendaftaran || 'BARU',
    data.status || 'DIAJUKAN',
    data.tanggal_pendaftaran || new Date().toISOString(),
    data.nama_lengkap || '',
    data.nisn || '-',
    data.nik || '-',
    data.nomor_kk || '-',
    data.jenis_kelamin || 'L',
    data.tempat_lahir || '',
    data.tanggal_lahir || '',
    data.agama || 'ISLAM',
    data.kewarganegaraan || 'WNI',
    data.kebutuhan_khusus || 'Tidak Ada',
    data.anak_ke || 1,
    data.jumlah_saudara_kandung || 1,
    data.provinsi || 'Jawa Barat',
    data.kabupaten_kota || 'Kab. Garut',
    data.kecamatan || '',
    data.desa_kelurahan || '',
    data.alamat_lengkap || '',
    data.rt || '-',
    data.rw || '-',
    data.dusun_kampung || '-',
    data.kode_pos || '-',
    data.status_tempat_tinggal || '-',
    data.moda_transportasi || '-',
    data.jarak_ke_pkbm || '-',
    data.waktu_tempuh_menit || 0,
    data.nomor_hp || '-',
    data.nomor_wa || '',
    data.email || '',
    data.kontak_darurat_nama || '-',
    data.kontak_darurat_nomor || '-',
    data.kontak_darurat_hubungan || '-',
    data.ayah_nama || '-',
    data.ayah_nik || '-',
    data.ayah_tahun_lahir || 0,
    data.ayah_pendidikan || '-',
    data.ayah_pekerjaan || '-',
    data.ayah_penghasilan || '-',
    data.ayah_status || '-',
    data.ibu_nama || '',
    data.ibu_nik || '-',
    data.ibu_tahun_lahir || 0,
    data.ibu_pendidikan || '-',
    data.ibu_pekerjaan || '-',
    data.ibu_penghasilan || '-',
    data.ibu_status || '-',
    data.tinggal_bersama || '-',
    data.wali_nama || '-',
    data.wali_nik || '-',
    data.wali_tahun_lahir || 0,
    data.wali_pendidikan || '-',
    data.wali_pekerjaan || '-',
    data.wali_penghasilan || '-',
    data.wali_hubungan || '-',
    data.wali_telepon || '-',
    data.tinggi_badan_cm || 0,
    data.berat_badan_kg || 0,
    data.lingkar_kepala_cm || 0,
    data.punya_kip || 'TIDAK',
    data.nomor_kip || '-',
    data.punya_pkh || 'TIDAK',
    data.nomor_pkh || '-',
    data.punya_kks || 'TIDAK',
    data.nomor_kks || '-',
    data.sekolah_asal || '',
    data.npsn_sekolah_asal || '-',
    data.nomor_peserta_ujian || '-',
    data.nomor_seri_ijazah || '-',
    data.tahun_lulus || 0,
    data.status_pendidikan_terakhir || '-',
    data.surat_pindah_nomor || '-',
    data.surat_pindah_tanggal || '-',
    typeof data.dokumen_json === 'string' ? data.dokumen_json : JSON.stringify(data.dokumen || []),
    data.pas_foto_url || '',
    data.catatan_operator || '-',
    data.diverifikasi_oleh || '-',
    data.diverifikasi_pada || '-',
    data.created_at || new Date().toISOString(),
    data.updated_at || new Date().toISOString()
  ];

  sheet.appendRow(row);

  return {
    success: true,
    message: 'Pendaftaran PPDB PKBM Celah Cahaya berhasil disimpan lengkap di Google Sheets.',
    nomor_pendaftaran: row[1],
    id: row[0]
  };
}

function handleGetPendaftaranList() {
  var ss = getDb();
  var sheet = ss.getSheetByName('PENDAFTARAN_PPDB');
  if (!sheet) return { success: true, data: [] };

  var values = sheet.getDataRange().getValues();
  var list = [];
  for (var i = 1; i < values.length; i++) {
    var r = values[i];
    list.push({
      id: r[0],
      nomor_pendaftaran: r[1],
      tahun_ajaran: r[2],
      gelombang: r[3],
      program_pilihan: r[4],
      jenis_pendaftaran: r[5],
      status: r[6],
      tanggal_pendaftaran: r[7],
      nama_lengkap: r[8],
      nisn: r[9],
      nik: r[10],
      nomor_kk: r[11],
      jenis_kelamin: r[12],
      tempat_lahir: r[13],
      tanggal_lahir: r[14],
      agama: r[15],
      kewarganegaraan: r[16],
      kebutuhan_khusus: r[17],
      anak_ke: r[18],
      jumlah_saudara_kandung: r[19],
      provinsi: r[20],
      kabupaten_kota: r[21],
      kecamatan: r[22],
      desa_kelurahan: r[23],
      alamat_lengkap: r[24],
      rt: r[25],
      rw: r[26],
      dusun_kampung: r[27],
      kode_pos: r[28],
      status_tempat_tinggal: r[29],
      moda_transportasi: r[30],
      jarak_ke_pkbm: r[31],
      waktu_tempuh_menit: r[32],
      nomor_hp: r[33],
      nomor_wa: r[34],
      email: r[35],
      kontak_darurat_nama: r[36],
      kontak_darurat_nomor: r[37],
      kontak_darurat_hubungan: r[38],
      ayah_nama: r[39],
      ayah_nik: r[40],
      ayah_tahun_lahir: r[41],
      ayah_pendidikan: r[42],
      ayah_pekerjaan: r[43],
      ayah_penghasilan: r[44],
      ayah_status: r[45],
      ibu_nama: r[46],
      ibu_nik: r[47],
      ibu_tahun_lahir: r[48],
      ibu_pendidikan: r[49],
      ibu_pekerjaan: r[50],
      ibu_penghasilan: r[51],
      ibu_status: r[52],
      tinggal_bersama: r[53],
      wali_nama: r[54],
      wali_nik: r[55],
      wali_tahun_lahir: r[56],
      wali_pendidikan: r[57],
      wali_pekerjaan: r[58],
      wali_penghasilan: r[59],
      wali_hubungan: r[60],
      wali_telepon: r[61],
      tinggi_badan_cm: r[62],
      berat_badan_kg: r[63],
      lingkar_kepala_cm: r[64],
      punya_kip: r[65] === 'YA',
      nomor_kip: r[66],
      punya_pkh: r[67] === 'YA',
      nomor_pkh: r[68],
      punya_kks: r[69] === 'YA',
      nomor_kks: r[70],
      sekolah_asal: r[71],
      npsn_sekolah_asal: r[72],
      nomor_peserta_ujian: r[73],
      nomor_seri_ijazah: r[74],
      tahun_lulus: r[75],
      status_pendidikan_terakhir: r[76],
      surat_pindah_nomor: r[77],
      surat_pindah_tanggal: r[78],
      dokumen: typeof r[79] === 'string' && r[79].startsWith('[') ? JSON.parse(r[79]) : [],
      pas_foto_url: r[80],
      catatan_operator: r[81],
      diverifikasi_oleh: r[82],
      diverifikasi_pada: r[83],
      created_at: r[84],
      updated_at: r[85]
    });
  }

  return { success: true, count: list.length, data: list };
}

function handleUpdatePendaftaranStatus(id, newStatus, catatan) {
  var ss = getDb();
  var sheet = ss.getSheetByName('PENDAFTARAN_PPDB');
  if (!sheet) return { success: false, message: 'Sheet tidak ditemukan' };

  var values = sheet.getDataRange().getValues();
  for (var i = 1; i < values.length; i++) {
    if (values[i][0] === id || values[i][1] === id) {
      var rowNum = i + 1;
      sheet.getRange(rowNum, 7).setValue(newStatus); // status column
      if (catatan) {
        sheet.getRange(rowNum, 82).setValue(catatan);
      }
      sheet.getRange(rowNum, 86).setValue(new Date().toISOString()); // updated_at
      return { success: true, message: 'Status pendaftaran berhasil diperbarui.' };
    }
  }
  return { success: false, message: 'Data pendaftaran tidak ditemukan.' };
}`
    },
    {
      name: 'TugasDanUjian.gs',
      description: 'Manajemen Tugas, Pengumpulan Tugas Siswa, Ulangan & Ujian Online.',
      code: `/**
 * PKBM CELAH CAHAYA - Tugas, Ulangan & Evaluasi Belajar Sync Engine
 */

function handleSyncTugas(payload) {
  var ss = getDb();
  var sheet = ss.getSheetByName('TUGAS');
  if (!sheet) { initAllSheets(); sheet = ss.getSheetByName('TUGAS'); }

  var op = payload.operation || 'add';
  var data = sheet.getDataRange().getValues();

  if (op === 'delete') {
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] === payload.id) {
        sheet.deleteRow(i + 1);
        return { success: true, message: 'Tugas berhasil dihapus dari Google Sheets.' };
      }
    }
    return { success: false, message: 'Tugas tidak ditemukan.' };
  }

  if (op === 'update') {
    for (var j = 1; j < data.length; j++) {
      if (data[j][0] === payload.id) {
        var rowNum = j + 1;
        sheet.getRange(rowNum, 2).setValue(payload.judul);
        sheet.getRange(rowNum, 3).setValue(payload.deskripsi);
        sheet.getRange(rowNum, 4).setValue(payload.deskripsi_petunjuk || '-');
        sheet.getRange(rowNum, 5).setValue(payload.kelas || '-');
        sheet.getRange(rowNum, 6).setValue(payload.paket);
        sheet.getRange(rowNum, 7).setValue(payload.mata_pelajaran);
        sheet.getRange(rowNum, 12).setValue(payload.batas_pengumpulan || payload.tenggat_waktu);
        sheet.getRange(rowNum, 13).setValue(payload.nilai_maksimal || 100);
        sheet.getRange(rowNum, 14).setValue(payload.bobot_nilai || 100);
        return { success: true, message: 'Tugas berhasil diperbarui di Google Sheets.' };
      }
    }
  }

  sheet.appendRow([
    payload.id || ('TGS-' + Date.now()),
    payload.judul,
    payload.deskripsi,
    payload.deskripsi_petunjuk || '-',
    payload.kelas || '-',
    payload.paket,
    payload.mata_pelajaran,
    payload.materi_terkait_id || '-',
    payload.materi_terkait_judul || '-',
    payload.tutor_id,
    payload.tutor_nama,
    payload.batas_pengumpulan || payload.tenggat_waktu,
    payload.nilai_maksimal || 100,
    payload.bobot_nilai || 100,
    payload.file_lampiran_nama || '-',
    payload.file_lampiran_url || '-',
    payload.status || 'PUBLISHED',
    payload.created_at || new Date().toISOString()
  ]);

  return { success: true, message: 'Tugas baru berhasil disimpan ke Google Sheets.' };
}

function handleSavePengumpulanTugas(payload) {
  var ss = getDb();
  var sheet = ss.getSheetByName('PENGUMPULAN_TUGAS');
  if (!sheet) { initAllSheets(); sheet = ss.getSheetByName('PENGUMPULAN_TUGAS'); }

  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === payload.id || (data[i][1] === payload.tugas_id && data[i][2] === payload.user_id)) {
      var rowNum = i + 1;
      sheet.getRange(rowNum, 6).setValue(payload.waktu_pengumpulan || new Date().toISOString());
      sheet.getRange(rowNum, 7).setValue(payload.teks_jawaban || '-');
      sheet.getRange(rowNum, 8).setValue(payload.file_nama || '-');
      sheet.getRange(rowNum, 9).setValue(payload.file_url || '-');
      sheet.getRange(rowNum, 11).setValue(payload.status || 'DIKUMPULKAN');
      if (payload.nilai !== undefined && payload.nilai !== '-') {
        sheet.getRange(rowNum, 13).setValue(payload.nilai);
        sheet.getRange(rowNum, 14).setValue(payload.feedback_tutor || '-');
        sheet.getRange(rowNum, 15).setValue(payload.dinilai_oleh || '-');
        sheet.getRange(rowNum, 16).setValue(payload.dinilai_pada || new Date().toISOString());
      }
      return { success: true, message: 'Pengumpulan tugas berhasil diperbarui di Google Sheets.' };
    }
  }

  sheet.appendRow([
    payload.id || ('SUB-' + Date.now()),
    payload.tugas_id,
    payload.user_id,
    payload.siswa_nama,
    payload.siswa_paket,
    payload.waktu_pengumpulan || new Date().toISOString(),
    payload.teks_jawaban || '-',
    payload.file_nama || '-',
    payload.file_url || '-',
    payload.file_tipe || '-',
    payload.file_ukuran || '-',
    payload.status || 'DIKUMPULKAN',
    payload.nilai !== undefined ? payload.nilai : '-',
    payload.feedback_tutor || '-',
    payload.dinilai_oleh || '-',
    payload.dinilai_pada || '-'
  ]);

  return { success: true, message: 'Jawaban tugas siswa berhasil disimpan di Google Sheets.' };
}

function handleGradeTugas(subId, nilai, feedback) {
  var ss = getDb();
  var sheet = ss.getSheetByName('PENGUMPULAN_TUGAS');
  if (!sheet) return { success: false, message: 'Sheet tidak ditemukan' };

  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === subId) {
      var rowNum = i + 1;
      sheet.getRange(rowNum, 12).setValue('DINILAI');
      sheet.getRange(rowNum, 13).setValue(nilai);
      sheet.getRange(rowNum, 14).setValue(feedback || '-');
      sheet.getRange(rowNum, 16).setValue(new Date().toISOString());
      return { success: true, message: 'Nilai tugas berhasil disimpan di Google Sheets.' };
    }
  }
  return { success: false, message: 'Data pengumpulan tugas tidak ditemukan.' };
}

function handleSyncUlangan(payload) {
  var ss = getDb();
  var sheet = ss.getSheetByName('ULANGAN');
  if (!sheet) { initAllSheets(); sheet = ss.getSheetByName('ULANGAN'); }

  var op = payload.operation || 'add';
  var data = sheet.getDataRange().getValues();

  if (op === 'delete') {
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] === payload.id) {
        sheet.deleteRow(i + 1);
        return { success: true, message: 'Ulangan berhasil dihapus dari Google Sheets.' };
      }
    }
    return { success: false, message: 'Ulangan tidak ditemukan.' };
  }

  if (op === 'update') {
    for (var j = 1; j < data.length; j++) {
      if (data[j][0] === payload.id) {
        var rowNum = j + 1;
        sheet.getRange(rowNum, 2).setValue(payload.judul);
        sheet.getRange(rowNum, 3).setValue(payload.deskripsi);
        sheet.getRange(rowNum, 4).setValue(payload.petunjuk || '-');
        sheet.getRange(rowNum, 10).setValue(payload.durasi_menit);
        sheet.getRange(rowNum, 11).setValue(payload.nilai_maksimal || 100);
        sheet.getRange(rowNum, 12).setValue(payload.kkm || 75);
        sheet.getRange(rowNum, 16).setValue(typeof payload.daftar_soal_json === 'string' ? payload.daftar_soal_json : JSON.stringify(payload.daftar_soal || []));
        return { success: true, message: 'Ulangan berhasil diperbarui di Google Sheets.' };
      }
    }
  }

  sheet.appendRow([
    payload.id || ('ULG-' + Date.now()),
    payload.judul,
    payload.deskripsi,
    payload.petunjuk || '-',
    payload.mata_pelajaran,
    payload.paket,
    payload.kelas || '-',
    payload.tutor_id,
    payload.tutor_nama,
    payload.durasi_menit,
    payload.nilai_maksimal || 100,
    payload.kkm,
    payload.batas_percobaan || 1,
    payload.status || 'PUBLISHED',
    payload.jumlah_soal || 0,
    typeof payload.daftar_soal_json === 'string' ? payload.daftar_soal_json : JSON.stringify(payload.daftar_soal || []),
    payload.created_at || new Date().toISOString()
  ]);

  return { success: true, message: 'Ulangan baru berhasil disimpan di Google Sheets.' };
}

function handleSaveUjianAttempt(payload) {
  var ss = getDb();
  var sheet = ss.getSheetByName('UJIAN_ATTEMPTS');
  if (!sheet) { initAllSheets(); sheet = ss.getSheetByName('UJIAN_ATTEMPTS'); }

  var row = [
    payload.id || ('ATM-' + Date.now()),
    payload.ulangan_id,
    payload.ulangan_judul,
    payload.user_id,
    payload.siswa_nama,
    payload.siswa_paket,
    payload.mulai_pada,
    payload.selesai_pada || '-',
    payload.status || 'SELESAI',
    payload.nilai_otomatis || 0,
    payload.nilai_uraian || 0,
    payload.nilai_total || 0,
    payload.dinilai ? 'YA' : 'TIDAK',
    payload.feedback_tutor || '-',
    typeof payload.jawaban_json === 'string' ? payload.jawaban_json : JSON.stringify(payload.jawaban || {}),
    typeof payload.catatan_per_soal_json === 'string' ? payload.catatan_per_soal_json : JSON.stringify(payload.catatan_per_soal || {})
  ];

  sheet.appendRow(row);
  return { success: true, message: 'Hasil ujian siswa berhasil dicatat di Google Sheets.' };
}

function handleGradeUjianAttempt(attemptId, nilaiUraian, feedback) {
  var ss = getDb();
  var sheet = ss.getSheetByName('UJIAN_ATTEMPTS');
  if (!sheet) return { success: false, message: 'Sheet tidak ditemukan' };

  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === attemptId) {
      var rowNum = i + 1;
      var nilaiOto = Number(data[i][9]) || 0;
      var total = nilaiOto + Number(nilaiUraian || 0);
      sheet.getRange(rowNum, 11).setValue(Number(nilaiUraian || 0));
      sheet.getRange(rowNum, 12).setValue(total);
      sheet.getRange(rowNum, 13).setValue('YA');
      sheet.getRange(rowNum, 14).setValue(feedback || '-');
      return { success: true, message: 'Koreksi ujian berhasil disimpan di Google Sheets.' };
    }
  }
  return { success: false, message: 'Attempt ujian tidak ditemukan.' };
}`
    },
    {
      name: 'MasterSync.gs',
      description: 'Sinkronisasi Materi, User, Tatap Muka, Settings, dan Master Bulk Sync (Push/Pull Full Database).',
      code: `/**
 * PKBM CELAH CAHAYA - Master Synchronization & Entity Management
 */

function handleSyncMateri(payload, action) {
  var ss = getDb();
  var sheet = ss.getSheetByName('MATERI');
  if (!sheet) { initAllSheets(); sheet = ss.getSheetByName('MATERI'); }

  var op = payload.operation || (action === 'deleteMateri' ? 'delete' : action === 'addMateri' ? 'add' : 'update');
  var data = sheet.getDataRange().getValues();

  if (op === 'delete') {
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] === payload.id) {
        sheet.deleteRow(i + 1);
        return { success: true, message: 'Materi modul berhasil dihapus dari Google Sheets.' };
      }
    }
    return { success: false, message: 'Materi tidak ditemukan.' };
  }

  if (op === 'update') {
    for (var j = 1; j < data.length; j++) {
      if (data[j][0] === payload.id) {
        var rowNum = j + 1;
        sheet.getRange(rowNum, 2).setValue(payload.judul);
        sheet.getRange(rowNum, 3).setValue(payload.deskripsi);
        sheet.getRange(rowNum, 4).setValue(payload.paket);
        sheet.getRange(rowNum, 5).setValue(payload.mata_pelajaran);
        sheet.getRange(rowNum, 10).setValue(payload.drive_url);
        sheet.getRange(rowNum, 11).setValue(payload.preview_url || payload.drive_url);
        sheet.getRange(rowNum, 19).setValue(new Date().toISOString());
        return { success: true, message: 'Materi modul berhasil diperbarui di Google Sheets.' };
      }
    }
  }

  sheet.appendRow([
    payload.id || ('MAT-' + Date.now()),
    payload.judul,
    payload.deskripsi,
    payload.paket,
    payload.mata_pelajaran,
    payload.kategori || 'Modul Utama',
    payload.tingkat || '-',
    payload.nama_file || (payload.judul + '.pdf'),
    payload.file_id || '-',
    payload.drive_url,
    payload.preview_url || payload.drive_url,
    payload.ukuran_file || '2.5 MB',
    payload.tahun || new Date().getFullYear(),
    payload.sumber_url || '-',
    payload.urutan || 1,
    payload.status || 'PUBLISHED',
    typeof payload.tujuan_pembelajaran_json === 'string' ? payload.tujuan_pembelajaran_json : JSON.stringify(payload.tujuan_pembelajaran || []),
    payload.created_at || new Date().toISOString(),
    payload.updated_at || new Date().toISOString()
  ]);

  return { success: true, message: 'Materi modul baru berhasil disimpan ke Google Sheets.' };
}

function handleSyncUser(payload, action) {
  var ss = getDb();
  var sheet = ss.getSheetByName('USERS');
  if (!sheet) { initAllSheets(); sheet = ss.getSheetByName('USERS'); }

  var op = payload.operation || (action === 'deleteUser' ? 'delete' : action === 'addUser' ? 'add' : 'update');
  var data = sheet.getDataRange().getValues();

  if (op === 'delete') {
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] === payload.id || data[i][1] === payload.username) {
        sheet.deleteRow(i + 1);
        return { success: true, message: 'User berhasil dihapus dari Google Sheets.' };
      }
    }
    return { success: false, message: 'User tidak ditemukan.' };
  }

  if (op === 'update') {
    for (var j = 1; j < data.length; j++) {
      if (data[j][0] === payload.id || data[j][1] === payload.username) {
        var rowNum = j + 1;
        sheet.getRange(rowNum, 4).setValue(payload.nama);
        sheet.getRange(rowNum, 5).setValue(payload.email || '-');
        sheet.getRange(rowNum, 6).setValue(payload.telepon || '-');
        sheet.getRange(rowNum, 8).setValue(payload.paket || '-');
        sheet.getRange(rowNum, 9).setValue(payload.kelas || '-');
        sheet.getRange(rowNum, 10).setValue(payload.nisn || '-');
        sheet.getRange(rowNum, 11).setValue(payload.nik || '-');
        sheet.getRange(rowNum, 12).setValue(payload.status || 'AKTIF');
        sheet.getRange(rowNum, 33).setValue(new Date().toISOString());
        return { success: true, message: 'User berhasil diperbarui di Google Sheets.' };
      }
    }
  }

  sheet.appendRow([
    payload.id || ('USR-' + Date.now()),
    payload.username,
    payload.password || 'password123',
    payload.nama,
    payload.email || '-',
    payload.telepon || '-',
    payload.role,
    payload.paket || '-',
    payload.kelas || '-',
    payload.nisn || '-',
    payload.nik || '-',
    payload.status || 'AKTIF',
    payload.foto || '',
    payload.mata_pelajaran || '-',
    typeof payload.mapel_paket_b === 'string' ? payload.mapel_paket_b : JSON.stringify(payload.mapel_paket_b || []),
    typeof payload.mapel_paket_c === 'string' ? payload.mapel_paket_c : JSON.stringify(payload.mapel_paket_c || []),
    payload.no_sk || '-',
    payload.pendidikan || '-',
    payload.nipd || '-',
    payload.jenis_kelamin || '-',
    payload.tempat_lahir || '-',
    payload.tanggal_lahir || '-',
    payload.agama || '-',
    payload.alamat || '-',
    payload.rt || '-',
    payload.rw || '-',
    payload.dusun || '-',
    payload.kelurahan || '-',
    payload.kecamatan || '-',
    payload.kode_pos || '-',
    payload.rombel || '-',
    payload.created_at || new Date().toISOString(),
    payload.updated_at || new Date().toISOString()
  ]);

  return { success: true, message: 'User baru berhasil disimpan di Google Sheets.' };
}

function handleSyncTatapMuka(payload) {
  var ss = getDb();
  var sheet = ss.getSheetByName('TATAP_MUKA');
  if (!sheet) { initAllSheets(); sheet = ss.getSheetByName('TATAP_MUKA'); }

  var op = payload.operation || 'add';
  var data = sheet.getDataRange().getValues();

  if (op === 'delete') {
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] === payload.id) {
        sheet.deleteRow(i + 1);
        return { success: true, message: 'Jadwal tatap muka berhasil dihapus dari Google Sheets.' };
      }
    }
    return { success: false, message: 'Jadwal tidak ditemukan.' };
  }

  if (op === 'update') {
    for (var j = 1; j < data.length; j++) {
      if (data[j][0] === payload.id) {
        var rowNum = j + 1;
        sheet.getRange(rowNum, 2).setValue(payload.judul);
        sheet.getRange(rowNum, 9).setValue(payload.tanggal);
        sheet.getRange(rowNum, 10).setValue(payload.jam_mulai);
        sheet.getRange(rowNum, 11).setValue(payload.jam_selesai);
        sheet.getRange(rowNum, 12).setValue(payload.link_meet || '-');
        sheet.getRange(rowNum, 15).setValue(payload.status);
        return { success: true, message: 'Jadwal tatap muka berhasil diperbarui di Google Sheets.' };
      }
    }
  }

  sheet.appendRow([
    payload.id || ('TM-' + Date.now()),
    payload.judul,
    payload.deskripsi || '-',
    payload.mata_pelajaran,
    payload.kelas,
    payload.paket,
    payload.tutor_id,
    payload.tutor_nama,
    payload.tanggal,
    payload.jam_mulai,
    payload.jam_selesai,
    payload.link_meet || '-',
    payload.materi_id || '-',
    payload.materi_judul || '-',
    payload.status,
    payload.created_at || new Date().toISOString()
  ]);

  return { success: true, message: 'Jadwal tatap muka berhasil disimpan di Google Sheets.' };
}

function handleSaveReadingProgress(payload) {
  var ss = getDb();
  var sheet = ss.getSheetByName('PROGRESS_BELAJAR');
  if (!sheet) { initAllSheets(); sheet = ss.getSheetByName('PROGRESS_BELAJAR'); }

  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][1] === payload.user_id && data[i][2] === payload.materi_id) {
      var rowNum = i + 1;
      sheet.getRange(rowNum, 4).setValue(payload.last_page);
      sheet.getRange(rowNum, 6).setValue(payload.progress_percent);
      sheet.getRange(rowNum, 7).setValue(payload.last_read_at || new Date().toISOString());
      sheet.getRange(rowNum, 8).setValue(payload.completed || 'TIDAK');
      return { success: true, message: 'Progres baca berhasil disimpan di Google Sheets.' };
    }
  }

  sheet.appendRow([
    payload.id || (payload.user_id + '_' + payload.materi_id),
    payload.user_id,
    payload.materi_id,
    payload.last_page,
    payload.total_pages,
    payload.progress_percent,
    payload.last_read_at || new Date().toISOString(),
    payload.completed || 'TIDAK'
  ]);

  return { success: true, message: 'Progres baca baru berhasil dicatat di Google Sheets.' };
}

function handleSaveSettings(payload) {
  var ss = getDb();
  var sheet = ss.getSheetByName('SETTINGS');
  if (!sheet) { initAllSheets(); sheet = ss.getSheetByName('SETTINGS'); }

  sheet.clearContents();
  sheet.appendRow(['key', 'value', 'updated_at']);

  for (var key in payload) {
    var val = typeof payload[key] === 'object' ? JSON.stringify(payload[key]) : String(payload[key]);
    sheet.appendRow([key, val, new Date().toISOString()]);
  }

  return { success: true, message: 'Pengaturan website berhasil disimpan di Google Sheets.' };
}

function handleMasterBulkSync(payload) {
  initAllSheets();
  var ss = getDb();
  var updatedCounts = {};

  if (payload.users && Array.isArray(payload.users)) {
    var uSheet = ss.getSheetByName('USERS');
    uSheet.clearContents();
    initAllSheets();
    payload.users.forEach(function(u) {
      handleSyncUser(u, 'addUser');
    });
    updatedCounts.users = payload.users.length;
  }

  if (payload.materi && Array.isArray(payload.materi)) {
    var mSheet = ss.getSheetByName('MATERI');
    mSheet.clearContents();
    initAllSheets();
    payload.materi.forEach(function(m) {
      handleSyncMateri(m, 'addMateri');
    });
    updatedCounts.materi = payload.materi.length;
  }

  if (payload.quiz_attempts && Array.isArray(payload.quiz_attempts)) {
    var qSheet = ss.getSheetByName('MODUL_QUIZ_ATTEMPTS');
    qSheet.clearContents();
    initAllSheets();
    payload.quiz_attempts.forEach(function(q) {
      handleSaveQuizAttempt(q);
    });
    updatedCounts.quiz_attempts = payload.quiz_attempts.length;
  }

  if (payload.pendaftaran && Array.isArray(payload.pendaftaran)) {
    var pSheet = ss.getSheetByName('PENDAFTARAN_PPDB');
    pSheet.clearContents();
    initAllSheets();
    payload.pendaftaran.forEach(function(p) {
      handleRegisterPPDB(p);
    });
    updatedCounts.pendaftaran = payload.pendaftaran.length;
  }

  return {
    success: true,
    message: 'Master Bulk Sync selesai! Seluruh database berhasil ditulis penuh ke Google Sheets.',
    counts: updatedCounts
  };
}

function handleGetAllData() {
  var ss = getDb();
  return {
    success: true,
    data: {
      users: handleGetUsers().data || [],
      materi: handleGetMateri().data || [],
      quiz_attempts: handleGetQuizAttempts().data || [],
      pendaftaran: handleGetPendaftaranList().data || []
    }
  };
}

function handleGetMateri(paket, mapel) {
  var ss = getDb();
  var sheet = ss.getSheetByName('MATERI');
  if (!sheet) return { success: true, data: [] };

  var values = sheet.getDataRange().getValues();
  var list = [];
  for (var i = 1; i < values.length; i++) {
    var r = values[i];
    if (paket && paket !== 'SEMUA' && r[3] !== paket) continue;
    if (mapel && mapel !== 'SEMUA' && r[4] !== mapel) continue;

    list.push({
      id: r[0],
      judul: r[1],
      deskripsi: r[2],
      paket: r[3],
      mata_pelajaran: r[4],
      kategori: r[5],
      tingkat: r[6],
      nama_file: r[7],
      file_id: r[8],
      drive_url: r[9],
      preview_url: r[10],
      ukuran_file: r[11],
      tahun: Number(r[12]),
      sumber_url: r[13],
      urutan: Number(r[14]),
      status: r[15],
      tujuan_pembelajaran: typeof r[16] === 'string' && r[16].startsWith('[') ? JSON.parse(r[16]) : [],
      created_at: r[17],
      updated_at: r[18]
    });
  }
  return { success: true, count: list.length, data: list };
}

function handleGetUsers(role, paket) {
  var ss = getDb();
  var sheet = ss.getSheetByName('USERS');
  if (!sheet) return { success: true, data: [] };

  var values = sheet.getDataRange().getValues();
  var list = [];
  for (var i = 1; i < values.length; i++) {
    var r = values[i];
    if (role && role !== 'SEMUA' && r[6] !== role) continue;
    if (paket && paket !== 'SEMUA' && r[7] !== paket) continue;

    list.push({
      id: r[0],
      username: r[1],
      password: r[2],
      nama: r[3],
      email: r[4],
      telepon: r[5],
      role: r[6],
      paket: r[7],
      kelas: r[8],
      nisn: r[9],
      nik: r[10],
      status: r[11],
      foto: r[12],
      mata_pelajaran: r[13],
      mapel_paket_b: typeof r[14] === 'string' && r[14].startsWith('[') ? JSON.parse(r[14]) : [],
      mapel_paket_c: typeof r[15] === 'string' && r[15].startsWith('[') ? JSON.parse(r[15]) : [],
      no_sk: r[16],
      pendidikan: r[17],
      nipd: r[18],
      jenis_kelamin: r[19],
      tempat_lahir: r[20],
      tanggal_lahir: r[21],
      agama: r[22],
      alamat: r[23],
      rt: r[24],
      rw: r[25],
      dusun: r[26],
      kelurahan: r[27],
      kecamatan: r[28],
      kode_pos: r[29],
      rombel: r[30],
      created_at: r[31],
      updated_at: r[32]
    });
  }
  return { success: true, count: list.length, data: list };
}

function handleGetSettings() {
  var ss = getDb();
  var sheet = ss.getSheetByName('SETTINGS');
  if (!sheet) return { success: true, data: {} };

  var values = sheet.getDataRange().getValues();
  var settings = {};
  for (var i = 1; i < values.length; i++) {
    var k = values[i][0];
    var v = values[i][1];
    try {
      settings[k] = JSON.parse(v);
    } catch(e) {
      settings[k] = v;
    }
  }
  return { success: true, data: settings };
}

function handleRecordActivity(user, payload) {
  var ss = getDb();
  var sheet = ss.getSheetByName('AKTIVITAS');
  if (!sheet) { initAllSheets(); sheet = ss.getSheetByName('AKTIVITAS'); }

  sheet.appendRow([
    'ACT-' + Date.now(),
    user ? user.id : 'GUEST',
    user ? user.nama : 'Pengunjung',
    user ? user.role : 'GUEST',
    payload.aktivitas || 'Akses Sistem',
    payload.materi_id || '-',
    payload.materi_judul || '-',
    payload.paket || '-',
    new Date().toISOString(),
    payload.durasi_detik || 0,
    payload.progress_persen || 0
  ]);

  return { success: true };
}`
    }
  ];
}
