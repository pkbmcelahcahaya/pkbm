import React, { useState } from 'react';
import {
  BookOpen,
  Layers,
  GraduationCap,
  Calendar,
  Clock,
  FileCheck,
  FileText,
  History,
  Target,
  ArrowLeft,
  X,
  Sparkles
} from 'lucide-react';
import {
  KurikulumProfile,
  KurikulumProgramDetail,
  StrukturKurikulumItem,
  CapaianPembelajaran,
  TujuanPembelajaran,
  AlokasiWaktuItem,
  KalenderPendidikanEvent,
  AsesmenKurikulumItem,
  DokumenKurikulum,
  VersiKurikulum,
  RiwayatPerubahanKurikulum,
  User,
  PaketType
} from '../types';
import { storage } from '../services/storageService';
import { Breadcrumb } from './Breadcrumb';
import { PrintPreviewModal } from './common/PrintPreviewModal';
import { KurikulumHeader } from './kurikulum/KurikulumHeader';
import { KurikulumOverviewTab } from './kurikulum/KurikulumOverviewTab';
import { KurikulumPaketBTab } from './kurikulum/KurikulumPaketBTab';
import { KurikulumPaketCTab } from './kurikulum/KurikulumPaketCTab';
import { KurikulumStrukturTab } from './kurikulum/KurikulumStrukturTab';
import { KurikulumCPTab } from './kurikulum/KurikulumCPTab';
import { KurikulumTPTab } from './kurikulum/KurikulumTPTab';
import { KurikulumAlokasiTab } from './kurikulum/KurikulumAlokasiTab';
import { KurikulumKalenderTab } from './kurikulum/KurikulumKalenderTab';
import { KurikulumAsesmenTab } from './kurikulum/KurikulumAsesmenTab';
import { KurikulumDokumenTab } from './kurikulum/KurikulumDokumenTab';
import { KurikulumAuditVersiTab } from './kurikulum/KurikulumAuditVersiTab';

interface KurikulumDashboardProps {
  currentUser: User | null;
  onBack?: () => void;
  onPreviewPdf?: (title: string, url: string) => void;
  onNavigateToLms?: (materiJudul?: string) => void;
}

