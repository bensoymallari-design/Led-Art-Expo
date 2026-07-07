import { Layout } from 'led-art-shared';
import { createPersistentStore } from './storeFactory';

export interface LayoutState {
  layouts: Layout[];
  activeLayoutId?: string;
}

export const layoutStore = createPersistentStore<LayoutState>('ledart:layouts', { layouts: [] });
