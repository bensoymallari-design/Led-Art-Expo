import { Content, Widget } from 'led-art-shared';
import { contentStore } from '../store/contentStore';

export class ContentService {
  async createTextContent(name: string, text: string, width: number, height: number): Promise<Content> {
    const now = new Date().toISOString();
    const content: Content = { id: `content-${Date.now()}`, name, type: 'text', width, height, text, color: '#42f5b3', backgroundColor: '#05070d', effect: 'scroll', createdAt: now, updatedAt: now };
    await this.save(content);
    return content;
  }

  async createWidgetContent(name: string, width: number, height: number, widgets: Widget[]): Promise<Content> {
    const now = new Date().toISOString();
    const content: Content = { id: `content-${Date.now()}`, name, type: 'widget', width, height, widgets, backgroundColor: '#05070d', createdAt: now, updatedAt: now };
    await this.save(content);
    return content;
  }

  async save(content: Content) {
    const state = await contentStore.hydrate();
    await contentStore.setState({ contents: [...state.contents.filter((item) => item.id !== content.id), content], selectedContentId: content.id });
  }

  async remove(contentId: string) {
    const state = await contentStore.hydrate();
    await contentStore.setState({ contents: state.contents.filter((item) => item.id !== contentId) });
  }
}

export const contentService = new ContentService();
