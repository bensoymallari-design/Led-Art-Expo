import AsyncStorage from '@react-native-async-storage/async-storage';
import { Content } from 'led-art-shared';

interface CacheIndexEntry { id: string; sizeBytes: number; lastAccessed: number; }
const INDEX_KEY = 'ledart:receiver-cache-index';
const CONTENT_PREFIX = 'ledart:receiver-content:';
const MAX_CACHE_BYTES = 75 * 1024 * 1024;

export class CacheService {
  async cacheContent(content: Content): Promise<void> {
    const serialized = JSON.stringify(content);
    await AsyncStorage.setItem(CONTENT_PREFIX + content.id, serialized);
    const index = await this.getIndex();
    const entry = { id: content.id, sizeBytes: serialized.length, lastAccessed: Date.now() };
    await AsyncStorage.setItem(INDEX_KEY, JSON.stringify([...index.filter((item) => item.id !== content.id), entry]));
    await this.evictIfNeeded();
  }

  async getCachedContent(id: string): Promise<Content | null> {
    const raw = await AsyncStorage.getItem(CONTENT_PREFIX + id);
    if (!raw) return null;
    const index = await this.getIndex();
    await AsyncStorage.setItem(INDEX_KEY, JSON.stringify(index.map((item) => item.id === id ? { ...item, lastAccessed: Date.now() } : item)));
    return JSON.parse(raw) as Content;
  }

  async getAll(): Promise<Content[]> {
    const index = await this.getIndex();
    const items = await Promise.all(index.map((entry) => this.getCachedContent(entry.id)));
    return items.filter(Boolean) as Content[];
  }

  async clearCache(): Promise<void> {
    const index = await this.getIndex();
    await Promise.all(index.map((entry) => AsyncStorage.removeItem(CONTENT_PREFIX + entry.id)));
    await AsyncStorage.removeItem(INDEX_KEY);
  }

  async getCacheSize(): Promise<number> { return (await this.getIndex()).reduce((sum, entry) => sum + entry.sizeBytes, 0); }
  getAvailableSpace(): number { return MAX_CACHE_BYTES; }

  private async getIndex(): Promise<CacheIndexEntry[]> { const raw = await AsyncStorage.getItem(INDEX_KEY); return raw ? JSON.parse(raw) : []; }
  private async evictIfNeeded() {
    let index = await this.getIndex();
    while (index.reduce((sum, entry) => sum + entry.sizeBytes, 0) > MAX_CACHE_BYTES && index.length > 1) {
      index = index.sort((a, b) => a.lastAccessed - b.lastAccessed);
      const [oldest, ...rest] = index;
      await AsyncStorage.removeItem(CONTENT_PREFIX + oldest.id);
      index = rest;
    }
    await AsyncStorage.setItem(INDEX_KEY, JSON.stringify(index));
  }
}
export const cacheService = new CacheService();
