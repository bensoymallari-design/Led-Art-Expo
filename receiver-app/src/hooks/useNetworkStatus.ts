import { useEffect, useState } from 'react';
import { Device, NETWORK_CONFIG, NetworkUtils } from 'led-art-shared';
import { mdnsService } from '../services/MDNSService';
import { webSocketServer } from '../services/WebSocketServer';
import { httpServer } from '../services/HTTPServer';

export function useNetworkStatus() {
  const [device, setDevice] = useState<Device>();
  const [senders, setSenders] = useState<string[]>([]);
  useEffect(() => { let mounted = true; NetworkUtils.getLocalIPAddress().then(async (ip) => {
    if (!mounted) return;
    const receiver: Device = { id: `receiver-${ip.replace(/\./g, '-')}`, name: 'LEDArt Receiver', ip, wsPort: NETWORK_CONFIG.webSocket.port, httpPort: NETWORK_CONFIG.http.port, udpPort: NETWORK_CONFIG.udp.port, status: 'online', connectionStatus: 'connected', lastSeen: new Date().toISOString(), capabilities: { maxWidth: 512, maxHeight: 256, panelCount: 1, supportsAnimation: true, supportsWidgets: true, supportsChunkedUpload: true }, uptimeSeconds: 0 };
    setDevice(receiver); await webSocketServer.start(); await httpServer.start(); await mdnsService.advertise(receiver);
  }); const unsub = webSocketServer.onStatus(setSenders); return () => { mounted = false; unsub(); mdnsService.stop(); webSocketServer.stop(); httpServer.stop(); }; }, []);
  return { device, connectedSenders: senders };
}
