import { Content, LEDPanel, Layout } from 'led-art-shared';
export class LayoutRenderer {
  splitContentAcrossPanels(content: Content, layout: Layout): Array<{ panel: LEDPanel; content: Content }> {
    return layout.panels.map((panel) => ({ panel, content: { ...content, width: panel.width, height: panel.height } }));
  }
}
export const layoutRenderer = new LayoutRenderer();
