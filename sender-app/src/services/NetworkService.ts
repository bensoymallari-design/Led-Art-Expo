import { Device, NETWORK_CONFIG, NetworkUtils } from 'led-art-shared';

export type AnnouncementHandler = (device: Device) => void;

export class NetworkService {
  private socket?: any;
  private handlers = new Set<AnnouncementHandler>();

  async getLocalIPAddress() {
    return NetworkUtils.getLocalIPAddress();
  }

  onAnnouncement(handler: AnnouncementHandler) {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  async startUdpDiscovery() {
    const udp = await optionalImport('react-native-udp');
    if (!udp?.createSocket) return false;
    this.socket = udp.createSocket({ type: 'udp4' });
    this.socket.on('message', (message: unknown) => this.handlePacket(String(message)));
    this.socket.bind(NETWORK_CONFIG.udp.port);
    return true;
  }

  stopUdpDiscovery() {
    this.socket?.close?.();
    this.socket = undefined;
  }

  async broadcastProbe() {
    if (!this.socket) return;
    const payload = JSON.stringify({ type: 'ledart_probe', timestamp: new Date().toISOString() });
    this.socket.send(payload, 0, payload.length, NETWORK_CONFIG.udp.port, NETWORK_CONFIG.udp.broadcastAddress);
  }

  async ping(ip: string, port?: number) {
    return NetworkUtils.pingDevice(ip, port);
  }

  private handlePacket(raw: string) {
    try {
      const packet = JSON.parse(raw);
      if (packet.type !== 'ledart_announcement') return;
      const now = new Date().toISOString();
      this.handlers.forEach((handler) => handler({
        id: packet.deviceId,
        name: packet.name ?? 'LEDArt Receiver',
        ip: packet.ip,
        wsPort: packet.wsPort ?? NETWORK_CONFIG.webSocket.port,
        httpPort: packet.httpPort ?? NETWORK_CONFIG.http.port,
        udpPort: NETWORK_CONFIG.udp.port,
        status: 'online',
        connectionStatus: 'disconnected',
        lastSeen: now,
        capabilities: packet.capabilities ?? defaultCapabilities(),
      }));
    } catch {
      // Ignore packets from other local services.
    }
  }
}

function defaultCapabilities() {
  return { maxWidth: 512, maxHeight: 256, panelCount: 1, supportsAnimation: true, supportsWidgets: true, supportsChunkedUpload: true };
}

async function optionalImport(name: string): Promise<any> {
  try { return await Function('name', 'return import(name)')(name); } catch { return undefined; }
}

export const networkService = new NetworkService();
