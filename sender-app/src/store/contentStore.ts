import { Content } from 'led-art-shared';
import { createPersistentStore } from './storeFactory';

export interface ContentState {
  contents: Content[];
  selectedContentId?: string;
}

export const contentStore = createPersistentStore<ContentState>('ledart:contents', { contents: [] });
