import { useCallback, useEffect, useState } from 'react';
import { Content, TransferProgress } from 'led-art-shared';
import { communicationService } from '../services/CommunicationService';

export function useContentSync() {
  const [progress, setProgress] = useState<TransferProgress[]>([]);
  useEffect(() => communicationService.onProgress((next) => setProgress((items) => [...items.filter((item) => item.deviceId !== next.deviceId || item.contentId !== next.contentId), next])), []);
  const send = useCallback(async (deviceId: string, content: Content) => {
    const viaWs = await communicationService.sendContentViaWS(deviceId, content);
    return viaWs || communicationService.sendContentViaHTTP(deviceId, content);
  }, []);
  return { progress, send, broadcast: communicationService.broadcastToAll.bind(communicationService) };
}
