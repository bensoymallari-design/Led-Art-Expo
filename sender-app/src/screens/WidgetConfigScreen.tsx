import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Widget } from 'led-art-shared';
import { WidgetRenderer } from '../components/WidgetRenderer';
import { contentService } from '../services/ContentService';
import { widgetService } from '../services/WidgetService';
import { theme } from '../utils/theme';

export function WidgetConfigScreen() {
  const [widgets, setWidgets] = useState<Widget[]>([widgetService.createClock(), widgetService.createDate()]);
  const addCountdown = () => setWidgets((items) => [...items, widgetService.createCountdown(new Date(Date.now() + 86400000).toISOString())]);
  const save = () => contentService.createWidgetContent('Offline Widgets', 128, 64, widgets);
  return <ScrollView style={styles.container}><Text style={styles.title}>Offline Widgets</Text><Text style={styles.meta}>Clock, date, countdown, manual weather, and text widgets use local device data only.</Text>{widgets.map((widget) => <View key={widget.id} style={styles.card}><Text style={styles.name}>{widget.name}</Text><WidgetRenderer widget={widget} /></View>)}<View style={styles.row}><TouchableOpacity style={styles.button} onPress={() => setWidgets((items) => [...items, widgetService.createText('LOCAL ONLY')])}><Text style={styles.buttonText}>Add Text</Text></TouchableOpacity><TouchableOpacity style={styles.button} onPress={addCountdown}><Text style={styles.buttonText}>Add Countdown</Text></TouchableOpacity></View><TouchableOpacity style={styles.save} onPress={save}><Text style={styles.buttonText}>Save Widget Content</Text></TouchableOpacity></ScrollView>;
}
const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: theme.colors.background, padding: 16 }, title: { color: theme.colors.text, fontSize: 30, fontWeight: '900', marginVertical: 16 }, meta: { color: theme.colors.muted, marginBottom: 16 }, card: { backgroundColor: theme.colors.surface, padding: 16, borderRadius: 16, marginBottom: 12 }, name: { color: theme.colors.text, fontWeight: '800', marginBottom: 8 }, row: { flexDirection: 'row', gap: 10 }, button: { flex: 1, backgroundColor: theme.colors.surfaceAlt, padding: 14, borderRadius: 12, alignItems: 'center' }, save: { backgroundColor: theme.colors.primaryDim, padding: 14, borderRadius: 12, alignItems: 'center', marginVertical: 16 }, buttonText: { color: theme.colors.text, fontWeight: '800' } });
