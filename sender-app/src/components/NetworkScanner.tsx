import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { theme } from '../utils/theme';

export function NetworkScanner({ isScanning, onScan }: { isScanning: boolean; onScan: () => void }) {
  return <View style={styles.card}><Text style={styles.title}>mDNS / UDP Discovery</Text><Text style={styles.body}>Scans _ledart._tcp.local and local UDP announcements. Manual IP fallback is available below.</Text><TouchableOpacity style={styles.button} onPress={onScan} disabled={isScanning}>{isScanning ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Scan Network</Text>}</TouchableOpacity></View>;
}
const styles = StyleSheet.create({ card: { backgroundColor: theme.colors.surface, borderRadius: 16, padding: 16, marginBottom: 16 }, title: { color: theme.colors.text, fontWeight: '800', fontSize: 18 }, body: { color: theme.colors.muted, marginVertical: 8 }, button: { backgroundColor: theme.colors.primaryDim, padding: 12, borderRadius: 12, alignItems: 'center' }, buttonText: { color: theme.colors.text, fontWeight: '800' } });
