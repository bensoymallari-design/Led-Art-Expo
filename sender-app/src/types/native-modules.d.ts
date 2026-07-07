declare module 'react-native-zeroconf' {
  export default class Zeroconf {
    constructor();
    scan(type?: string, protocol?: string, domain?: string): void;
    stop(): void;
    publishService(type: string, protocol: string, domain: string, name: string, port: number, txt?: Record<string, string>): void;
    unpublishService(name: string): void;
    on(event: string, listener: (...args: any[]) => void): void;
    removeDeviceListeners?(): void;
    removeAllListeners?(): void;
  }
}

declare module 'react-native-udp' {
  export function createSocket(options: any): any;
}

declare module 'react-native-tcp' {
  export function createServer(handler: (socket: any) => void): any;
}

declare module 'react-native-background-timer' {
  const BackgroundTimer: {
    setInterval(handler: () => void, timeout: number): number;
    clearInterval(id: number): void;
    setTimeout(handler: () => void, timeout: number): number;
    clearTimeout(id: number): void;
  };
  export default BackgroundTimer;
}
