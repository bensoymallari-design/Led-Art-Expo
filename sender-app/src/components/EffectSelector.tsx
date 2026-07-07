import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { EffectType } from 'led-art-shared';
import { theme } from '../utils/theme';
const effects: EffectType[] = ['none', 'scroll', 'blink', 'fade', 'wipe', 'pulse'];
export function EffectSelector({ value, onChange }: { value: EffectType; onChange: (effect: EffectType) => void }) {
  return <View style={styles.row}>{effects.map((effect) => <TouchableOpacity key={effect} style={[styles.chip, value === effect && styles.active]} onPress={() => onChange(effect)}><Text style={styles.text}>{effect}</Text></TouchableOpacity>)}</View>;
}
const styles = StyleSheet.create({ row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, chip: { backgroundColor: theme.colors.surfaceAlt, padding: 10, borderRadius: 999 }, active: { backgroundColor: theme.colors.primaryDim }, text: { color: theme.colors.text, textTransform: 'capitalize' } });
