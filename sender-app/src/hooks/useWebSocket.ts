import { useCallback, useState } from 'react';
import { ConnectionStatus } from 'led-art-shared';
import { communicationService } from '../services/CommunicationService';

export function useWebSocket() {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const connect = useCallback(async (ip: string, port?: number, deviceId?: string) => {
    setStatus('connecting');
    const ok = await communicationService.connectToReceiver(ip, port, deviceId);
    setStatus(ok ? 'connected' : 'error');
    return ok;
  }, []);
  return { status, connect, service: communicationService };
}
