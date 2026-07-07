import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
export function ConnectionIndicator({ connected }: { connected: boolean }) { return <View style={styles.row}><View style={[styles.dot, { backgroundColor: connected ? '#42f5b3' : '#ff5f6d' }]} /><Text style={styles.text}>{connected ? 'Sender connected' : 'Awaiting sender'}</Text></View>; }
const styles = StyleSheet.create({ row: { flexDirection: 'row', gap: 8, alignItems: 'center' }, dot: { width: 10, height: 10, borderRadius: 5 }, text: { color: '#f7fbff' } });
