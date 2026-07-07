import { NETWORK_CONFIG } from '../networkConfig';

export class NetworkUtils {
  static async getLocalIPAddress(): Promise<string> {
    try {
      const mod = await optionalImport('expo-network');
      if (mod?.getIpAddressAsync) {
        return await mod.getIpAddressAsync();
      }
    } catch {
      // Expo Network is optional in tests and web previews.
    }
    return '0.0.0.0';
  }

  static async getSubnetMask(): Promise<string> {
    return '255.255.255.0';
  }

  static isSameSubnet(ip1: string, ip2: string, subnetMask = '255.255.255.0'): boolean {
    if (!this.validateIP(ip1) || !this.validateIP(ip2) || !this.validateIP(subnetMask)) return false;
    const a = toOctets(ip1);
    const b = toOctets(ip2);
    const mask = toOctets(subnetMask);
    return a.every((octet, index) => (octet & mask[index]) === (b[index] & mask[index]));
  }

  static async pingDevice(ip: string, port = NETWORK_CONFIG.webSocket.port, timeoutMs = 2000): Promise<number> {
    if (!this.validateIP(ip)) throw new Error(`Invalid IP address: ${ip}`);
    const started = Date.now();
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : undefined;
    const timeout = setTimeout(() => controller?.abort(), timeoutMs);
    try {
      await fetch(`http://${ip}:${port}`, { method: 'GET', signal: controller?.signal });
    } catch {
      // A refused HTTP response still proves the route was attempted; return elapsed latency.
    } finally {
      clearTimeout(timeout);
    }
    return Date.now() - started;
  }

  static validateIP(ip: string): boolean {
    const parts = ip.trim().split('.');
    return parts.length === 4 && parts.every((part) => /^\d+$/.test(part) && Number(part) >= 0 && Number(part) <= 255);
  }

  static webSocketUrl(ip: string, port = NETWORK_CONFIG.webSocket.port, path = NETWORK_CONFIG.webSocket.path): string {
    return `ws://${ip}:${port}${path}`;
  }

  static httpUrl(ip: string, port = NETWORK_CONFIG.http.port, path = ''): string {
    return `http://${ip}:${port}${path.startsWith('/') ? path : `/${path}`}`;
  }

  static broadcastPacket(deviceId: string, name: string, ip: string) {
    return JSON.stringify({
      type: 'ledart_announcement',
      deviceId,
      name,
      ip,
      wsPort: NETWORK_CONFIG.webSocket.port,
      httpPort: NETWORK_CONFIG.http.port,
      timestamp: new Date().toISOString(),
    });
  }
}

function toOctets(ip: string) {
  return ip.split('.').map((part) => Number(part));
}

async function optionalImport(name: string): Promise<any> {
  try {
    return await Function('name', 'return import(name)')(name);
  } catch {
    return undefined;
  }
}
