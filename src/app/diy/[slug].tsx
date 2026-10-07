
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React, { type ComponentProps } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TCSHeader from '../../components/common/TCSHeader';

const COLORS = {
  blue700: '#0046BE',
  bg: '#F4F5F7',
  cardBG: '#FFFFFF',
  text: '#1F2937',
  muted: '#6B7280',
};


// Type for icon name derived from MaterialCommunityIcons
type MdiName = ComponentProps<typeof MaterialCommunityIcons>['name'];

// Small helper for consistent size/color + optional top padding
const CommunityIcon = ({
  name,
  size = 32,
  color = '#254dc5',
  paddingTop = 8,
}: {
  name: MdiName;
  size?: number;
  color?: string;
  paddingTop?: number;
}) => (
  <View style={{ paddingTop }}>
    <MaterialCommunityIcons name={name} size={size} color={color} />
  </View>
);


function guideMeta(slug?: string) {
   const title =
    slug === 'reset-pos-terminal' ? 'How to Reset POS Terminal' :
    slug === 'printer-setup' ? 'Printer Setup Guide' :
    slug === 'network-troubleshooting' ? 'Network Troubleshooting' :
    slug === 'software-update' ? 'Software Update Procedure' :
    slug === 'inventory-scanner' ? 'Inventory Scanner Setup' :
    'DIY Guide';

const iconName: MdiName =
    slug === 'reset-pos-terminal'
      ? 'hammer-wrench'          // 🛠️
      : slug === 'printer-setup'
      ? 'printer'                // 🖨️
      : slug === 'network-troubleshooting'
      ? 'access-point-network'   // 📶
      : slug === 'software-update'
      ? 'update'                 // 💾
      : slug === 'inventory-scanner'
      ? 'barcode-scan'           // 📦 (closest to scanner)
      : 'book-open-page-variant';// 📘

  // Return a React element so caller can render directly
  const icon = <CommunityIcon name={iconName} />;


  return { title, icon };
}

export default function DIYGuideScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { title, icon } = guideMeta(slug);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.blue700} />

      {/* TCS header (no page title) */}
      <TCSHeader showBack />

      {/* Centered hero block below header */}
      
        <View style={styles.hero}>
            <Text style={styles.heroIcon}>{icon}</Text>
            <Text style={styles.heroTitle}>{title}</Text>
            <Text style={styles.heroSub}>
                Category: {slug?.includes('network') ? 'Network' : 'Hardware'} • Difficulty: Easy • Time: 5 minutes
            </Text>
        </View>


      <ScrollView contentContainerStyle={styles.content}>
        {/* Overview Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Overview</Text>
          <Text style={styles.body}>
            This guide will walk you through the process of resolving the selected task.
          </Text>
          <Text style={[styles.cardTitle, { marginTop: 10 }]}>When to Use This Guide</Text>
          <Text style={styles.body}>
            • Device is frozen or unresponsive{'\n'}
            • Error messages shown{'\n'}
            • Transaction flow has stopped{'\n'}
            • After a power outage or software update
          </Text>
        </View>

        {/* Steps */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Step 1: Soft Reset</Text>
          <Text style={styles.body}>
            1. Hold the Power button for 3 seconds{'\n'}
            2. Select “Restart” from the menu{'\n'}
            3. Wait 2–3 minutes for reboot{'\n'}
            4. Log in with credentials{'\n'}
            5. Process a test transaction
          </Text>
          <Text style={[styles.note, { marginTop: 10 }]}>
            If soft reset doesn’t work, proceed to Step 2.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------- styles ---------------- */
const CIRCLE_SIZE = 42;
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },

  hero: { alignItems: 'center', paddingVertical: 14 },
  heroIcon: { fontSize: 28 },
  heroTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginTop: 6, textAlign: 'center' },
  heroSub: { fontSize: 12.5, color: COLORS.muted, marginTop: 2, textAlign: 'center' },

  content: { paddingHorizontal: 16, paddingBottom: 24, alignItems: 'center' },

  card: {
    width: '100%', maxWidth: 420, backgroundColor: COLORS.cardBG, borderRadius: 14,
    padding: 14, marginBottom: 12,
    shadowColor: '#101828', shadowOpacity: 0.12, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 3,
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  body: { fontSize: 13, color: COLORS.text, marginTop: 6, lineHeight: 18 },
  note: { fontSize: 12.5, color: COLORS.blue700, fontWeight: '700' },
})