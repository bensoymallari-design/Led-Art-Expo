import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DeviceStatusCard } from '../components/DeviceStatusCard';
import { useDeviceStatus } from '../hooks/useDeviceStatus';
import { contentStore } from '../store/contentStore';
import { communicationService } from '../services/CommunicationService';
import { theme } from '../utils/theme';

export function DeviceManagerScreen() {
  const { devices, onlineCount } = useDeviceStatus();
  const sendAll = async () => {
    const content = contentStore.getState().contents[0];
    if (content) await communicationService.broadcastToAll(content);
  };
  return <View style={styles.container}><View style={styles.header}><Text style={styles.title}>Device Manager</Text><TouchableOpacity style={styles.button} onPress={sendAll}><Text style={styles.buttonText}>Send to All</Text></TouchableOpacity></View><Text style={styles.meta}>{onlineCount} online | {devices.length} known receivers | group broadcasting ready for 1-50+ panels</Text><FlatList data={devices} keyExtractor={(item) => item.id} renderItem={({ item }) => <DeviceStatusCard device={item} onConnect={() => communicationService.connectToReceiver(item.ip, item.wsPort, item.id)} onSend={async () => { const c = contentStore.getState().contents[0]; if (c) await communicationService.sendContentViaWS(item.id, c); }} />} /></View>;
}
const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: theme.colors.background, padding: 16 }, header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, title: { color: theme.colors.text, fontSize: 30, fontWeight: '900', marginVertical: 16 }, meta: { color: theme.colors.muted, marginBottom: 16 }, button: { backgroundColor: theme.colors.primaryDim, padding: 12, borderRadius: 12 }, buttonText: { color: theme.colors.text, fontWeight: '800' } });
