import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { ConnectionStatus as Status } from 'led-art-shared';
import { theme } from '../utils/theme';

export function ConnectionStatus({ status }: { status: Status }) {
  const color = status === 'connected' ? theme.colors.primary : status === 'error' || status === 'offline' ? theme.colors.danger : theme.colors.warning;
  return <View style={styles.row}><View style={[styles.dot, { backgroundColor: color }]} /><Text style={styles.text}>{status}</Text></View>;
}
const styles = StyleSheet.create({ row: { flexDirection: 'row', alignItems: 'center', gap: 6 }, dot: { width: 10, height: 10, borderRadius: 5 }, text: { color: theme.colors.muted, textTransform: 'capitalize' } });
