import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Device } from 'led-art-shared';
export function StatusBar({ device, fps, senders }: { device?: Device; fps: number; senders: number }) { return <View style={styles.bar}><Text style={styles.text}>IP {device?.ip ?? 'detecting'} | WS {device?.wsPort ?? 8080} | HTTP {device?.httpPort ?? 8081}</Text><Text style={styles.text}>{fps} fps | {senders} sender(s)</Text></View>; }
const styles = StyleSheet.create({ bar: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, backgroundColor: 'rgba(5,7,13,0.78)', padding: 8, flexDirection: 'row', justifyContent: 'space-between' }, text: { color: '#f7fbff', fontSize: 12 } });
