import { LEDPanel } from 'led-art-shared';
import { createPersistentStore } from './storeFactory';

export interface PanelState {
  panels: LEDPanel[];
}

export const panelStore = createPersistentStore<PanelState>('ledart:panels', { panels: [] });
