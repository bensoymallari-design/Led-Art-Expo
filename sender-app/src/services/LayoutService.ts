import { Layout, LEDPanel } from 'led-art-shared';
import { layoutStore } from '../store/layoutStore';

export const RESOLUTION_PRESETS = [
  { label: '64 x 32', width: 64, height: 32 },
  { label: '128 x 64', width: 128, height: 64 },
  { label: '256 x 128', width: 256, height: 128 },
  { label: '512 x 256', width: 512, height: 256 },
];

export class LayoutService {
  createDefaultPanel(width = 128, height = 64): LEDPanel {
    return { id: `panel-${Date.now()}`, name: 'Panel 1', width, height, position: { x: 0, y: 0 }, orientation: 'landscape', mirrorX: false, mirrorY: false, brightness: 1 };
  }

  async createLayout(name: string, width = 128, height = 64): Promise<Layout> {
    const now = new Date().toISOString();
    const layout: Layout = { id: `layout-${Date.now()}`, name, width, height, panels: [this.createDefaultPanel(width, height)], backgroundColor: '#05070d', createdAt: now, updatedAt: now };
    const state = await layoutStore.hydrate();
    await layoutStore.setState({ layouts: [...state.layouts, layout], activeLayoutId: layout.id });
    return layout;
  }

  async save(layout: Layout) {
    const state = await layoutStore.hydrate();
    await layoutStore.setState({ layouts: [...state.layouts.filter((item) => item.id !== layout.id), { ...layout, updatedAt: new Date().toISOString() }], activeLayoutId: layout.id });
  }
}

export const layoutService = new LayoutService();
