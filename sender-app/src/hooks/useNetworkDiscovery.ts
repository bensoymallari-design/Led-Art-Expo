import { useCallback, useEffect, useState } from 'react';
import { Device } from 'led-art-shared';
import { discoveryService } from '../services/DiscoveryService';
import { deviceStore } from '../store/deviceStore';

export function useNetworkDiscovery() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isScanning, setScanning] = useState(false);
  useEffect(() => deviceStore.subscribe((state) => setDevices(state.devices)), []);
  const startDiscovery = useCallback(async () => {
    setScanning(true);
    try { setDevices(await discoveryService.discoverDevices()); }
    finally { setScanning(false); }
  }, []);
  const addManual = useCallback((ip: string, port: number, name?: string) => discoveryService.addDeviceManually(ip, port, name), []);
  return { devices, isScanning, startDiscovery, addManual };
}
