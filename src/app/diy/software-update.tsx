
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

  // Checklist
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

export default function SoftwareUpdateGuide() {
  const icon = <CommunityIcon name="update" />
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
            Software Update Procedure
          </Text>
          <Text style={styles.heroSub}>
            Category: Software • Difficulty: Intermediate • Time: 20–45 minutes
          </Text>
        </View>

        {/* Overview */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Overview</Text>
          <Text style={styles.body}>
            This guide covers the procedures for updating software on store systems including
            POS terminals, workstations, and store applications.
          </Text>
        </View>

        {/* Update Types */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Update Types</Text>
          {[
            '• Critical Security Updates – Install immediately',
            '• Application Updates – Install during scheduled maintenance',
            '• Operating System Updates – Coordinated with IT',
            '• Firmware Updates – Scheduled by IT',
          ].map((t, i) => (
            <Text key={`ut-${i}`} style={styles.body}>{t}</Text>
          ))}
        </View>

        {/* Before You Begin */}
        <View style={styles.calloutOrange}>
          <Text style={styles.calloutHeadingOrange}>⚠️ Before You Begin:</Text>
          {[
            '• Never update POS systems during store hours',
            '• Always create backup before major updates',
            '• Verify sufficient disk space',
            '• Ensure stable network connection',
            '• Have IT Help Desk number ready',
          ].map((t, i) => (
            <Text key={`byb-${i}`} style={styles.calloutTextOrange}>{t}</Text>
          ))}
        </View>

        {/* Pre-Update Checklist */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Pre‑Update Checklist</Text>
          <View style={styles.checklist}>
            {[
              'Manager approval received',
              'Backup completed (if required)',
              'All users logged out',
              'Active transactions completed',
              'Network connection verified',
              'Power source stable (UPS recommended)',
              'Update files downloaded/accessible',
              'Downtime communicated to team',
            ].map((t, i) => (
              <View key={`pre-${i}`} style={styles.checkRow}>
                <View style={styles.checkbox} />
                <Text style={styles.body}>{t}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* POS Terminal Updates */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>POS Terminal Updates</Text>

          <Text style={[styles.sectionTitle, { marginTop: 6 }]}>Automatic Updates (Recommended)</Text>
          {[
            '1. Log into POS with admin credentials',
            '2. Open System Settings → Updates',
            '3. Enable Automatic Updates',
            '4. Set update window: 2:00 AM – 5:00 AM',
            '5. Enable Auto‑restart if required',
            '6. Click Save',
          ].map((t, i) => (
            <Text key={`auto-${i}`} style={styles.body}>{t}</Text>
          ))}

          {/* When to use manual updates */}
          <View style={styles.calloutBlue}>
            <Text style={styles.calloutHeading}>When to use manual updates:</Text>
            {[
              '• Automatic updates disabled',
              '• Critical update needed immediately',
              '• Troubleshooting update issues',
              '• IT instructs manual update',
            ].map((t, i) => (
              <Text key={`manual-why-${i}`} style={styles.calloutText}>{t}</Text>
            ))}
          </View>

          <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Manual Updates</Text>
          {[
            '1. Open System Settings → Updates',
            '2. Click Check for Updates',
            '3. Review available updates',
            '4. Select updates to install',
            '5. Click Download',
            '6. After download, click Install Now',
            '7. System may restart multiple times',
            '8. Do not interrupt the process',
          ].map((t, i) => (
            <Text key={`manual-${i}`} style={styles.body}>{t}</Text>
          ))}
        </View>

        {/* Update Schedule Reference */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Update Schedule Reference</Text>
          <View style={styles.subCard}>
            <Text style={[styles.sectionTitle, { color: COLORS.blue700 }]}>Daily</Text>
            <Text style={styles.body}>• Automatic antivirus updates</Text>
            <Text style={styles.body}>• Application cache updates</Text>
          </View>

          <View style={styles.subCard}>
            <Text style={[styles.sectionTitle, { color: COLORS.blue700 }]}>Weekly</Text>
            <Text style={styles.body}>• Application minor updates</Text>
            <Text style={styles.body}>• Security definition updates</Text>
          </View>

          <View style={styles.subCard}>
            <Text style={[styles.sectionTitle, { color: COLORS.blue700 }]}>
              Monthly (First Tuesday)
            </Text>
            <Text style={styles.body}>• Windows Update rollup</Text>
            <Text style={styles.body}>• Store application updates</Text>
            <Text style={styles.body}>• Firmware updates (if scheduled)</Text>
          </View>

          <View style={styles.subCard}>
            <Text style={[styles.sectionTitle, { color: COLORS.blue700 }]}>Quarterly</Text>
            <Text style={styles.body}>• Major application releases</Text>
            <Text style={styles.body}>• System maintenance</Text>
            <Text style={styles.body}>• Hardware firmware updates</Text>
          </View>
        </View>

        {/* Required Approvals */}
        <View style={styles.calloutOrange}>
          <Text style={styles.calloutHeadingOrange}>⚠️ Required Approvals:</Text>
          <Text style={styles.calloutTextOrange}>Store Manager approval required for:</Text>
          {[
            '• Updates during store hours (emergency only)',
            '• Major version upgrades',
            '• Updates requiring system downtime',
          ].map((t, i) => (
            <Text key={`mgr-${i}`} style={styles.calloutTextOrange}>{t}</Text>
          ))}

          <Text style={[styles.calloutTextOrange, { marginTop: 8 }]}>
            IT approval required for:
          </Text>
          {[
            '• Firmware updates',
            '• Operating system upgrades',
            '• Network equipment updates',
          ].map((t, i) => (
            <Text key={`it-${i}`} style={styles.calloutTextOrange}>{t}</Text>
          ))}
        </View>

        {/* Store Application Updates */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Store Application Updates</Text>

          <Text style={[styles.sectionTitle, { marginTop: 6 }]}>RSS (Retail Store System)</Text>
          {[
            '1. Navigate to Store Portal → Downloads',
            '2. Select RSS Updates',
            '3. Download latest version',
            '4. Close RSS application completely',
            '5. Run downloaded installer',
            '6. Select “Update existing installation”',
            '7. Click Install and wait for completion',
            '8. Launch RSS and verify version number',
          ].map((t, i) => (
            <Text key={`rss-${i}`} style={styles.body}>{t}</Text>
          ))}

          <Text style={[styles.sectionTitle, { marginTop: 10 }]}>RV (Rev)</Text>
          {[
            '1. Open browser and go to: rv.tcs.com/updates',
            '2. Log in with your credentials',
            '3. Click Install Latest Update',
            '4. Application will close and update automatically',
            '5. Wait 2–5 minutes for update',
            '6. RV will relaunch when complete',
          ].map((t, i) => (
            <Text key={`rv-${i}`} style={styles.body}>{t}</Text>
          ))}

          <Text style={[styles.sectionTitle, { marginTop: 10 }]}>SIGN UI (Digital Signage)</Text>
          {[
            '1. Updates install automatically in background',
            '2. Check status: Settings → System Info',
            '3. For manual update, run SignUI_Updater.exe',
          ].map((t, i) => (
            <Text key={`sign-${i}`} style={styles.body}>{t}</Text>
          ))}
        </View>

        {/* Post-Update Verification */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Post‑Update Verification</Text>
          <View style={styles.checklist}>
            {[
              'System boots normally',
              'All applications launch',
              'Hardware devices work',
              'Network connectivity active',
              'No error messages',
              'Performance normal',
              'Test transaction successful',
            ].map((t, i) => (
              <View key={`post-${i}`} style={styles.checkRow}>
                <View style={styles.checkbox} />
                <Text style={styles.body}>{t}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Troubleshooting Update Issues */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Troubleshooting Update Issues</Text>

          <Text style={[styles.sectionTitle, { marginTop: 6 }]}>Update Fails to Install</Text>
          {[
            '• Check disk space (need 10GB+ free)',
            '• Re‑download update file',
            '• Disable antivirus temporarily',
            '• Run Windows Update Troubleshooter',
          ].map((t, i) => (
            <Text key={`fail-${i}`} style={styles.body}>{t}</Text>
          ))}

          <Text style={[styles.sectionTitle, { marginTop: 10 }]}>System Won’t Boot After Update</Text>
          {[
            '1. Boot to Safe Mode (press F8 during startup)',
            '2. Uninstall recent update from Control Panel',
            '3. Use System Restore if available',
            '4. Call IT Help Desk if issue persists',
          ].map((t, i) => (
            <Text key={`boot-${i}`} style={styles.body}>{t}</Text>
          ))}

          <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Application Won’t Launch After Update</Text>
          {[
            '1. Restart computer',
            '2. Repair installation from Control Panel',
            '3. Reinstall application if needed',
            '4. Contact IT for assistance',
          ].map((t, i) => (
            <Text key={`app-${i}`} style={styles.body}>{t}</Text>
          ))}

          <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Update Stuck/Frozen</Text>
          {[
            '• Wait 60+ minutes (some updates take time)',
            '• Check disk activity light',
            '• Only force restart as last resort',
            '• System will attempt recovery on restart',
          ].map((t, i) => (
            <Text key={`stuck-${i}`} style={styles.body}>{t}</Text>
          ))}
        </View>

        {/* Contact Information */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Contact Information</Text>

          <View style={styles.subCard}>
            <Text style={[styles.sectionTitle, { color: COLORS.blue700 }]}>IT Help Desk</Text>
            <Text style={styles.body}>Phone: 1-800-TCS-HELP</Text>
            <Text style={styles.body}>Internal: x5500</Text>
            <Text style={styles.body}>Email: ithelpdesk@tcs.com</Text>
            <Text style={styles.body}>Available: 24/7</Text>
          </View>

          <View style={styles.subCard}>
            <Text style={[styles.sectionTitle, { color: COLORS.blue700 }]}>Software Support</Text>
            <Text style={styles.body}>Internal: x5520</Text>
            <Text style={styles.body}>Email: software-support@tcs.com</Text>
            <Text style={styles.body}>Available: Mon–Fri 8AM–6PM (local time)</Text>
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
