import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  Upload,
  FileText,
  Trash2,
  Eye,
  Sparkles,
  Save,
  Printer,
  Shield,
  User,
  MapPin,
  Users,
  GraduationCap,
  FileCheck,
  Award,
  Calendar,
  Phone,
  Mail,
  Home,
  Check,
  RefreshCw
} from 'lucide-react';
import {
  PendaftaranWargaBelajar,
  DokumenPendaftaran,
  PaketType,
  JenisDokumen
} from '../types';
import { storage } from '../services/storageService';
import { googleSheetsSync } from '../services/googleSheetsSyncService';
import { PrintPreviewModal } from './common/PrintPreviewModal';
import {
  WILAYAH_INDONESIA,
  DAFTAR_PROVINSI,
  getKabupatenByProvinsi,
  getKecamatanByKabupaten,
  getKelurahanByKecamatan
} from '../data/wilayahIndonesia';

interface RegistrationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (pendaftaran: PendaftaranWargaBelajar) => void;
  initialPaket?: PaketType;
}

interface FormErrors {
  [key: string]: string;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialPaket = 'PAKET C'
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedRecord, setSubmittedRecord] = useState<PendaftaranWargaBelajar | null>(null);
  const [previewDoc, setPreviewDoc] = useState<DokumenPendaftaran | null>(null);
  const [agreeTerms, setAgreeTerms] = useState<boolean>(false);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);

  // Form State
  const [formData, setFormData] = useState({
    // Header & Meta
    tahun_ajaran: '2026/2027',
    gelombang: 'Gelombang 1 (Januari - Juni 2026)',
    program_pilihan: initialPaket as PaketType,
    jenis_pendaftaran: 'BARU' as 'BARU' | 'PINDAHAN',

    // 1. Identitas
    nama_lengkap: '',
    nisn: '',
    nik: '',
    nomor_kk: '',
    jenis_kelamin: 'L' as 'L' | 'P',
    tempat_lahir: '',
    tanggal_lahir: '',
    agama: 'ISLAM' as 'ISLAM' | 'KRISTEN' | 'KATOLIK' | 'HINDU' | 'BUDDHA' | 'KONGHUCU' | 'LAINNYA',
    kewarganegaraan: 'WNI' as 'WNI' | 'WNA',
    kebutuhan_khusus: 'Tidak Ada',
    anak_ke: 1,
    jumlah_saudara_kandung: 1,

    // 2. Alamat & Kontak
    provinsi: 'Jawa Barat',
    kabupaten_kota: 'Kab. Bandung',
    kecamatan: 'Baleendah',
    desa_kelurahan: 'Baleendah',
    alamat_lengkap: '',
    rt: '01',
    rw: '01',
    dusun_kampung: '',
    kode_pos: '40375',
    status_tempat_tinggal: 'RUMAH_ORANG_TUA' as 'MILIK_SENDIRI' | 'RUMAH_ORANG_TUA' | 'SEWA_KONTRAK' | 'ASRAMA' | 'MENUMPANG' | 'LAINNYA',
    moda_transportasi: 'SEPEDA_MOTOR' as 'JALAN_KAKI' | 'SEPEDA' | 'SEPEDA_MOTOR' | 'ANGKUTAN_UMUM' | 'KENDARAAN_PRIBADI' | 'OJEK_ONLINE' | 'LAINNYA',
    jarak_ke_pkbm: '1 - 3 km' as '< 1 km' | '1 - 3 km' | '3 - 5 km' | '5 - 10 km' | '> 10 km',
    waktu_tempuh_menit: 15,
    nomor_hp: '',
    nomor_wa: '',
    email: '',
    kontak_darurat_nama: '',
    kontak_darurat_nomor: '',
    kontak_darurat_hubungan: '',

    // 3. Orang Tua & Wali
    ayah_nama: '',
    ayah_nik: '',
    ayah_tahun_lahir: 1980,
    ayah_pendidikan: 'SMA/SMK',
    ayah_pekerjaan: 'Wiraswasta/Pedagang',
    ayah_penghasilan: 'Rp 2.000.000 - Rp 5.000.000',
    ayah_status: 'MASIH_HIDUP' as 'MASIH_HIDUP' | 'MENINGGAL' | 'TIDAK_DIKETAHUI',

    ibu_nama: '',
    ibu_nik: '',
    ibu_tahun_lahir: 1982,
    ibu_pendidikan: 'SMP',
    ibu_pekerjaan: 'Ibu Rumah Tangga',
    ibu_penghasilan: 'Tidak Berpenghasilan',
    ibu_status: 'MASIH_HIDUP' as 'MASIH_HIDUP' | 'MENINGGAL' | 'TIDAK_DIKETAHUI',

    tinggal_bersama: 'ORANG_TUA' as 'ORANG_TUA' | 'WALI' | 'SENDIRI' | 'ASRAMA_PANTI',
    wali_nama: '',
    wali_nik: '',
    wali_tahun_lahir: 1978,
    wali_pendidikan: 'SMA/SMK',
    wali_pekerjaan: 'Karyawan Swasta',
    wali_penghasilan: 'Rp 2.000.000 - Rp 5.000.000',
    wali_hubungan: 'Paman / Bibi',
    wali_telepon: '',

    // 4. Periodik, Kesejahteraan & Pendidikan
    tinggi_badan_cm: 165,
    berat_badan_kg: 55,
    lingkar_kepala_cm: 55,
    punya_kip: false,
    nomor_kip: '',
    punya_pkh: false,
    nomor_pkh: '',
    punya_kks: false,
    nomor_kks: '',

    sekolah_asal: '',
    npsn_sekolah_asal: '',
    nomor_seri_ijazah: '',
    tahun_lulus: 2023,
    status_pendidikan_terakhir: 'Lulus SMP / MTs',
    surat_pindah_nomor: '',
    surat_pindah_tanggal: '',

    // 5. Dokumen
    dokumen: [] as DokumenPendaftaran[],
    pas_foto_url: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Auto load draft from LocalStorage on mount
  useEffect(() => {
    if (!isOpen) return;
    const draft = storage.getPendaftaranDraft();
    if (draft && draft.data) {
      setFormData(prev => ({
        ...prev,
        ...draft.data,
        program_pilihan: draft.data.program_pilihan || initialPaket
      }));
      setLastSavedTime(new Date(draft.saved_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
    }
  }, [isOpen, initialPaket]);

  // Debounced Autosave to localStorage
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Real-time Field Validator Helper
  const validateSingleField = (field: string, value: any): string | null => {
    switch (field) {
      case 'nama_lengkap':
        if (!value || !value.toString().trim()) return 'Nama lengkap wajib diisi sesuai ijazah/akta.';
        return null;
      case 'nik': {
        const clean = (value || '').toString().replace(/\D/g, '');
        if (!clean) return 'NIK wajib diisi (16 digit angka).';
        if (clean.length !== 16) return `NIK harus tepat 16 digit (saat ini ${clean.length} digit).`;
        return null;
      }
      case 'nomor_kk': {
        const clean = (value || '').toString().replace(/\D/g, '');
        if (!clean) return 'Nomor Kartu Keluarga (KK) wajib diisi.';
        if (clean.length !== 16) return `Nomor KK harus tepat 16 digit (saat ini ${clean.length} digit).`;
        return null;
      }
      case 'nisn': {
        const clean = (value || '').toString().replace(/\D/g, '');
        if (clean && clean.length !== 10) return `NISN harus 10 digit angka (saat ini ${clean.length} digit).`;
        return null;
      }
      case 'tempat_lahir':
        if (!value || !value.toString().trim()) return 'Tempat lahir wajib diisi.';
        return null;
      case 'tanggal_lahir':
        if (!value) return 'Tanggal lahir wajib dipilih.';
        return null;
      case 'alamat_lengkap':
        if (!value || !value.toString().trim()) return 'Alamat jalan/gang/nomor rumah wajib diisi.';
        return null;
      case 'rt':
        if (!value || !value.toString().trim()) return 'RT wajib diisi.';
        return null;
      case 'rw':
        if (!value || !value.toString().trim()) return 'RW wajib diisi.';
        return null;
      case 'kode_pos': {
        const clean = (value || '').toString().replace(/\D/g, '');
        if (!clean) return 'Kode pos wajib diisi.';
        if (clean.length < 5) return 'Kode pos minimal 5 digit.';
        return null;
      }
      case 'nomor_wa': {
        const clean = (value || '').toString().replace(/\D/g, '');
        if (!clean) return 'Nomor WhatsApp aktif wajib diisi.';
        if (clean.length < 10 || clean.length > 14) return `Nomor WA tidak valid (${clean.length} digit, standar 10-14 digit).`;
        return null;
      }
      case 'email': {
        const str = (value || '').toString().trim();
        if (!str) return 'Alamat email aktif wajib diisi.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str)) return 'Format email tidak valid (contoh: nama@email.com).';
        return null;
      }
      case 'ibu_nama':
        if (!value || !value.toString().trim()) return 'Nama ibu kandung wajib diisi sesuai Akta Kelahiran/KK.';
        return null;
      case 'ayah_nama':
        if (formData.ayah_status === 'MASIH_HIDUP' && (!value || !value.toString().trim())) {
          return 'Nama ayah kandung wajib diisi.';
        }
        return null;
      case 'wali_nama':
        if (formData.tinggal_bersama === 'WALI' && (!value || !value.toString().trim())) {
          return 'Nama lengkap wali wajib diisi.';
        }
        return null;
      case 'sekolah_asal':
        if (!value || !value.toString().trim()) return 'Nama sekolah asal terakhir wajib diisi.';
        return null;
      case 'surat_pindah_nomor':
        if (formData.jenis_pendaftaran === 'PINDAHAN' && (!value || !value.toString().trim())) {
          return 'Nomor Surat Keterangan Pindah wajib diisi.';
        }
        return null;
      default:
        return null;
    }
  };

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Real-time live validation check for this field
      const fieldError = validateSingleField(field, value);
      setErrors(errs => {
        const next = { ...errs };
        if (fieldError) {
          next[field] = fieldError;
        } else {
          delete next[field];
        }
        return next;
      });

      // Trigger Autosave
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        storage.savePendaftaranDraft(updated);
        setLastSavedTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
      }, 600);

      return updated;
    });
  };

  const handleFieldBlur = (field: string) => {
    const errorMsg = validateSingleField(field, (formData as any)[field]);
    setErrors(errs => {
      const next = { ...errs };
      if (errorMsg) {
        next[field] = errorMsg;
      } else {
        delete next[field];
      }
      return next;
    });
  };

  const handleResetDraft = () => {
    if (window.confirm('Apakah Anda yakin ingin mengosongkan draf formulir pendaftaran ini?')) {
      storage.clearPendaftaranDraft();
      setFormData({
        tahun_ajaran: '2026/2027',
        gelombang: 'Gelombang 1 (Januari - Juni 2026)',
        program_pilihan: initialPaket,
        jenis_pendaftaran: 'BARU',
        nama_lengkap: '',
        nisn: '',
        nik: '',
        nomor_kk: '',
        jenis_kelamin: 'L',
        tempat_lahir: '',
        tanggal_lahir: '',
        agama: 'ISLAM',
        kewarganegaraan: 'WNI',
        kebutuhan_khusus: 'Tidak Ada',
        anak_ke: 1,
        jumlah_saudara_kandung: 1,
        provinsi: 'Jawa Barat',
        kabupaten_kota: 'Kab. Bandung',
        kecamatan: 'Baleendah',
        desa_kelurahan: 'Baleendah',
        alamat_lengkap: '',
        rt: '01',
        rw: '01',
        dusun_kampung: '',
        kode_pos: '40375',
        status_tempat_tinggal: 'RUMAH_ORANG_TUA',
        moda_transportasi: 'SEPEDA_MOTOR',
        jarak_ke_pkbm: '1 - 3 km',
        waktu_tempuh_menit: 15,
        nomor_hp: '',
        nomor_wa: '',
        email: '',
        kontak_darurat_nama: '',
        kontak_darurat_nomor: '',
        kontak_darurat_hubungan: '',
        ayah_nama: '',
        ayah_nik: '',
        ayah_tahun_lahir: 1980,
        ayah_pendidikan: 'SMA/SMK',
        ayah_pekerjaan: 'Wiraswasta/Pedagang',
        ayah_penghasilan: 'Rp 2.000.000 - Rp 5.000.000',
        ayah_status: 'MASIH_HIDUP',
        ibu_nama: '',
        ibu_nik: '',
        ibu_tahun_lahir: 1982,
        ibu_pendidikan: 'SMP',
        ibu_pekerjaan: 'Ibu Rumah Tangga',
        ibu_penghasilan: 'Tidak Berpenghasilan',
        ibu_status: 'MASIH_HIDUP',
        tinggal_bersama: 'ORANG_TUA',
        wali_nama: '',
        wali_nik: '',
        wali_tahun_lahir: 1978,
        wali_pendidikan: 'SMA/SMK',
        wali_pekerjaan: 'Karyawan Swasta',
        wali_penghasilan: 'Rp 2.000.000 - Rp 5.000.000',
        wali_hubungan: 'Paman / Bibi',
        wali_telepon: '',
        tinggi_badan_cm: 165,
        berat_badan_kg: 55,
        lingkar_kepala_cm: 55,
        punya_kip: false,
        nomor_kip: '',
        punya_pkh: false,
        nomor_pkh: '',
        punya_kks: false,
        nomor_kks: '',
        sekolah_asal: '',
        npsn_sekolah_asal: '',
        nomor_seri_ijazah: '',
        tahun_lulus: 2023,
        status_pendidikan_terakhir: 'Lulus SMP / MTs',
        surat_pindah_nomor: '',
        surat_pindah_tanggal: '',
        dokumen: [],
        pas_foto_url: ''
      });
      setErrors({});
      setLastSavedTime(null);
      setCurrentStep(1);
    }
  };

  // Cascading Address Handlers
  const handleProvinsiChange = (prov: string) => {
    const kabs = getKabupatenByProvinsi(prov);
    const firstKab = kabs[0] || 'Lainnya';
    const kecs = getKecamatanByKabupaten(prov, firstKab);
    const firstKec = kecs[0] || 'Lainnya';
    const kels = getKelurahanByKecamatan(prov, firstKab, firstKec);
    const firstKel = kels[0] || 'Lainnya';

    setFormData(prev => ({
      ...prev,
      provinsi: prov,
      kabupaten_kota: firstKab,
      kecamatan: firstKec,
      desa_kelurahan: firstKel
    }));
  };

  const handleKabupatenChange = (kab: string) => {
    const kecs = getKecamatanByKabupaten(formData.provinsi, kab);
    const firstKec = kecs[0] || 'Lainnya';
    const kels = getKelurahanByKecamatan(formData.provinsi, kab, firstKec);
    const firstKel = kels[0] || 'Lainnya';

    setFormData(prev => ({
      ...prev,
      kabupaten_kota: kab,
      kecamatan: firstKec,
      desa_kelurahan: firstKel
    }));
  };

  const handleKecamatanChange = (kec: string) => {
    const kels = getKelurahanByKecamatan(formData.provinsi, formData.kabupaten_kota, kec);
    const firstKel = kels[0] || 'Lainnya';

    setFormData(prev => ({
      ...prev,
      kecamatan: kec,
      desa_kelurahan: firstKel
    }));
  };

  // Document Upload Handler (Base64)
  const handleFileUpload = (jenis: JenisDokumen, label: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5MB. Silakan pilih file yang lebih kecil.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64Url = reader.result as string;
      const newDoc: DokumenPendaftaran = {
        id: `DOC-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        jenis,
        label,
        nama_file: file.name,
        url: base64Url,
        tipe_file: file.type,
        ukuran_bytes: file.size,
        status_verifikasi: 'BELUM_DIVERIFIKASI',
        uploaded_at: new Date().toISOString()
      };

      setFormData(prev => {
        const filtered = prev.dokumen.filter(d => d.jenis !== jenis);
        const updated = {
          ...prev,
          dokumen: [...filtered, newDoc],
          pas_foto_url: jenis === 'PAS_FOTO' ? base64Url : prev.pas_foto_url
        };
        storage.savePendaftaranDraft(updated);
        return updated;
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveDoc = (jenis: JenisDokumen) => {
    setFormData(prev => {
      const updated = {
        ...prev,
        dokumen: prev.dokumen.filter(d => d.jenis !== jenis),
        pas_foto_url: jenis === 'PAS_FOTO' ? '' : prev.pas_foto_url
      };
      storage.savePendaftaranDraft(updated);
      return updated;
    });
  };

  // Step Validations
  const validateStep = (step: number): boolean => {
    const errs: FormErrors = {};

    if (step === 1) {
      // Step 1: Identitas
      if (!formData.nama_lengkap.trim()) errs.nama_lengkap = 'Nama lengkap wajib diisi sesuai ijazah/akta.';
      
      // NIK Validation
      const cleanNik = formData.nik.replace(/\D/g, '');
      if (!cleanNik) {
        errs.nik = 'NIK (Nomor Induk Kependudukan) wajib diisi.';
      } else if (cleanNik.length !== 16) {
        errs.nik = `NIK harus tepat 16 digit angka (saat ini: ${cleanNik.length} digit).`;
      }

      // KK Validation
      const cleanKK = formData.nomor_kk.replace(/\D/g, '');
      if (!cleanKK) {
        errs.nomor_kk = 'Nomor Kartu Keluarga (KK) wajib diisi.';
      } else if (cleanKK.length !== 16) {
        errs.nomor_kk = `Nomor KK harus tepat 16 digit angka (saat ini: ${cleanKK.length} digit).`;
      }

      // NISN Validation (optional but must be 10 digits if provided)
      if (formData.nisn) {
        const cleanNisn = formData.nisn.replace(/\D/g, '');
        if (cleanNisn.length !== 10) {
          errs.nisn = `NISN harus 10 digit angka (saat ini: ${cleanNisn.length} digit).`;
        }
      }

      if (!formData.tempat_lahir.trim()) errs.tempat_lahir = 'Tempat lahir wajib diisi.';
      if (!formData.tanggal_lahir) errs.tanggal_lahir = 'Tanggal lahir wajib dipilih.';
    } else if (step === 2) {
      // Step 2: Alamat & Kontak
      if (!formData.alamat_lengkap.trim()) errs.alamat_lengkap = 'Alamat jalan/gang/nomor rumah wajib diisi.';
      if (!formData.rt.trim()) errs.rt = 'RT wajib diisi.';
      if (!formData.rw.trim()) errs.rw = 'RW wajib diisi.';
      if (!formData.kode_pos.trim()) errs.kode_pos = 'Kode pos wajib diisi.';

      // Telepon & WA validation
      const cleanWa = formData.nomor_wa.replace(/\D/g, '');
      if (!cleanWa) {
        errs.nomor_wa = 'Nomor WhatsApp aktif wajib diisi untuk konfirmasi.';
      } else if (cleanWa.length < 10 || cleanWa.length > 14) {
        errs.nomor_wa = 'Nomor WhatsApp harus valid (antara 10 - 14 digit).';
      }

      // Email validation
      if (!formData.email.trim()) {
        errs.email = 'Alamat email aktif wajib diisi.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errs.email = 'Format email tidak valid (contoh: nama@email.com).';
      }
    } else if (step === 3) {
      // Step 3: Orang Tua / Wali
      if (!formData.ibu_nama.trim()) {
        errs.ibu_nama = 'Nama ibu kandung wajib diisi sesuai Akta Kelahiran/KK (Standar Dapodik).';
      }
      if (!formData.ayah_nama.trim() && formData.ayah_status === 'MASIH_HIDUP') {
        errs.ayah_nama = 'Nama ayah kandung wajib diisi.';
      }
      if (formData.tinggal_bersama === 'WALI' && !formData.wali_nama?.trim()) {
        errs.wali_nama = 'Nama wali wajib diisi jika tinggal bersama wali.';
      }
    } else if (step === 4) {
      // Step 4: Pendidikan Asal
      if (!formData.sekolah_asal.trim()) {
        errs.sekolah_asal = 'Nama sekolah asal terakhir wajib diisi.';
      }
      if (formData.jenis_pendaftaran === 'PINDAHAN' && !formData.surat_pindah_nomor?.trim()) {
        errs.surat_pindah_nomor = 'Nomor Surat Keterangan Pindah wajib diisi untuk siswa jalur pindahan.';
      }
    } else if (step === 5) {
      // Step 5: Dokumen
      const hasPasFoto = formData.dokumen.some(d => d.jenis === 'PAS_FOTO');
      const hasKK = formData.dokumen.some(d => d.jenis === 'KK');
      const hasAkta = formData.dokumen.some(d => d.jenis === 'AKTA_KELAHIRAN');
      const hasIjazah = formData.dokumen.some(d => d.jenis === 'IJAZAH');

      if (!hasPasFoto) errs.doc_pas_foto = 'Pas foto resmi terbaru wajib diunggah.';
      if (!hasKK) errs.doc_kk = 'Scan/Foto Kartu Keluarga (KK) wajib diunggah.';
      if (!hasAkta) errs.doc_akta = 'Scan/Foto Akta Kelahiran wajib diunggah.';
      if (!hasIjazah) errs.doc_ijazah = 'Scan/Foto Ijazah pendidikan terakhir wajib diunggah.';

      if (formData.jenis_pendaftaran === 'PINDAHAN') {
        const hasSuratPindah = formData.dokumen.some(d => d.jenis === 'SURAT_PINDAH');
        if (!hasSuratPindah) errs.doc_surat_pindah = 'Surat Keterangan Pindah Sekolah wajib diunggah.';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 6));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submit Final Registration
  const handleSubmitRegistration = async () => {
    if (!agreeTerms) {
      alert('Mohon centang pernyataan persetujuan keabsahan data terlebih dahulu.');
      return;
    }

    setIsSubmitting(true);
    try {
      const generatedNomor = storage.generateNomorPendaftaran(formData.program_pilihan);
      
      const newRegistration = storage.createPendaftaran({
        ...formData,
        nomor_pendaftaran: generatedNomor,
        status: 'DIAJUKAN',
        tanggal_pendaftaran: new Date().toISOString()
      });

      // Synchronize directly to Google Sheets database
      await googleSheetsSync.syncPPDBToGoogleSheets(newRegistration);

      // Clear draft
      storage.clearPendaftaranDraft();
      setSubmittedRecord(newRegistration);
      if (onSuccess) onSuccess(newRegistration);
    } catch (err) {
      console.error('Submit registration error:', err);
      alert('Terjadi kesalahan saat menyimpan pendaftaran. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const stepsConfig = [
    { number: 1, title: 'Identitas', desc: 'Data Diri Siswa', icon: User },
    { number: 2, title: 'Alamat', desc: 'Domisili & Kontak', icon: MapPin },
    { number: 3, title: 'Orang Tua', desc: 'Data Ayah, Ibu, Wali', icon: Users },
    { number: 4, title: 'Pendidikan', desc: 'Riwayat & Sekolah Asal', icon: GraduationCap },
    { number: 5, title: 'Dokumen', desc: 'Unggah Berkas Digital', icon: FileCheck },
    { number: 6, title: 'Konfirmasi', desc: 'Verifikasi & Pengajuan', icon: Award }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden my-auto max-h-[95vh] flex flex-col">
        
        {/* Header Bar */}
        <div className="px-6 py-4.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xl shadow-lg shadow-amber-400/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  Formulir Pendaftaran Warga Belajar 2026
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-slate-950 uppercase tracking-wider">
                  Dapodik Kemendikbud
                </span>
              </div>
              <p className="text-xs text-indigo-200/90">
                Pendidikan Kesetaraan Paket B (SMP) & Paket C (SMA) • PKBM Celah Cahaya
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {lastSavedTime && (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-300 bg-emerald-950/70 px-2.5 py-1 rounded-full border border-emerald-800/80 shadow-sm">
                  <Save className="w-3 h-3 text-emerald-400" />
                  <span>Autosave: {lastSavedTime}</span>
                </span>
                <button
                  type="button"
                  onClick={handleResetDraft}
                  title="Kosongkan draf & mulai baru"
                  className="text-[11px] text-rose-200 hover:text-rose-100 bg-rose-950/60 hover:bg-rose-900/80 px-2.5 py-1 rounded-full border border-rose-800/80 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span className="hidden sm:inline">Reset Draf</span>
                </button>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Multi-Step Wizard Progress Bar */}
        {!submittedRecord && (
          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 shrink-0">
            {/* Progress Percentage & Step Labels */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Langkah {currentStep} dari 6:
                </span>
                <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  {stepsConfig[currentStep - 1].title} — {stepsConfig[currentStep - 1].desc}
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                {Math.round((currentStep / 6) * 100)}% Selesai
              </span>
            </div>

            {/* Stepper Dots & Line */}
            <div className="grid grid-cols-6 gap-2 sm:gap-3">
              {stepsConfig.map((s) => {
                const IconComponent = s.icon;
                const isCurrent = currentStep === s.number;
                const isPassed = currentStep > s.number;

                return (
                  <button
                    key={s.number}
                    type="button"
                    onClick={() => {
                      if (s.number < currentStep || validateStep(currentStep)) {
                        setCurrentStep(s.number);
                      }
                    }}
                    className={`flex flex-col items-center gap-1.5 text-left p-1.5 sm:p-2 rounded-2xl transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-300 dark:border-indigo-700 shadow-sm'
                        : isPassed
                        ? 'text-emerald-600 dark:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        : 'text-slate-400 opacity-60'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                        isCurrent
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-2 ring-indigo-300 dark:ring-indigo-700'
                          : isPassed
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {isPassed ? <Check className="w-4 h-4" /> : <IconComponent className="w-4 h-4" />}
                    </div>
                    <span className={`text-[10px] sm:text-[11px] font-bold text-center truncate max-w-full ${
                      isCurrent ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'
                    }`}>
                      {s.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Scrollable Form Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 dark:text-slate-200">
          
          {/* SUCCESS CONFIRMATION SLIP */}
          {submittedRecord ? (
            <div className="space-y-6 text-center py-4 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-3xl mx-auto flex items-center justify-center shadow-xl">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  Pendaftaran Berhasil Dikirimkan!
                </span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  Bukti Pendaftaran Warga Belajar 2026
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
                  Simpan Nomor Pendaftaran Anda di bawah ini untuk mengecek status verifikasi berkas dan penerimaan.
                </p>
              </div>

              {/* Printable Slip Card */}
              <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 max-w-xl mx-auto text-left shadow-lg space-y-5">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider">
                      Nomor Registrasi Resmi
                    </p>
                    <p className="text-xl font-mono font-black text-indigo-600 dark:text-indigo-400">
                      {submittedRecord.nomor_pendaftaran}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 rounded-full text-xs font-bold border border-amber-300 dark:border-amber-800">
                    Menunggu Verifikasi
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <p className="text-[10px] text-slate-400">Nama Lengkap</p>
                    <p className="font-bold text-slate-900 dark:text-white">{submittedRecord.nama_lengkap}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">Program Pilihan</p>
                    <p className="font-bold text-indigo-600 dark:text-indigo-400">{submittedRecord.program_pilihan}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">Jalur Masuk</p>
                    <p className="font-bold text-slate-900 dark:text-white">{submittedRecord.jenis_pendaftaran}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">NIK (16 Digit)</p>
                    <p className="font-mono font-bold text-slate-900 dark:text-white">{submittedRecord.nik}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">Tanggal Daftar</p>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {new Date(submittedRecord.tanggal_pendaftaran).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">Tahun Ajaran</p>
                    <p className="font-bold text-slate-900 dark:text-white">{submittedRecord.tahun_ajaran}</p>
                  </div>
                </div>

                <div className="p-3.5 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 text-xs text-indigo-900 dark:text-indigo-200 space-y-1">
                  <p className="font-bold">Langkah Selanjutnya:</p>
                  <ol className="list-decimal list-inside text-[11px] space-y-0.5 opacity-90">
                    <li>Petugas verifikator Dapodik akan memeriksa kesesuaian dokumen Anda dalam 1x24 jam kerja.</li>
                    <li>Notifikasi status penerimaan akan dikirimkan melalui WhatsApp ke nomor <strong className="underline">{submittedRecord.nomor_wa}</strong>.</li>
                    <li>Anda juga dapat memantau status berkas sewaktu-waktu melalui tombol <strong>Cek Status Pendaftaran</strong> di beranda.</li>
                  </ol>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button
                    onClick={() => setShowPrintModal(true)}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-xs font-bold flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-600 cursor-pointer shadow-sm"
                  >
                    <Printer className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Cetak Bukti Pendaftaran</span>
                  </button>

                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md cursor-pointer transition-colors"
                  >
                    Selesai & Tutup
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* STEP 1: IDENTITAS WARGA BELAJAR */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  {/* Program Selection Card */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div
                      onClick={() => handleFieldChange('program_pilihan', 'PAKET B')}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        formData.program_pilihan === 'PAKET B'
                          ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 shadow-md ring-2 ring-indigo-300'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase">
                          Program Pilihan
                        </span>
                        <input
                          type="radio"
                          name="program_pilihan"
                          checked={formData.program_pilihan === 'PAKET B'}
                          onChange={() => handleFieldChange('program_pilihan', 'PAKET B')}
                          className="w-4 h-4 text-indigo-600"
                        />
                      </div>
                      <h4 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                        Paket B (Setara SMP/MTs)
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Untuk lulusan SD/MI atau putus sekolah SMP. Kurikulum Merdeka Terintegrasi.
                      </p>
                    </div>

                    <div
                      onClick={() => handleFieldChange('program_pilihan', 'PAKET C')}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        formData.program_pilihan === 'PAKET C'
                          ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 shadow-md ring-2 ring-indigo-300'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase">
                          Program Pilihan
                        </span>
                        <input
                          type="radio"
                          name="program_pilihan"
                          checked={formData.program_pilihan === 'PAKET C'}
                          onChange={() => handleFieldChange('program_pilihan', 'PAKET C')}
                          className="w-4 h-4 text-indigo-600"
                        />
                      </div>
                      <h4 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                        Paket C (Setara SMA/SMK/MA)
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Untuk lulusan SMP/MTs/Paket B atau putus sekolah SMA. Ijazah resmi nasional.
                      </p>
                    </div>
                  </div>

                  {/* Jenis Pendaftaran & Gelombang */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Jalur Masuk <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={formData.jenis_pendaftaran}
                        onChange={(e) => handleFieldChange('jenis_pendaftaran', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="BARU">Siswa Baru (Lulus Jenjang Sebelumnya)</option>
                        <option value="PINDAHAN">Pindahan dari Sekolah Formal / PKBM Lain</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Tahun Ajaran
                      </label>
                      <input
                        type="text"
                        disabled
                        value={formData.tahun_ajaran}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 text-xs font-bold text-slate-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Gelombang PPDB
                      </label>
                      <input
                        type="text"
                        disabled
                        value={formData.gelombang}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 text-xs font-bold text-slate-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Biodata Fields */}
                  <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <h3 className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Biodata Sesuai Akta Kelahiran & Kartu Keluarga (KK)
                    </h3>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Nama Lengkap Siswa <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Masukkan nama lengkap tanpa gelar singkat"
                        value={formData.nama_lengkap}
                        onChange={(e) => handleFieldChange('nama_lengkap', e.target.value)}
                        className={`w-full px-3.5 py-2.5 rounded-xl border ${
                          errors.nama_lengkap ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-300 dark:border-slate-700'
                        } bg-white dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-indigo-500`}
                      />
                      {errors.nama_lengkap && (
                        <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1 font-medium">
                          <AlertCircle className="w-3.5 h-3.5" /> {errors.nama_lengkap}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          Nomor Induk Kependudukan (NIK) <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          maxLength={16}
                          placeholder="16 digit angka NIK KTP/KIA/KK"
                          value={formData.nik}
                          onChange={(e) => handleFieldChange('nik', e.target.value.replace(/\D/g, ''))}
                          className={`w-full px-3.5 py-2.5 rounded-xl border font-mono text-xs ${
                            errors.nik ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-300 dark:border-slate-700'
                          } bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-indigo-500`}
                        />
                        {errors.nik ? (
                          <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1 font-medium">
                            <AlertCircle className="w-3.5 h-3.5" /> {errors.nik}
                          </p>
                        ) : (
                          <p className="text-[10px] text-slate-400 mt-1">{formData.nik.length}/16 digit</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          Nomor Kartu Keluarga (KK) <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          maxLength={16}
                          placeholder="16 digit nomor KK di bagian atas"
                          value={formData.nomor_kk}
                          onChange={(e) => handleFieldChange('nomor_kk', e.target.value.replace(/\D/g, ''))}
                          className={`w-full px-3.5 py-2.5 rounded-xl border font-mono text-xs ${
                            errors.nomor_kk ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-300 dark:border-slate-700'
                          } bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-indigo-500`}
                        />
                        {errors.nomor_kk ? (
                          <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1 font-medium">
                            <AlertCircle className="w-3.5 h-3.5" /> {errors.nomor_kk}
                          </p>
                        ) : (
                          <p className="text-[10px] text-slate-400 mt-1">{formData.nomor_kk.length}/16 digit</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          NISN (Nomor Induk Siswa Nasional)
                        </label>
                        <input
                          type="text"
                          maxLength={10}
                          placeholder="10 digit (jika ada)"
                          value={formData.nisn}
                          onChange={(e) => handleFieldChange('nisn', e.target.value.replace(/\D/g, ''))}
                          className={`w-full px-3.5 py-2.5 rounded-xl border font-mono text-xs ${
                            errors.nisn ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-300 dark:border-slate-700'
                          } bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-indigo-500`}
                        />
                        {errors.nisn && (
                          <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1 font-medium">
                            <AlertCircle className="w-3.5 h-3.5" /> {errors.nisn}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          Jenis Kelamin <span className="text-rose-500">*</span>
                        </label>
                        <div className="flex gap-4 pt-1.5">
                          <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                            <input
                              type="radio"
                              name="jenis_kelamin"
                              checked={formData.jenis_kelamin === 'L'}
                              onChange={() => handleFieldChange('jenis_kelamin', 'L')}
                              className="text-indigo-600"
                            />
                            <span>Laki-Laki</span>
                          </label>
                          <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                            <input
                              type="radio"
                              name="jenis_kelamin"
                              checked={formData.jenis_kelamin === 'P'}
                              onChange={() => handleFieldChange('jenis_kelamin', 'P')}
                              className="text-indigo-600"
                            />
                            <span>Perempuan</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          Agama <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={formData.agama}
                          onChange={(e) => handleFieldChange('agama', e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="ISLAM">Islam</option>
                          <option value="KRISTEN">Kristen Protestan</option>
                          <option value="KATOLIK">Katolik</option>
                          <option value="HINDU">Hindu</option>
                          <option value="BUDDHA">Buddha</option>
                          <option value="KONGHUCU">Konghucu</option>
                          <option value="LAINNYA">Lainnya</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          Tempat Lahir <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Kota / Kabupaten tempat lahir"
                          value={formData.tempat_lahir}
                          onChange={(e) => handleFieldChange('tempat_lahir', e.target.value)}
                          className={`w-full px-3.5 py-2.5 rounded-xl border ${
                            errors.tempat_lahir ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-300 dark:border-slate-700'
                          } bg-white dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-indigo-500`}
                        />
                        {errors.tempat_lahir && (
                          <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1 font-medium">
                            <AlertCircle className="w-3.5 h-3.5" /> {errors.tempat_lahir}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          Tanggal Lahir <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={formData.tanggal_lahir}
                          onChange={(e) => handleFieldChange('tanggal_lahir', e.target.value)}
                          className={`w-full px-3.5 py-2.5 rounded-xl border ${
                            errors.tanggal_lahir ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-300 dark:border-slate-700'
                          } bg-white dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-indigo-500`}
                        />
                        {errors.tanggal_lahir && (
                          <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1 font-medium">
                            <AlertCircle className="w-3.5 h-3.5" /> {errors.tanggal_lahir}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          Anak Ke-
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={20}
                          value={formData.anak_ke}
                          onChange={(e) => handleFieldChange('anak_ke', parseInt(e.target.value) || 1)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          Jumlah Saudara Kandung
                        </label>
                        <input
                          type="number"
                          min={0}
                          max={20}
                          value={formData.jumlah_saudara_kandung}
                          onChange={(e) => handleFieldChange('jumlah_saudara_kandung', parseInt(e.target.value) || 0)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          Kebutuhan Khusus
                        </label>
                        <select
                          value={formData.kebutuhan_khusus}
                          onChange={(e) => handleFieldChange('kebutuhan_khusus', e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="Tidak Ada">Tidak Ada</option>
                          <option value="Netra">Netra (A)</option>
                          <option value="Rungu">Rungu (B)</option>
                          <option value="Grahita">Grahita (C)</option>
                          <option value="Daksa">Daksa (D)</option>
                          <option value="Laras">Laras (E)</option>
                          <option value="Lainnya">Lainnya</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: ALAMAT & KONTAK */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h3 className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Alamat Domisili Tempat Tinggal (Dapodik)
                  </h3>

                  {/* Cascading Wilayah Selectors */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Provinsi <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={formData.provinsi}
                        onChange={(e) => handleProvinsiChange(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {DAFTAR_PROVINSI.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Kabupaten / Kota <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={formData.kabupaten_kota}
                        onChange={(e) => handleKabupatenChange(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {getKabupatenByProvinsi(formData.provinsi).map((k) => (
                          <option key={k} value={k}>{k}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Kecamatan <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={formData.kecamatan}
                        onChange={(e) => handleKecamatanChange(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {getKecamatanByKabupaten(formData.provinsi, formData.kabupaten_kota).map((kc) => (
                          <option key={kc} value={kc}>{kc}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Kelurahan / Desa <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={formData.desa_kelurahan}
                        onChange={(e) => handleFieldChange('desa_kelurahan', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {getKelurahanByKecamatan(formData.provinsi, formData.kabupaten_kota, formData.kecamatan).map((kl) => (
                          <option key={kl} value={kl}>{kl}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Detail Alamat & RT RW */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Alamat Lengkap (Nama Jalan / Gang / No. Rumah) <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Contoh: Jl. Terusan Buahbatu No. 45 Blok C"
                      value={formData.alamat_lengkap}
                      onChange={(e) => handleFieldChange('alamat_lengkap', e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl border ${
                        errors.alamat_lengkap ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-300 dark:border-slate-700'
                      } bg-white dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-indigo-500`}
                    />
                    {errors.alamat_lengkap && (
                      <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.alamat_lengkap}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        RT <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        maxLength={4}
                        placeholder="01"
                        value={formData.rt}
                        onChange={(e) => handleFieldChange('rt', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        RW <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        maxLength={4}
                        placeholder="05"
                        value={formData.rw}
                        onChange={(e) => handleFieldChange('rw', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Dusun / Kampung
                      </label>
                      <input
                        type="text"
                        placeholder="Nama Dusun"
                        value={formData.dusun_kampung}
                        onChange={(e) => handleFieldChange('dusun_kampung', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Kode Pos <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        maxLength={5}
                        placeholder="40287"
                        value={formData.kode_pos}
                        onChange={(e) => handleFieldChange('kode_pos', e.target.value.replace(/\D/g, ''))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Kontak & Transportasi */}
                  <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <h3 className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Informasi Kontak & Aksesibilitas
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          Nomor WhatsApp (Aktif) <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="tel"
                          placeholder="081234567890"
                          value={formData.nomor_wa}
                          onChange={(e) => {
                            const val = e.target.value;
                            handleFieldChange('nomor_wa', val);
                            if (!formData.nomor_hp) handleFieldChange('nomor_hp', val);
                          }}
                          className={`w-full px-3.5 py-2.5 rounded-xl border font-mono text-xs ${
                            errors.nomor_wa ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-300 dark:border-slate-700'
                          } bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-indigo-500`}
                        />
                        {errors.nomor_wa && (
                          <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1 font-medium">
                            <AlertCircle className="w-3.5 h-3.5" /> {errors.nomor_wa}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          Alamat Email Siswa <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="email"
                          placeholder="siswa@gmail.com"
                          value={formData.email}
                          onChange={(e) => handleFieldChange('email', e.target.value)}
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-xs ${
                            errors.email ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-300 dark:border-slate-700'
                          } bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-indigo-500`}
                        />
                        {errors.email && (
                          <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1 font-medium">
                            <AlertCircle className="w-3.5 h-3.5" /> {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          Status Tempat Tinggal
                        </label>
                        <select
                          value={formData.status_tempat_tinggal}
                          onChange={(e) => handleFieldChange('status_tempat_tinggal', e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="RUMAH_ORANG_TUA">Rumah Orang Tua</option>
                          <option value="MILIK_SENDIRI">Milik Sendiri</option>
                          <option value="SEWA_KONTRAK">Sewa / Kontrak / Kost</option>
                          <option value="MENUMPANG">Menumpang Saudara</option>
                          <option value="ASRAMA">Asrama / Panti</option>
                          <option value="LAINNYA">Lainnya</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          Moda Transportasi
                        </label>
                        <select
                          value={formData.moda_transportasi}
                          onChange={(e) => handleFieldChange('moda_transportasi', e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="SEPEDA_MOTOR">Sepeda Motor</option>
                          <option value="ANGKUTAN_UMUM">Angkutan Umum / Bus</option>
                          <option value="JALAN_KAKI">Jalan Kaki</option>
                          <option value="SEPEDA">Sepeda</option>
                          <option value="OJEK_ONLINE">Ojek Online</option>
                          <option value="KENDARAAN_PRIBADI">Mobil Pribadi</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          Jarak ke Kampus PKBM
                        </label>
                        <select
                          value={formData.jarak_ke_pkbm}
                          onChange={(e) => handleFieldChange('jarak_ke_pkbm', e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="< 1 km">&lt; 1 km</option>
                          <option value="1 - 3 km">1 - 3 km</option>
                          <option value="3 - 5 km">3 - 5 km</option>
                          <option value="5 - 10 km">5 - 10 km</option>
                          <option value="> 10 km">&gt; 10 km (Luar Kota / Daring)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: ORANG TUA / WALI */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  {/* DATA IBU KANDUNG (MANDATORY DAPODIK) */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Users className="w-4 h-4" />
                        <span>Data Ibu Kandung (Wajib Sesuai Akta / KK)</span>
                      </h4>
                      <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-md font-bold">
                        Wajib Dapodik
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          Nama Ibu Kandung <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Nama lengkap ibu kandung"
                          value={formData.ibu_nama}
                          onChange={(e) => handleFieldChange('ibu_nama', e.target.value)}
                          className={`w-full px-3.5 py-2.5 rounded-xl border ${
                            errors.ibu_nama ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-300 dark:border-slate-700'
                          } bg-white dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-indigo-500`}
                        />
                        {errors.ibu_nama && (
                          <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1 font-medium">
                            <AlertCircle className="w-3.5 h-3.5" /> {errors.ibu_nama}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          NIK Ibu (16 Digit)
                        </label>
                        <input
                          type="text"
                          maxLength={16}
                          placeholder="16 digit NIK Ibu (jika ada)"
                          value={formData.ibu_nik}
                          onChange={(e) => handleFieldChange('ibu_nik', e.target.value.replace(/\D/g, ''))}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          Status Ibu
                        </label>
                        <select
                          value={formData.ibu_status}
                          onChange={(e) => handleFieldChange('ibu_status', e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold outline-none"
                        >
                          <option value="MASIH_HIDUP">Masih Hidup</option>
                          <option value="MENINGGAL">Meninggal Dunia</option>
                          <option value="TIDAK_DIKETAHUI">Tidak Diketahui</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          Pendidikan Terakhir
                        </label>
                        <select
                          value={formData.ibu_pendidikan}
                          onChange={(e) => handleFieldChange('ibu_pendidikan', e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs outline-none"
                        >
                          <option value="SD/Sederajat">SD / Sederajat</option>
                          <option value="SMP">SMP / MTs</option>
                          <option value="SMA/SMK">SMA / SMK / MA</option>
                          <option value="D3/D4">Diploma (D3/D4)</option>
                          <option value="S1">Sarjana (S1)</option>
                          <option value="S2/S3">Pascasarjana (S2/S3)</option>
                          <option value="Tidak Sekolah">Tidak Sekolah</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          Pekerjaan
                        </label>
                        <select
                          value={formData.ibu_pekerjaan}
                          onChange={(e) => handleFieldChange('ibu_pekerjaan', e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs outline-none"
                        >
                          <option value="Ibu Rumah Tangga">Ibu Rumah Tangga</option>
                          <option value="Wiraswasta/Pedagang">Wiraswasta / Pedagang</option>
                          <option value="Karyawan Swasta">Karyawan Swasta</option>
                          <option value="PNS/TNI/Polri">PNS / TNI / Polri</option>
                          <option value="Petani/Nelayan">Petani / Nelayan</option>
                          <option value="Buruh">Buruh / Harian Lepas</option>
                          <option value="Lainnya">Lainnya</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          Penghasilan
                        </label>
                        <select
                          value={formData.ibu_penghasilan}
                          onChange={(e) => handleFieldChange('ibu_penghasilan', e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs outline-none"
                        >
                          <option value="Tidak Berpenghasilan">Tidak Berpenghasilan</option>
                          <option value="< Rp 1.000.000">&lt; Rp 1.000.000</option>
                          <option value="Rp 1.000.000 - Rp 2.000.000">Rp 1.000.000 - Rp 2.000.000</option>
                          <option value="Rp 2.000.000 - Rp 5.000.000">Rp 2.000.000 - Rp 5.000.000</option>
                          <option value="> Rp 5.000.000">&gt; Rp 5.000.000</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* DATA AYAH KANDUNG */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-4">
                    <h4 className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Users className="w-4 h-4" />
                      <span>Data Ayah Kandung</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          Nama Ayah Kandung {formData.ayah_status === 'MASIH_HIDUP' && <span className="text-rose-500">*</span>}
                        </label>
                        <input
                          type="text"
                          placeholder="Nama lengkap ayah kandung"
                          value={formData.ayah_nama}
                          onChange={(e) => handleFieldChange('ayah_nama', e.target.value)}
                          className={`w-full px-3.5 py-2.5 rounded-xl border ${
                            errors.ayah_nama ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-300 dark:border-slate-700'
                          } bg-white dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-indigo-500`}
                        />
                        {errors.ayah_nama && (
                          <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1 font-medium">
                            <AlertCircle className="w-3.5 h-3.5" /> {errors.ayah_nama}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          NIK Ayah (16 Digit)
                        </label>
                        <input
                          type="text"
                          maxLength={16}
                          placeholder="16 digit NIK Ayah (jika ada)"
                          value={formData.ayah_nik}
                          onChange={(e) => handleFieldChange('ayah_nik', e.target.value.replace(/\D/g, ''))}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          Status Ayah
                        </label>
                        <select
                          value={formData.ayah_status}
                          onChange={(e) => handleFieldChange('ayah_status', e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold outline-none"
                        >
                          <option value="MASIH_HIDUP">Masih Hidup</option>
                          <option value="MENINGGAL">Meninggal Dunia</option>
                          <option value="TIDAK_DIKETAHUI">Tidak Diketahui</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          Pendidikan Terakhir
                        </label>
                        <select
                          value={formData.ayah_pendidikan}
                          onChange={(e) => handleFieldChange('ayah_pendidikan', e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs outline-none"
                        >
                          <option value="SD/Sederajat">SD / Sederajat</option>
                          <option value="SMP">SMP / MTs</option>
                          <option value="SMA/SMK">SMA / SMK / MA</option>
                          <option value="D3/D4">Diploma (D3/D4)</option>
                          <option value="S1">Sarjana (S1)</option>
                          <option value="S2/S3">Pascasarjana (S2/S3)</option>
                          <option value="Tidak Sekolah">Tidak Sekolah</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          Pekerjaan
                        </label>
                        <select
                          value={formData.ayah_pekerjaan}
                          onChange={(e) => handleFieldChange('ayah_pekerjaan', e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs outline-none"
                        >
                          <option value="Wiraswasta/Pedagang">Wiraswasta / Pedagang</option>
                          <option value="Karyawan Swasta">Karyawan Swasta</option>
                          <option value="Buruh">Buruh / Pekerja Lepas</option>
                          <option value="PNS/TNI/Polri">PNS / TNI / Polri</option>
                          <option value="Petani/Nelayan">Petani / Nelayan</option>
                          <option value="Pensiunan">Pensiunan</option>
                          <option value="Tidak Bekerja">Tidak Bekerja</option>
                          <option value="Lainnya">Lainnya</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          Penghasilan
                        </label>
                        <select
                          value={formData.ayah_penghasilan}
                          onChange={(e) => handleFieldChange('ayah_penghasilan', e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs outline-none"
                        >
                          <option value="Rp 2.000.000 - Rp 5.000.000">Rp 2.000.000 - Rp 5.000.000</option>
                          <option value="Rp 1.000.000 - Rp 2.000.000">Rp 1.000.000 - Rp 2.000.000</option>
                          <option value="< Rp 1.000.000">&lt; Rp 1.000.000</option>
                          <option value="> Rp 5.000.000">&gt; Rp 5.000.000</option>
                          <option value="Tidak Berpenghasilan">Tidak Berpenghasilan</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* DATA WALI (KONDISIONAL) */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h4 className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Status Tempat Tinggal / Perwalian
                      </h4>

                      <select
                        value={formData.tinggal_bersama}
                        onChange={(e) => handleFieldChange('tinggal_bersama', e.target.value)}
                        className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold outline-none"
                      >
                        <option value="ORANG_TUA">Tinggal Bersama Orang Tua</option>
                        <option value="WALI">Tinggal Bersama Wali (Paman/Bibi/Kakek/Nenek)</option>
                        <option value="SENDIRI">Tinggal Sendiri / Mandiri</option>
                        <option value="ASRAMA_PANTI">Asrama / Panti Asuhan</option>
                      </select>
                    </div>

                    {formData.tinggal_bersama === 'WALI' && (
                      <div className="space-y-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                              Nama Lengkap Wali <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="text"
                              placeholder="Nama wali yang bertanggung jawab"
                              value={formData.wali_nama}
                              onChange={(e) => handleFieldChange('wali_nama', e.target.value)}
                              className={`w-full px-3.5 py-2.5 rounded-xl border ${
                                errors.wali_nama ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-300 dark:border-slate-700'
                              } bg-white dark:bg-slate-800 text-xs outline-none`}
                            />
                            {errors.wali_nama && (
                              <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1 font-medium">
                                <AlertCircle className="w-3.5 h-3.5" /> {errors.wali_nama}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                              Hubungan dengan Siswa
                            </label>
                            <input
                              type="text"
                              placeholder="Contoh: Paman / Kakek / Saudara"
                              value={formData.wali_hubungan}
                              onChange={(e) => handleFieldChange('wali_hubungan', e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                              Nomor Telepon/WA Wali
                            </label>
                            <input
                              type="tel"
                              placeholder="081234567890"
                              value={formData.wali_telepon}
                              onChange={(e) => handleFieldChange('wali_telepon', e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-xs outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                              Pekerjaan Wali
                            </label>
                            <input
                              type="text"
                              placeholder="Pekerjaan wali"
                              value={formData.wali_pekerjaan}
                              onChange={(e) => handleFieldChange('wali_pekerjaan', e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 4: PENDIDIKAN & PERIODIK */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  {/* RIWAYAT PENDIDIKAN ASAL */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Riwayat Pendidikan Terakhir
                    </h3>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Nama Sekolah Asal Terakhir <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: SMP Negeri 2 Cileunyi / SD Negeri 03 Buahbatu"
                        value={formData.sekolah_asal}
                        onChange={(e) => handleFieldChange('sekolah_asal', e.target.value)}
                        className={`w-full px-3.5 py-2.5 rounded-xl border ${
                          errors.sekolah_asal ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-300 dark:border-slate-700'
                        } bg-white dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-indigo-500`}
                      />
                      {errors.sekolah_asal && (
                        <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1 font-medium">
                          <AlertCircle className="w-3.5 h-3.5" /> {errors.sekolah_asal}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          NPSN Sekolah Asal (8 Digit)
                        </label>
                        <input
                          type="text"
                          maxLength={8}
                          placeholder="20219876"
                          value={formData.npsn_sekolah_asal}
                          onChange={(e) => handleFieldChange('npsn_sekolah_asal', e.target.value.replace(/\D/g, ''))}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-xs outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          Nomor Seri Ijazah Terakhir
                        </label>
                        <input
                          type="text"
                          placeholder="DN-02/D-SMP/13/00123"
                          value={formData.nomor_seri_ijazah}
                          onChange={(e) => handleFieldChange('nomor_seri_ijazah', e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-xs outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          Tahun Lulus
                        </label>
                        <input
                          type="number"
                          min={1970}
                          max={2026}
                          value={formData.tahun_lulus}
                          onChange={(e) => handleFieldChange('tahun_lulus', parseInt(e.target.value) || 2023)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs outline-none"
                        />
                      </div>
                    </div>

                    {/* Jika Siswa Pindahan */}
                    {formData.jenis_pendaftaran === 'PINDAHAN' && (
                      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 space-y-4">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-600" />
                          <h4 className="text-xs font-bold text-amber-900 dark:text-amber-300">
                            Khusus Siswa Pindahan (Wajib Melampirkan Surat Pindah & Rapor)
                          </h4>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-amber-900 dark:text-amber-200 mb-1.5">
                              Nomor Surat Keterangan Pindah <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="text"
                              placeholder="421.3/089/SMP-PAS/2026"
                              value={formData.surat_pindah_nomor}
                              onChange={(e) => handleFieldChange('surat_pindah_nomor', e.target.value)}
                              className={`w-full px-3.5 py-2.5 rounded-xl border ${
                                errors.surat_pindah_nomor ? 'border-rose-500' : 'border-amber-300 dark:border-amber-700'
                              } bg-white dark:bg-slate-800 text-xs outline-none`}
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-amber-900 dark:text-amber-200 mb-1.5">
                              Tanggal Surat Pindah
                            </label>
                            <input
                              type="date"
                              value={formData.surat_pindah_tanggal}
                              onChange={(e) => handleFieldChange('surat_pindah_tanggal', e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-800 text-xs outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* DATA PERIODIK & PROGRAM KESEJAHTERAAN */}
                  <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <h3 className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Data Periodik Fisik Siswa (Dapodik)
                    </h3>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          Tinggi Badan (cm)
                        </label>
                        <input
                          type="number"
                          min={50}
                          max={220}
                          value={formData.tinggi_badan_cm}
                          onChange={(e) => handleFieldChange('tinggi_badan_cm', parseInt(e.target.value) || 160)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          Berat Badan (kg)
                        </label>
                        <input
                          type="number"
                          min={20}
                          max={150}
                          value={formData.berat_badan_kg}
                          onChange={(e) => handleFieldChange('berat_badan_kg', parseInt(e.target.value) || 50)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          Lingkar Kepala (cm)
                        </label>
                        <input
                          type="number"
                          min={30}
                          max={80}
                          value={formData.lingkar_kepala_cm}
                          onChange={(e) => handleFieldChange('lingkar_kepala_cm', parseInt(e.target.value) || 55)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* KARTU BANTUAN SOSIAL / PIP */}
                  <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <h3 className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Kartu Kesejahteraan Sosial (PIP / KIP / PKH / KKS)
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 space-y-2">
                        <label className="flex items-center justify-between cursor-pointer">
                          <span className="text-xs font-bold text-slate-800 dark:text-white">Penerima KIP / PIP</span>
                          <input
                            type="checkbox"
                            checked={formData.punya_kip}
                            onChange={(e) => handleFieldChange('punya_kip', e.target.checked)}
                            className="w-4 h-4 text-indigo-600 rounded"
                          />
                        </label>
                        {formData.punya_kip && (
                          <input
                            type="text"
                            placeholder="Nomor KIP"
                            value={formData.nomor_kip}
                            onChange={(e) => handleFieldChange('nomor_kip', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 text-xs font-mono outline-none"
                          />
                        )}
                      </div>

                      <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 space-y-2">
                        <label className="flex items-center justify-between cursor-pointer">
                          <span className="text-xs font-bold text-slate-800 dark:text-white">Penerima PKH</span>
                          <input
                            type="checkbox"
                            checked={formData.punya_pkh}
                            onChange={(e) => handleFieldChange('punya_pkh', e.target.checked)}
                            className="w-4 h-4 text-indigo-600 rounded"
                          />
                        </label>
                        {formData.punya_pkh && (
                          <input
                            type="text"
                            placeholder="Nomor PKH"
                            value={formData.nomor_pkh}
                            onChange={(e) => handleFieldChange('nomor_pkh', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 text-xs font-mono outline-none"
                          />
                        )}
                      </div>

                      <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 space-y-2">
                        <label className="flex items-center justify-between cursor-pointer">
                          <span className="text-xs font-bold text-slate-800 dark:text-white">Penerima KKS</span>
                          <input
                            type="checkbox"
                            checked={formData.punya_kks}
                            onChange={(e) => handleFieldChange('punya_kks', e.target.checked)}
                            className="w-4 h-4 text-indigo-600 rounded"
                          />
                        </label>
                        {formData.punya_kks && (
                          <input
                            type="text"
                            placeholder="Nomor KKS"
                            value={formData.nomor_kks}
                            onChange={(e) => handleFieldChange('nomor_kks', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 text-xs font-mono outline-none"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: DOKUMEN DIGITAL */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 text-xs text-indigo-900 dark:text-indigo-200 flex items-center gap-3">
                    <Shield className="w-5 h-5 text-indigo-600 shrink-0" />
                    <span>
                      Unggah scan atau foto dokumen yang jelas, terbaca, dan tidak terpotong (format PDF, JPG, atau PNG maksimal 5MB per berkas).
                    </span>
                  </div>

                  {/* Required Documents Upload Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* 1. Pas Foto */}
                    <div className={`p-4 rounded-2xl border ${
                      errors.doc_pas_foto ? 'border-rose-500 bg-rose-50/40' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50'
                    } space-y-3`}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          1. Pas Foto Resmi 3x4 (Background Merah/Biru) <span className="text-rose-500">*</span>
                        </span>
                        {formData.dokumen.some(d => d.jenis === 'PAS_FOTO') && (
                          <span className="text-emerald-600 text-xs font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Terunggah
                          </span>
                        )}
                      </div>

                      {formData.dokumen.find(d => d.jenis === 'PAS_FOTO') ? (
                        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
                          <img
                            src={formData.dokumen.find(d => d.jenis === 'PAS_FOTO')?.url}
                            alt="Pas Foto"
                            className="w-12 h-14 object-cover rounded-lg border border-slate-300"
                          />
                          <div className="flex-1 min-w-0 text-xs">
                            <p className="font-bold truncate text-slate-900 dark:text-white">
                              {formData.dokumen.find(d => d.jenis === 'PAS_FOTO')?.nama_file}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {((formData.dokumen.find(d => d.jenis === 'PAS_FOTO')?.ukuran_bytes || 0) / 1024).toFixed(0)} KB
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveDoc('PAS_FOTO')}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 flex flex-col items-center justify-center gap-1 text-xs text-slate-500 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-900/30">
                          <Upload className="w-5 h-5 text-slate-400" />
                          <span className="font-bold">Pilih File Pas Foto</span>
                          <span className="text-[10px] text-slate-400">JPG, PNG (Maks. 5MB)</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload('PAS_FOTO', 'Pas Foto Resmi 3x4', e)}
                            className="hidden"
                          />
                        </label>
                      )}
                      {errors.doc_pas_foto && (
                        <p className="text-[11px] text-rose-500 font-medium">{errors.doc_pas_foto}</p>
                      )}
                    </div>

                    {/* 2. Kartu Keluarga (KK) */}
                    <div className={`p-4 rounded-2xl border ${
                      errors.doc_kk ? 'border-rose-500 bg-rose-50/40' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50'
                    } space-y-3`}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          2. Scan Kartu Keluarga (KK) <span className="text-rose-500">*</span>
                        </span>
                        {formData.dokumen.some(d => d.jenis === 'KK') && (
                          <span className="text-emerald-600 text-xs font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Terunggah
                          </span>
                        )}
                      </div>

                      {formData.dokumen.find(d => d.jenis === 'KK') ? (
                        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
                          <FileText className="w-8 h-8 text-indigo-500 shrink-0" />
                          <div className="flex-1 min-w-0 text-xs">
                            <p className="font-bold truncate text-slate-900 dark:text-white">
                              {formData.dokumen.find(d => d.jenis === 'KK')?.nama_file}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {((formData.dokumen.find(d => d.jenis === 'KK')?.ukuran_bytes || 0) / 1024).toFixed(0)} KB
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveDoc('KK')}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 flex flex-col items-center justify-center gap-1 text-xs text-slate-500 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-900/30">
                          <Upload className="w-5 h-5 text-slate-400" />
                          <span className="font-bold">Pilih Scan / Foto KK</span>
                          <span className="text-[10px] text-slate-400">PDF, JPG, PNG (Maks. 5MB)</span>
                          <input
                            type="file"
                            accept=".pdf,image/*"
                            onChange={(e) => handleFileUpload('KK', 'Kartu Keluarga (KK)', e)}
                            className="hidden"
                          />
                        </label>
                      )}
                      {errors.doc_kk && (
                        <p className="text-[11px] text-rose-500 font-medium">{errors.doc_kk}</p>
                      )}
                    </div>

                    {/* 3. Akta Kelahiran */}
                    <div className={`p-4 rounded-2xl border ${
                      errors.doc_akta ? 'border-rose-500 bg-rose-50/40' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50'
                    } space-y-3`}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          3. Scan Akta Kelahiran <span className="text-rose-500">*</span>
                        </span>
                        {formData.dokumen.some(d => d.jenis === 'AKTA_KELAHIRAN') && (
                          <span className="text-emerald-600 text-xs font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Terunggah
                          </span>
                        )}
                      </div>

                      {formData.dokumen.find(d => d.jenis === 'AKTA_KELAHIRAN') ? (
                        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
                          <FileText className="w-8 h-8 text-indigo-500 shrink-0" />
                          <div className="flex-1 min-w-0 text-xs">
                            <p className="font-bold truncate text-slate-900 dark:text-white">
                              {formData.dokumen.find(d => d.jenis === 'AKTA_KELAHIRAN')?.nama_file}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {((formData.dokumen.find(d => d.jenis === 'AKTA_KELAHIRAN')?.ukuran_bytes || 0) / 1024).toFixed(0)} KB
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveDoc('AKTA_KELAHIRAN')}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 flex flex-col items-center justify-center gap-1 text-xs text-slate-500 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-900/30">
                          <Upload className="w-5 h-5 text-slate-400" />
                          <span className="font-bold">Pilih Scan Akta Kelahiran</span>
                          <span className="text-[10px] text-slate-400">PDF, JPG, PNG (Maks. 5MB)</span>
                          <input
                            type="file"
                            accept=".pdf,image/*"
                            onChange={(e) => handleFileUpload('AKTA_KELAHIRAN', 'Akta Kelahiran', e)}
                            className="hidden"
                          />
                        </label>
                      )}
                      {errors.doc_akta && (
                        <p className="text-[11px] text-rose-500 font-medium">{errors.doc_akta}</p>
                      )}
                    </div>

                    {/* 4. Ijazah / SKHUN Terakhir */}
                    <div className={`p-4 rounded-2xl border ${
                      errors.doc_ijazah ? 'border-rose-500 bg-rose-50/40' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50'
                    } space-y-3`}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          4. Scan Ijazah / SKHUN Terakhir <span className="text-rose-500">*</span>
                        </span>
                        {formData.dokumen.some(d => d.jenis === 'IJAZAH') && (
                          <span className="text-emerald-600 text-xs font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Terunggah
                          </span>
                        )}
                      </div>

                      {formData.dokumen.find(d => d.jenis === 'IJAZAH') ? (
                        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
                          <FileText className="w-8 h-8 text-indigo-500 shrink-0" />
                          <div className="flex-1 min-w-0 text-xs">
                            <p className="font-bold truncate text-slate-900 dark:text-white">
                              {formData.dokumen.find(d => d.jenis === 'IJAZAH')?.nama_file}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {((formData.dokumen.find(d => d.jenis === 'IJAZAH')?.ukuran_bytes || 0) / 1024).toFixed(0)} KB
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveDoc('IJAZAH')}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 flex flex-col items-center justify-center gap-1 text-xs text-slate-500 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-900/30">
                          <Upload className="w-5 h-5 text-slate-400" />
                          <span className="font-bold">Pilih Scan Ijazah</span>
                          <span className="text-[10px] text-slate-400">PDF, JPG, PNG (Maks. 5MB)</span>
                          <input
                            type="file"
                            accept=".pdf,image/*"
                            onChange={(e) => handleFileUpload('IJAZAH', 'Ijazah Terakhir', e)}
                            className="hidden"
                          />
                        </label>
                      )}
                      {errors.doc_ijazah && (
                        <p className="text-[11px] text-rose-500 font-medium">{errors.doc_ijazah}</p>
                      )}
                    </div>
                  </div>

                  {/* Optional Docs: Surat Pindah / KIP */}
                  {formData.jenis_pendaftaran === 'PINDAHAN' && (
                    <div className="p-4 rounded-2xl border border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-900 dark:text-amber-200">
                          Scan Surat Keterangan Pindah Sekolah <span className="text-rose-500">*</span>
                        </span>
                        {formData.dokumen.some(d => d.jenis === 'SURAT_PINDAH') && (
                          <span className="text-emerald-600 text-xs font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Terunggah
                          </span>
                        )}
                      </div>

                      {formData.dokumen.find(d => d.jenis === 'SURAT_PINDAH') ? (
                        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                          <FileText className="w-8 h-8 text-amber-500 shrink-0" />
                          <div className="flex-1 min-w-0 text-xs">
                            <p className="font-bold truncate text-slate-900 dark:text-white">
                              {formData.dokumen.find(d => d.jenis === 'SURAT_PINDAH')?.nama_file}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveDoc('SURAT_PINDAH')}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="border-2 border-dashed border-amber-300 dark:border-amber-800 rounded-xl p-4 flex flex-col items-center justify-center gap-1 text-xs text-amber-800 dark:text-amber-300 hover:border-amber-500 cursor-pointer bg-white/60 dark:bg-slate-900/60">
                          <Upload className="w-5 h-5 text-amber-600" />
                          <span className="font-bold">Pilih Scan Surat Pindah</span>
                          <input
                            type="file"
                            accept=".pdf,image/*"
                            onChange={(e) => handleFileUpload('SURAT_PINDAH', 'Surat Pindah Sekolah', e)}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 6: KONFIRMASI & RINGKASAN DATA */}
              {currentStep === 6 && (
                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white shadow-xl space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                      <div>
                        <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider">
                          Ringkasan Pendaftaran Calon Warga Belajar
                        </span>
                        <h3 className="text-xl font-black text-white">{formData.nama_lengkap}</h3>
                        <p className="text-xs text-slate-300">
                          {formData.program_pilihan} • Jalur {formData.jenis_pendaftaran === 'PINDAHAN' ? 'Pindahan' : 'Siswa Baru'}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-amber-400 text-slate-950 rounded-full text-xs font-black self-start">
                        Tahun Ajaran {formData.tahun_ajaran}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                      <div>
                        <p className="text-[10px] text-slate-400">NIK (16 Digit)</p>
                        <p className="font-mono font-bold text-white">{formData.nik}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400">No. Kartu Keluarga</p>
                        <p className="font-mono font-bold text-white">{formData.nomor_kk}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400">Tempat, Tgl Lahir</p>
                        <p className="font-bold text-white">{formData.tempat_lahir}, {formData.tanggal_lahir}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400">WhatsApp / HP</p>
                        <p className="font-mono font-bold text-white">{formData.nomor_wa}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-800 text-xs">
                      <div>
                        <p className="text-[10px] text-slate-400">Alamat Domisili</p>
                        <p className="font-medium text-slate-200">
                          {formData.alamat_lengkap} RT {formData.rt} RW {formData.rw}, Kel. {formData.desa_kelurahan}, Kec. {formData.kecamatan}, {formData.kabupaten_kota}, {formData.provinsi}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400">Sekolah Asal & Orang Tua</p>
                        <p className="font-medium text-slate-200">
                          {formData.sekolah_asal} • Ibu: {formData.ibu_nama} • Ayah: {formData.ayah_nama || '-'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Uploaded Documents List Checklist */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-3">
                    <h4 className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Dokumen Digital yang Telah Dilampirkan ({formData.dokumen.length} Berkas)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {formData.dokumen.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span className="font-bold text-slate-800 dark:text-white truncate">{doc.label}</span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[10px] text-slate-400 font-mono">
                              {(doc.ukuran_bytes / 1024).toFixed(0)} KB
                            </span>
                            <button
                              type="button"
                              onClick={() => setPreviewDoc(doc)}
                              title="Lihat Berkas"
                              className="p-1 rounded text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Statement & Agreement */}
                  <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="w-5 h-5 text-indigo-600 rounded mt-0.5"
                      />
                      <span className="text-xs text-amber-950 dark:text-amber-200 leading-relaxed font-medium">
                        Saya menyatakan dengan sebenarnya bahwa seluruh data dan dokumen yang saya isikan dalam formulir PPDB PKBM Celah Cahaya ini adalah <strong>benar, sah, dan sesuai dengan aslinya</strong> untuk keperluan integrasi sistem Dapodik Kemendikbudristek RI. Apabila di kemudian hari ditemukan ketidaksesuaian data, saya bersedia menerima sanksi sesuai ketentuan yang berlaku.
                      </span>
                    </label>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Navigation Bar */}
        {!submittedRecord && (
          <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between shrink-0">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Sebelumnya</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-colors cursor-pointer"
              >
                Batal
              </button>
            )}

            <div className="flex items-center gap-3">
              {currentStep < 6 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
                >
                  <span>Lanjutkan</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isSubmitting || !agreeTerms}
                  onClick={handleSubmitRegistration}
                  className={`px-6 py-2.5 rounded-xl text-white text-xs font-black flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
                    !agreeTerms || isSubmitting
                      ? 'bg-slate-400 dark:bg-slate-700 cursor-not-allowed opacity-70'
                      : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30 ring-2 ring-emerald-400'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Memproses Pendaftaran...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Kirim & Ajukan Pendaftaran</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal Preview Dokumen */}
      {previewDoc && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
            <div className="p-4 bg-slate-100 dark:bg-slate-800 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{previewDoc.label}</h4>
                <p className="text-xs text-slate-500 truncate max-w-md">{previewDoc.nama_file}</p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="p-1.5 rounded-xl text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-auto flex-1 flex items-center justify-center bg-slate-900/5">
              {previewDoc.tipe_file.includes('pdf') ? (
                <iframe
                  src={previewDoc.url}
                  className="w-full h-96 rounded-xl border border-slate-300 dark:border-slate-700"
                  title={previewDoc.label}
                />
              ) : (
                <img
                  src={previewDoc.url}
                  alt={previewDoc.label}
                  className="max-h-[60vh] max-w-full object-contain rounded-xl shadow-md"
                />
              )}
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Print Preview & Export Modal */}
      {showPrintModal && submittedRecord && (
        <PrintPreviewModal
          isOpen={showPrintModal}
          onClose={() => setShowPrintModal(false)}
          defaultDocType="PPDB_SLIP"
          docData={submittedRecord}
          title={`Bukti Pendaftaran - ${submittedRecord.nama_lengkap}`}
        />
      )}
    </div>
  );
};
