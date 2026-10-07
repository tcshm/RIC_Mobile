
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

export default function PrinterSetupGuide() {
  const icon = <CommunityIcon name="printer" />
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Platform.OS === 'android' ? COLORS.blue700 : undefined}
      />

      {/* TCS Header */}
      <TCSHeader showBack />

      {/* Content (hero moved inside the ScrollView so it scrolls) */}
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroIcon}>{icon}</Text>
          <Text style={[styles.heroTitle, { color: COLORS.blue700 }]}>Printer Setup Guide</Text>
          <Text style={styles.heroSub}>
            Category: Hardware • Difficulty: Easy • Time: 10 minutes
          </Text>
        </View>

        {/* Overview */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Overview</Text>
          <Text style={styles.body}>
            This guide covers the installation, configuration, and basic troubleshooting of
            receipt printers, label printers, and office printers used in TCS locations.
          </Text>
        </View>

        {/* Printer Types */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Printer Types</Text>
          {[
            '• Receipt Printers (Epson TM-T88VI)',
            '• Label Printers (Zebra ZD420)',
            '• Office Printers (HP LaserJet)',
          ].map((t, i) => (
            <Text key={i} style={styles.body}>{t}</Text>
          ))}
        </View>

        {/* Receipt Printer Setup */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Receipt Printer Setup</Text>

          <Text style={[styles.sectionTitle, { marginTop: 8 }]}>Step 1: Physical Installation</Text>
          {[
            '1. Unbox printer and remove protective materials',
            '2. Place on flat, stable surface near POS terminal',
            '3. Connect power adapter to printer',
            '4. Plug power cable into outlet',
          ].map((t, i) => (
            <Text key={`r1-${i}`} style={styles.body}>{t}</Text>
          ))}

          <Text style={[styles.sectionTitle, { marginTop: 12 }]}>Step 2: Connect to POS Terminal</Text>

          {/* USB callout */}
          <View style={styles.calloutBlue}>
            <Text style={styles.calloutHeading}>For USB Connection:</Text>
            {[
              '1. Connect USB cable to printer’s USB port',
              '2. Connect other end to POS terminal',
              '3. Wait for Windows to detect (30–60 seconds)',
            ].map((t, i) => (
              <Text key={`usb-${i}`} style={styles.calloutText}>{t}</Text>
            ))}
          </View>

          {/* Network callout */}
          <View style={styles.calloutBlue}>
            <Text style={styles.calloutHeading}>For Network Connection:</Text>
            {[
              '1. Connect Ethernet cable to printer’s LAN port',
              '2. Connect other end to network switch',
              '3. Press Feed button to print config page',
              '4. Note the IP address on printed page',
            ].map((t, i) => (
              <Text key={`net-${i}`} style={styles.calloutText}>{t}</Text>
            ))}
          </View>

          <Text style={[styles.sectionTitle, { marginTop: 12 }]}>Step 3: Configure Printer Settings</Text>
          {[
            '1. Open Control Panel → Devices and Printers',
            '2. Right-click on new printer',
            '3. Select Printer properties',
            '4. Configure settings:',
            '   - Paper size: 80mm (3.15")',
            '   - Print speed: High',
            '   - Cut type: Partial cut',
            '   - Buzzer: Enabled',
            '5. Click Apply → OK',
          ].map((t, i) => (
            <Text key={`r3-${i}`} style={styles.body}>{t}</Text>
          ))}
        </View>

        {/* Label Printer Setup (Zebra) */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Label Printer Setup (Zebra)</Text>

          <Text style={[styles.sectionTitle, { marginTop: 8 }]}>Step 1: Load Labels</Text>
          {[
            '1. Open the top cover of the printer',
            '2. Load label roll onto the spindle',
            '3. Thread labels through the guides',
            '4. Close the top cover',
            '5. Press Feed button to advance labels',
          ].map((t, i) => (
            <Text key={`z1-${i}`} style={styles.body}>{t}</Text>
          ))}

          <Text style={[styles.sectionTitle, { marginTop: 12 }]}>Step 2: Configure Label Size</Text>
          {[
            '1. Open Zebra Setup Utilities',
            '2. Select your printer from the list',
            '3. Click Configure Printer Settings',
            '4. Set label dimensions:',
            '   - Width: 4 inches',
            '   - Height: 6 inches (standard) or 2 inches (small)',
            '5. Set print darkness: 15',
            '6. Click Save',
          ].map((t, i) => (
            <Text key={`z2-${i}`} style={styles.body}>{t}</Text>
          ))}

          <Text style={[styles.sectionTitle, { marginTop: 12 }]}>Step 3: Calibrate Printer</Text>
          {[
            '1. In Zebra Setup Utilities, click Calibrate',
            '2. Printer will feed several labels',
            '3. Wait for calibration to complete',
            '4. Print a test label to verify',
          ].map((t, i) => (
            <Text key={`z3-${i}`} style={styles.body}>{t}</Text>
          ))}
        </View>

        {/* Common Issues & Solutions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Common Issues & Solutions</Text>

          <Text style={[styles.sectionTitle, { marginTop: 8 }]}>Paper Jam</Text>
          {[
            '1. Turn off printer',
            '2. Open paper cover',
            '3. Remove jammed paper carefully',
            '4. Close cover and power on',
            '5. Press Feed button',
          ].map((t, i) => (
            <Text key={`jam-${i}`} style={styles.body}>{t}</Text>
          ))}

          <Text style={[styles.sectionTitle, { marginTop: 12 }]}>Faded Printing</Text>
          {[
            '• Check paper roll is installed correctly',
            '• Clean print head with isopropyl alcohol',
            '• Replace paper roll if old/damaged',
            '• Adjust print darkness in settings',
          ].map((t, i) => (
            <Text key={`faded-${i}`} style={styles.body}>{t}</Text>
          ))}

          <Text style={[styles.sectionTitle, { marginTop: 12 }]}>Not Cutting Properly</Text>
          {[
            '• Clean cutter blade with soft cloth',
            '• Replace cutter blade if damaged',
            '• Adjust cut position in printer settings',
          ].map((t, i) => (
            <Text key={`cut-${i}`} style={styles.body}>{t}</Text>
          ))}

          <Text style={[styles.sectionTitle, { marginTop: 12 }]}>Labels Not Feeding Correctly</Text>
          {[
            '• Recalibrate the printer',
            '• Check label roll is loaded correctly',
            '• Clean sensors with compressed air',
            '• Verify label size in printer settings',
          ].map((t, i) => (
            <Text key={`feed-${i}`} style={styles.body}>{t}</Text>
          ))}
        </View>

        {/* Maintenance Schedule */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Maintenance Schedule</Text>

          <Text style={[styles.sectionTitle, { marginTop: 8 }]}>Daily</Text>
          <View style={styles.checklist}>
            {[
              'Check paper/label levels',
              'Test print functionality',
              'Clear any paper jams',
            ].map((t, i) => (
              <View key={`d-${i}`} style={styles.checkRow}>
                <View style={styles.checkbox} />
                <Text style={styles.body}>{t}</Text>
              </View>
            ))}
          </View>

          <Text style={[styles.sectionTitle, { marginTop: 12 }]}>Weekly</Text>
          <View style={styles.checklist}>
            {[
              'Clean print heads with isopropyl alcohol',
              'Check for error messages',
              'Verify network connectivity',
            ].map((t, i) => (
              <View key={`w-${i}`} style={styles.checkRow}>
                <View style={styles.checkbox} />
                <Text style={styles.body}>{t}</Text>
              </View>
            ))}
          </View>

          <Text style={[styles.sectionTitle, { marginTop: 12 }]}>Monthly</Text>
          <View style={styles.checklist}>
            {[
              'Clean cutter blade (receipt printers)',
              'Clean sensors (label printers)',
              'Update firmware if available',
              'Check for loose connections',
            ].map((t, i) => (
              <View key={`m-${i}`} style={styles.checkRow}>
                <View style={styles.checkbox} />
                <Text style={styles.body}>{t}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Safety & Best Practices */}
        <View style={styles.calloutOrange}>
          <Text style={styles.calloutHeadingOrange}>⚠️ Safety & Best Practices:</Text>
          {[
            '• Never force paper through printer mechanisms',
            '• Use only approved paper and label types',
            '• Keep printer vents clear for ventilation',
            '• Unplug printer before cleaning',
            '• Do not attempt to disassemble printer',
          ].map((t, i) => (
            <Text key={`safe-${i}`} style={styles.calloutTextOrange}>{t}</Text>
          ))}
        </View>

        {/* Approved Supplies */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Approved Supplies</Text>

          <View style={styles.subCard}>
            <Text style={styles.sectionTitle}>Receipt Printers:</Text>
            <Text style={styles.body}>Paper: Thermal 80mm × 80mm</Text>
            <Text style={styles.body}>Part #: TCS-RCP-80</Text>
          </View>

          <View style={styles.subCard}>
            <Text style={styles.sectionTitle}>Label Printers:</Text>
            <Text style={styles.body}>Labels: Zebra 4" × 6" Direct Thermal</Text>
            <Text style={styles.body}>Part #: TCS-LBL-46</Text>
            <Text style={[styles.body, { marginTop: 8 }]}>Small Labels: Zebra 4" × 2"</Text>
            <Text style={styles.body}>Part #: TCS-LBL-42</Text>
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
            <Text style={[styles.sectionTitle, { color: COLORS.blue700 }]}>Printer Support</Text>
            <Text style={styles.body}>Email: printer-support@tcs.com</Text>
            <Text style={styles.body}>Internal: x5550</Text>
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

  // Hero is inside ScrollView now
  hero: { alignItems: 'center', paddingVertical: 14 },
  heroIcon: { fontSize: 28 },
  heroTitle: { fontSize: 20, fontWeight: '700' }, // color applied inline to be blue
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

  // Main headings (card titles) in blue
  cardTitle: { fontSize: 16, fontWeight: '700', color: COLORS.blue700 },

  // Step headings in normal text color for contrast
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
  calloutHeading: { color: COLORS.calloutBlueText, fontWeight: '700', fontSize: 13.5 },
  calloutText: { fontSize: 13, color: COLORS.text, marginTop: 6, lineHeight: 18 },

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
