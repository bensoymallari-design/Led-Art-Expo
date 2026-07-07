import { Device, NETWORK_CONFIG, NetworkUtils } from 'led-art-shared';
import { deviceStore } from '../store/deviceStore';
import { networkService } from './NetworkService';

export class DiscoveryService {
  private zeroconf?: any;
  private devices = new Map<string, Device>();
  private scanTimer?: ReturnType<typeof setInterval>;

  async discoverDevices(): Promise<Device[]> {
    await this.start();
    await networkService.broadcastProbe();
    return Array.from(this.devices.values());
  }

  async start() {
    networkService.onAnnouncement((device) => this.upsertDevice(device));
    await networkService.startUdpDiscovery();
    await this.startMdnsScan();
    this.scanTimer ??= setInterval(() => this.pruneStaleDevices(), NETWORK_CONFIG.discovery.interval);
  }

  stop() {
    this.zeroconf?.stop?.();
    this.zeroconf?.removeAllListeners?.();
    networkService.stopUdpDiscovery();
    if (this.scanTimer) clearInterval(this.scanTimer);
    this.scanTimer = undefined;
  }

  async addDeviceManually(ip: string, port = NETWORK_CONFIG.webSocket.port, name = `Receiver ${ip}`): Promise<Device> {
    if (!NetworkUtils.validateIP(ip)) throw new Error('Enter a valid IPv4 address');
    const latencyMs = await NetworkUtils.pingDevice(ip, port).catch(() => undefined);
    const now = new Date().toISOString();
    const device: Device = {
      id: `manual-${ip}-${port}`,
      name,
      ip,
      wsPort: port,
      httpPort: NETWORK_CONFIG.http.port,
      udpPort: NETWORK_CONFIG.udp.port,
      status: latencyMs === undefined ? 'unknown' : 'online',
      connectionStatus: 'disconnected',
      latencyMs,
      lastSeen: now,
      manual: true,
      capabilities: defaultCapabilities(),
    };
    await this.upsertDevice(device, true);
    return device;
  }

  async reconnectToKnownDevices(): Promise<Device[]> {
    const state = await deviceStore.hydrate();
    await Promise.all(state.knownDevices.map(async (device) => {
      const latencyMs = await NetworkUtils.pingDevice(device.ip, device.wsPort).catch(() => undefined);
      await this.upsertDevice({ ...device, latencyMs, status: latencyMs === undefined ? 'offline' : 'online', lastSeen: new Date().toISOString() });
    }));
    return Array.from(this.devices.values());
  }

  private async startMdnsScan() {
    const Zeroconf = (await optionalImport('react-native-zeroconf'))?.default;
    if (!Zeroconf) return;
    this.zeroconf = new Zeroconf();
    this.zeroconf.on('resolved', (service: any) => {
      const ip = service.addresses?.find((address: string) => NetworkUtils.validateIP(address)) ?? service.host;
      if (!ip) return;
      this.upsertDevice({
        id: service.txt?.deviceId ?? service.name,
        name: service.name ?? 'LEDArt Receiver',
        ip,
        wsPort: Number(service.txt?.wsPort ?? NETWORK_CONFIG.webSocket.port),
        httpPort: Number(service.txt?.httpPort ?? NETWORK_CONFIG.http.port),
        udpPort: NETWORK_CONFIG.udp.port,
        status: 'online',
        connectionStatus: 'disconnected',
        lastSeen: new Date().toISOString(),
        capabilities: defaultCapabilities(),
      });
    });
    this.zeroconf.scan('ledart', 'tcp', 'local.');
  }

  private async upsertDevice(device: Device, persistKnown = false) {
    this.devices.set(device.id, device);
    const devices = Array.from(this.devices.values());
    const current = deviceStore.getState();
    const knownDevices = persistKnown ? upsert(current.knownDevices, device) : current.knownDevices;
    await deviceStore.setState({ devices, knownDevices });
  }

  private pruneStaleDevices() {
    const cutoff = Date.now() - NETWORK_CONFIG.discovery.staleAfter;
    for (const [id, device] of this.devices) {
      if (!device.manual && new Date(device.lastSeen).getTime() < cutoff) {
        this.devices.set(id, { ...device, status: 'offline', connectionStatus: 'offline' });
      }
    }
    deviceStore.setState({ devices: Array.from(this.devices.values()) });
  }
}

function upsert(devices: Device[], next: Device) {
  return [...devices.filter((device) => device.id !== next.id), next];
}
function defaultCapabilities() {
  return { maxWidth: 512, maxHeight: 256, panelCount: 1, supportsAnimation: true, supportsWidgets: true, supportsChunkedUpload: true };
}
async function optionalImport(name: string): Promise<any> {
  try { return await Function('name', 'return import(name)')(name); } catch { return undefined; }
}
export const discoveryService = new DiscoveryService();
