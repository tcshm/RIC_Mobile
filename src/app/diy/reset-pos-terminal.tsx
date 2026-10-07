
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
  calloutBlueBG: '#E8F0FE',
  calloutBlueText: '#0B57D0',
  calloutOrangeBG: '#FFF7ED',
  calloutOrangeText: '#D97706',
  checklistBG: '#F9FAFB',
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

export default function ResetPOSTerminalGuide() {
  const icon = <CommunityIcon name="hammer-wrench" />
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
          <Text style={[styles.heroTitle, { color: COLORS.blue700 }]}>
            How to Reset POS Terminal
          </Text>
          <Text style={styles.heroSub}>
            Category: Hardware • Difficulty: Easy • Time: 5 minutes
          </Text>
        </View>

        {/* Overview */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Overview</Text>
          <Text style={styles.body}>
            This guide will walk you through the process of resetting a POS (Point of Sale)
            terminal when it becomes unresponsive or needs to be reinitialized.
          </Text>
        </View>

        {/* When to Use This Guide */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>When to Use This Guide</Text>
          {[
            '• Terminal is frozen or unresponsive',
            '• Screen shows error messages',
            '• Transaction processing has stopped',
            '• After a power outage or system update',
          ].map((t, i) => (
            <Text key={`when-${i}`} style={styles.body}>{t}</Text>
          ))}
        </View>

        {/* Step 1: Soft Reset */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Step 1: Soft Reset</Text>
          {[
            '1. Press and hold the Power button for 3 seconds',
            '2. Select “Restart” from the menu',
            '3. Wait 2–3 minutes for the system to reboot',
            '4. Log in with your credentials',
            '5. Process a test transaction',
          ].map((t, i) => (
            <Text key={`soft-${i}`} style={styles.body}>{t}</Text>
          ))}

          {/* Note */}
          <View style={styles.calloutBlue}>
            <Text style={styles.calloutText}>
              If the soft reset doesn’t work, proceed to Step 2.
            </Text>
          </View>
        </View>

        {/* Step 2: Hard Reset */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Step 2: Hard Reset</Text>
          {[
            '1. Locate the reset button on the back of the terminal',
            '2. Use a paperclip to press and hold for 10 seconds',
            '3. Release when the screen goes black',
            '4. Wait for the TCS logo to appear (3–5 minutes)',
            '5. Terminal will boot to the setup screen',
          ].map((t, i) => (
            <Text key={`hard-${i}`} style={styles.body}>{t}</Text>
          ))}
        </View>

        {/* Step 3: Reconfigure Terminal */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Step 3: Reconfigure Terminal</Text>
          {[
            '1. Select your store location from the dropdown',
            '2. Enter the terminal ID (found on device label)',
            '   Format: TCS-POS-XXXX-XX',
            '3. Click Connect to Network',
            '4. Wait for the green checkmark',
            '5. Click Complete Setup',
          ].map((t, i) => (
            <Text key={`reconf-${i}`} style={styles.body}>{t}</Text>
          ))}
        </View>

        {/* Step 4: Verify Functionality */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Step 4: Verify Functionality</Text>
          <View style={styles.checklist}>
            {[
              'Terminal displays the main POS screen',
              'Network connection is active (green indicator)',
              'Scanner is functional',
              'Card reader is operational',
              'Receipt printer is online',
            ].map((t, i) => (
              <View key={`verify-${i}`} style={styles.checkRow}>
                <View style={styles.checkbox} />
                <Text style={styles.body}>{t}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Troubleshooting */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Troubleshooting</Text>

          <Text style={[styles.sectionTitle, { marginTop: 6 }]}>
            Terminal won’t turn on after reset
          </Text>
          {[
            '• Check power cable connection',
            '• Try a different power outlet',
            '• Contact IT Support if problem persists',
          ].map((t, i) => (
            <Text key={`tt-on-${i}`} style={styles.body}>{t}</Text>
          ))}

          <Text style={[styles.sectionTitle, { marginTop: 10 }]}>
            Network connection fails
          </Text>
          {[
            '• Verify Ethernet cable is connected',
            '• Check network switch status',
            '• Restart the network router',
            '• Contact Network Operations Center (NOC)',
          ].map((t, i) => (
            <Text key={`tt-net-${i}`} style={styles.body}>{t}</Text>
          ))}

          <Text style={[styles.sectionTitle, { marginTop: 10 }]}>
            Terminal ID not recognized
          </Text>
          {[
            '• Double-check the terminal ID on device label',
            '• Ensure no typos in entry',
            '• Contact Help Desk for terminal registration',
          ].map((t, i) => (
            <Text key={`tt-id-${i}`} style={styles.body}>{t}</Text>
          ))}
        </View>

        {/* Important Reminders */}
        <View style={styles.calloutOrange}>
          <Text style={styles.calloutHeadingOrange}>⚠️ Important Reminders:</Text>
          {[
            '• Never reset a terminal during active transactions',
            '• Notify your supervisor before performing a reset',
            '• Document the reset in the store operations log',
            '• Keep terminal ID and store code confidential',
          ].map((t, i) => (
            <Text key={`rem-${i}`} style={styles.calloutTextOrange}>{t}</Text>
          ))}
        </View>

        {/* Contact Information */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Contact Information</Text>

          <View style={styles.subCard}>
            <Text style={[styles.sectionTitle, { color: COLORS.blue700 }]}>IT Help Desk</Text>
            <Text style={styles.body}>Phone: 1-800-TCS-HELP</Text>
            <Text style={styles.body}>Internal: x5500</Text>
            <Text style={styles.body}>Available: 24/7</Text>
          </View>

          <View style={styles.subCard}>
            <Text style={[styles.sectionTitle, { color: COLORS.blue700 }]}>
              Network Operations Center (NOC)
            </Text>
            <Text style={styles.body}>Phone: 1-800-TCS-NOC1</Text>
            <Text style={styles.body}>Internal: x7200</Text>
            <Text style={styles.body}>Available: 24/7</Text>
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

  checklist: { backgroundColor: COLORS.checklistBG, borderRadius: 10, padding: 10, marginTop: 6 },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  checkbox: {
    width: 14, height: 14, borderRadius: 3,
    borderWidth: 1, borderColor: '#D1D5DB', backgroundColor: '#FFFFFF',
  },

  footer: { fontSize: 12, color: COLORS.muted, textAlign: 'center', marginTop: 4 },
});
