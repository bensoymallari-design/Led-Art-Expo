import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';
import { Layout } from 'led-art-shared';
import { theme } from '../utils/theme';

export function PanelGrid({ layout }: { layout: Layout }) {
  const scale = Math.min(320 / layout.width, 180 / layout.height);
  return <View style={styles.wrap}><Svg width={layout.width * scale} height={layout.height * scale} viewBox={`0 0 ${layout.width} ${layout.height}`}>
    <Rect x={0} y={0} width={layout.width} height={layout.height} fill={layout.backgroundColor} stroke="#334155" />
    {layout.panels.map((panel) => <React.Fragment key={panel.id}><Rect x={panel.position.x} y={panel.position.y} width={panel.width} height={panel.height} fill="none" stroke="#42f5b3" strokeWidth={2} /><SvgText x={panel.position.x + 4} y={panel.position.y + 14} fill="#ffffff" fontSize="10">{panel.name}</SvgText></React.Fragment>)}
  </Svg><Text style={styles.caption}>{layout.width} x {layout.height}px</Text></View>;
}
const styles = StyleSheet.create({ wrap: { alignItems: 'center', padding: 16, backgroundColor: theme.colors.surface, borderRadius: 16 }, caption: { color: theme.colors.muted, marginTop: 8 } });
