import React, { useState, useMemo } from 'react';
import {
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  UploadCloud,
  Award,
  Plus,
  Edit2,
  Trash2,
  Users,
  Search,
  Eye,
  ExternalLink,
  MessageSquare,
  FileCheck2,
  Download,
  AlertCircle
} from 'lucide-react';
import { Tugas, PengumpulanTugas, User, PaketType } from '../types';
import { storage } from '../services/storageService';
import { googleSheetsSync } from '../services/googleSheetsSyncService';
import { TextToSpeechButton } from './common/TextToSpeechButton';

interface TugasSectionProps {
  currentUser: User;
}

export const TugasSection: React.FC<TugasSectionProps> = ({ currentUser }) => {
  const isStudent = currentUser.role === 'SISWA';

  // Data states
  const [tugasList, setTugasList] = useState<Tugas[]>(() =>
    storage.getTugas(currentUser.role, isStudent ? currentUser.paket : undefined)
  );
  const [pengumpulanList, setPengumpulanList] = useState<PengumpulanTugas[]>(() =>
    storage.getPengumpulanTugas(undefined, isStudent ? currentUser.id : undefined)
  );

  // Filters & Tabs
  const [activeTab, setActiveTab] = useState<'SEMUA' | 'BELUM' | 'DIKUMPULKAN' | 'DINILAI'>('SEMUA');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMapel, setFilterMapel] = useState('SEMUA');
  const [filterPaket, setFilterPaket] = useState<string>('SEMUA');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTugas, setEditingTugas] = useState<Tugas | null>(null);

  // Student submission modal
  const [selectedTugasForSubmit, setSelectedTugasForSubmit] = useState<Tugas | null>(null);
  const [submitText, setSubmitText] = useState('');
  const [submitFileName, setSubmitFileName] = useState('');
  const [submitFileUrl, setSubmitFileUrl] = useState('');

  // Tutor review modal
  const [selectedTugasForReview, setSelectedTugasForReview] = useState<Tugas | null>(null);
  const [gradingSubmission, setGradingSubmission] = useState<PengumpulanTugas | null>(null);
  const [gradeScore, setGradeScore] = useState<number>(85);
  const [gradeFeedback, setGradeFeedback] = useState<string>('');

  // Tutor Form State
  const [formJudul, setFormJudul] = useState('');
  const [formDeskripsi, setFormDeskripsi] = useState('');
  const [formMapel, setFormMapel] = useState('Bahasa Indonesia');
  const [formKelas, setFormKelas] = useState('Kelas 8 Paket B');
  const [formPaket, setFormPaket] = useState<PaketType>(currentUser.paket || 'PAKET B');
  const [formDeadline, setFormDeadline] = useState(
    new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 16)
  );
  const [formBobot, setFormBobot] = useState(100);

  const refreshData = () => {
    setTugasList(storage.getTugas(currentUser.role, isStudent ? currentUser.paket : undefined));
    setPengumpulanList(storage.getPengumpulanTugas(undefined, isStudent ? currentUser.id : undefined));
  };

  const mapelOptions = useMemo(() => storage.getMapel(), []);

  // Filter and map student submission status
  const processedTugas = useMemo(() => {
    return tugasList.map(t => {
      const mySubmission = pengumpulanList.find(p => p.tugas_id === t.id && (!isStudent || p.user_id === currentUser.id));
      const isOverdue = new Date(t.batas_pengumpulan) < new Date();
      return {
        ...t,
        mySubmission,
        isOverdue
      };
    });
  }, [tugasList, pengumpulanList, isStudent, currentUser.id]);

  const filteredTugas = useMemo(() => {
    return processedTugas.filter(item => {
      const matchSearch =
        item.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.mata_pelajaran.toLowerCase().includes(searchQuery.toLowerCase());
      const matchMapel = filterMapel === 'SEMUA' || item.mata_pelajaran === filterMapel;
      const matchPaket = filterPaket === 'SEMUA' || item.paket === filterPaket;

      let matchTab = true;
      if (isStudent) {
        if (activeTab === 'BELUM') matchTab = !item.mySubmission;
        if (activeTab === 'DIKUMPULKAN') matchTab = !!item.mySubmission && item.mySubmission.status !== 'SUDAH_DINILAI';
        if (activeTab === 'DINILAI') matchTab = item.mySubmission?.status === 'SUDAH_DINILAI';
      }

      return matchSearch && matchMapel && matchPaket && matchTab;
    });
  }, [processedTugas, searchQuery, filterMapel, filterPaket, activeTab, isStudent]);

  // Handle Tutor Create/Edit
  const handleOpenCreateModal = (tugas?: Tugas) => {
    if (tugas) {
      setEditingTugas(tugas);
      setFormJudul(tugas.judul);
      setFormDeskripsi(tugas.deskripsi_petunjuk);
      setFormMapel(tugas.mata_pelajaran);
      setFormKelas(tugas.kelas);
      setFormPaket(tugas.paket);
      setFormDeadline(tugas.batas_pengumpulan);
      setFormBobot(tugas.bobot_nilai);
    } else {
      setEditingTugas(null);
      setFormJudul('');
      setFormDeskripsi('');
      setFormMapel(currentUser.mata_pelajaran?.split('&')[0].trim() || 'Bahasa Indonesia');
      setFormKelas(currentUser.kelas?.split('&')[0].trim() || 'Kelas 8 Paket B');
      setFormPaket(currentUser.paket || 'PAKET B');
      setFormDeadline(new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 16));
      setFormBobot(100);
    }
    setIsCreateModalOpen(true);
  };

  const handleSaveTugas = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formJudul.trim()) return;

    if (editingTugas) {
      const updated = storage.updateTugas(editingTugas.id, {
        judul: formJudul,
        deskripsi: formDeskripsi,
        deskripsi_petunjuk: formDeskripsi,
        mata_pelajaran: formMapel,
        kelas: formKelas,
        paket: formPaket,
        batas_pengumpulan: formDeadline,
        nilai_maksimal: formBobot,
        bobot_nilai: formBobot
      });
      if (updated) {
        googleSheetsSync.syncTugas(updated, 'update').catch(err => console.warn('Sync Tugas:', err));
      }
    } else {
      const created = storage.addTugas({
        judul: formJudul,
        deskripsi: formDeskripsi,
        deskripsi_petunjuk: formDeskripsi,
        mata_pelajaran: formMapel,
        kelas: formKelas,
        paket: formPaket,
        tutor_id: currentUser.id,
        tutor_nama: currentUser.nama,
        batas_pengumpulan: formDeadline,
        nilai_maksimal: formBobot,
        bobot_nilai: formBobot,
        status: 'AKTIF'
      });
      if (created) {
        googleSheetsSync.syncTugas(created, 'add').catch(err => console.warn('Sync Tugas:', err));
      }
    }

    setIsCreateModalOpen(false);
    refreshData();
  };

  const handleDeleteTugas = (id: string, judul: string) => {
    if (confirm(`Hapus tugas "${judul}"? Semua data pengumpulan juga akan dihapus.`)) {
      const target = tugasList.find(t => t.id === id);
      storage.deleteTugas(id);
      if (target) {
        googleSheetsSync.syncTugas(target, 'delete').catch(err => console.warn('Delete Tugas Sync:', err));
      }
      refreshData();
    }
  };

  // Student submit task handler
  const handleOpenSubmitModal = (tugas: Tugas) => {
    const existing = pengumpulanList.find(p => p.tugas_id === tugas.id && p.user_id === currentUser.id);
    setSelectedTugasForSubmit(tugas);
    setSubmitText(existing?.teks_jawaban || '');
    setSubmitFileName(existing?.file_nama || '');
    setSubmitFileUrl(existing?.file_url || '');
  };

  const handleSubmitTugas = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTugasForSubmit) return;
    if (!submitText.trim() && !submitFileName.trim() && !submitFileUrl.trim()) {
      alert('Mohon isi teks jawaban atau cantumkan tautan / nama file tugas Anda.');
      return;
    }

    const newSubmission = storage.submitTugas({
      tugas_id: selectedTugasForSubmit.id,
      user_id: currentUser.id,
      siswa_nama: currentUser.nama,
      siswa_paket: currentUser.paket || 'PAKET B',
      teks_jawaban: submitText,
      file_nama: submitFileName || 'Lembar_Jawaban_' + currentUser.nama.replace(/\s+/g, '_') + '.pdf',
      file_url: submitFileUrl || 'https://drive.google.com/',
      file_ukuran: '1.2 MB'
    });

    // Auto sync submission to Google Sheets
    if (newSubmission) {
      googleSheetsSync.syncTugasDanUjianToGoogleSheets('pengumpulan_tugas', [newSubmission]).catch(err => {
        console.warn('Google Sheets Tugas Submission Sync:', err);
      });
    }

    setSelectedTugasForSubmit(null);
    refreshData();
  };

  // Tutor grading handler
  const handleOpenReview = (tugas: Tugas) => {
    setSelectedTugasForReview(tugas);
  };

  const handleOpenGradeDialog = (sub: PengumpulanTugas) => {
    setGradingSubmission(sub);
    setGradeScore(sub.nilai || 85);
    setGradeFeedback(sub.feedback_tutor || 'Kerja bagus, jawaban tersusun dengan baik.');
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSubmission) return;

    const updated = storage.gradePengumpulanTugas(
      gradingSubmission.id,
      Number(gradeScore),
      gradeFeedback,
      currentUser.nama
    );

    // Auto sync grade update to Google Sheets
    if (updated) {
      googleSheetsSync.syncTugasDanUjianToGoogleSheets('pengumpulan_tugas', [updated]).catch(err => {
        console.warn('Google Sheets Grading Sync:', err);
      });
    }

    setGradingSubmission(null);
    refreshData();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>{isStudent ? 'Tugas & Aktivitas Mandiri' : 'Manajemen Penugasan Siswa'}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isStudent
              ? 'Kerjakan dan kumpulkan tugas sebelum batas waktu untuk mendapatkan penilaian tutor'
              : 'Buat tugas baru, pantau pengumpulan berkas warga belajar, dan berikan penilaian'}
          </p>
        </div>

        {!isStudent && (
          <button
            onClick={() => handleOpenCreateModal()}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Tugas Baru</span>
          </button>
        )}
      </div>

      {/* Student Category Tabs */}
      {isStudent && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {[
            { key: 'SEMUA', label: 'Semua Tugas' },
            { key: 'BELUM', label: '⏳ Belum Dikerjakan' },
            { key: 'DIKUMPULKAN', label: '📤 Sudah Dikumpulkan' },
            { key: 'DINILAI', label: '⭐ Sudah Dinilai' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 rounded-xl font-bold transition-colors shrink-0 cursor-pointer ${
                activeTab === tab.key
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          {!isStudent && (
            <select
              value={filterPaket}
              onChange={e => setFilterPaket(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              <option value="SEMUA">Semua Paket</option>
              <option value="PAKET B">Paket B (SMP)</option>
              <option value="PAKET C">Paket C (SMA)</option>
            </select>
          )}

          <select
            value={filterMapel}
            onChange={e => setFilterMapel(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            <option value="SEMUA">Semua Mapel</option>
            {mapelOptions.map(m => (
              <option key={m.id} value={m.nama_mata_pelajaran}>
                {m.nama_mata_pelajaran} ({m.paket})
              </option>
            ))}
          </select>
        </div>

        <div className="relative min-w-[200px] flex-1 sm:flex-initial">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari judul tugas..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Grid of Tasks */}
      {filteredTugas.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <FileText className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
            Tidak ada tugas pada kategori ini
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Semua tugas Anda telah selesai atau belum ada penugasan baru dari tutor.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {filteredTugas.map(tugas => {
            const mySub = tugas.mySubmission;
            const hasSubmitted = !!mySub;
            const isGraded = mySub?.status === 'SUDAH_DINILAI';
            const allSubmissionsForThis = storage.getPengumpulanTugas(tugas.id);

            return (
              <div
                key={tugas.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all duration-200 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-md ${
                        tugas.paket === 'PAKET B'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-indigo-50 text-indigo-800 border border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300'
                      }`}>
                        {tugas.paket}
                      </span>
                      <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                        {tugas.mata_pelajaran}
                      </span>
                    </div>

                    {/* Student Status Badge */}
                    {isStudent && (
                      <div>
                        {isGraded ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            <Award className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Nilai: {mySub.nilai}</span>
                          </span>
                        ) : hasSubmitted ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                            <FileCheck2 className="w-3.5 h-3.5 text-blue-500" />
                            <span>Terkirim</span>
                          </span>
                        ) : tugas.isOverdue ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                            <span>Terlambat</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            <span>Belum Dikerjakan</span>
                          </span>
                        )}
                      </div>
                    )}

                    {!isStudent && (
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {allSubmissionsForThis.length} Terkumpul
                      </span>
                    )}
                  </div>

                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-snug">
                      {tugas.judul}
                    </h3>
                    <TextToSpeechButton
                      text={`Tugas ${tugas.mata_pelajaran}: ${tugas.judul}. Petunjuk pengerjaan: ${tugas.deskripsi_petunjuk}`}
                      title={tugas.judul}
                      variant="icon"
                      size="xs"
                    />
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed whitespace-pre-line">
                    {tugas.deskripsi_petunjuk}
                  </p>

                  <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span className="text-[11px] text-slate-400">Tutor:</span>
                      <span className="font-semibold">{tugas.tutor_nama}</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span className="text-[11px] text-slate-400">Batas Waktu:</span>
                      <span className={`font-bold ${tugas.isOverdue && !hasSubmitted ? 'text-rose-600' : 'text-slate-700 dark:text-slate-200'}`}>
                        {tugas.batas_pengumpulan.replace('T', ' ')} WIB
                      </span>
                    </div>

                    {isGraded && mySub?.feedback_tutor && (
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-xs">
                        <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400 block mb-0.5">
                          Feedback Tutor:
                        </span>
                        <p className="text-slate-700 dark:text-slate-300 italic">
                          "{mySub.feedback_tutor}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-850/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  {isStudent ? (
                    <button
                      onClick={() => handleOpenSubmitModal(tugas)}
                      className={`flex-1 py-2.5 px-4 font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                        hasSubmitted
                          ? 'bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      }`}
                    >
                      {hasSubmitted ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <span>Lihat / Perbarui Jawaban</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-4 h-4" />
                          <span>Kumpulkan Tugas</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleOpenReview(tugas)}
                        className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Lihat & Nilai ({allSubmissionsForThis.length})</span>
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenCreateModal(tugas)}
                          className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                          title="Edit Tugas"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteTugas(tugas.id, tugas.judul)}
                          className="p-2 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-colors cursor-pointer"
                          title="Hapus Tugas"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* STUDENT SUBMISSION MODAL */}
      {selectedTugasForSubmit && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              Kumpulkan Tugas: {selectedTugasForSubmit.judul}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
              Mata Pelajaran: {selectedTugasForSubmit.mata_pelajaran} • Batas: {selectedTugasForSubmit.batas_pengumpulan.replace('T', ' ')} WIB
            </p>

            <form onSubmit={handleSubmitTugas} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Uraian / Jawaban Teks Anda:
                </label>
                <textarea
                  rows={4}
                  value={submitText}
                  onChange={e => setSubmitText(e.target.value)}
                  placeholder="Tuliskan jawaban langsung atau rangkuman tugas Anda di sini..."
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tautan File Google Drive / Berkas Dokumen (Opsional):
                </label>
                <input
                  type="url"
                  value={submitFileUrl}
                  onChange={e => setSubmitFileUrl(e.target.value)}
                  placeholder="https://drive.google.com/file/d/... atau tautan file cloud Anda"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Berkas Dokumen:
                </label>
                <input
                  type="text"
                  value={submitFileName}
                  onChange={e => setSubmitFileName(e.target.value)}
                  placeholder="Contoh: Tugas_Bahasa_Indonesia_Budi.pdf"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setSelectedTugasForSubmit(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Kirim Pengumpulan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TUTOR CREATE / EDIT MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mb-4">
              {editingTugas ? 'Edit Penugasan' : 'Buat Penugasan Baru'}
            </h3>

            <form onSubmit={handleSaveTugas} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Judul Tugas
                </label>
                <input
                  type="text"
                  required
                  value={formJudul}
                  onChange={e => setFormJudul(e.target.value)}
                  placeholder="Contoh: Analisis Struktur Teks Eksplanasi Bab 2"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Program / Paket
                  </label>
                  <select
                    value={formPaket}
                    onChange={e => setFormPaket(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  >
                    <option value="PAKET B">PAKET B (SMP)</option>
                    <option value="PAKET C">PAKET C (SMA)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Mata Pelajaran
                  </label>
                  <select
                    value={formMapel}
                    onChange={e => setFormMapel(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                  >
                    {mapelOptions
                      .filter(m => m.paket === formPaket)
                      .map(mp => (
                        <option key={mp.id} value={mp.nama_mata_pelajaran}>
                          {mp.nama_mata_pelajaran}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Batas Pengumpulan (Deadline)
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formDeadline}
                    onChange={e => setFormDeadline(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Bobot Maksimal Nilai
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={100}
                    value={formBobot}
                    onChange={e => setFormBobot(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Petunjuk & Instruksi Tugas
                </label>
                <textarea
                  rows={4}
                  required
                  value={formDeskripsi}
                  onChange={e => setFormDeskripsi(e.target.value)}
                  placeholder="Jelaskan instruksi pengerjaan tugas secara rinci..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Simpan Tugas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TUTOR SUBMISSIONS REVIEW MODAL */}
      {selectedTugasForReview && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  Pengumpulan: {selectedTugasForReview.judul}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedTugasForReview.mata_pelajaran} • {selectedTugasForReview.paket}
                </p>
              </div>
              <button
                onClick={() => setSelectedTugasForReview(null)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold"
              >
                Tutup
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {storage.getPengumpulanTugas(selectedTugasForReview.id).length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Belum ada siswa yang mengumpulkan tugas ini.
                </div>
              ) : (
                storage.getPengumpulanTugas(selectedTugasForReview.id).map(sub => (
                  <div
                    key={sub.id}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">
                          {sub.siswa_nama}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                          {sub.siswa_paket}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Dikumpulkan: {sub.waktu_pengumpulan}
                        </span>
                      </div>

                      {sub.teks_jawaban && (
                        <p className="text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 italic">
                          "{sub.teks_jawaban}"
                        </p>
                      )}

                      {sub.file_url && (
                        <a
                          href={sub.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>{sub.file_nama || 'Unduh Berkas Siswa'}</span>
                        </a>
                      )}
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                      {sub.status === 'SUDAH_DINILAI' ? (
                        <div className="text-right">
                          <span className="px-3 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-black text-xs">
                            Nilai: {sub.nilai} / 100
                          </span>
                        </div>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                          Belum Dinilai
                        </span>
                      )}

                      <button
                        onClick={() => handleOpenGradeDialog(sub)}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer"
                      >
                        {sub.status === 'SUDAH_DINILAI' ? 'Ubah Nilai' : 'Beri Nilai & Feedback'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* GRADING DIALOG */}
      {gradingSubmission && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h3 className="text-base font-black text-slate-900 dark:text-white mb-1">
              Beri Nilai: {gradingSubmission.siswa_nama}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Masukkan skor 0 - 100 dan catatan umpan balik untuk siswa.
            </p>

            <form onSubmit={handleSaveGrade} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Skor Nilai (0 - 100)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  required
                  value={gradeScore}
                  onChange={e => setGradeScore(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-black text-base text-indigo-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Catatan / Feedback Tutor
                </label>
                <textarea
                  rows={3}
                  required
                  value={gradeFeedback}
                  onChange={e => setGradeFeedback(e.target.value)}
                  placeholder="Berikan saran atau apresiasi untuk tugas ini..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setGradingSubmission(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Simpan Nilai
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
