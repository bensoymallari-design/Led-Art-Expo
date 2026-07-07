import { NETWORK_CONFIG, createMessage, decodeMessage, encodeMessage } from 'led-art-shared';
import { contentReceiver } from './ContentReceiver';

export class WebSocketServer {
  private server: any;
  private clients: Map<string, any> = new Map();
  private statusHandlers = new Set<(clients: string[]) => void>();

  onStatus(handler: (clients: string[]) => void) { this.statusHandlers.add(handler); return () => this.statusHandlers.delete(handler); }

  async start(port: number = NETWORK_CONFIG.webSocket.port) {
    const tcp = await optionalImport('react-native-tcp');
    if (!tcp?.createServer) return false;
    this.server = tcp.createServer((socket: any) => this.handleSocket(socket));
    this.server.listen(port, '0.0.0.0');
    return true;
  }

  stop() { this.server?.close?.(); this.clients.clear(); this.emitStatus(); }

  handleContent(content: any) { return contentReceiver.handleContent(content, true); }

  private handleSocket(socket: any) {
    const id = `${socket.remoteAddress ?? 'sender'}-${Date.now()}`;
    this.clients.set(id, socket);
    this.emitStatus();
    socket.on('data', async (buffer: unknown) => {
      const raw = String(buffer);
      try {
        const message = decodeMessage(raw);
        if (message.type === 'content') await contentReceiver.handleContent((message.payload as any).content, (message.payload as any).autoPlay);
        if (message.type === 'ping') socket.write(encodeMessage(createMessage('pong', 'receiver', { ok: true }, message.sourceDeviceId)));
      } catch (error) {
        socket.write(encodeMessage(createMessage('error', 'receiver', { message: error instanceof Error ? error.message : 'Invalid message' }, id)));
      }
    });
    socket.on('close', () => { this.clients.delete(id); this.emitStatus(); });
  }

  private emitStatus() { this.statusHandlers.forEach((handler) => handler(Array.from(this.clients.keys()))); }
}
async function optionalImport(name: string): Promise<any> { try { return await Function('name', 'return import(name)')(name); } catch { return undefined; } }
export const webSocketServer = new WebSocketServer();
