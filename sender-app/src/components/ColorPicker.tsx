import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
const colors = ['#42f5b3', '#ffffff', '#ffd166', '#ff5f6d', '#5dade2', '#b47cff'];
export function ColorPicker({ value, onChange }: { value: string; onChange: (color: string) => void }) {
  return <View style={styles.row}>{colors.map((color) => <TouchableOpacity key={color} onPress={() => onChange(color)} style={[styles.swatch, { backgroundColor: color, borderWidth: value === color ? 3 : 0 }]} />)}</View>;
}
const styles = StyleSheet.create({ row: { flexDirection: 'row', gap: 10 }, swatch: { width: 34, height: 34, borderRadius: 17, borderColor: '#fff' } });
