import { PendaftaranWargaBelajar } from '../types';

export const INITIAL_PENDAFTARAN: PendaftaranWargaBelajar[] = [
  {
    id: 'REG-2026-0001',
    nomor_pendaftaran: 'PKBM-2026-000101',
    tahun_ajaran: '2026/2027',
    gelombang: 'Gelombang 1 (Januari - Juni 2026)',
    program_pilihan: 'PAKET B',
    jenis_pendaftaran: 'BARU',
    status: 'DITERIMA',
    tanggal_pendaftaran: '2026-02-10T09:30:00.000Z',
    diverifikasi_oleh: 'Admin Pusat PKBM',
    diverifikasi_pada: '2026-02-11T14:20:00.000Z',
    user_id_terbuat: 'usr_siswa_b1',

    // 1. Identitas
    nama_lengkap: 'Budi Santoso',
    nisn: '0087654321',
    nik: '3204281504080001',
    nomor_kk: '3204280102030005',
    jenis_kelamin: 'L',
    tempat_lahir: 'Bandung',
    tanggal_lahir: '2008-04-15',
    agama: 'ISLAM',
    kewarganegaraan: 'WNI',
    kebutuhan_khusus: 'Tidak Ada',
    anak_ke: 2,
    jumlah_saudara_kandung: 3,

    // 2. Tempat Tinggal
    alamat_lengkap: 'Jl. Terusan Buahbatu No. 45 RT 03 RW 05',
    rt: '03',
    rw: '05',
    dusun_kampung: 'Cijawura Girang',
    desa_kelurahan: 'Cijawura',
    kecamatan: 'Buahbatu',
    kabupaten_kota: 'Kota Bandung',
    provinsi: 'Jawa Barat',
    kode_pos: '40287',
    status_tempat_tinggal: 'MILIK_SENDIRI',
    moda_transportasi: 'SEPEDA_MOTOR',
    jarak_ke_pkbm: '1 - 3 km',
    waktu_tempuh_menit: 15,

    // 3. Kontak
    nomor_hp: '081234567890',
    nomor_wa: '081234567890',
    email: 'budi.santoso2026@gmail.com',
    kontak_darurat_nomor: '081398765432',
    kontak_darurat_nama: 'Ahmad Santoso',
    kontak_darurat_hubungan: 'Ayah Kandung',

    // 4. Ayah
    ayah_nama: 'Ahmad Santoso',
    ayah_nik: '3204281203750002',
    ayah_tahun_lahir: 1975,
    ayah_pendidikan: 'SMA/SMK',
    ayah_pekerjaan: 'Wiraswasta/Pedagang',
    ayah_penghasilan: 'Rp 2.000.000 - Rp 5.000.000',
    ayah_status: 'MASIH_HIDUP',

    // 5. Ibu
    ibu_nama: 'Siti Aminah',
    ibu_nik: '3204285508780004',
    ibu_tahun_lahir: 1978,
    ibu_pendidikan: 'SMP',
    ibu_pekerjaan: 'Ibu Rumah Tangga',
    ibu_penghasilan: 'Tidak Berpenghasilan',
    ibu_status: 'MASIH_HIDUP',

    // 6. Wali
    tinggal_bersama: 'ORANG_TUA',

    // 7. Periodik
    tinggi_badan_cm: 165,
    berat_badan_kg: 52,
    lingkar_kepala_cm: 55,

    // 8. Kesejahteraan
    punya_kip: true,
    nomor_kip: 'KIP-2026-BDG-0912',
    punya_pkh: false,
    punya_kks: false,

    // 9. Pendidikan
    sekolah_asal: 'SD Negeri 03 Buahbatu',
    npsn_sekolah_asal: '20219876',
    nomor_seri_ijazah: 'DN-02/D-SD/13/0012934',
    tahun_lulus: 2021,
    status_pendidikan_terakhir: 'Lulus SD Sederajat',

    // 10. Dokumen
    dokumen: [
      {
        id: 'DOC-01',
        jenis: 'PAS_FOTO',
        label: 'Pas Foto 3x4',
        nama_file: 'pas_foto_budi.jpg',
        url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300',
        tipe_file: 'image/jpeg',
        ukuran_bytes: 245000,
        status_verifikasi: 'VALID',
        uploaded_at: '2026-02-10T09:35:00.000Z'
      },
      {
        id: 'DOC-02',
        jenis: 'KK',
        label: 'Kartu Keluarga (KK)',
        nama_file: 'kk_keluarga_santoso.pdf',
        url: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=600',
        tipe_file: 'application/pdf',
        ukuran_bytes: 1250000,
        status_verifikasi: 'VALID',
        uploaded_at: '2026-02-10T09:36:00.000Z'
      },
      {
        id: 'DOC-03',
        jenis: 'AKTA_KELAHIRAN',
        label: 'Akta Kelahiran',
        nama_file: 'akta_budi_santoso.jpg',
        url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600',
        tipe_file: 'image/jpeg',
        ukuran_bytes: 840000,
        status_verifikasi: 'VALID',
        uploaded_at: '2026-02-10T09:37:00.000Z'
      },
      {
        id: 'DOC-04',
        jenis: 'IJAZAH',
        label: 'Ijazah SD Terakhir',
        nama_file: 'ijazah_sd_budi.pdf',
        url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600',
        tipe_file: 'application/pdf',
        ukuran_bytes: 980000,
        status_verifikasi: 'VALID',
        uploaded_at: '2026-02-10T09:38:00.000Z'
      }
    ],
    pas_foto_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300',
    created_at: '2026-02-10T09:30:00.000Z'
  },
  {
    id: 'REG-2026-0002',
    nomor_pendaftaran: 'PKBM-2026-000102',
    tahun_ajaran: '2026/2027',
    gelombang: 'Gelombang 1 (Januari - Juni 2026)',
    program_pilihan: 'PAKET C',
    jenis_pendaftaran: 'BARU',
    status: 'DIAJUKAN',
    tanggal_pendaftaran: '2026-03-01T11:15:00.000Z',

    // 1. Identitas
    nama_lengkap: 'Siti Rahmawati',
    nisn: '0065432198',
    nik: '3204126207060003',
    nomor_kk: '3204120104050012',
    jenis_kelamin: 'P',
    tempat_lahir: 'Bandung',
    tanggal_lahir: '2006-07-22',
    agama: 'ISLAM',
    kewarganegaraan: 'WNI',
    kebutuhan_khusus: 'Tidak Ada',
    anak_ke: 1,
    jumlah_saudara_kandung: 2,

    // 2. Tempat Tinggal
    alamat_lengkap: 'Komplek Permata Biru Blok D2 No. 18',
    rt: '04',
    rw: '12',
    dusun_kampung: 'Cinunuk Barat',
    desa_kelurahan: 'Cinunuk',
    kecamatan: 'Cileunyi',
    kabupaten_kota: 'Kab. Bandung',
    provinsi: 'Jawa Barat',
    kode_pos: '40624',
    status_tempat_tinggal: 'RUMAH_ORANG_TUA',
    moda_transportasi: 'ANGKUTAN_UMUM',
    jarak_ke_pkbm: '3 - 5 km',
    waktu_tempuh_menit: 25,

    // 3. Kontak
    nomor_hp: '085712349988',
    nomor_wa: '085712349988',
    email: 'siti.rahmawati2006@gmail.com',
    kontak_darurat_nomor: '085698712345',
    kontak_darurat_nama: 'Dewi Kartika',
    kontak_darurat_hubungan: 'Ibu Kandung',

    // 4. Ayah
    ayah_nama: 'Dedi Kurniawan',
    ayah_nik: '3204121503730007',
    ayah_tahun_lahir: 1973,
    ayah_pendidikan: 'SMA/SMK',
    ayah_pekerjaan: 'Karyawan Swasta',
    ayah_penghasilan: 'Rp 2.000.000 - Rp 5.000.000',
    ayah_status: 'MASIH_HIDUP',

    // 5. Ibu
    ibu_nama: 'Dewi Kartika',
    ibu_nik: '3204125810760002',
    ibu_tahun_lahir: 1976,
    ibu_pendidikan: 'SMA/SMK',
    ibu_pekerjaan: 'Wiraswasta/Pedagang',
    ibu_penghasilan: 'Rp 1.000.000 - Rp 2.000.000',
    ibu_status: 'MASIH_HIDUP',

    // 6. Wali
    tinggal_bersama: 'ORANG_TUA',

    // 7. Periodik
    tinggi_badan_cm: 158,
    berat_badan_kg: 48,
    lingkar_kepala_cm: 54,

    // 8. Kesejahteraan
    punya_kip: false,
    punya_pkh: false,
    punya_kks: false,

    // 9. Pendidikan
    sekolah_asal: 'SMP Negeri 2 Cileunyi',
    npsn_sekolah_asal: '20228811',
    nomor_seri_ijazah: 'DN-02/D-SMP/13/0045199',
    tahun_lulus: 2022,
    status_pendidikan_terakhir: 'Lulus SMP Sederajat',

    // 10. Dokumen
    dokumen: [
      {
        id: 'DOC-05',
        jenis: 'PAS_FOTO',
        label: 'Pas Foto 3x4',
        nama_file: 'pasfoto_siti_rahma.jpg',
        url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300',
        tipe_file: 'image/jpeg',
        ukuran_bytes: 280000,
        status_verifikasi: 'BELUM_DIVERIFIKASI',
        uploaded_at: '2026-03-01T11:18:00.000Z'
      },
      {
        id: 'DOC-06',
        jenis: 'KK',
        label: 'Kartu Keluarga (KK)',
        nama_file: 'kk_dedi_kurniawan.pdf',
        url: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=600',
        tipe_file: 'application/pdf',
        ukuran_bytes: 1420000,
        status_verifikasi: 'BELUM_DIVERIFIKASI',
        uploaded_at: '2026-03-01T11:20:00.000Z'
      },
      {
        id: 'DOC-07',
        jenis: 'IJAZAH',
        label: 'Ijazah SMP Terakhir',
        nama_file: 'ijazah_smp_siti.pdf',
        url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600',
        tipe_file: 'application/pdf',
        ukuran_bytes: 1100000,
        status_verifikasi: 'BELUM_DIVERIFIKASI',
        uploaded_at: '2026-03-01T11:21:00.000Z'
      }
    ],
    pas_foto_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300',
    created_at: '2026-03-01T11:15:00.000Z'
  },
  {
    id: 'REG-2026-0003',
    nomor_pendaftaran: 'PKBM-2026-000103',
    tahun_ajaran: '2026/2027',
    gelombang: 'Gelombang 1 (Januari - Juni 2026)',
    program_pilihan: 'PAKET C',
    jenis_pendaftaran: 'PINDAHAN',
    status: 'PERLU_PERBAIKAN',
    tanggal_pendaftaran: '2026-03-05T14:40:00.000Z',
    catatan_operator: 'Foto Kartu Keluarga buram dan terpotong di bagian NIK Ayah. Mohon unggah ulang file scan KK yang jelas dan tegak lurus.',
    diverifikasi_oleh: 'Operator Dapodik PKBM',
    diverifikasi_pada: '2026-03-06T10:15:00.000Z',

    // 1. Identitas
    nama_lengkap: 'Rian Pratama',
    nisn: '0054321987',
    nik: '3273011409050005',
    nomor_kk: '3273010101010099',
    jenis_kelamin: 'L',
    tempat_lahir: 'Jakarta',
    tanggal_lahir: '2005-09-14',
    agama: 'ISLAM',
    kewarganegaraan: 'WNI',
    kebutuhan_khusus: 'Tidak Ada',
    anak_ke: 1,
    jumlah_saudara_kandung: 1,

    // 2. Tempat Tinggal
    alamat_lengkap: 'Jl. Pasirluyu Timur No. 89',
    rt: '02',
    rw: '07',
    desa_kelurahan: 'Pasirluyu',
    kecamatan: 'Regol',
    kabupaten_kota: 'Kota Bandung',
    provinsi: 'Jawa Barat',
    kode_pos: '40254',
    status_tempat_tinggal: 'SEWA_KONTRAK',
    moda_transportasi: 'SEPEDA_MOTOR',
    jarak_ke_pkbm: '1 - 3 km',
    waktu_tempuh_menit: 10,

    // 3. Kontak
    nomor_hp: '087812984433',
    nomor_wa: '087812984433',
    email: 'rian.pratama99@gmail.com',

    // 4. Ayah
    ayah_nama: 'Bambang Pratama',
    ayah_nik: '3273011204700001',
    ayah_tahun_lahir: 1970,
    ayah_pendidikan: 'SMA/SMK',
    ayah_pekerjaan: 'Buruh',
    ayah_penghasilan: 'Rp 1.000.000 - Rp 2.000.000',
    ayah_status: 'MASIH_HIDUP',

    // 5. Ibu
    ibu_nama: 'Nurhayati',
    ibu_nik: '3273015509740003',
    ibu_tahun_lahir: 1974,
    ibu_pendidikan: 'SMP',
    ibu_pekerjaan: 'Ibu Rumah Tangga',
    ibu_penghasilan: 'Tidak Berpenghasilan',
    ibu_status: 'MASIH_HIDUP',

    // 6. Wali
    tinggal_bersama: 'ORANG_TUA',

    // 7. Periodik
    tinggi_badan_cm: 170,
    berat_badan_kg: 60,
    lingkar_kepala_cm: 56,

    // 8. Kesejahteraan
    punya_kip: true,
    nomor_kip: 'KIP-2026-JKT-8871',
    punya_pkh: true,
    nomor_pkh: 'PKH-3273-00912',
    punya_kks: false,

    // 9. Pendidikan
    sekolah_asal: 'SMA Pasundan 2 Bandung',
    npsn_sekolah_asal: '20219900',
    tahun_lulus: 2023,
    status_pendidikan_terakhir: 'Pindahan Kelas 11',
    surat_pindah_nomor: '421.3/089/SMA-PAS/2026',
    surat_pindah_tanggal: '2026-02-15',

    // 10. Dokumen
    dokumen: [
      {
        id: 'DOC-08',
        jenis: 'PAS_FOTO',
        label: 'Pas Foto 3x4',
        nama_file: 'rian_foto_resmi.jpg',
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
        tipe_file: 'image/jpeg',
        ukuran_bytes: 290000,
        status_verifikasi: 'VALID',
        uploaded_at: '2026-03-05T14:45:00.000Z'
      },
      {
        id: 'DOC-09',
        jenis: 'KK',
        label: 'Kartu Keluarga (KK)',
        nama_file: 'kartu_keluarga_rian_buram.jpg',
        url: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=600',
        tipe_file: 'image/jpeg',
        ukuran_bytes: 410000,
        status_verifikasi: 'PERLU_PERBAIKAN',
        catatan_operator: 'Foto KK buram dan NIK terpotong. Mohon unggah ulang.',
        uploaded_at: '2026-03-05T14:46:00.000Z'
      },
      {
        id: 'DOC-10',
        jenis: 'SURAT_PINDAH',
        label: 'Surat Keterangan Pindah Sekolah',
        nama_file: 'surat_pindah_sma_pasundan.pdf',
        url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600',
        tipe_file: 'application/pdf',
        ukuran_bytes: 890000,
        status_verifikasi: 'VALID',
        uploaded_at: '2026-03-05T14:48:00.000Z'
      }
    ],
    pas_foto_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
    created_at: '2026-03-05T14:40:00.000Z'
  }
];
