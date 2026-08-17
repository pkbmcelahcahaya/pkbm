import { Materi } from '../types';

const OFFLINE_STORAGE_PREFIX = 'pkbm_offline_materi_';
const OFFLINE_INDEX_KEY = 'pkbm_offline_materials_index';

export interface CachedModuleData {
  materi: Materi;
  cachedAt: string; // ISO string
  contentSummary?: string;
  isAvailableOffline: boolean;
}

export class CurriculumCacheService {
  /**
   * Check if a module is available in offline storage
   */
  isModuleCached(materiId: string): boolean {
    try {
      const key = `${OFFLINE_STORAGE_PREFIX}${materiId}`;
      return localStorage.getItem(key) !== null;
    } catch {
      return false;
    }
  }

  /**
   * Cache a module into LocalStorage & offline registry
   */
  cacheModule(materi: Materi): boolean {
    try {
      const key = `${OFFLINE_STORAGE_PREFIX}${materi.id}`;
      const payload: CachedModuleData = {
        materi,
        cachedAt: new Date().toISOString(),
        contentSummary: materi.deskripsi,
        isAvailableOffline: true
      };

      localStorage.setItem(key, JSON.stringify(payload));

      // Update offline indexed list
      const index = this.getCachedModuleIds();
      if (!index.includes(materi.id)) {
        index.push(materi.id);
        localStorage.setItem(OFFLINE_INDEX_KEY, JSON.stringify(index));
      }

      return true;
    } catch (e) {
      console.warn('Failed to cache module offline:', e);
      return false;
    }
  }

  /**
   * Retrieve cached module from LocalStorage
   */
  getCachedModule(materiId: string): CachedModuleData | null {
    try {
      const key = `${OFFLINE_STORAGE_PREFIX}${materiId}`;
      const data = localStorage.getItem(key);
      if (!data) return null;
      return JSON.parse(data) as CachedModuleData;
    } catch {
      return null;
    }
  }

  /**
   * Get all cached module IDs
   */
  getCachedModuleIds(): string[] {
    try {
      const data = localStorage.getItem(OFFLINE_INDEX_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  /**
   * Remove a module from offline cache
   */
  removeCachedModule(materiId: string): void {
    try {
      const key = `${OFFLINE_STORAGE_PREFIX}${materiId}`;
      localStorage.removeItem(key);

      let index = this.getCachedModuleIds();
      index = index.filter(id => id !== materiId);
      localStorage.setItem(OFFLINE_INDEX_KEY, JSON.stringify(index));
    } catch (e) {
      console.warn('Error removing cached module:', e);
    }
  }

  /**
   * Clear all offline cached curriculum materials
   */
  clearAllCache(): void {
    try {
      const ids = this.getCachedModuleIds();
      ids.forEach(id => {
        localStorage.removeItem(`${OFFLINE_STORAGE_PREFIX}${id}`);
      });
      localStorage.removeItem(OFFLINE_INDEX_KEY);
    } catch (e) {
      console.warn('Error clearing offline cache:', e);
    }
  }
}

export const curriculumCache = new CurriculumCacheService();
