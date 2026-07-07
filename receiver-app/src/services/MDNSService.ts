import { Device, NETWORK_CONFIG, NetworkUtils } from 'led-art-shared';

export class MDNSService {
  private zeroconf?: any;
  private udpSocket?: any;
  private timer?: ReturnType<typeof setInterval>;

  async advertise(device: Device) {
    await this.publishMdns(device);
    await this.startUdpAnnouncements(device);
  }

  stop() { this.zeroconf?.unpublishService?.(NETWORK_CONFIG.mDNS.serviceName); this.zeroconf?.stop?.(); this.udpSocket?.close?.(); if (this.timer) clearInterval(this.timer); }

  private async publishMdns(device: Device) {
    const Zeroconf = (await optionalImport('react-native-zeroconf'))?.default;
    if (!Zeroconf) return;
    this.zeroconf = new Zeroconf();
    this.zeroconf.publishService('ledart', 'tcp', 'local.', device.name, NETWORK_CONFIG.webSocket.port, { deviceId: device.id, wsPort: String(device.wsPort), httpPort: String(device.httpPort), maxWidth: String(device.capabilities.maxWidth), maxHeight: String(device.capabilities.maxHeight) });
  }

  private async startUdpAnnouncements(device: Device) {
    const udp = await optionalImport('react-native-udp');
    if (!udp?.createSocket) return;
    this.udpSocket = udp.createSocket({ type: 'udp4' });
    this.udpSocket.bind(NETWORK_CONFIG.udp.port);
    const send = () => {
      const packet = NetworkUtils.broadcastPacket(device.id, device.name, device.ip);
      this.udpSocket?.send(packet, 0, packet.length, NETWORK_CONFIG.udp.port, NETWORK_CONFIG.udp.broadcastAddress);
    };
    send();
    this.timer = setInterval(send, NETWORK_CONFIG.udp.announcementInterval);
  }
}
async function optionalImport(name: string): Promise<any> { try { return await Function('name', 'return import(name)')(name); } catch { return undefined; } }
export const mdnsService = new MDNSService();
