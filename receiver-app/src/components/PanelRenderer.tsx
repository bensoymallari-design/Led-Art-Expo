import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { LEDPanel } from 'led-art-shared';
export function PanelRenderer({ panel, color = '#42f5b3' }: { panel: LEDPanel; color?: string }) {
  return <View style={styles.wrap}><Svg width="100%" height="100%" viewBox={`0 0 ${panel.width} ${panel.height}`}><Rect x={0} y={0} width={panel.width} height={panel.height} fill="#05070d" stroke={color} strokeWidth={2} /></Svg></View>;
}
const styles = StyleSheet.create({ wrap: { flex: 1, minHeight: 120 } });
