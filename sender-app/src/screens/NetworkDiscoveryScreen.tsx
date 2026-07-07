import React, { useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Content } from 'led-art-shared';
import { DeviceStatusCard } from '../components/DeviceStatusCard';
import { NetworkScanner } from '../components/NetworkScanner';
import { useNetworkDiscovery } from '../hooks/useNetworkDiscovery';
import { communicationService } from '../services/CommunicationService';
import { theme } from '../utils/theme';

export function NetworkDiscoveryScreen() {
  const { devices, isScanning, startDiscovery, addManual } = useNetworkDiscovery();
  const [ipAddress, setIpAddress] = useState('');
  const [port, setPort] = useState('8080');
  const [deviceName, setDeviceName] = useState('');
  const sample: Content = { id: 'sample', name: 'Hello WLAN', type: 'text', width: 128, height: 64, text: 'LOCAL LED ART', color: '#42f5b3', backgroundColor: '#05070d', effect: 'scroll', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  const addDevice = async () => {
    try { await addManual(ipAddress, Number(port), deviceName || undefined); setIpAddress(''); setDeviceName(''); }
    catch (error) { Alert.alert('Could not add device', error instanceof Error ? error.message : 'Unknown error'); }
  };
  return <View style={styles.container}><FlatList data={devices} keyExtractor={(item) => item.id} ListHeaderComponent={<><Text style={styles.title}>Network Devices</Text><NetworkScanner isScanning={isScanning} onScan={startDiscovery} /><View style={styles.manual}><Text style={styles.sectionTitle}>Manual IP Fallback</Text><TextInput style={styles.input} placeholder="IP Address" placeholderTextColor={theme.colors.muted} value={ipAddress} onChangeText={setIpAddress} keyboardType="numbers-and-punctuation" /><TextInput style={styles.input} placeholder="Port" placeholderTextColor={theme.colors.muted} value={port} onChangeText={setPort} keyboardType="number-pad" /><TextInput style={styles.input} placeholder="Device Name (optional)" placeholderTextColor={theme.colors.muted} value={deviceName} onChangeText={setDeviceName} /><TouchableOpacity style={styles.button} onPress={addDevice}><Text style={styles.buttonText}>Add Device</Text></TouchableOpacity></View></>} renderItem={({ item }) => <DeviceStatusCard device={item} onConnect={() => communicationService.connectToReceiver(item.ip, item.wsPort, item.id)} onSend={() => communicationService.sendContentViaWS(item.id, sample)} />} ListEmptyComponent={<View style={styles.empty}><Text style={styles.emptyText}>No devices found on network</Text><Text style={styles.emptySubtext}>Make sure receivers are powered on and connected to the same WiFi.</Text></View>} /></View>;
}
const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: theme.colors.background, padding: 16 }, title: { color: theme.colors.text, fontSize: 30, fontWeight: '900', marginVertical: 16 }, manual: { backgroundColor: theme.colors.surface, borderRadius: 16, padding: 16, marginBottom: 16 }, sectionTitle: { color: theme.colors.text, fontWeight: '800', fontSize: 18, marginBottom: 8 }, input: { backgroundColor: theme.colors.surfaceAlt, color: theme.colors.text, padding: 12, borderRadius: 10, marginBottom: 10 }, button: { backgroundColor: theme.colors.primaryDim, padding: 12, borderRadius: 10, alignItems: 'center' }, buttonText: { color: theme.colors.text, fontWeight: '800' }, empty: { alignItems: 'center', padding: 28 }, emptyText: { color: theme.colors.text, fontWeight: '800' }, emptySubtext: { color: theme.colors.muted, textAlign: 'center', marginTop: 6 } });
