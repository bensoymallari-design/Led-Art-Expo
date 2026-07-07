import React from 'react';
import { Image, Text, View, StyleSheet } from 'react-native';
import { Content } from 'led-art-shared';
import { WidgetRenderer } from './WidgetRenderer';
import { theme } from '../utils/theme';

export function ContentPreview({ content }: { content: Content }) {
  return <View style={[styles.preview, { aspectRatio: content.width / content.height, backgroundColor: content.backgroundColor ?? '#000' }]}>
    {content.dataUri ? <Image source={{ uri: content.dataUri }} style={StyleSheet.absoluteFill} resizeMode="cover" /> : null}
    {content.text ? <Text style={[styles.text, { color: content.color ?? theme.colors.primary }]}>{content.text}</Text> : null}
    {content.widgets?.map((widget) => <WidgetRenderer key={widget.id} widget={widget} />)}
  </View>;
}
const styles = StyleSheet.create({ preview: { width: '100%', borderRadius: 16, borderWidth: 1, borderColor: theme.colors.border, padding: 12, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' }, text: { fontSize: 24, fontWeight: '800' } });
