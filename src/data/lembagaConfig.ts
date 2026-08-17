// MASTER DATA IDENTITAS RESMI PKBM CELAH CAHAYA
// Sesuai Surat Keputusan & Data Pokok Pendidikan Masyarakat (Dikmas)

export interface LembagaIdentity {
  nama: string;
  npsn: string;
  alamat: string;
  desa_kelurahan: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  status: string;
  bentuk_pendidikan: string;
  jenjang: string;
  program_layanan: string[];
  sk_pendirian: string;
  tanggal_sk_pendirian: string;
  tanggal_sk_pendirian_lengkap: string;
  sk_operasional: string;
  sk_izin_operasional?: string;
  tanggal_sk_operasional: string;
  tanggal_sk_operasional_lengkap: string;
  tagline: string;
  subjudul: string;
  tahun_ajaran_aktif: string;
  copyright: string;
  logo: {
    drive_file_id: string;
    primary_url: string;
    thumbnail_url: string;
    gdrive_share_url: string;
  };
}

export const MASTER_LEMBAGA: LembagaIdentity = {
  nama: 'PKBM CELAH CAHAYA',
  npsn: 'P9984574',
  alamat: 'Kp. Sukawangi',
  desa_kelurahan: 'Sukawangi',
  kecamatan: 'Singajaya',
  kabupaten: 'Garut',
  provinsi: 'Jawa Barat',
  status: 'SWASTA',
  bentuk_pendidikan: 'PKBM',
  jenjang: 'DIKMAS',
  program_layanan: ['Paket B', 'Paket C'],
  sk_pendirian: '421.9/1145-DISDIK',
  tanggal_sk_pendirian: '22-07-2019',
  tanggal_sk_pendirian_lengkap: '22 Juli 2019',
  sk_operasional: '421.9/1145-DISDIK',
  sk_izin_operasional: '421.9/1145-DISDIK',
  tanggal_sk_operasional: '22-07-2019',
  tanggal_sk_operasional_lengkap: '22 Juli 2019',
  tagline: 'Sistem Informasi Pembelajaran PKBM',
  subjudul: 'Paket B & Paket C',
  tahun_ajaran_aktif: '2026/2027',
  copyright: '© 2026 PKBM CELAH CAHAYA. All Rights Reserved.',
  logo: {
    drive_file_id: '1YOLykYW-nVj8Lj6SyVPCjXdXnkwdQKZ3',
    primary_url: 'https://lh3.googleusercontent.com/d/1YOLykYW-nVj8Lj6SyVPCjXdXnkwdQKZ3',
    thumbnail_url: 'https://drive.google.com/thumbnail?id=1YOLykYW-nVj8Lj6SyVPCjXdXnkwdQKZ3&sz=w1000',
    gdrive_share_url: 'https://drive.google.com/file/d/1YOLykYW-nVj8Lj6SyVPCjXdXnkwdQKZ3/view?usp=drive_link'
  }
};

export const ALAMAT_LENGKAP_LEMBAGA = `${MASTER_LEMBAGA.alamat}, Desa ${MASTER_LEMBAGA.desa_kelurahan}, Kec. ${MASTER_LEMBAGA.kecamatan}, Kab. ${MASTER_LEMBAGA.kabupaten}, Provinsi ${MASTER_LEMBAGA.provinsi}`;
