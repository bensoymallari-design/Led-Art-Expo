import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ConnectionIndicator } from '../components/ConnectionIndicator';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { theme } from '../utils/theme';
export function NetworkInfoScreen() { const { device, connectedSenders } = useNetworkStatus(); return <ScrollView style={styles.container}><Text style={styles.title}>Network Status</Text><View style={styles.card}><ConnectionIndicator connected={connectedSenders.length > 0} /><Text style={styles.text}>IP address: {device?.ip ?? 'Detecting...'}</Text><Text style={styles.text}>WebSocket: {device?.wsPort ?? 8080}</Text><Text style={styles.text}>HTTP upload: {device?.httpPort ?? 8081}</Text><Text style={styles.text}>mDNS: _ledart._tcp.local</Text><Text style={styles.text}>Connected senders: {connectedSenders.join(', ') || 'none'}</Text><Text style={styles.text}>Auto-start: enabled through Display screen mount</Text></View></ScrollView>; }
const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: theme.colors.background, padding: 16 }, title: { color: theme.colors.text, fontSize: 30, fontWeight: '900', marginVertical: 16 }, card: { backgroundColor: theme.colors.surface, borderRadius: 16, padding: 16 }, text: { color: theme.colors.text, marginTop: 10 } });
