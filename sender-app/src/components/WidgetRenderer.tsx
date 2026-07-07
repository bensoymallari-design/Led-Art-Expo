import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { Widget } from 'led-art-shared';

export function WidgetRenderer({ widget }: { widget: Widget }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const id = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(id); }, []);
  if (!widget.enabled) return null;
  const config: any = widget.config;
  if (widget.type === 'clock') return <Text style={{ color: config.color, fontSize: config.fontSize }}>{now.toLocaleTimeString([], { hour12: config.format === '12h', second: config.showSeconds ? '2-digit' : undefined })}</Text>;
  if (widget.type === 'date') return <Text style={{ color: config.color, fontSize: config.fontSize }}>{now.toLocaleDateString([], { dateStyle: config.format })}</Text>;
  if (widget.type === 'countdown') {
    const remaining = Math.max(0, new Date(config.targetDate).getTime() - now.getTime());
    const seconds = Math.floor(remaining / 1000) % 60, minutes = Math.floor(remaining / 60000) % 60, hours = Math.floor(remaining / 3600000) % 24, days = Math.floor(remaining / 86400000);
    return <Text style={{ color: config.color, fontSize: config.fontSize }}>{config.label} {days}d {hours}h {minutes}m {seconds}s</Text>;
  }
  if (widget.type === 'weather') return <Text style={{ color: config.color, fontSize: config.fontSize }}>{config.label} {config.temperature ?? '--'} {config.condition ?? ''}</Text>;
  return <Text style={{ color: config.color, fontSize: config.size }}>{config.text}</Text>;
}
