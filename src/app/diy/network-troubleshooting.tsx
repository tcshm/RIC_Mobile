
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { type ComponentProps } from 'react';
import {
  Platform,
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
  blue600: '#0B57D0',
  bg: '#F4F5F7',
  cardBG: '#FFFFFF',
  text: '#1F2937',
  muted: '#6B7280',

  // Callouts
  calloutBlueBG: '#E8F0FE',
  calloutBlueText: '#0B57D0',
  calloutOrangeBG: '#FFF7ED',
  calloutOrangeText: '#D97706',
  calloutRedBG: '#FEE2E2',
  calloutRedText: '#B91C1C',

  // Checklist / diagnostics
  checklistBG: '#F9FAFB',

  // Command blocks
  cmdBG: '#0F172A', // slate-900-ish
  cmdBorder: '#1E293B',
  cmdText: '#A7F3D0', // mint/green text
  cmdTitle: '#60A5FA', // blue title
};

// Type for valid MaterialCommunityIcons names
type MdiName = ComponentProps<typeof MaterialCommunityIcons>['name'];

// Small helper for consistent size/color + optional top padding
const CommunityIcon = ({
  name,
  size = 28,
  color = COLORS.blue700,
  paddingTop = 4,
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

export default function NetworkTroubleshootingGuide() {

  const icon = <CommunityIcon name="access-point-network" />
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Platform.OS === 'android' ? COLORS.blue700 : undefined}
      />

      {/* TCS Header */}
      <TCSHeader showBack />

      {/* Content (hero inside ScrollView so it scrolls) */}
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroIcon}>{icon}</Text>
          <Text style={[styles.heroTitle, { color: COLORS.blue700 }]}>Network Troubleshooting</Text>
          <Text style={styles.heroSub}>
            Category: Network • Difficulty: Intermediate • Time: 15–30 minutes
          </Text>
        </View>

        {/* Overview */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Overview</Text>
          <Text style={styles.body}>
            This guide provides step-by-step instructions for diagnosing and resolving common
            network connectivity issues in TCS locations.
          </Text>
        </View>

        {/* Network Architecture */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Network Architecture</Text>
          <Text style={styles.body}>Your store network consists of:</Text>
          {[
            '• Primary Router (TCS0000XN001-1)',
            '• Secondary Router (TCS0000XN001-2) – Failover',
            '• Main Switch (TCS0000XN201)',
            '• IDF Switch (TCS0000XN301)',
            '• Ops Support Switch (TCS0000XN004)',
            '• Wireless Access Points (multiple)',
            '• Primary ISP Link (main internet)',
            '• Secondary ISP Link (backup)',
            '• Mobile NOC (emergency backup)',
          ].map((t, i) => (
            <Text key={`arch-${i}`} style={styles.body}>{t}</Text>
          ))}
        </View>

        {/* Quick Diagnostics */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quick Diagnostics</Text>

          <Text style={[styles.sectionTitle, { marginTop: 6 }]}>Step 1: Identify the Issue</Text>
          <Text style={styles.body}>Determine which devices are affected:</Text>
          <View style={styles.checklist}>
            {[
              'Single device (POS, printer, scanner)',
              'Multiple devices in one area',
              'Entire store network',
              'Wireless only',
              'Wired only',
            ].map((t, i) => (
              <View key={`qd-${i}`} style={styles.checkRow}>
                <View style={styles.checkbox} />
                <Text style={styles.body}>{t}</Text>
              </View>
            ))}
          </View>

          <Text style={[styles.sectionTitle, { marginTop: 12 }]}>Step 2: Check Network Status</Text>
          {[
            '1. Open the Store Operations app',
            '2. Navigate to Network section',
            '3. Review device status:',
            '   • Green dot = Online',
            '   • Red dot = Offline',
            '   • INC badge = Active incident',
          ].map((t, i) => (
            <Text key={`ns-${i}`} style={styles.body}>{t}</Text>
          ))}
        </View>

        {/* Issue 1: Single Device Cannot Connect */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Issue 1: Single Device Cannot Connect</Text>

          {/* Symptoms */}
          <View style={styles.calloutRed}>
            <Text style={styles.calloutHeadingRed}>Symptoms:</Text>
            {[
              '• One POS terminal shows “No Network”',
              '• Other devices working normally',
            ].map((t, i) => (
              <Text key={`sym1-${i}`} style={styles.calloutTextRed}>{t}</Text>
            ))}
          </View>

          <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Resolution for Wired Devices:</Text>
          {[
            '1. Unplug Ethernet cable from device',
            '2. Wait 10 seconds',
            '3. Plug cable back in firmly',
            '4. Restart the device',
            '5. Test connectivity',
          ].map((t, i) => (
            <Text key={`wired-${i}`} style={styles.body}>{t}</Text>
          ))}

          <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Resolution for Wireless Devices:</Text>
          {[
            '1. Forget the Wi‑Fi network',
            '2. Search for available networks',
            '3. Reconnect to TCS-Store-Secure',
            '4. Enter password (contact manager)',
            '5. Test connectivity',
          ].map((t, i) => (
            <Text key={`wifi-${i}`} style={styles.body}>{t}</Text>
          ))}
        </View>

        {/* Issue 2: Slow Network Performance */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Issue 2: Slow Network Performance</Text>

          {/* Symptoms */}
          <View style={styles.calloutRed}>
            <Text style={styles.calloutHeadingRed}>Symptoms:</Text>
            {[
              '• Slow loading times',
              '• Transactions taking longer than usual',
              '• Frequent timeouts',
            ].map((t, i) => (
              <Text key={`sym2-${i}`} style={styles.calloutTextRed}>{t}</Text>
            ))}
          </View>

          <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Basic Troubleshooting:</Text>
          {[
            '1. Restart the affected device',
            '2. Clear browser cache (if applicable)',
            '3. Close unnecessary applications',
            '4. Disconnect unused devices from Wi‑Fi',
          ].map((t, i) => (
            <Text key={`bt-${i}`} style={styles.body}>{t}</Text>
          ))}

          <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Network Equipment Reset:</Text>
          {[
            '1. Locate nearest network switch (in closet)',
            '2. Unplug power for 30 seconds',
            '3. Plug back in and wait 2–3 minutes',
            '4. Test performance again',
          ].map((t, i) => (
            <Text key={`ner-${i}`} style={styles.body}>{t}</Text>
          ))}
        </View>

        {/* Issue 3: Internet Connection Down */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Issue 3: Internet Connection Down</Text>

          {/* Symptoms */}
          <View style={styles.calloutRed}>
            <Text style={styles.calloutHeadingRed}>Symptoms:</Text>
            {[
              '• “No Internet” errors',
              '• Can access internal systems but not external',
              '• Payment processing unavailable',
            ].map((t, i) => (
              <Text key={`sym3-${i}`} style={styles.calloutTextRed}>{t}</Text>
            ))}
          </View>

          <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Step 1: Automatic Failover</Text>
          <View style={styles.calloutBlue}>
            {[
              'The system should automatically switch to Secondary Link:',
              '1. Wait 2–3 minutes for failover',
              '2. Check if internet is restored',
              '3. Monitor Network screen for Primary Link status',
            ].map((t, i) => (
              <Text key={`fail-${i}`} style={styles.calloutText}>{t}</Text>
            ))}
          </View>

          <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Step 2: Manual Intervention</Text>
          {[
            'If failover doesn’t occur:',
            '1. Contact NOC immediately: 1-800-TCS-NOC1',
            '2. Provide store number',
            '3. Report Primary Link is down',
            '4. Follow NOC instructions',
          ].map((t, i) => (
            <Text key={`man-${i}`} style={styles.body}>{t}</Text>
          ))}
        </View>

        {/* Issue 4: WiFi Not Working */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Issue 4: Wi‑Fi Not Working</Text>

          {/* Symptoms */}
          <View style={styles.calloutRed}>
            <Text style={styles.calloutHeadingRed}>Symptoms:</Text>
            {[
              '• Devices cannot find Wi‑Fi network',
              '• Wi‑Fi connects but no internet',
              '• Intermittent Wi‑Fi drops',
            ].map((t, i) => (
              <Text key={`sym4-${i}`} style={styles.calloutTextRed}>{t}</Text>
            ))}
          </View>

          <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Check Access Point Status:</Text>
          {[
            'Physical access point lights:',
            '• Solid green = Normal',
            '• Flashing amber = Booting',
            '• Red = Error',
            '• No lights = No power',
          ].map((t, i) => (
            <Text key={`ap-${i}`} style={styles.body}>{t}</Text>
          ))}

          <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Restart Access Point:</Text>
          {[
            '1. Locate nearest access point (ceiling mounted)',
            '2. Use PoE switch to cycle power:',
            '   • Unplug Ethernet cable from switch',
            '   • Wait 30 seconds',
            '   • Plug back in',
            '3. Wait 3–5 minutes for full boot',
            '4. Test Wi‑Fi connectivity',
          ].map((t, i) => (
            <Text key={`apreset-${i}`} style={styles.body}>{t}</Text>
          ))}
        </View>

        {/* Diagnostic Commands */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Diagnostic Commands</Text>
          <Text style={styles.body}>Use Windows Command Prompt:</Text>

          <View style={styles.cmdBlock}>
            <Text style={styles.cmdTitle}>Test Internet Connectivity:</Text>
            <Text style={styles.cmdText}>ping 8.8.8.8</Text>
          </View>

          <View style={styles.cmdBlock}>
            <Text style={styles.cmdTitle}>Test Internal Connectivity:</Text>
            <Text style={styles.cmdText}>ping 192.168.1.1</Text>
          </View>

          <View style={styles.cmdBlock}>
            <Text style={styles.cmdTitle}>Check IP Address:</Text>
            <Text style={styles.cmdText}>ipconfig /all</Text>
          </View>

          <View style={styles.cmdBlock}>
            <Text style={styles.cmdTitle}>Renew IP Address:</Text>
            <Text style={styles.cmdText}>ipconfig /release{'\n'}ipconfig /renew</Text>
          </View>
        </View>

        {/* When to Escalate */}
        <View style={styles.calloutOrange}>
          <Text style={styles.calloutHeadingOrange}>⚠️ When to Escalate:</Text>
          <Text style={styles.calloutTextOrange}>Call IT Help Desk (x5500) if:</Text>
          {[
            '• Issue affects single device',
            '• Basic troubleshooting didn’t work',
          ].map((t, i) => (
            <Text key={`esc-it-${i}`} style={styles.calloutTextOrange}>{t}</Text>
          ))}

          <Text style={[styles.calloutTextOrange, { marginTop: 8 }]}>
            Call NOC (x7200) if:
          </Text>
          {[
            '• Multiple devices affected',
            '• Internet connection down',
            '• Network equipment offline',
            '• Widespread connectivity issues',
          ].map((t, i) => (
            <Text key={`esc-noc-${i}`} style={styles.calloutTextOrange}>{t}</Text>
          ))}
        </View>

        {/* Contact Information */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Contact Information</Text>

          <View style={styles.subCard}>
            <Text style={[styles.sectionTitle, { color: COLORS.blue700 }]}>
              Network Operations Center (NOC)
            </Text>
            <Text style={styles.body}>Phone: 1-800-TCS-NOC1</Text>
            <Text style={styles.body}>Internal: x7200</Text>
            <Text style={styles.body}>Available: 24/7</Text>
            <Text style={styles.body}>For: Network outages, ISP issues, equipment failures</Text>
          </View>

          <View style={styles.subCard}>
            <Text style={[styles.sectionTitle, { color: COLORS.blue700 }]}>IT Help Desk</Text>
            <Text style={styles.body}>Phone: 1-800-TCS-HELP</Text>
            <Text style={styles.body}>Internal: x5500</Text>
            <Text style={styles.body}>Available: 24/7</Text>
            <Text style={styles.body}>For: Device issues, connectivity problems</Text>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>Last Updated: November 2025</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------- styles ---------------- */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },

  hero: { alignItems: 'center', paddingVertical: 14 },
  heroIcon: { fontSize: 28 },
  heroTitle: { fontSize: 20, fontWeight: '700' }, // blue applied inline
  heroSub: { fontSize: 12.5, color: COLORS.muted, marginTop: 2 },

  content: { paddingHorizontal: 16, paddingBottom: 24, alignItems: 'center' },

  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: COLORS.cardBG,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#101828',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  subCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
  },

  // Main card headings in blue
  cardTitle: { fontSize: 16, fontWeight: '700', color: COLORS.blue700 },

  // Sub-section headings in default text color
  sectionTitle: { fontSize: 14.5, fontWeight: '700', color: COLORS.text },
  body: { fontSize: 13, color: COLORS.text, marginTop: 6, lineHeight: 18 },

  // Callouts
  calloutBlue: {
    backgroundColor: COLORS.calloutBlueBG,
    borderWidth: 1,
    borderColor: COLORS.blue600,
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  calloutText: { fontSize: 13, color: COLORS.text, lineHeight: 18 },

  calloutOrange: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: COLORS.calloutOrangeBG,
    borderWidth: 1,
    borderColor: COLORS.calloutOrangeText,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  calloutHeadingOrange: { color: COLORS.calloutOrangeText, fontWeight: '700', fontSize: 14.5 },
  calloutTextOrange: { fontSize: 13, color: COLORS.text, marginTop: 6, lineHeight: 18 },

  calloutRed: {
    backgroundColor: COLORS.calloutRedBG,
    borderWidth: 1,
    borderColor: COLORS.calloutRedText,
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  calloutHeadingRed: { color: COLORS.calloutRedText, fontWeight: '700', fontSize: 13.5 },
  calloutTextRed: { fontSize: 13, color: COLORS.text, marginTop: 6, lineHeight: 18 },

  // Checklist
  checklist: { backgroundColor: COLORS.checklistBG, borderRadius: 10, padding: 10, marginTop: 6 },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  checkbox: {
    width: 14, height: 14, borderRadius: 3,
    borderWidth: 1, borderColor: '#D1D5DB', backgroundColor: '#FFFFFF',
  },

  // Command blocks
  cmdBlock: {
    backgroundColor: COLORS.cmdBG,
    borderWidth: 1,
    borderColor: COLORS.cmdBorder,
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
  },
  cmdTitle: { color: COLORS.cmdTitle, fontWeight: '700', fontSize: 13 },
  cmdText: { color: COLORS.cmdText, fontSize: 13, marginTop: 6, lineHeight: 18 },

  footer: { fontSize: 12, color: COLORS.muted, textAlign: 'center', marginTop: 4 },
});
