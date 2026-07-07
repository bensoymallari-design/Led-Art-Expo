import { useCallback, useEffect, useState } from 'react';
import { Content } from 'led-art-shared';
import { playbackService } from '../services/PlaybackService';

export function useAutoPlay() {
  const [isAutoPlayEnabled, setEnabled] = useState(playbackService.autoPlayEnabled);
  const [playlist, setPlaylist] = useState<Content[]>([]);
  const [currentContent, setCurrentContent] = useState<Content | undefined>();
  useEffect(() => { playbackService.hydrate(); return playbackService.subscribe((content, items = []) => { setCurrentContent(content); setPlaylist(items); }); }, []);
  const setAutoPlay = useCallback((enabled: boolean) => { setEnabled(enabled); playbackService.setAutoPlay(enabled); }, []);
  return { isAutoPlayEnabled, setAutoPlay, playlist, currentContent, startAutoPlay: playbackService.startAutoPlay.bind(playbackService), queueContent: playbackService.queueContent.bind(playbackService) };
}
