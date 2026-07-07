import { Widget } from 'led-art-shared';

export class WidgetService {
  createClock(): Widget {
    return { id: `widget-${Date.now()}`, type: 'clock', name: 'Local Clock', enabled: true, config: { format: '24h', showSeconds: true, timezone: 'local', color: '#42f5b3', fontSize: 18, position: { x: 4, y: 4, width: 120, height: 28 } } };
  }

  createDate(): Widget {
    return { id: `widget-${Date.now()}`, type: 'date', name: 'Local Date', enabled: true, config: { format: 'medium', color: '#ffffff', fontSize: 14, position: { x: 4, y: 34, width: 120, height: 24 } } };
  }

  createCountdown(targetDate: string): Widget {
    return { id: `widget-${Date.now()}`, type: 'countdown', name: 'Countdown', enabled: true, config: { targetDate, label: 'Starts in', showDays: true, showHours: true, showMinutes: true, showSeconds: true, color: '#ffd166', fontSize: 14, position: { x: 4, y: 4, width: 160, height: 32 } } };
  }

  createText(text: string): Widget {
    return { id: `widget-${Date.now()}`, type: 'text', name: 'Text', enabled: true, config: { text, font: 'System', size: 18, color: '#42f5b3', effect: 'scroll', scrollDirection: 'left', speed: 1, position: { x: 0, y: 0, width: 128, height: 32 } } };
  }
}

export const widgetService = new WidgetService();
