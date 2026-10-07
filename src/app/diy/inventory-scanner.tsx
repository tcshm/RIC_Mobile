
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

  // Checklist blocks
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


export default function InventoryScannerSetupGuide() {
  const icon = <CommunityIcon name="barcode-scan" />;
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
          <Text style={[styles.heroTitle, { color: COLORS.blue700 }]}>Inventory Scanner Setup</Text>
          <Text style={styles.heroSub}>
            Category: Hardware • Difficulty: Easy • Time: 10 minutes
          </Text>
        </View>

        {/* Overview */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Overview</Text>
          <Text style={styles.body}>
            This guide covers the setup, configuration, and troubleshooting of handheld inventory
            scanners (RF Guns) used for inventory management, price checks, and stock verification in TCS locations.
          </Text>
        </View>

        {/* Scanner Models */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Scanner Models</Text>
          {[
            '• Zebra TC52 (Primary – Android-based)',
            '• Zebra TC21 (Compact model)',
            '• Honeywell CT40 (Legacy – being phased out)',
          ].map((t, i) => (
            <Text key={`models-${i}`} style={styles.body}>{t}</Text>
          ))}
        </View>

        {/* Initial Setup (New Scanner) */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Initial Setup (New Scanner)</Text>

          <Text style={[styles.sectionTitle, { marginTop: 6 }]}>Step 1: Unboxing and Charging</Text>
          {[
            '1. Remove scanner from packaging',
            '2. Locate battery and battery cover',
            '3. Insert battery into scanner',
            '   - Align contacts at bottom',
            '   - Push down until clicks',
            '4. Place scanner in charging cradle',
            '5. Charge for 4 hours before first use',
          ].map((t, i) => (
            <Text key={`unbox-${i}`} style={styles.body}>{t}</Text>
          ))}

          {/* LED indicator callout */}
          <View style={styles.calloutBlue}>
            <Text style={styles.calloutHeading}>LED Indicator:</Text>
            <Text style={styles.calloutText}>• Red = Charging</Text>
            <Text style={styles.calloutText}>• Green = Fully charged</Text>
          </View>

          <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Step 2: Power On</Text>
          {[
            '1. Press and hold Power button for 3 seconds',
            '2. Wait for TCS logo to appear',
            '3. Device will boot to home screen (2–3 minutes)',
            '4. Initial setup wizard will launch',
          ].map((t, i) => (
            <Text key={`pwr-${i}`} style={styles.body}>{t}</Text>
          ))}

          <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Step 3: Network Configuration</Text>
          {[
            '1. On setup wizard, select Connect to Wi‑Fi',
            '2. Choose network: TCS-Store-Secure',
            '3. Enter Wi‑Fi password (get from manager)',
            '4. Tap Connect',
            '5. Wait for connection confirmation',
          ].map((t, i) => (
            <Text key={`net-${i}`} style={styles.body}>{t}</Text>
          ))}

          <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Step 4: Device Registration</Text>
          {[
            '1. Setup wizard will prompt "Register Device"',
            '2. Enter store number: Store XXXX',
            '3. Enter your employee ID',
            '4. Scan your employee badge barcode',
            '5. Tap Register',
            '6. Wait for confirmation message',
          ].map((t, i) => (
            <Text key={`reg-${i}`} style={styles.body}>{t}</Text>
          ))}

          <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Step 5: Install Store Apps</Text>
          {[
            'Device will automatically download:',
            '• RSS Mobile (Retail Store System)',
            '• Store Inventory',
            '• Price Checker',
            '• Reverse Logistics',
            'Wait for all apps to install (5–10 minutes)',
            'Tap Complete Setup when done',
          ].map((t, i) => (
            <Text key={`apps-${i}`} style={styles.body}>{t}</Text>
          ))}
        </View>

        {/* Daily Operation */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Daily Operation</Text>

          <Text style={[styles.sectionTitle, { marginTop: 6 }]}>Starting Your Shift</Text>
          {[
            '1. Take scanner from charging cradle',
            '2. Check battery level (should be 80%+)',
            '3. Sign out scanner in log book:',
            '   - Your name',
            '   - Scanner ID (on back of device)',
            '   - Time and date',
            '4. Wake scanner and log in',
          ].map((t, i) => (
            <Text key={`start-${i}`} style={styles.body}>{t}</Text>
          ))}

          <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Ending Your Shift</Text>
          {[
            '1. Close all apps',
            '2. Log out of device',
            '3. Place scanner in designated cradle',
            '4. Verify charging light appears',
            '5. Sign in scanner in log book',
            '6. Report any issues to supervisor',
          ].map((t, i) => (
            <Text key={`end-${i}`} style={styles.body}>{t}</Text>
          ))}
        </View>

        {/* Scanner Functions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Scanner Functions</Text>

          <View style={styles.subCard}>
            <Text style={styles.sectionTitle}>Price Check</Text>
            {[
              '1. Open Price Checker app',
              '2. Scan product barcode',
              '3. View product name, price, and stock',
            ].map((t, i) => (
              <Text key={`func-price-${i}`} style={styles.body}>{t}</Text>
            ))}
          </View>

          <View style={styles.subCard}>
            <Text style={styles.sectionTitle}>Inventory Count</Text>
            {[
              '1. Open RSS Mobile → Inventory Count',
              '2. Select count type (Full/Cycle/Spot)',
              '3. Scan location barcode',
              '4. Scan each product and enter quantity',
              '5. Tap Submit when complete',
            ].map((t, i) => (
              <Text key={`func-inv-${i}`} style={styles.body}>{t}</Text>
            ))}
          </View>

          <View style={styles.subCard}>
            <Text style={styles.sectionTitle}>Stock Lookup</Text>
            {[
              '1. Open RSS Mobile → Stock Lookup',
              '2. Select count type or enter SKU',
              '3. View on‑hand quantity and location',
            ].map((t, i) => (
              <Text key={`func-stock-${i}`} style={styles.body}>{t}</Text>
            ))}
          </View>

          <View style={styles.subCard}>
            <Text style={styles.sectionTitle}>Receiving</Text>
            {[
              '1. Open RSS Mobile → Receiving',
              '2. Scan shipment label',
              '3. Scan each item received',
              '4. Enter quantities',
              '5. Tap Complete Receipt',
            ].map((t, i) => (
              <Text key={`func-recv-${i}`} style={styles.body}>{t}</Text>
            ))}
          </View>
        </View>

        {/* Troubleshooting */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Troubleshooting</Text>

          <Text style={[styles.sectionTitle, { marginTop: 6 }]}>Scanner Won’t Turn On</Text>
          {[
            '• Check battery is seated correctly',
            '• Charge battery for 30 minutes',
            '• Try different battery from working scanner',
            '• Contact IT Help Desk if still not working',
          ].map((t, i) => (
            <Text key={`tt-on-${i}`} style={styles.body}>{t}</Text>
          ))}

          <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Scanner Won’t Scan Barcodes</Text>
          {[
            '• Clean scanner window with microfiber cloth',
            '• Check scan settings (Settings → Scanner)',
            '• Test with different barcode',
            '• Restart scanner',
            '• Recalibrate scanner (Settings → Scanner → Calibrate)',
          ].map((t, i) => (
            <Text key={`tt-scan-${i}`} style={styles.body}>{t}</Text>
          ))}

          <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Wi‑Fi Connection Issues</Text>
          {[
            '• Swipe down and tap Wi‑Fi icon to reconnect',
            '• Forget network and reconnect',
            '• Check if other scanners are connected',
            '• Restart scanner',
          ].map((t, i) => (
            <Text key={`tt-wifi-${i}`} style={styles.body}>{t}</Text>
          ))}

          <Text style={[styles.sectionTitle, { marginTop: 10 }]}>App Won’t Open or Crashes</Text>
          {[
            '• Force stop app (Settings → Apps)',
            '• Clear app cache',
            '• Clear app data (will reset settings)',
            '• Update or reinstall app',
          ].map((t, i) => (
            <Text key={`tt-app-${i}`} style={styles.body}>{t}</Text>
          ))}

          <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Battery Drains Quickly</Text>
          {[
            '• Enable Battery Saver mode',
            '• Reduce screen brightness',
            '• Close unused apps',
            '• Replace battery if 2+ years old',
          ].map((t, i) => (
            <Text key={`tt-batt-${i}`} style={styles.body}>{t}</Text>
          ))}
        </View>

        {/* >>> MISSING SECTION ADDED HERE <<< */}
        {/* Maintenance Schedule */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Maintenance Schedule</Text>

          {/* Daily (added as requested) */}
          <View style={styles.checklist}>
            <Text style={[styles.sectionTitle, { color: COLORS.blue700 }]}>Daily</Text>
            {[
              'Clean scanner window',
              'Wipe down device with sanitizer',
              'Check for physical damage',
              'Verify battery charges properly',
            ].map((t, i) => (
              <View key={`maint-d-${i}`} style={styles.checkRow}>
                <View style={styles.checkbox} />
                <Text style={styles.body}>{t}</Text>
              </View>
            ))}
          </View>

          {/* Weekly (from screenshot) */}
          <View style={[styles.checklist, { marginTop: 10 }]}>
            <Text style={[styles.sectionTitle, { color: COLORS.blue700 }]}>Weekly</Text>
            {[
              'Deep clean scanner housing',
              'Check for software updates',
              'Test all scan modes',
            ].map((t, i) => (
              <View key={`maint-w-${i}`} style={styles.checkRow}>
                <View style={styles.checkbox} />
                <Text style={styles.body}>{t}</Text>
              </View>
            ))}
          </View>

          {/* Monthly (from screenshot) */}
          <View style={[styles.checklist, { marginTop: 10 }]}>
            <Text style={[styles.sectionTitle, { color: COLORS.blue700 }]}>Monthly</Text>
            {[
              'Inspect charging contacts',
              'Clean charging cradle',
              'Test battery health',
              'Review scanner assignment log',
            ].map((t, i) => (
              <View key={`maint-m-${i}`} style={styles.checkRow}>
                <View style={styles.checkbox} />
                <Text style={styles.body}>{t}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Scanner Care Best Practices */}
        <View style={styles.calloutOrange}>
          <Text style={styles.calloutHeadingOrange}>⚠️ Scanner Care Best Practices:</Text>
          <Text style={styles.calloutTextOrange}>DO:</Text>
          {[
            '• Use wrist strap when available',
            '• Store in protective case when not in use',
            '• Report damage immediately',
          ].map((t, i) => (
            <Text key={`care-do-${i}`} style={styles.calloutTextOrange}>{t}</Text>
          ))}

          <Text style={[styles.calloutTextOrange, { marginTop: 8 }]}>DON’T:</Text>
          {[
            '• Drop or throw scanner',
            '• Leave on floor or in walkways',
            '• Expose to extreme temperatures',
            '• Disassemble device',
          ].map((t, i) => (
            <Text key={`care-dont-${i}`} style={styles.calloutTextOrange}>{t}</Text>
          ))}
        </View>

        {/* Scanner Specifications */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Scanner Specifications</Text>

          <View style={styles.subCard}>
            <Text style={[styles.sectionTitle, { color: COLORS.blue700 }]}>Zebra TC52</Text>
            {[
              '• Display: 5" touchscreen',
              '• OS: Android 11',
              '• Battery: 3400 mAh',
              '• Scanner: 2D imager',
              '• Wi‑Fi: Dual‑band 802.11 a/b/g/n/ac',
              '• Weight: 8.8 oz (with battery)',
              '• Durability: IP65 rated, 6ft drop rating',
            ].map((t, i) => (
              <Text key={`tc52-${i}`} style={styles.body}>{t}</Text>
            ))}
          </View>

          <View style={styles.subCard}>
            <Text style={[styles.sectionTitle, { color: COLORS.blue700 }]}>Zebra TC21</Text>
            {[
              '• Display: 4.3" touchscreen',
              '• OS: Android 10',
              '• Battery: 3000 mAh',
              '• Scanner: 1D/2D imager',
              '• Wi‑Fi: 802.11 a/b/g/n/ac',
              '• Weight: 7.9 oz (with battery)',
              '• Durability: IP54 rated, 4ft drop rating',
            ].map((t, i) => (
              <Text key={`tc21-${i}`} style={styles.body}>{t}</Text>
            ))}
          </View>
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
            <Text style={[styles.sectionTitle, { color: COLORS.blue700 }]}>Hardware Support</Text>
            <Text style={styles.body}>Internal: x5530</Text>
            <Text style={styles.body}>Email: hardware-support@tcs.com</Text>
            <Text style={styles.body}>For: Scanner issues, battery requests, repairs</Text>
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
  calloutHeading: { color: COLORS.calloutBlueText, fontWeight: '700', fontSize: 13.5 },
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

  // Checklist
  checklist: { backgroundColor: COLORS.checklistBG, borderRadius: 10, padding: 10, marginTop: 6 },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  checkbox: {
    width: 14, height: 14, borderRadius: 3,
    borderWidth: 1, borderColor: '#D1D5DB', backgroundColor: '#FFFFFF',
  },

  footer: { fontSize: 12, color: COLORS.muted, textAlign: 'center', marginTop: 4 },
});
