import { Content, ConnectionStatus, Device, Layout, NETWORK_CONFIG, NetworkUtils, TransferProgress, checksum, chunkString, createMessage, encodeMessage } from 'led-art-shared';
import { deviceStore } from '../store/deviceStore';

export class CommunicationService {
  private wsConnections: Map<string, WebSocket> = new Map();
  private statuses: Map<string, ConnectionStatus> = new Map();
  private reconnectAttempts: Map<string, number> = new Map();
  private devices: Map<string, Device> = new Map();
  private progressHandlers = new Set<(progress: TransferProgress) => void>();

  onProgress(handler: (progress: TransferProgress) => void) {
    this.progressHandlers.add(handler);
    return () => this.progressHandlers.delete(handler);
  }

  async connectToReceiver(ip: string, port = NETWORK_CONFIG.webSocket.port, deviceId = `manual-${ip}-${port}`): Promise<boolean> {
    this.setStatus(deviceId, 'connecting');
    const url = NetworkUtils.webSocketUrl(ip, port);
    return new Promise((resolve) => {
      const ws = new WebSocket(url);
      const timeout = setTimeout(() => {
        ws.close();
        this.setStatus(deviceId, 'error');
        resolve(false);
      }, NETWORK_CONFIG.discovery.timeout);
      ws.onopen = () => {
        clearTimeout(timeout);
        this.wsConnections.set(deviceId, ws);
        this.reconnectAttempts.set(deviceId, 0);
        this.setStatus(deviceId, 'connected');
        ws.send(encodeMessage(createMessage('hello', 'sender', { app: 'sender', device: { id: 'sender' }, protocolVersion: '1.0.0' }, deviceId)));
        resolve(true);
      };
      ws.onclose = () => {
        this.wsConnections.delete(deviceId);
        this.setStatus(deviceId, 'disconnected');
        this.scheduleReconnect(deviceId, ip, port);
      };
      ws.onerror = () => this.setStatus(deviceId, 'error');
      ws.onmessage = (event) => this.handleMessage(deviceId, String(event.data));
    });
  }

  registerDevice(device: Device) {
    this.devices.set(device.id, device);
  }

  async sendContentViaWS(deviceId: string, content: Content): Promise<boolean> {
    const ws = this.wsConnections.get(deviceId);
    if (!ws || ws.readyState !== WebSocket.OPEN) return false;
    ws.send(encodeMessage(createMessage('content', 'sender', { content, autoPlay: true }, deviceId)));
    this.emitProgress(deviceId, content.id, JSON.stringify(content).length, JSON.stringify(content).length, 'complete');
    return true;
  }

  async sendContentViaHTTP(deviceId: string, content: Content): Promise<boolean> {
    const device = this.devices.get(deviceId) ?? deviceStore.getState().devices.find((item) => item.id === deviceId);
    if (!device) return false;
    const serialized = JSON.stringify(content);
    const chunks = chunkString(serialized, NETWORK_CONFIG.http.chunkSize);
    const transferId = `${content.id}-${Date.now()}`;
    for (let index = 0; index < chunks.length; index += 1) {
      const body = JSON.stringify({ transferId, contentId: content.id, chunkIndex: index, totalChunks: chunks.length, checksum: checksum(chunks[index]), data: chunks[index] });
      const response = await fetch(NetworkUtils.httpUrl(device.ip, device.httpPort, '/upload-chunk'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
      if (!response.ok) {
        this.emitProgress(deviceId, content.id, index * NETWORK_CONFIG.http.chunkSize, serialized.length, 'failed', `HTTP ${response.status}`);
        return false;
      }
      this.emitProgress(deviceId, content.id, Math.min(serialized.length, (index + 1) * NETWORK_CONFIG.http.chunkSize), serialized.length, 'sending');
    }
    await fetch(NetworkUtils.httpUrl(device.ip, device.httpPort, '/complete-upload'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ transferId, contentId: content.id }) });
    this.emitProgress(deviceId, content.id, serialized.length, serialized.length, 'complete');
    return true;
  }

  async broadcastToAll(content: Content): Promise<boolean> {
    const connected = Array.from(this.wsConnections.keys());
    const results = await Promise.all(connected.map((id) => this.sendContentViaWS(id, content)));
    return results.every(Boolean);
  }

  getConnectionStatus(deviceId: string): ConnectionStatus {
    return this.statuses.get(deviceId) ?? 'disconnected';
  }

  async pingDevice(deviceId: string): Promise<number> {
    const device = this.devices.get(deviceId) ?? deviceStore.getState().devices.find((item) => item.id === deviceId);
    if (!device) throw new Error('Unknown device');
    return NetworkUtils.pingDevice(device.ip, device.wsPort);
  }

  async syncLayout(layout: Layout): Promise<void> {
    await Promise.all(Array.from(this.wsConnections.entries()).map(([deviceId, ws]) => {
      if (ws.readyState === WebSocket.OPEN) ws.send(encodeMessage(createMessage('layout_sync', 'sender', { layout }, deviceId)));
    }));
  }

  private scheduleReconnect(deviceId: string, ip: string, port: number) {
    const attempt = (this.reconnectAttempts.get(deviceId) ?? 0) + 1;
    this.reconnectAttempts.set(deviceId, attempt);
    this.setStatus(deviceId, 'reconnecting');
    const delay = Math.min(NETWORK_CONFIG.webSocket.reconnectMaxDelay, NETWORK_CONFIG.webSocket.reconnectBaseDelay * 2 ** Math.min(attempt, 6));
    setTimeout(() => this.connectToReceiver(ip, port, deviceId), delay);
  }

  private handleMessage(_deviceId: string, raw: string) {
    try { JSON.parse(raw); } catch { /* ignore malformed sender-side telemetry */ }
  }

  private setStatus(deviceId: string, status: ConnectionStatus) {
    this.statuses.set(deviceId, status);
    const devices = deviceStore.getState().devices.map((device) => device.id === deviceId ? { ...device, connectionStatus: status, status: status === 'connected' ? 'online' as const : device.status } : device);
    deviceStore.setState({ devices });
  }

  private emitProgress(deviceId: string, contentId: string, bytesSent: number, totalBytes: number, status: TransferProgress['status'], error?: string) {
    const progress = { deviceId, contentId, bytesSent, totalBytes, percentage: totalBytes ? Math.round((bytesSent / totalBytes) * 100) : 0, status, error };
    this.progressHandlers.forEach((handler) => handler(progress));
  }
}

export const communicationService = new CommunicationService();
