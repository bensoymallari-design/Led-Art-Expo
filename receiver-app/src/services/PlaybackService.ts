import { Content } from 'led-art-shared';
import { cacheService } from './CacheService';

type Listener = (content?: Content, playlist?: Content[]) => void;

export class PlaybackService {
  private playlist: Content[] = [];
  private currentIndex = 0;
  private timer?: ReturnType<typeof setTimeout>;
  private listeners = new Set<Listener>();
  autoPlayEnabled = true;

  async hydrate() { this.playlist = await cacheService.getAll(); this.emit(); }
  subscribe(listener: Listener) { this.listeners.add(listener); listener(this.current(), this.playlist); return () => this.listeners.delete(listener); }
  current() { return this.playlist[this.currentIndex]; }
  setAutoPlay(enabled: boolean) { this.autoPlayEnabled = enabled; if (enabled) this.startAutoPlay(); else this.stop(); }
  async queueContent(content: Content) { await cacheService.cacheContent(content); this.playlist = [...this.playlist.filter((item) => item.id !== content.id), content]; if (!this.current() || this.autoPlayEnabled) { this.currentIndex = this.playlist.length - 1; this.startAutoPlay(); } this.emit(); }
  startAutoPlay() { if (!this.autoPlayEnabled || !this.playlist.length) return; this.stop(); const content = this.current(); this.emit(); this.timer = setTimeout(() => { this.currentIndex = (this.currentIndex + 1) % this.playlist.length; this.startAutoPlay(); }, content?.durationMs ?? 8000); }
  stop() { if (this.timer) clearTimeout(this.timer); this.timer = undefined; }
  clear() { this.stop(); this.playlist = []; this.currentIndex = 0; this.emit(); }
  private emit() { this.listeners.forEach((listener) => listener(this.current(), this.playlist)); }
}
export const playbackService = new PlaybackService();
