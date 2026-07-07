import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Content } from 'led-art-shared';
import { ContentPreview } from '../components/ContentPreview';
import { contentService } from '../services/ContentService';
import { contentStore } from '../store/contentStore';
import { theme } from '../utils/theme';

export function ContentManagerScreen() {
  const [contents, setContents] = useState<Content[]>([]);
  const [text, setText] = useState('HELLO WLAN');
  useEffect(() => contentStore.subscribe((state) => setContents(state.contents)), []);
  const create = async () => contentService.createTextContent(`Text ${contents.length + 1}`, text, 128, 64);
  return <View style={styles.container}><Text style={styles.title}>Content Manager</Text><TextInput style={styles.input} value={text} onChangeText={setText} placeholderTextColor={theme.colors.muted} /><TouchableOpacity style={styles.button} onPress={create}><Text style={styles.buttonText}>Create Text Content</Text></TouchableOpacity><FlatList data={contents} keyExtractor={(item) => item.id} renderItem={({ item }) => <View style={styles.card}><Text style={styles.name}>{item.name}</Text><ContentPreview content={item} /></View>} /></View>;
}
const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: theme.colors.background, padding: 16 }, title: { color: theme.colors.text, fontSize: 30, fontWeight: '900', marginVertical: 16 }, input: { backgroundColor: theme.colors.surfaceAlt, color: theme.colors.text, padding: 12, borderRadius: 10, marginBottom: 10 }, button: { backgroundColor: theme.colors.primaryDim, padding: 14, borderRadius: 12, alignItems: 'center', marginBottom: 16 }, buttonText: { color: theme.colors.text, fontWeight: '800' }, card: { backgroundColor: theme.colors.surface, padding: 14, borderRadius: 16, marginBottom: 14 }, name: { color: theme.colors.text, fontWeight: '800', marginBottom: 8 } });
