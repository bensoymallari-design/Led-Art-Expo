import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../utils/theme';
export function PanelConfigScreen() {
  return <View style={styles.container}><Text style={styles.title}>Panel Configuration</Text><Text style={styles.text}>Configure panel size, type, brightness, mirror/flip, orientation, and grouping in Layout Editor. Synced layouts are sent over WebSocket to each receiver.</Text></View>;
}
const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: theme.colors.background, padding: 16 }, title: { color: theme.colors.text, fontSize: 30, fontWeight: '900', marginVertical: 16 }, text: { color: theme.colors.muted, lineHeight: 22 } });
