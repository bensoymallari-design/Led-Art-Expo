import { NETWORK_CONFIG, checksum } from 'led-art-shared';
import { contentReceiver } from './ContentReceiver';

export class HTTPServer {
  private server: any;
  private chunks = new Map<string, string[]>();

  async start(port: number = NETWORK_CONFIG.http.port) {
    const tcp = await optionalImport('react-native-tcp');
    if (!tcp?.createServer) return false;
    this.server = tcp.createServer((socket: any) => this.handleSocket(socket));
    this.server.listen(port, '0.0.0.0');
    return true;
  }
  stop() { this.server?.close?.(); }

  private handleSocket(socket: any) {
    socket.on('data', async (buffer: unknown) => {
      const request = String(buffer);
      const [head, body = ''] = request.split('\r\n\r\n');
      const path = head.split(' ')[1];
      try {
        if (path === '/upload-chunk') {
          const chunk = JSON.parse(body);
          if (checksum(chunk.data) !== chunk.checksum) throw new Error('Checksum mismatch');
          const transferChunks = this.chunks.get(chunk.transferId) ?? Array(chunk.totalChunks).fill('');
          transferChunks[chunk.chunkIndex] = chunk.data;
          this.chunks.set(chunk.transferId, transferChunks);
          return respond(socket, 200, { ok: true });
        }
        if (path === '/complete-upload') {
          const { transferId } = JSON.parse(body);
          const serialized = (this.chunks.get(transferId) ?? []).join('');
          await contentReceiver.handleContent(JSON.parse(serialized), true);
          this.chunks.delete(transferId);
          return respond(socket, 200, { ok: true });
        }
        respond(socket, 200, { service: 'LEDArt Receiver HTTP', ok: true });
      } catch (error) { respond(socket, 400, { ok: false, error: error instanceof Error ? error.message : 'Bad request' }); }
    });
  }
}
function respond(socket: any, status: number, body: unknown) { const payload = JSON.stringify(body); socket.write(`HTTP/1.1 ${status} OK\r\nContent-Type: application/json\r\nContent-Length: ${payload.length}\r\n\r\n${payload}`); socket.end?.(); }
async function optionalImport(name: string): Promise<any> { try { return await Function('name', 'return import(name)')(name); } catch { return undefined; } }
export const httpServer = new HTTPServer();