export const KurikulumDashboard: React.FC<KurikulumDashboardProps> = ({
  currentUser,
  onBack,
  onPreviewPdf,
  onNavigateToLms
}) => {
  const isAdmin = currentUser?.role === 'ADMIN';

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedCpIdFilter, setSelectedCpIdFilter] = useState<string | undefined>(undefined);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Core Data States loaded from storage
  const [profile, setProfile] = useState<KurikulumProfile>(storage.getKurikulumProfile());
  const [progB, setProgB] = useState<KurikulumProgramDetail>(storage.getKurikulumProgramDetail('PAKET B'));
  const [progC, setProgC] = useState<KurikulumProgramDetail>(storage.getKurikulumProgramDetail('PAKET C'));
  const [strukturList, setStrukturList] = useState<StrukturKurikulumItem[]>(storage.getStrukturKurikulum());
  const [cpList, setCpList] = useState<CapaianPembelajaran[]>(storage.getCapaianPembelajaran());
  const [tpList, setTpList] = useState<TujuanPembelajaran[]>(storage.getTujuanPembelajaran());
  const [alokasiList, setAlokasiList] = useState<AlokasiWaktuItem[]>(storage.getAlokasiWaktu());
  const [kalenderList, setKalenderList] = useState<KalenderPendidikanEvent[]>(storage.getKalenderPendidikan());
  const [asesmenList, setAsesmenList] = useState<AsesmenKurikulumItem[]>(storage.getAsesmenKurikulum());
  const [dokumenList, setDokumenList] = useState<DokumenKurikulum[]>(storage.getDokumenKurikulum());
  const [versiList, setVersiList] = useState<VersiKurikulum[]>(storage.getVersiKurikulum());
  const [riwayatList, setRiwayatList] = useState<RiwayatPerubahanKurikulum[]>(storage.getRiwayatKurikulum());

  // Reload helper
  const reloadAll = () => {
    setProfile(storage.getKurikulumProfile());
    setProgB(storage.getKurikulumProgramDetail('PAKET B'));
    setProgC(storage.getKurikulumProgramDetail('PAKET C'));
    setStrukturList(storage.getStrukturKurikulum());
    setCpList(storage.getCapaianPembelajaran());
    setTpList(storage.getTujuanPembelajaran());
    setAlokasiList(storage.getAlokasiWaktu());
    setKalenderList(storage.getKalenderPendidikan());
    setAsesmenList(storage.getAsesmenKurikulum());
    setDokumenList(storage.getDokumenKurikulum());
    setVersiList(storage.getVersiKurikulum());
    setRiwayatList(storage.getRiwayatKurikulum());
  };

  // Toast feedback
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Modals for Profile & Program
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [profileForm, setProfileForm] = useState<KurikulumProfile>(profile);

  const [isEditProgramOpen, setIsEditProgramOpen] = useState(false);
  const [editingProgramType, setEditingProgramType] = useState<PaketType>('PAKET B');
  const [programForm, setProgramForm] = useState<KurikulumProgramDetail>(progB);

  // Handle Edit Profile
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    storage.saveKurikulumProfile(profileForm, currentUser?.nama || 'Admin');
    setProfile(profileForm);
    setIsEditProfileOpen(false);
    showToast('Profil Kurikulum berhasil diperbarui');
    reloadAll();
  };

  // Handle Edit Program Detail
  const handleSaveProgramDetail = (e: React.FormEvent) => {
    e.preventDefault();
    storage.saveKurikulumProgramDetail(programForm, currentUser?.nama || 'Admin');
    if (editingProgramType === 'PAKET B') setProgB(programForm);
    else setProgC(programForm);
    setIsEditProgramOpen(false);
    showToast(`Data Program ${editingProgramType} berhasil diperbarui`);
    reloadAll();
  };

  // Handlers for Structure
  const handleSaveStruktur = (item: Omit<StrukturKurikulumItem, 'id'> & { id?: string }) => {
    storage.saveStrukturKurikulumItem(item, currentUser?.nama || 'Admin');
    setStrukturList(storage.getStrukturKurikulum());
    showToast('Mata pelajaran berhasil disimpan');
    reloadAll();
  };

  const handleDeleteStruktur = (id: string) => {
    storage.deleteStrukturKurikulumItem(id, currentUser?.nama || 'Admin');
    setStrukturList(storage.getStrukturKurikulum());
    showToast('Mata pelajaran dihapus');
    reloadAll();
  };

  const handleDuplicateStruktur = (id: string) => {
    storage.duplicateStrukturKurikulumItem(id, currentUser?.nama || 'Admin');
    setStrukturList(storage.getStrukturKurikulum());
    showToast('Mata pelajaran diduplikat');
    reloadAll();
  };

  // Handlers for CP
  const handleSaveCP = (cp: Omit<CapaianPembelajaran, 'id' | 'created_at'> & { id?: string }) => {
    storage.saveCapaianPembelajaran(cp, currentUser?.nama || 'Admin');
    setCpList(storage.getCapaianPembelajaran());
    showToast('Capaian Pembelajaran (CP) berhasil disimpan');
    reloadAll();
  };

  const handleDeleteCP = (id: string) => {
    storage.deleteCapaianPembelajaran(id, currentUser?.nama || 'Admin');
    setCpList(storage.getCapaianPembelajaran());
    showToast('CP berhasil dihapus');
    reloadAll();
  };

  // Handlers for TP
  const handleSaveTP = (tp: Omit<TujuanPembelajaran, 'id'> & { id?: string }) => {
    storage.saveTujuanPembelajaran(tp, currentUser?.nama || 'Admin');
    setTpList(storage.getTujuanPembelajaran());
    showToast('Tujuan Pembelajaran (TP) berhasil disimpan');
    reloadAll();
  };

  const handleDeleteTP = (id: string) => {
    storage.deleteTujuanPembelajaran(id, currentUser?.nama || 'Admin');
    setTpList(storage.getTujuanPembelajaran());
    showToast('TP berhasil dihapus');
    reloadAll();
  };

  const handleDuplicateTP = (id: string) => {
    storage.duplicateTujuanPembelajaran(id, currentUser?.nama || 'Admin');
    setTpList(storage.getTujuanPembelajaran());
    showToast('TP berhasil diduplikat');
    reloadAll();
  };

  // Handlers for Alokasi
  const handleSaveAlokasi = (item: Omit<AlokasiWaktuItem, 'id'> & { id?: string }) => {
    storage.saveAlokasiWaktuItem(item, currentUser?.nama || 'Admin');
    setAlokasiList(storage.getAlokasiWaktu());
    showToast('Alokasi waktu berhasil disimpan');
    reloadAll();
  };

  const handleDeleteAlokasi = (id: string) => {
    storage.deleteAlokasiWaktuItem(id, currentUser?.nama || 'Admin');
    setAlokasiList(storage.getAlokasiWaktu());
    showToast('Alokasi waktu dihapus');
    reloadAll();
  };

  // Handlers for Kalender
  const handleSaveKalender = (evt: Omit<KalenderPendidikanEvent, 'id'> & { id?: string }) => {
    storage.saveKalenderEvent(evt, currentUser?.nama || 'Admin');
    setKalenderList(storage.getKalenderPendidikan());
    showToast('Agenda kalender berhasil disimpan');
    reloadAll();
  };

  const handleDeleteKalender = (id: string) => {
    storage.deleteKalenderEvent(id, currentUser?.nama || 'Admin');
    setKalenderList(storage.getKalenderPendidikan());
    showToast('Agenda kalender dihapus');
    reloadAll();
  };

  // Handlers for Asesmen
  const handleSaveAsesmen = (item: Omit<AsesmenKurikulumItem, 'id'> & { id?: string }) => {
    storage.saveAsesmenItem(item, currentUser?.nama || 'Admin');
    setAsesmenList(storage.getAsesmenKurikulum());
    showToast('Skema asesmen berhasil disimpan');
    reloadAll();
  };

  const handleDeleteAsesmen = (id: string) => {
    storage.deleteAsesmenItem(id, currentUser?.nama || 'Admin');
    setAsesmenList(storage.getAsesmenKurikulum());
    showToast('Skema asesmen dihapus');
    reloadAll();
  };

  // Handlers for Dokumen
  const handleSaveDokumen = (doc: Omit<DokumenKurikulum, 'id' | 'tanggal_unggah'> & { id?: string }) => {
    storage.saveDokumenKurikulum(doc, currentUser?.nama || 'Admin');
    setDokumenList(storage.getDokumenKurikulum());
    showToast('Dokumen kurikulum berhasil disimpan');
    reloadAll();
  };

  const handleDeleteDokumen = (id: string) => {
    storage.deleteDokumenKurikulum(id, currentUser?.nama || 'Admin');
    setDokumenList(storage.getDokumenKurikulum());
    showToast('Dokumen dihapus');
    reloadAll();
  };

  // Handlers for Versi & Backup
  const handleSaveVersi = (v: Omit<VersiKurikulum, 'id' | 'created_at'> & { id?: string }) => {
    storage.saveVersiKurikulum(v);
    setVersiList(storage.getVersiKurikulum());
    showToast('Versi baru kurikulum berhasil dibuat');
    reloadAll();
  };

  const handleActivateVersi = (id: string) => {
    storage.activateVersiKurikulum(id, currentUser?.nama || 'Admin');
    reloadAll();
    showToast('Versi kurikulum aktif berhasil diubah');
  };

  const handleExportBackup = () => {
    const backupData = storage.exportKurikulumBackupJson();
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(typeof backupData === 'string' ? backupData : JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `Kurikulum_PKBM_Celah_Cahaya_${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCsv = () => {
    const csvContent = storage.exportStrukturToCsv();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `Struktur_Kurikulum_PKBM_Celah_Cahaya_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleImportBackup = (jsonData: any) => {
    const rawString = typeof jsonData === 'string' ? jsonData : JSON.stringify(jsonData);
    const success = storage.importKurikulumBackupJson(rawString, currentUser?.nama || 'Admin');
    if (success) {
      reloadAll();
      showToast('Data kurikulum berhasil dipulihkan dari backup JSON');
    }
  };

  const handleResetDefault = () => {
    storage.resetKurikulumToDefault(currentUser?.nama || 'Admin');
    reloadAll();
    showToast('Kurikulum telah di-reset ke master data awal');
  };

  const handlePrint = () => {
    setIsPrintModalOpen(true);
  };

  // Syllabus-style Horizontal Tabs definition
  const tabs = [
    { id: 'overview', label: 'Ringkasan & Profil' },
    { id: 'paket_b', label: 'Paket B (Fase D)' },
    { id: 'paket_c', label: 'Paket C (Fase E/F)' },
    { id: 'struktur', label: 'Struktur & SKK' },
    { id: 'cp', label: 'Capaian Pembelajaran (CP)' },
    { id: 'tp', label: 'Alur Tujuan (ATP/TP)' },
    { id: 'alokasi', label: 'Alokasi Waktu' },
    { id: 'kalender', label: 'Kalender Akademik' },
    { id: 'asesmen', label: 'Skema Asesmen' },
    { id: 'dokumen', label: 'Dokumen KOSP' },
    { id: 'audit_versi', label: 'Versi & Audit' }
  ];

  return (
    <div className="w-full bg-[#F5F6F8] min-h-screen text-[#1F2937] pb-16">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#172033] text-white px-5 py-3 rounded-lg shadow-xl border border-gray-700 text-xs font-medium flex items-center gap-3 animate-fadeIn">
          <Sparkles className="w-4 h-4 text-[#C8102E]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Breadcrumb & Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-gray-200/60 mb-2">
        <Breadcrumb
          homeLabel="Portal Belajar LMS"
          onHomeClick={onBack}
          items={[
            {
              label: 'Kurikulum Operasional (KOSP)',
              onClick: activeTab !== 'overview' ? () => setActiveTab('overview') : undefined,
              active: activeTab === 'overview'
            },
            ...(activeTab !== 'overview'
              ? [
                  {
                    label: tabs.find((t) => t.id === activeTab)?.label || activeTab,
                    active: true
                  }
                ]
              : [])
          ]}
        />

        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#172033] transition-colors cursor-pointer self-start sm:self-auto"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Modul LMS</span>
          </button>
        )}
      </div>

      {/* Academic Header Banner */}
      <KurikulumHeader
        profile={profile}
        currentUser={currentUser}
        onEditProfile={() => {
          setProfileForm(profile);
          setIsEditProfileOpen(true);
        }}
        onExportCsv={handleExportCsv}
        onExportBackup={handleExportBackup}
        onPrint={handlePrint}
        activeTab={activeTab}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Horizontal Tab Navigation Bar (Syllabus Style with red underline, no buttons/boxes) */}
        <div className="bg-white border-b border-gray-200 sticky top-16 z-30 shadow-xs -mx-4 sm:mx-0 sm:rounded-t-lg">
          <nav className="flex items-center gap-1 sm:gap-4 overflow-x-auto px-4 sm:px-6 no-scrollbar">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3.5 px-3 text-xs sm:text-[13px] whitespace-nowrap transition-colors border-b-2 font-medium cursor-pointer ${
                    isActive
                      ? 'border-[#C8102E] text-[#172033] font-bold'
                      : 'border-transparent text-gray-500 hover:text-[#172033] hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content Display Area inside Pure White Academic Sheets */}
        <main className="space-y-6">
          {activeTab === 'overview' && (
            <KurikulumOverviewTab
              profile={profile}
              currentUser={currentUser}
              onNavigateTab={(tabId) => setActiveTab(tabId)}
              onEditProfile={() => {
                setProfileForm(profile);
                setIsEditProfileOpen(true);
              }}
            />
          )}

          {activeTab === 'paket_b' && (
            <KurikulumPaketBTab
              programDetail={progB}
              strukturMapel={strukturList}
              currentUser={currentUser}
              onNavigateTab={(tabId) => setActiveTab(tabId)}
              onEditProgram={() => {
                setEditingProgramType('PAKET B');
                setProgramForm(progB);
                setIsEditProgramOpen(true);
              }}
            />
          )}

          {activeTab === 'paket_c' && (
            <KurikulumPaketCTab
              programDetail={progC}
              strukturMapel={strukturList}
              currentUser={currentUser}
              onNavigateTab={(tabId) => setActiveTab(tabId)}
              onEditProgram={() => {
                setEditingProgramType('PAKET C');
                setProgramForm(progC);
                setIsEditProgramOpen(true);
              }}
            />
          )}

          {activeTab === 'struktur' && (
            <KurikulumStrukturTab
              strukturList={strukturList}
              currentUser={currentUser}
              onSaveItem={handleSaveStruktur}
              onDeleteItem={handleDeleteStruktur}
              onDuplicateItem={handleDuplicateStruktur}
              onExportCsv={handleExportCsv}
            />
          )}

          {activeTab === 'cp' && (
            <KurikulumCPTab
              cpList={cpList}
              currentUser={currentUser}
              onSaveCP={handleSaveCP}
              onDeleteCP={handleDeleteCP}
              onNavigateToTP={(cpId) => {
                setSelectedCpIdFilter(cpId);
                setActiveTab('tp');
              }}
            />
          )}

          {activeTab === 'tp' && (
            <KurikulumTPTab
              tpList={tpList}
              cpList={cpList}
              currentUser={currentUser}
              selectedCpIdFilter={selectedCpIdFilter}
              onClearCpFilter={() => setSelectedCpIdFilter(undefined)}
              onSaveTP={handleSaveTP}
              onDeleteTP={handleDeleteTP}
              onDuplicateTP={handleDuplicateTP}
              onOpenLmsMateri={(judul) => {
                if (onNavigateToLms) onNavigateToLms(judul);
              }}
            />
          )}

          {activeTab === 'alokasi' && (
            <KurikulumAlokasiTab
              alokasiList={alokasiList}
              currentUser={currentUser}
              onSaveAlokasi={handleSaveAlokasi}
              onDeleteAlokasi={handleDeleteAlokasi}
            />
          )}

          {activeTab === 'kalender' && (
            <KurikulumKalenderTab
              kalenderList={kalenderList}
              currentUser={currentUser}
              onSaveEvent={handleSaveKalender}
              onDeleteEvent={handleDeleteKalender}
            />
          )}

          {activeTab === 'asesmen' && (
            <KurikulumAsesmenTab
              asesmenList={asesmenList}
              currentUser={currentUser}
              onSaveAsesmen={handleSaveAsesmen}
              onDeleteAsesmen={handleDeleteAsesmen}
            />
          )}

          {activeTab === 'dokumen' && (
            <KurikulumDokumenTab
              dokumenList={dokumenList}
              currentUser={currentUser}
              onSaveDokumen={handleSaveDokumen}
              onDeleteDokumen={handleDeleteDokumen}
              onPreviewPdf={onPreviewPdf}
            />
          )}

          {activeTab === 'audit_versi' && (
            <KurikulumAuditVersiTab
              profile={profile}
              versiList={versiList}
              riwayatList={riwayatList}
              currentUser={currentUser}
              onSaveVersi={handleSaveVersi}
              onActivateVersi={handleActivateVersi}
              onExportBackup={handleExportBackup}
              onImportBackup={handleImportBackup}
              onResetDefault={handleResetDefault}
            />
          )}
        </main>
      </div>

      {/* Modal Edit Profile Kurikulum (Admin) */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172033]/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="text-lg font-bold text-[#172033]">
                Kelola Profil & KOSP Kurikulum
              </h3>
              <button
                type="button"
                onClick={() => setIsEditProfileOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Tahun Pelajaran
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.tahun_pelajaran}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, tahun_pelajaran: e.target.value })
                    }
                    className="w-full text-xs rounded-md border border-gray-300 p-2.5 bg-white focus:border-[#C8102E] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Semester Aktif
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.semester_aktif}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, semester_aktif: e.target.value })
                    }
                    className="w-full text-xs rounded-md border border-gray-300 p-2.5 bg-white focus:border-[#C8102E] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Visi Pendidikan Kesetaraan
                </label>
                <textarea
                  rows={3}
                  required
                  value={profileForm.visi}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, visi: e.target.value })
                  }
                  className="w-full text-xs rounded-md border border-gray-300 p-2.5 bg-white focus:border-[#C8102E] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Misi Pembelajaran
                </label>
                <textarea
                  rows={4}
                  required
                  value={profileForm.misi}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, misi: e.target.value })
                  }
                  className="w-full text-xs rounded-md border border-gray-300 p-2.5 bg-white focus:border-[#C8102E] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Tujuan Kurikulum Operasional
                </label>
                <textarea
                  rows={4}
                  required
                  value={profileForm.tujuan}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, tujuan: e.target.value })
                  }
                  className="w-full text-xs rounded-md border border-gray-300 p-2.5 bg-white focus:border-[#C8102E] outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md bg-white hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium text-white bg-[#C8102E] hover:bg-[#A30D25] rounded-md shadow-sm transition-colors cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Program Detail (Admin) */}
      {isEditProgramOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172033]/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="text-lg font-bold text-[#172033]">
                Kelola Detail Program {editingProgramType}
              </h3>
              <button
                type="button"
                onClick={() => setIsEditProgramOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProgramDetail} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Nama Resmi Program
                </label>
                <input
                  type="text"
                  required
                  value={programForm.nama_resmi}
                  onChange={(e) =>
                    setProgramForm({ ...programForm, nama_resmi: e.target.value })
                  }
                  className="w-full text-xs rounded-md border border-gray-300 p-2.5 bg-white focus:border-[#C8102E] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Deskripsi Program
                </label>
                <textarea
                  rows={3}
                  required
                  value={programForm.deskripsi_program}
                  onChange={(e) =>
                    setProgramForm({ ...programForm, deskripsi_program: e.target.value })
                  }
                  className="w-full text-xs rounded-md border border-gray-300 p-2.5 bg-white focus:border-[#C8102E] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Beban Belajar (SKK)
                  </label>
                  <input
                    type="number"
                    required
                    value={programForm.beban_belajar_skk}
                    onChange={(e) =>
                      setProgramForm({
                        ...programForm,
                        beban_belajar_skk: Number(e.target.value) || 0
                      })
                    }
                    className="w-full text-xs rounded-md border border-gray-300 p-2.5 bg-white focus:border-[#C8102E] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Fase Kurikulum
                  </label>
                  <input
                    type="text"
                    required
                    value={programForm.fase}
                    onChange={(e) =>
                      setProgramForm({ ...programForm, fase: e.target.value })
                    }
                    className="w-full text-xs rounded-md border border-gray-300 p-2.5 bg-white focus:border-[#C8102E] outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsEditProgramOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md bg-white hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium text-white bg-[#C8102E] hover:bg-[#A30D25] rounded-md shadow-sm transition-colors cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Centralized Print Preview & PDF Export Modal */}
      {isPrintModalOpen && (
        <PrintPreviewModal
          isOpen={isPrintModalOpen}
          onClose={() => setIsPrintModalOpen(false)}
          defaultDocType="KURIKULUM_SILABUS"
          docData={{
            profile,
            programB: progB,
            programC: progC,
            strukturs: strukturList,
            alokasis: alokasiList,
            kalenders: kalenderList,
            cps: cpList,
            tps: tpList
          }}
          title="Dokumen Kurikulum Operasional Satuan Pendidikan (KOSP)"
        />
      )}
    </div>
  );
};
