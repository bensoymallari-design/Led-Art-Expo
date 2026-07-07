export const NETWORK_CONFIG = {
  mDNS: {
    port: 5353,
    serviceType: '_ledart._tcp.local',
    serviceName: 'LEDArt-Receiver',
    protocol: 'tcp',
    domain: 'local.',
  },
  webSocket: {
    port: 8080,
    path: '/ws',
    pingInterval: 30000,
    reconnectBaseDelay: 750,
    reconnectMaxDelay: 15000,
  },
  http: {
    port: 8081,
    maxFileSize: 50 * 1024 * 1024,
    timeout: 30000,
    chunkSize: 64 * 1024,
  },
  udp: {
    port: 8765,
    broadcastAddress: '255.255.255.255',
    multicastGroup: '239.0.0.1',
    announcementInterval: 5000,
  },
  discovery: {
    interval: 5000,
    timeout: 2000,
    staleAfter: 15000,
  },
} as const;

export type NetworkConfig = typeof NETWORK_CONFIG;
