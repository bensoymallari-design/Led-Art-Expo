import { Device } from 'led-art-shared';
import { createPersistentStore } from './storeFactory';

export interface DeviceState {
  devices: Device[];
  knownDevices: Device[];
}

export const deviceStore = createPersistentStore<DeviceState>('ledart:devices', { devices: [], knownDevices: [] });
