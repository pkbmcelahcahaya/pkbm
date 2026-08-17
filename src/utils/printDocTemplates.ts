/**
 * PKBM CELAH CAHAYA - Official Academic & Administrative Document Templates
 * Menyediakan layout kop surat resmi, tabel data berstandar administrasi Dikmas,
 * tanda tangan, barcode keabsahan, dan template cetak untuk seluruh modul aplikasi.
 */

import { MASTER_LEMBAGA, ALAMAT_LENGKAP_LEMBAGA } from '../data/lembagaConfig';

export interface DocumentPrintConfig {
  docType:
    | 'PPDB_SLIP'
    | 'PPDB_FORMULIR'
    | 'KARTU_PELAJAR'
    | 'REKAP_SISWA'
    | 'REKAP_KUIS_100'
    | 'LEMBAR_NILAI_KUIS'
    | 'REKAP_TUGAS'
    | 'REKAP_ULANGAN'
    | 'TRANSKRIP_NILAI'
    | 'REKAP_TATAP_MUKA'
    | 'REKAP_TUTOR'
    | 'SILABUS_KURIKULUM'
    | 'LEARNING_REPORT';
  title: string;
  subtitle?: string;
  nomorSurat?: string;
  data: any;
  filterInfo?: {
    paket?: string;
    kelas?: string;
    mapel?: string;
    periode?: string;
  };
  orientation?: 'PORTRAIT' | 'LANDSCAPE';
}

/**
 * Format Tanggal Indonesia
 */
export function formatTanggalIndo(dateStr?: string | number): string {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return String(dateStr);
    const bulan = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return `${d.getDate()} ${bulan[d.getMonth()]} ${d.getFullYear()}`;
  } catch (e) {
    return String(dateStr);
  }
}

/**
 * Format Waktu dan Tanggal Lengkap
 */
export function formatWaktuLengkapIndo(dateStr?: string): string {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return `${formatTanggalIndo(dateStr)} pukul ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')} WIB`;
  } catch (e) {
    return dateStr;
  }
}
