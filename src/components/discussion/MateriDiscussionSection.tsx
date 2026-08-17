import React, { useState, useEffect, useMemo } from 'react';
import {
  MessageSquare,
  HelpCircle,
  Lightbulb,
  Send,
  Heart,
  CornerDownRight,
  Pin,
  Trash2,
  CheckCircle2,
  Sparkles,
  User as UserIcon,
  BookOpen,
  Filter,
  Flame
} from 'lucide-react';
import { Materi, MateriComment, User } from '../../types';
import { discussionService } from '../../services/discussionService';

interface MateriDiscussionSectionProps {
  materi: Materi;
  currentUser: User | null;
  currentPage?: number;
  totalPages?: number;
  className?: string;
  isCompact?: boolean;
}

export const MateriDiscussionSection: React.FC<MateriDiscussionSectionProps> = ({
  materi,
  currentUser,
  currentPage = 1,
  totalPages = 24,
  className = '',
  isCompact = false
}) => {
  const [comments, setComments] = useState<MateriComment[]>([]);
  const [newContent, setNewContent] = useState('');
  const [commentType, setCommentType] = useState<'QUESTION' | 'INSIGHT' | 'GENERAL'>('QUESTION');
  const [attachPage, setAttachPage] = useState<boolean>(true);
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'QUESTION' | 'INSIGHT' | 'PINNED'>('ALL');
  const [submitting, setSubmitting] = useState(false);

  // Load and subscribe to real-time discussion thread
  useEffect(() => {
    if (!materi) return;

    const loadComments = () => {
      const list = discussionService.getComments(materi.id);
      setComments(list);
    };

    loadComments();

    const unsubscribe = discussionService.subscribe(loadComments);
    return () => unsubscribe();
  }, [materi?.id]);

  const filteredComments = useMemo(() => {
    return comments.filter(c => {
      if (filterType === 'QUESTION') return c.type === 'QUESTION';
      if (filterType === 'INSIGHT') return c.type === 'INSIGHT';
      if (filterType === 'PINNED') return Boolean(c.is_pinned);
      return true;
    });
  }, [comments, filterType]);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim() || !currentUser || !materi) return;

    setSubmitting(true);
    try {
      discussionService.addComment({
        materiId: materi.id,
        user: currentUser,
        content: newContent,
        type: commentType,
        pageNumber: attachPage ? currentPage : undefined
      });
      setNewContent('');
      // Reset to default
      setCommentType('QUESTION');
    } catch (err) {
      console.error('Failed to add comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendReply = (commentId: string) => {
    if (!replyContent.trim() || !currentUser || !materi) return;

    discussionService.addReply({
      materiId: materi.id,
      commentId,
      user: currentUser,
      content: replyContent
    });

    setReplyContent('');
    setActiveReplyId(null);
  };

  const handleToggleLike = (commentId: string) => {
    if (!currentUser || !materi) return;
    discussionService.toggleLikeComment(materi.id, commentId, currentUser.id);
  };

  const handleTogglePin = (commentId: string) => {
    if (!materi) return;
    discussionService.togglePinComment(materi.id, commentId);
  };

  const handleDelete = (commentId: string) => {
    if (!materi) return;
    if (window.confirm('Hapus komentar/diskusi ini?')) {
      discussionService.deleteComment(materi.id, commentId);
    }
  };

  const formatTimeAgo = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return 'Baru saja';
      if (diffMins < 60) return `${diffMins}m lalu`;
      if (diffHours < 24) return `${diffHours}j lalu`;
      if (diffDays === 1) return 'Kemarin';
      return `${diffDays}h lalu`;
    } catch {
      return 'Baru saja';
    }
  };

  const isTeacherOrAdmin = currentUser?.role === 'TUTOR' || currentUser?.role === 'ADMIN';

  return (
    <div className={`space-y-4 text-slate-900 dark:text-slate-100 ${className}`}>
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Forum Diskusi & Tanya Jawab Modul
              </h3>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Tanyakan materi yang sulit atau bagikan catatan ringkasan dengan sesama warga belajar & tutor.
            </p>
          </div>
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-1 overflow-x-auto py-1">
          <button
            type="button"
            onClick={() => setFilterType('ALL')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filterType === 'ALL'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            Semua ({comments.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('QUESTION')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer ${
              filterType === 'QUESTION'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            <HelpCircle className="w-3 h-3 text-amber-500" />
            <span>Tanya</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterType('INSIGHT')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer ${
              filterType === 'INSIGHT'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            <Lightbulb className="w-3 h-3 text-emerald-500" />
            <span>Insight</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterType('PINNED')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer ${
              filterType === 'PINNED'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            <Pin className="w-3 h-3 text-purple-500" />
            <span>Pin</span>
          </button>
        </div>
      </div>

      {/* Input submission box */}
      {currentUser ? (
        <form
          onSubmit={handleSubmitComment}
          className="p-3.5 bg-slate-50 dark:bg-slate-850/80 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2.5"
        >
          <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Tipe Posting:</span>
              <button
                type="button"
                onClick={() => setCommentType('QUESTION')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  commentType === 'QUESTION'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <HelpCircle className="w-3 h-3" />
                <span>Pertanyaan / Tanya Tutor</span>
              </button>

              <button
                type="button"
                onClick={() => setCommentType('INSIGHT')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  commentType === 'INSIGHT'
                    ? 'bg-emerald-500 text-slate-950 shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <Lightbulb className="w-3 h-3" />
                <span>Insight / Catatan</span>
              </button>

              <button
                type="button"
                onClick={() => setCommentType('GENERAL')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  commentType === 'GENERAL'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <MessageSquare className="w-3 h-3" />
                <span>Diskusi Umum</span>
              </button>
            </div>

            {/* Page number attachment toggle */}
            <label className="flex items-center gap-1.5 cursor-pointer select-none text-[11px] text-slate-600 dark:text-slate-400 font-medium">
              <input
                type="checkbox"
                checked={attachPage}
                onChange={e => setAttachPage(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>Tandai Halaman Aktif (Hal. {currentPage})</span>
            </label>
          </div>

          <div className="relative">
            <textarea
              rows={isCompact ? 2 : 3}
              value={newContent}
              onChange={e => setNewContent(e.target.value)}
              placeholder={
                commentType === 'QUESTION'
                  ? `Tuliskan pertanyaan Anda mengenai materi ${materi.mata_pelajaran} (Halaman ${currentPage})...`
                  : commentType === 'INSIGHT'
                  ? 'Tuliskan insight penting atau kesimpulan materi yang Anda pelajari...'
                  : 'Bagikan pendapat atau diskusikan modul ini bersama rekan belajar...'
              }
              className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-slate-400">
              Posting sebagai: <strong>{currentUser.nama}</strong> ({currentUser.role})
            </span>

            <button
              type="submit"
              disabled={!newContent.trim() || submitting}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Mengirim...' : 'Kirim Diskusi'}</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-900/60 text-xs text-amber-800 dark:text-amber-300 text-center">
          Silakan masuk/login untuk ikut berpartisipasi dalam diskusi dan tanya jawab modul ini.
        </div>
      )}

      {/* Discussion Thread List */}
      <div className="space-y-3 pt-2">
        {filteredComments.length === 0 ? (
          <div className="text-center py-8 px-4 bg-slate-50 dark:bg-slate-850/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            <MessageSquare className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Belum ada diskusi untuk kategori ini.
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Jadilah yang pertama mengajukan pertanyaan atau berbagi insight pada modul ini!
            </p>
          </div>
        ) : (
          filteredComments.map(comment => {
            const hasLiked = currentUser ? comment.likes?.includes(currentUser.id) : false;
            const likeCount = comment.likes?.length || 0;
            const replyCount = comment.replies?.length || 0;
            const isAuthor = currentUser?.id === comment.user_id;

            return (
              <div
                key={comment.id}
                className={`p-4 rounded-2xl border transition-all ${
                  comment.is_pinned
                    ? 'bg-purple-50/60 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800/80 shadow-2xs'
                    : comment.type === 'QUESTION'
                    ? 'bg-white dark:bg-slate-900 border-amber-200/70 dark:border-slate-800'
                    : comment.type === 'INSIGHT'
                    ? 'bg-white dark:bg-slate-900 border-emerald-200/70 dark:border-slate-800'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Comment Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-indigo-600 dark:text-indigo-400 shrink-0 border border-slate-200 dark:border-slate-700">
                      {comment.user_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">
                          {comment.user_name}
                        </span>

                        {/* Role Badge */}
                        <span
                          className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded-md ${
                            comment.user_role === 'ADMIN'
                              ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                              : comment.user_role === 'TUTOR'
                              ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {comment.user_role === 'SISWA' ? 'Warga Belajar' : comment.user_role}
                        </span>

                        {/* Type Badge */}
                        {comment.type === 'QUESTION' && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 flex items-center gap-0.5">
                            <HelpCircle className="w-2.5 h-2.5" /> Tanya
                          </span>
                        )}
                        {comment.type === 'INSIGHT' && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center gap-0.5">
                            <Lightbulb className="w-2.5 h-2.5" /> Insight
                          </span>
                        )}

                        {comment.is_pinned && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center gap-0.5">
                            <Pin className="w-2.5 h-2.5" /> Tersemat
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                        {comment.page_number && (
                          <span className="font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-0.5">
                            <BookOpen className="w-2.5 h-2.5" /> Hal. {comment.page_number}
                          </span>
                        )}
                        {comment.page_number && <span>•</span>}
                        <span>{formatTimeAgo(comment.created_at)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions (Pin / Delete) */}
                  <div className="flex items-center gap-1">
                    {isTeacherOrAdmin && (
                      <button
                        type="button"
                        onClick={() => handleTogglePin(comment.id)}
                        className={`p-1 rounded-lg transition-colors cursor-pointer ${
                          comment.is_pinned
                            ? 'text-purple-600 bg-purple-100 dark:bg-purple-900/50'
                            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                        }`}
                        title={comment.is_pinned ? 'Lepas Pin' : 'Sematkan Komentar'}
                      >
                        <Pin className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {(isAuthor || isTeacherOrAdmin) && (
                      <button
                        type="button"
                        onClick={() => handleDelete(comment.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                        title="Hapus Diskusi"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Comment Body */}
                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed pl-1 whitespace-pre-line">
                  {comment.content}
                </p>

                {/* Bottom Action bar */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleLike(comment.id)}
                      className={`px-2 py-1 rounded-lg flex items-center gap-1 text-[11px] font-semibold transition-colors cursor-pointer ${
                        hasLiked
                          ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/60 font-bold'
                          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-rose-600' : ''}`} />
                      <span>{likeCount > 0 ? likeCount : 'Suka'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveReplyId(activeReplyId === comment.id ? null : comment.id)}
                      className="px-2 py-1 rounded-lg flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <CornerDownRight className="w-3.5 h-3.5" />
                      <span>Balas {replyCount > 0 ? `(${replyCount})` : ''}</span>
                    </button>
                  </div>

                  {comment.replies && comment.replies.some(r => r.is_tutor_answer) && (
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900">
                      <CheckCircle2 className="w-3 h-3" /> Dijawab Tutor
                    </span>
                  )}
                </div>

                {/* Threaded Replies List */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 pl-3 sm:pl-5 border-l-2 border-indigo-200 dark:border-indigo-900/60 ml-2">
                    {comment.replies.map(reply => (
                      <div
                        key={reply.id}
                        className={`p-2.5 rounded-xl text-xs ${
                          reply.is_tutor_answer
                            ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/80'
                            : 'bg-slate-50 dark:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-slate-900 dark:text-white text-[11px]">
                              {reply.user_name}
                            </span>
                            <span
                              className={`text-[8px] font-black uppercase px-1 py-0.1 rounded ${
                                reply.user_role === 'TUTOR' || reply.user_role === 'ADMIN'
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              {reply.user_role}
                            </span>
                            {reply.is_tutor_answer && (
                              <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                                <Sparkles className="w-2.5 h-2.5" /> Jawaban Resmi
                              </span>
                            )}
                          </div>
                          <span className="text-[9px] text-slate-400">
                            {formatTimeAgo(reply.created_at)}
                          </span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 text-[11px] sm:text-xs leading-relaxed">
                          {reply.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Inline Reply Input Box */}
                {activeReplyId === comment.id && currentUser && (
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2 items-center">
                    <input
                      type="text"
                      value={replyContent}
                      onChange={e => setReplyContent(e.target.value)}
                      placeholder={`Balas ${comment.user_name}...`}
                      className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      autoFocus
                      onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendReply(comment.id);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleSendReply(comment.id)}
                      disabled={!replyContent.trim()}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <Send className="w-3 h-3" />
                      <span>Kirim</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveReplyId(null);
                        setReplyContent('');
                      }}
                      className="p-1.5 text-slate-400 hover:text-slate-600 text-xs rounded-xl cursor-pointer"
                    >
                      Batal
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
