import React, { useState } from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { DisplayScreen } from './src/screens/DisplayScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { NetworkInfoScreen } from './src/screens/NetworkInfoScreen';
import { theme } from './src/utils/theme';

export default function App() {
  const [screen, setScreen] = useState<'display' | 'settings' | 'network'>('display');
  return <View style={styles.root}>{screen === 'display' ? <DisplayScreen /> : screen === 'settings' ? <SettingsScreen /> : <NetworkInfoScreen />}<View style={styles.nav}>{(['display', 'settings', 'network'] as const).map((item) => <TouchableOpacity key={item} style={[styles.tab, screen === item && styles.active]} onPress={() => setScreen(item)}><Text style={styles.tabText}>{item}</Text></TouchableOpacity>)}</View></View>;
}
const styles = StyleSheet.create({ root: { flex: 1, backgroundColor: theme.colors.background }, nav: { position: 'absolute', left: 16, right: 16, bottom: 16, flexDirection: 'row', backgroundColor: 'rgba(16,24,39,0.9)', borderRadius: 18, padding: 6, gap: 6 }, tab: { flex: 1, padding: 12, borderRadius: 12, alignItems: 'center' }, active: { backgroundColor: theme.colors.primaryDim }, tabText: { color: theme.colors.text, textTransform: 'capitalize', fontWeight: '800' } });
