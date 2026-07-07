import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Device } from 'led-art-shared';
import { ConnectionStatus } from './ConnectionStatus';
import { theme } from '../utils/theme';

export function DeviceStatusCard({ device, onConnect, onSend, onConfigure }: { device: Device; onConnect?: () => void; onSend?: () => void; onConfigure?: () => void }) {
  return <View style={styles.card}>
    <View style={styles.top}><View><Text style={styles.name}>{device.name}</Text><Text style={styles.ip}>{device.ip}:{device.wsPort}</Text></View><ConnectionStatus status={device.connectionStatus} /></View>
    <Text style={styles.meta}>Latency {device.latencyMs ?? '--'} ms | Signal {device.signalStrength ?? '--'} | Panels {device.capabilities.panelCount}</Text>
    <View style={styles.actions}><TouchableOpacity style={styles.button} onPress={onConnect}><Text style={styles.buttonText}>Connect</Text></TouchableOpacity><TouchableOpacity style={styles.button} onPress={onSend}><Text style={styles.buttonText}>Send</Text></TouchableOpacity><TouchableOpacity style={styles.secondary} onPress={onConfigure}><Text style={styles.buttonText}>Configure</Text></TouchableOpacity></View>
  </View>;
}
const styles = StyleSheet.create({ card: { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderWidth: 1, borderRadius: 16, padding: 16, marginBottom: 12 }, top: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 }, name: { color: theme.colors.text, fontSize: 18, fontWeight: '700' }, ip: { color: theme.colors.muted, marginTop: 4 }, meta: { color: theme.colors.muted, marginVertical: 12 }, actions: { flexDirection: 'row', gap: 8 }, button: { backgroundColor: theme.colors.primaryDim, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10 }, secondary: { backgroundColor: theme.colors.surfaceAlt, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10 }, buttonText: { color: theme.colors.text, fontWeight: '700' } });
