import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Content, LEDPanel } from 'led-art-shared';
import { EffectRenderer } from './EffectRenderer';
import { WidgetRenderer } from './WidgetRenderer';

export function LEDPlayer({ content, panels }: { content?: Content; panels: LEDPanel[] }) {
  if (!content) return <View style={styles.empty}><Text style={styles.emptyText}>Waiting for local WLAN content...</Text></View>;
  return <View style={[styles.stage, { backgroundColor: content.backgroundColor ?? '#000' }]}>{content.dataUri ? <Image source={{ uri: content.dataUri }} style={StyleSheet.absoluteFill} resizeMode="cover" /> : null}<EffectRenderer effect={content.effect}>{content.text ? <Text style={[styles.text, { color: content.color ?? '#42f5b3' }]}>{content.text}</Text> : null}</EffectRenderer>{content.widgets?.map((widget) => <WidgetRenderer key={widget.id} widget={widget} />)}<Text style={styles.panelCount}>{panels.length} panel(s)</Text></View>;
}
const styles = StyleSheet.create({ stage: { flex: 1, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }, text: { fontSize: 42, fontWeight: '900', textAlign: 'center' }, empty: { flex: 1, backgroundColor: '#05070d', alignItems: 'center', justifyContent: 'center' }, emptyText: { color: '#92a1b8', fontSize: 18 }, panelCount: { position: 'absolute', right: 12, bottom: 8, color: '#92a1b8' } });
