import { MateriComment, MateriCommentReply, User } from '../types';

const DISCUSSION_STORAGE_KEY = 'pkbm_materi_discussions_v1';
const UPDATE_EVENT_NAME = 'pkbm_materi_discussions_updated';

class DiscussionService {
  private getStore(): Record<string, MateriComment[]> {
    try {
      const data = localStorage.getItem(DISCUSSION_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Failed to parse discussion data:', e);
    }
    return this.initSeedDiscussions();
  }

  private saveStore(store: Record<string, MateriComment[]>): void {
    try {
      localStorage.setItem(DISCUSSION_STORAGE_KEY, JSON.stringify(store));
      // Notify active listeners in the current tab
      window.dispatchEvent(new CustomEvent(UPDATE_EVENT_NAME));
    } catch (e) {
      console.warn('Failed to save discussion data:', e);
    }
  }

  private initSeedDiscussions(): Record<string, MateriComment[]> {
    const defaultStore: Record<string, MateriComment[]> = {
      // Seed for general or common modules
      'default': [
        {
          id: 'comm-seed-1',
          materi_id: 'default',
          user_id: 'usr_siswa_1',
          user_name: 'Budi Santoso',
          user_role: 'SISWA',
          page_number: 2,
          type: 'QUESTION',
          content: 'Mohon pencerahannya Bapak/Ibu Tutor, bagaimana tips paling efektif memahami konsep dasar pada bab ini untuk persiapan asesmen sumatif?',
          created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
          likes: ['usr_siswa_2', 'usr_siswa_3'],
          is_pinned: true,
          replies: [
            {
              id: 'rep-seed-1',
              comment_id: 'comm-seed-1',
              user_id: 'usr_tutor_1',
              user_name: 'Deni Ramdani, S.Pd (Tutor)',
              user_role: 'TUTOR',
              content: 'Halo Budi! Kuncinya adalah mencatat poin kunci di setiap halaman dan mencoba mengerjakan latihan kuis 100 soal mandiri. Jika ada soal yang belum paham, silakan tanyakan langsung di forum ini ya.',
              created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
              likes: ['usr_siswa_1'],
              is_tutor_answer: true
            }
          ]
        },
        {
          id: 'comm-seed-2',
          materi_id: 'default',
          user_id: 'usr_siswa_2',
          user_name: 'Siti Rahmawati',
          user_role: 'SISWA',
          page_number: 4,
          type: 'INSIGHT',
          content: '💡 Catatan Insight: Pada studi kasus halaman 4, keterkaitan antara materi teoritis dengan penerapan sehari-hari sangat jelas. Sangat bermanfaat untuk warga belajar kesetaraan!',
          created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
          likes: ['usr_siswa_1', 'usr_tutor_1'],
          replies: []
        }
      ]
    };

    try {
      localStorage.setItem(DISCUSSION_STORAGE_KEY, JSON.stringify(defaultStore));
    } catch {}

    return defaultStore;
  }

  /**
   * Get all comments for a specific module
   */
  getComments(materiId: string): MateriComment[] {
    const store = this.getStore();
    const list = store[materiId] || store['default'] || [];
    // Sort pinned first, then newest first
    return [...list].sort((a, b) => {
      if (a.is_pinned && !b.is_pinned) return -1;
      if (!a.is_pinned && b.is_pinned) return 1;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }

  /**
   * Add a new comment/question/insight to a module
   */
  addComment(params: {
    materiId: string;
    user: User;
    content: string;
    type: 'QUESTION' | 'INSIGHT' | 'GENERAL';
    pageNumber?: number;
  }): MateriComment {
    const store = this.getStore();
    const currentList = store[params.materiId] || [];

    const newComment: MateriComment = {
      id: `comm_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      materi_id: params.materiId,
      user_id: params.user.id,
      user_name: params.user.nama,
      user_role: params.user.role,
      avatar_url: params.user.foto_url || params.user.foto,
      page_number: params.pageNumber,
      type: params.type,
      content: params.content.trim(),
      created_at: new Date().toISOString(),
      likes: [],
      replies: []
    };

    store[params.materiId] = [newComment, ...currentList];
    this.saveStore(store);
    return newComment;
  }

  /**
   * Add reply to a specific comment
   */
  addReply(params: {
    materiId: string;
    commentId: string;
    user: User;
    content: string;
  }): MateriCommentReply | null {
    const store = this.getStore();
    const currentList = store[params.materiId] || store['default'] || [];

    const commentIndex = currentList.findIndex(c => c.id === params.commentId);
    if (commentIndex === -1) return null;

    const newReply: MateriCommentReply = {
      id: `rep_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      comment_id: params.commentId,
      user_id: params.user.id,
      user_name: params.user.nama,
      user_role: params.user.role,
      content: params.content.trim(),
      created_at: new Date().toISOString(),
      likes: [],
      is_tutor_answer: params.user.role === 'TUTOR' || params.user.role === 'ADMIN'
    };

    if (!currentList[commentIndex].replies) {
      currentList[commentIndex].replies = [];
    }
    currentList[commentIndex].replies.push(newReply);
    store[params.materiId] = currentList;
    this.saveStore(store);
    return newReply;
  }

  /**
   * Toggle like on a comment
   */
  toggleLikeComment(materiId: string, commentId: string, userId: string): boolean {
    const store = this.getStore();
    const list = store[materiId] || store['default'] || [];
    const target = list.find(c => c.id === commentId);
    if (!target) return false;

    if (!target.likes) target.likes = [];
    const index = target.likes.indexOf(userId);
    if (index > -1) {
      target.likes.splice(index, 1);
    } else {
      target.likes.push(userId);
    }

    store[materiId] = list;
    this.saveStore(store);
    return true;
  }

  /**
   * Toggle pin on a comment (Admin / Tutor only)
   */
  togglePinComment(materiId: string, commentId: string): boolean {
    const store = this.getStore();
    const list = store[materiId] || store['default'] || [];
    const target = list.find(c => c.id === commentId);
    if (!target) return false;

    target.is_pinned = !target.is_pinned;
    store[materiId] = list;
    this.saveStore(store);
    return true;
  }

  /**
   * Delete comment (Author or Admin/Tutor)
   */
  deleteComment(materiId: string, commentId: string): boolean {
    const store = this.getStore();
    const list = store[materiId] || [];
    store[materiId] = list.filter(c => c.id !== commentId);
    this.saveStore(store);
    return true;
  }

  /**
   * Subscribe to real-time thread updates
   */
  subscribe(callback: () => void): () => void {
    const handler = () => callback();
    window.addEventListener(UPDATE_EVENT_NAME, handler);
    window.addEventListener('storage', handler);

    return () => {
      window.removeEventListener(UPDATE_EVENT_NAME, handler);
      window.removeEventListener('storage', handler);
    };
  }
}

export const discussionService = new DiscussionService();
