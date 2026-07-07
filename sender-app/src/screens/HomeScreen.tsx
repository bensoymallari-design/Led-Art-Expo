import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDeviceStatus } from '../hooks/useDeviceStatus';
import { layoutService } from '../services/LayoutService';
import { theme } from '../utils/theme';

export function HomeScreen({ navigation }: { navigation: StackNavigationProp<any> }) {
  const { onlineCount, devices } = useDeviceStatus();
  useEffect(() => { layoutService.createLayout('Default 128x64').catch(() => undefined); }, []);
  const cards = [ ['Network Discovery', 'Find receivers on this WLAN', 'NetworkDiscovery'], ['Content Manager', 'Create text, image, and widget content', 'ContentManager'], ['Layout Editor', 'Design multi-panel LED canvases', 'LayoutEditor'], ['Devices', 'Monitor and batch-send to receivers', 'DeviceManager'], ['Widgets', 'Configure offline clock/date/countdown/text', 'WidgetConfig'] ];
  return <ScrollView style={styles.container}><Text style={styles.title}>LED Art Sender</Text><Text style={styles.subtitle}>Local-only WLAN control. {onlineCount}/{devices.length} receivers online.</Text>{cards.map(([title, body, route]) => <TouchableOpacity key={route} style={styles.card} onPress={() => navigation.navigate(route)}><Text style={styles.cardTitle}>{title}</Text><Text style={styles.cardBody}>{body}</Text></TouchableOpacity>)}</ScrollView>;
}
const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: theme.colors.background, padding: 20 }, title: { color: theme.colors.text, fontSize: 34, fontWeight: '900', marginTop: 20 }, subtitle: { color: theme.colors.muted, marginBottom: 24 }, card: { backgroundColor: theme.colors.surface, borderRadius: 18, padding: 18, marginBottom: 14, borderColor: theme.colors.border, borderWidth: 1 }, cardTitle: { color: theme.colors.text, fontSize: 20, fontWeight: '800' }, cardBody: { color: theme.colors.muted, marginTop: 6 } });
