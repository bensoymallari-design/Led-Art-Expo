import { useEffect, useState } from 'react';
import { Device } from 'led-art-shared';
import { deviceStore } from '../store/deviceStore';

export function useDeviceStatus() {
  const [devices, setDevices] = useState<Device[]>([]);
  useEffect(() => deviceStore.subscribe((state) => setDevices(state.devices)), []);
  return { devices, onlineCount: devices.filter((device) => device.status === 'online').length };
}
