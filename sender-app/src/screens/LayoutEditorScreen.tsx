import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Layout } from 'led-art-shared';
import { PanelGrid } from '../components/PanelGrid';
import { RESOLUTION_PRESETS, layoutService } from '../services/LayoutService';
import { layoutStore } from '../store/layoutStore';
import { theme } from '../utils/theme';

export function LayoutEditorScreen() {
  const [layout, setLayout] = useState<Layout>();
  const [name, setName] = useState('Main Layout');
  useEffect(() => { layoutStore.hydrate().then((state) => setLayout(state.layouts[0])).catch(() => undefined); }, []);
  const create = async (width: number, height: number) => { const next = await layoutService.createLayout(name, width, height); setLayout(next); };
  return <ScrollView style={styles.container}><Text style={styles.title}>Layout Editor</Text><TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Layout name" placeholderTextColor={theme.colors.muted} /><View style={styles.presetRow}>{RESOLUTION_PRESETS.map((preset) => <TouchableOpacity key={preset.label} style={styles.chip} onPress={() => create(preset.width, preset.height)}><Text style={styles.chipText}>{preset.label}</Text></TouchableOpacity>)}</View>{layout ? <><PanelGrid layout={layout} /><TouchableOpacity style={styles.button} onPress={() => layoutService.save(layout)}><Text style={styles.buttonText}>Save Layout</Text></TouchableOpacity></> : <TouchableOpacity style={styles.button} onPress={() => create(128, 64)}><Text style={styles.buttonText}>Create Custom 128 x 64</Text></TouchableOpacity>}<Text style={styles.help}>Supports custom resolutions, orientation, grouping, mirror/flip and multi-panel synchronization through the shared layout model.</Text></ScrollView>;
}
const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: theme.colors.background, padding: 16 }, title: { color: theme.colors.text, fontSize: 30, fontWeight: '900', marginVertical: 16 }, input: { backgroundColor: theme.colors.surfaceAlt, color: theme.colors.text, padding: 12, borderRadius: 10, marginBottom: 10 }, presetRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }, chip: { backgroundColor: theme.colors.surface, padding: 12, borderRadius: 12 }, chipText: { color: theme.colors.text }, button: { backgroundColor: theme.colors.primaryDim, padding: 14, borderRadius: 12, alignItems: 'center', marginVertical: 16 }, buttonText: { color: theme.colors.text, fontWeight: '800' }, help: { color: theme.colors.muted, lineHeight: 20 } });
