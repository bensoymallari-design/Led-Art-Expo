import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useKeepAwake } from 'expo-keep-awake';
import { LEDPanel } from 'led-art-shared';
import { LEDPlayer } from '../components/LEDPlayer';
import { StatusBar } from '../components/StatusBar';
import { useAutoPlay } from '../hooks/useAutoPlay';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { usePerformance } from '../hooks/usePerformance';

const defaultPanels: LEDPanel[] = [{ id: 'panel-1', name: 'Panel 1', width: 128, height: 64, position: { x: 0, y: 0 }, orientation: 'landscape', mirrorX: false, mirrorY: false, brightness: 1 }];
export function DisplayScreen() {
  useKeepAwake();
  const { currentContent } = useAutoPlay();
  const { device, connectedSenders } = useNetworkStatus();
  const { fps } = usePerformance();
  return <View style={styles.container}><StatusBar device={device} fps={fps} senders={connectedSenders.length} /><LEDPlayer content={currentContent} panels={device?.layout?.panels ?? defaultPanels} /></View>;
}
const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#05070d' } });
