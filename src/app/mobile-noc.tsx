
// app/mobile-noc.tsx
import React from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PageTitle from '../components/common/PageTitle';
import TCSHeader from '../components/common/TCSHeader';

const COLORS = {
  blue700: '#0046BE',
  green: '#22C55E',
  bg: '#dcdcdcff',
  cardBG: '#FFFFFF',
  text: '#1F2937',
  muted: '#6B7280',
};

export default function MobileNocScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.blue700} />

      {/* Header */}
      <TCSHeader showBack />
      <PageTitle  title="Mobile-NOC" />

      {/* Content */}
      <View style={styles.content}>
        {/* Background AI Tasks */}
        <View style={styles.card1}>
          <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle}>Background AI Tasks</Text>
          <View style={styles.statusPill}>
            <Text style={styles.statusPillText}>ACTIVE</Text>
          </View>
          </View>
          <Text style={styles.meta1}>AI in Action: 0 files triggered</Text>
          <Text style={styles.meta}>AI identified triages: 0</Text>
          <Text style={styles.meta}>Task ID: 7469f532-289...</Text>
          <Text style={styles.meta}>Updated: 2025-08-05 10:27:49</Text>
        </View>

        {/* Overall Health Controller */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Overall Health Controller</Text>
          <View style={styles.row}>
            <Text style={styles.label}>SSID:</Text>
            <Text style={styles.value}>TCS-WiFi</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>BSSID:</Text>
            <Text style={styles.value}>70:6d:15:cf:e:38e</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Signal:</Text>
            <Text style={styles.value}>-51 dBm</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Link speed:</Text>
            <Text style={styles.value}>50 Mbps</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Channel:</Text>
            <Text style={styles.value}>64</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>ISP:</Text>
            <Text style={styles.value}>Verizon</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Distance:</Text>
            <Text style={styles.value}>0.5 m</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>AP Rating:</Text>
            <Text style={styles.value}>4/5 (Good)</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>SSID URL:</Text>
            <Text style={[styles.value, { color: COLORS.blue700 }]}>tcs-wifi-access</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },

  content: { padding: 16, alignItems: 'center' },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: COLORS.cardBG,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    // shadow
    shadowColor: '#101828',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  card1:{
    backgroundColor:'#d6edd2ff',
    width: '100%',
    maxWidth: 420,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    // shadow
    shadowColor: '#101828',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  statusPill: { backgroundColor: COLORS.green, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  statusPillText: { color: '#FFFFFF', fontWeight: '700', fontSize: 12 },
  meta: { fontSize: 13, color: COLORS.muted, marginTop: 6 },
  meta1: { fontSize: 13,fontWeight:600, color: '#1ca815ff', marginTop: 6 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  label: { fontSize: 13, color: COLORS.muted },
  value: { fontSize: 13, color: COLORS.text, fontWeight: '600' },
});
    