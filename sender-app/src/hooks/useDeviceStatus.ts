import { useEffect, useState } from 'react';
import { Device } from 'led-art-shared';
import { deviceStore } from '../store/deviceStore';

export function useDeviceStatus() {
  const [devices, setDevices] = useState<Device[]>([]);
  useEffect(() => { const unsubscribe = deviceStore.subscribe((state) => setDevices(state.devices)); return () => { unsubscribe(); }; }, []);
  return { devices, onlineCount: devices.filter((device) => device.status === 'online').length };
}
