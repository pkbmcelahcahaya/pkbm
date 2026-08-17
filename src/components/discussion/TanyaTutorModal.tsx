import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Send,
  MessageSquare,
  Sparkles,
  Award,
  BookOpen,
  UserCheck,
  Phone,
  Mail,
  HelpCircle,
  Clock,
  CheckCircle2,
  Paperclip,
  ExternalLink,
  MessageCircle,
  GraduationCap,
  Bot
} from 'lucide-react';
import { Materi, User } from '../../types';
import { TutorMasterInfo, getAssignedTutorForMateri } from '../../data/tutorData';
import { discussionService } from '../../services/discussionService';
import { TextToSpeechButton } from '../common/TextToSpeechButton';

interface TanyaTutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  materi: Materi;
  currentUser: User | null;
  currentPage: number;
  totalPages: number;
  onOpenDiscussionSidebar?: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'tutor';
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  pageReference?: number;
}

export const TanyaTutorModal: React.FC<TanyaTutorModalProps> = ({
  isOpen,
  onClose,
  materi,
  currentUser,
  currentPage,
  totalPages,
  onOpenDiscussionSidebar
}) => {
  const tutor: TutorMasterInfo = getAssignedTutorForMateri(materi);

  const [activeTab, setActiveTab] = useState<'form' | 'chat' | 'contact'>('form');
  
  // Quick Contact Form state
  const [senderName, setSenderName] = useState(currentUser?.nama || '');
  const [senderEmail, setSenderEmail] = useState(currentUser?.email || '');
  const [questionCategory, setQuestionCategory] = useState<'konsep' | 'tugas' | 'evaluasi' | 'umum'>('konsep');
  const [questionText, setQuestionText] = useState('');
  const [includePageRef, setIncludePageRef] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  // Live Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'msg-welcome',
        sender: 'tutor',
        senderName: tutor.nama,
        senderAvatar: tutor.foto,
        text: `Halo ${currentUser?.nama || 'Warga Belajar'}! Saya ${tutor.nama}, Tutor Pengampu mata pelajaran ${materi.mata_pelajaran} untuk ${materi.paket}. Senang bisa mendampingi Anda belajar modul "${materi.judul}". Ada bagian di Halaman ${currentPage} atau lembar tugas yang perlu saya jelaskan lebih lanjut?`,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        pageReference: currentPage
      }
    ];
  });
  const [chatInput, setChatInput] = useState('');
  const [isTutorTyping, setIsTutorTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab === 'chat') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, activeTab, isTutorTyping]);

  if (!isOpen) return null;

  // Handle Form Submission
  const handleSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;

    setIsSubmitting(true);

    const fullQuestion = `[Tanya Tutor - ${questionCategory.toUpperCase()}] ${questionText.trim()}`;

    // Post to persistent discussion service
    discussionService.addComment({
      materiId: materi.id,
      user: currentUser || {
        id: `guest-${Date.now()}`,
        nama: senderName || 'Warga Belajar',
        role: 'WARGA_BELAJAR',
        status: 'AKTIF',
        foto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
      },
      pageNumber: includePageRef ? currentPage : undefined,
      type: 'QUESTION',
      content: fullQuestion
    });

    // Also add to chat messages
    const newChatMsg: ChatMessage = {
      id: `chat-${Date.now()}`,
      sender: 'user',
      senderName: senderName || 'Warga Belajar',
      senderAvatar: currentUser?.foto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      text: questionText.trim(),
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      pageReference: includePageRef ? currentPage : undefined
    };

    setChatMessages(prev => [...prev, newChatMsg]);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmittedSuccess(true);
      setQuestionText('');

      // Auto-reply in chat after a short delay
      setTimeout(() => {
        generateTutorAutoReply(questionText.trim(), questionCategory);
      }, 1500);
    }, 600);
  };

  // Tutor auto reply generator based on context
  const generateTutorAutoReply = (userQuery: string, category: string) => {
    setIsTutorTyping(true);
    setTimeout(() => {
      let replyText = '';
      const qLower = userQuery.toLowerCase();

      if (category === 'tugas' || qLower.includes('tugas') || qLower.includes('aktivitas')) {
        replyText = `Pertanyaan yang sangat bagus terkait tugas mandiri pada modul ${materi.judul}! Kuncinya adalah menghubungkan teori di Halaman ${currentPage} dengan pengalaman sehari-hari. Coba susun jawaban secara runtut dimulai dari identifikasi masalah, faktor pemicu, lalu solusi yang relevan. Jangan ragu kirimkan draf jawaban Anda!`;
      } else if (category === 'evaluasi' || qLower.includes('kuis') || qLower.includes('soal')) {
        replyText = `Untuk evaluasi kuis modul ini, perhatikan istilah kunci dan definisi utama di setiap sub-bab. Soal dirancang untuk menguji pemahaman konsep dasar, bukan sekadar hafalan. Pastikan Anda telah membaca ringkasan materi di Halaman ${currentPage} sebelum mengerjakan kuis 100 soal!`;
      } else if (qLower.includes('ringkasan') || qLower.includes('inti') || qLower.includes('jelaskan')) {
        replyText = `Inti pokok materi pada modul "${materi.judul}" mata pelajaran ${materi.mata_pelajaran} adalah membekali warga belajar dengan kompetensi esensial dan wawasan aplikatif. Pada Halaman ${currentPage}, fokus utamanya adalah penguatan penalaran kritis dan pemecahan masalah mandiri.`;
      } else {
        replyText = `Terima kasih atas pertanyaannya! Catatan pertanyaan ini telah saya terima dan tersimpan di riwayat bimbingan modul "${materi.judul}". Terus tingkatkan semangat belajarnya, dan Anda juga bisa berdiskusi lebih lanjut via WhatsApp atau forum materi ini ya!`;
      }

      setChatMessages(prev => [
        ...prev,
        {
          id: `tutor-reply-${Date.now()}`,
          sender: 'tutor',
          senderName: tutor.nama,
          senderAvatar: tutor.foto,
          text: replyText,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          pageReference: currentPage
        }
      ]);
      setIsTutorTyping(false);
    }, 1800);
  };

  // Handle Send Chat Message
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    const newMsg: ChatMessage = {
      id: `chat-${Date.now()}`,
      sender: 'user',
      senderName: currentUser?.nama || senderName || 'Warga Belajar',
      senderAvatar: currentUser?.foto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      text: userText,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      pageReference: currentPage
    };

    setChatMessages(prev => [...prev, newMsg]);
    setChatInput('');

    generateTutorAutoReply(userText, 'umum');
  };

  // WhatsApp Pre-filled Link
  const studentNameFormatted = currentUser?.nama || senderName || 'Warga Belajar';
  const waMessage = encodeURIComponent(
    `Halo Bapak/Ibu ${tutor.nama},\n\nSaya *${studentNameFormatted}* (Warga Belajar PKBM Celah Cahaya - ${materi.paket}).\n\nSaya ingin berkonsultasi mengenai materi pembelajaran:\n📖 *Modul:* ${materi.judul}\n📚 *Mata Pelajaran:* ${materi.mata_pelajaran}\n📄 *Referensi Halaman:* Halaman ${currentPage} dari ${totalPages}\n\n*Pertanyaan saya:* `
  );
  // Default WhatsApp direct link using Indonesian country code format
  const waLink = `https://wa.me/6282118335520?text=${waMessage}`;

  return (
    <div
      id="tanya-tutor-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        onClick={e => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-indigo-50/80 via-white to-indigo-50/80 dark:from-slate-900 dark:via-slate-850 dark:to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/30">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  Tanya Tutor Pengampu
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Siap Membimbing
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Konsultasi & Tanya Jawab Materi Modul Pembelajaran Mandiri
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Assigned Tutor Profile Highlight Card */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-850/60 border-b border-slate-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="relative shrink-0">
                <img
                  src={tutor.foto}
                  alt={tutor.nama}
                  className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-md"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" title="Tutor Online" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-100/70 dark:bg-indigo-950/80 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800">
                    Tutor {tutor.pendidikan}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    SK: {tutor.no_sk}
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate mt-0.5">
                  {tutor.nama}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 truncate">
                  {tutor.mata_pelajaran}
                </p>
              </div>
            </div>

            {/* Context Badge of Current Reading Page */}
            <div className="bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-750 text-xs shrink-0 shadow-2xs w-full sm:w-auto">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[11px] mb-0.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                <span>Referensi Modul Saat Ini:</span>
              </div>
              <p className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[240px]">
                {materi.judul}
              </p>
              <div className="flex items-center justify-between text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 mt-1">
                <span>{materi.paket}</span>
                <span>Halaman {currentPage} dari {totalPages}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center px-4 sm:px-5 pt-3 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('form')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'form'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Kirim Pesan / Formulir</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('chat')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'chat'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat Langsung Sesi Belajar</span>
            {chatMessages.length > 1 && (
              <span className="w-2 h-2 rounded-full bg-indigo-600" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('contact')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'contact'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Kontak WhatsApp & Info</span>
          </button>
        </div>

        {/* Tab Contents Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 custom-scrollbar">
          {/* TAB 1: FORMULIR TANYA TUTOR */}
          {activeTab === 'form' && (
            <div className="space-y-4">
              {isSubmittedSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-start gap-3 text-emerald-800 dark:text-emerald-200 text-xs"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-bold text-sm">Pertanyaan Anda Berhasil Terkirim ke Tutor!</p>
                    <p className="mt-0.5 text-emerald-700 dark:text-emerald-300">
                      Tutor {tutor.nama} telah menerima pesan Anda dan tersimpan di riwayat diskusi modul. Anda dapat melanjutkan dialog di tab Chat Langsung atau melihatnya di forum diskusi modul.
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        type="button"
                        onClick={() => setActiveTab('chat')}
                        className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl font-bold text-xs hover:bg-emerald-700 transition-colors cursor-pointer"
                      >
                        Buka Sesi Chat
                      </button>
                      {onOpenDiscussionSidebar && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onOpenDiscussionSidebar();
                          }}
                          className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-emerald-300 text-emerald-700 dark:text-emerald-300 rounded-xl font-bold text-xs hover:bg-emerald-50 transition-colors cursor-pointer"
                        >
                          Lihat di Forum Diskusi
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              <form onSubmit={handleSubmitQuestion} className="space-y-4">
                {/* Sender Identity Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Nama Warga Belajar / Pengirim
                    </label>
                    <input
                      type="text"
                      required
                      value={senderName}
                      onChange={e => setSenderName(e.target.value)}
                      placeholder="Masukkan nama lengkap Anda..."
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Email / Nomor HP (Opsional)
                    </label>
                    <input
                      type="text"
                      value={senderEmail}
                      onChange={e => setSenderEmail(e.target.value)}
                      placeholder="Email atau kontak untuk follow-up..."
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Question Category Chips */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Kategori Bimbingan & Pertanyaan:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'konsep', label: '❓ Konsep Materi', desc: 'Penjelasan teori' },
                      { id: 'tugas', label: '📝 Lembar Tugas', desc: 'Bantuan aktivitas' },
                      { id: 'evaluasi', label: '🎯 Soal Kuis', desc: 'Pembahasan soal' },
                      { id: 'umum', label: '💬 Bimbingan Umum', desc: 'Konsultasi belajar' }
                    ].map(cat => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setQuestionCategory(cat.id as any)}
                        className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                          questionCategory === cat.id
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 shadow-2xs'
                            : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-750 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                        }`}
                      >
                        <p className="text-xs font-bold">{cat.label}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{cat.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Page Reference Tag Toggle */}
                <div className="flex items-center justify-between p-3 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-2xl border border-indigo-100 dark:border-indigo-900/50">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Sertakan Penanda Halaman Referensi
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Membantu Tutor langsung mengetahui Anda bertanya di Halaman {currentPage}
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    id="chk-include-page"
                    checked={includePageRef}
                    onChange={e => setIncludePageRef(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                  />
                </div>

                {/* Question Text Area */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Isi Pertanyaan / Bagian yang Ingin Dikonsultasikan
                    </label>
                    {/* Quick Template Prompts */}
                    <span className="text-[11px] text-slate-400">
                      Tuliskan secara jelas & spesifik
                    </span>
                  </div>
                  <textarea
                    required
                    rows={4}
                    value={questionText}
                    onChange={e => setQuestionText(e.target.value)}
                    placeholder={`Tuliskan pertanyaan Anda kepada ${tutor.nama} mengenai modul ${materi.judul} (misal: "Bapak/Ibu Tutor, mohon bantuan penjelasan cara menyelesaikan lembar tugas nomor 3 di halaman ini...")...`}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none leading-relaxed"
                  />

                  {/* Prompt Shortcut Chips */}
                  <div className="flex items-center gap-1.5 flex-wrap mt-2">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500" /> Template:
                    </span>
                    {[
                      'Mohon penjelasan konsep inti di halaman ini',
                      'Bagaimana tips mengerjakan latihan tugas mandiri?',
                      'Minta petunjuk pembahasan evaluasi soal kuis'
                    ].map((prompt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setQuestionText(prompt)}
                        className="px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-600 dark:text-slate-400 hover:text-indigo-600 text-[10px] font-medium rounded-lg transition-colors cursor-pointer"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting || !questionText.trim()}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Mengirimkan...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Kirimkan ke {tutor.nama}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: LIVE CHAT SESI BELAJAR */}
          {activeTab === 'chat' && (
            <div className="flex flex-col h-[400px]">
              {/* Chat Message List */}
              <div className="flex-1 overflow-y-auto space-y-3.5 pr-2 custom-scrollbar">
                {chatMessages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${
                      msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    <img
                      src={msg.senderAvatar}
                      alt={msg.senderName}
                      className="w-7 h-7 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                    />

                    <div
                      className={`max-w-[82%] rounded-2xl p-3 text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-indigo-600 text-white rounded-tr-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-tl-xs border border-slate-200/80 dark:border-slate-750'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className={`text-[10px] font-black ${msg.sender === 'user' ? 'text-indigo-200' : 'text-indigo-600 dark:text-indigo-400'}`}>
                          {msg.senderName}
                        </span>
                        <div className="flex items-center gap-1.5 text-[9px] opacity-70">
                          {msg.pageReference && (
                            <span className="bg-black/10 dark:bg-white/10 px-1 py-0.2 rounded font-mono">
                              Hal. {msg.pageReference}
                            </span>
                          )}
                          <span>{msg.timestamp}</span>
                        </div>
                      </div>

                      <p>{msg.text}</p>

                      {msg.sender === 'tutor' && (
                        <div className="mt-2 pt-1.5 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-end">
                          <TextToSpeechButton
                            text={msg.text}
                            title={`Jawaban ${tutor.nama}`}
                            variant="icon"
                            size="xs"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isTutorTyping && (
                  <div className="flex items-center gap-2 text-xs text-slate-400 animate-in fade-in">
                    <img
                      src={tutor.foto}
                      alt={tutor.nama}
                      className="w-6 h-6 rounded-lg object-cover"
                    />
                    <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-tl-xs flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                      <span className="text-[10px] text-slate-500 ml-1">{tutor.nama} sedang mengetik...</span>
                    </div>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Chat Input Bar */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 mt-2">
                <form onSubmit={handleSendChat} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    placeholder={`Tanya langsung ${tutor.nama} seputar Hal. ${currentPage}...`}
                    className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!chatInput.trim() || isTutorTyping}
                    className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl transition-all cursor-pointer shrink-0"
                    title="Kirim Pesan"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 3: KONTAK LANGSUNG & WHATSAPP */}
          {activeTab === 'contact' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-600/30 shrink-0">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-black text-xs sm:text-sm text-slate-900 dark:text-white">
                      Konsultasi Langsung via WhatsApp
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Tersambung otomatis dengan template pesan berisi detail nama modul & halaman aktif.
                    </p>
                  </div>
                </div>

                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer shrink-0"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Buka Chat WhatsApp</span>
                </a>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-750 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-600/30 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-black text-xs sm:text-sm text-slate-900 dark:text-white">
                      Kirim Surat Elektronik (Email Resmi)
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      {tutor.email}
                    </p>
                  </div>
                </div>

                <a
                  href={`mailto:${tutor.email}?subject=${encodeURIComponent(`[Konsultasi Belajar PKBM] Modul: ${materi.judul} (${materi.paket})`)}`}
                  className="w-full sm:w-auto px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Kirim Email</span>
                </a>
              </div>

              {/* Service Hours & Consultation Guidelines */}
              <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300 mb-1.5">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Jam Bimbingan & Konsultasi Tutor PKBM Celah Cahaya:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600 dark:text-slate-400">
                  <li><strong>Senin s.d. Sabtu:</strong> Pukul 08.00 – 17.00 WIB (Respon Cepat).</li>
                  <li><strong>Luar Jam Bimbingan:</strong> Pesan tetap dapat dikirimkan dan akan direspons pada jam kerja berikutnya.</li>
                  <li>Warga belajar dianjurkan menyertakan nomor halaman atau foto lembar aktivitas saat bertanya.</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="p-3 bg-slate-100 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span>Layanan Bimbingan Belajar Kesetaraan • PKBM Celah Cahaya</span>
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">
            Tutor: {tutor.nama}
          </span>
        </div>
      </motion.div>
    </div>
  );
};
