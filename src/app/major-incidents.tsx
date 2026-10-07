
// app/major-incidents.tsx
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PageTitle from '../components/common/PageTitle';
import TCSHeader from '../components/common/TCSHeader';

/* ---------------- Theme ---------------- */
const COLORS = {
  brandBlue: '#0046BE',
  bg: '#F3F4F6',
  cardBG: '#FFFFFF',
  text: '#111827',
  muted: '#6B7280',
  green: '#22C55E',
  greenDeep: '#065F46',
  red: '#EF4444',
  divider: '#E5E7EB',
  shadow: '#101828',
  accentBlue: '#2563EB',
  successBg: '#DCFCE7',
};

/* ---------------- Red circular “i” icon (for header) ---------------- */
const HeaderInfoIcon = ({ size = 24 }: { size?: number }) => (
  <View>
    <MaterialCommunityIcons name="information-outline" size={size} color="#ff0000" />
  </View>
);

/* ---------------- Page data ---------------- */
const PREVIOUS = {
  // id intentionally removed
  title: 'POS Sales Date Issue',
  subtitle:
    'All past sales data flow incident has been fixed. All stores are required to validate the status and update the notification.',
  // changed to a specific past-week timestamp
  time: 'Jan 17, 2026 · 10:15 AM',
  status: 'Resolved',
};

export default function MajorIncidentsScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.brandBlue} />

      {/* Header + Title */}
      <TCSHeader showBack />
      {/* Custom page title row with icon at the beginning (no 0 badge) */}
      <View style={styles.titleRow}>
        <HeaderInfoIcon />
        <PageTitle title="Major Incident Notifications" />
      </View>

      <View style={styles.content}>
        {/* -------- All Clear (styled View, NO red info icon, green tick after title) -------- */}
        <View style={styles.clearCard}>
          {/* Title + green tick inline */}
          <View style={styles.clearTitleRow}>
            <Text style={styles.clearTitle}>All Clear</Text>
            <MaterialCommunityIcons
              name="check-circle-outline"
              size={20}
              color={COLORS.greenDeep}
            />
          </View>

          <Text style={styles.clearText}>
            There is no major active incidents affecting stores.
          </Text>
        </View>

        {/* -------- Divider with label -------- */}
        <View style={styles.sectionDivider}>
          <View style={styles.sectionLine} />
          <Text style={styles.sectionLabel}>Previous Major Incidents</Text>
          <View style={styles.sectionLine} />
        </View>

        {/* -------- Previous Incident (single card, NO ID) -------- */}
        <View style={styles.incidentCard}>
          {/* Header row: Resolved pill aligned right */}
          <View style={styles.incidentHeader}>
            <View style={{ flex: 1 }} />
            <View style={styles.resolvedPill}>
              <MaterialCommunityIcons
                name="check-circle-outline"
                size={16}
                color={COLORS.greenDeep}
                style={{ marginRight: 6 }}
              />
              <Text style={styles.resolvedText}>{PREVIOUS.status}</Text>
            </View>
          </View>

          {/* Title + supporting icon row */}
          <View style={styles.incidentTitleRow}>
            <View style={styles.iconPill}>
              {/* Use a valid icon name for your @expo/vector-icons version */}
              <MaterialCommunityIcons name="calendar-plus" size={18} color={COLORS.accentBlue} />
            </View>
            <Text style={styles.incidentTitle}>{PREVIOUS.title}</Text>
          </View>

          {/* Subtitle (kept exactly as provided) */}
          <Text style={styles.incidentSubtitle}>{PREVIOUS.subtitle}</Text>

          {/* Meta row (specific date/time from last week) */}
          <View style={styles.metaRow}>
            <MaterialCommunityIcons name="calendar-clock" size={16} color={COLORS.muted} />
            <Text style={styles.metaText}>{PREVIOUS.time}</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

/* ---------------- Styles ---------------- */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },

  /* Row that holds the icon + PageTitle */
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 6,
  },

  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
    gap: 16,
  },

  /* red “i” circular button (header only) */
  iCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.red,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.16,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  /* All Clear card */
  clearCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FECACA',     // light red border
    backgroundColor: '#FFF5F5', // subtle warm tint (no gradient)
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  clearTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  clearTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: 0.2,
  },
  clearText: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.muted,
  },

  /* Section Divider */
  sectionDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 2,
  },
  sectionLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.divider,
  },
  sectionLabel: {
    fontSize: 13,
    color: COLORS.muted,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },

  /* Previous Incident card (without ID) */
  incidentCard: {
    backgroundColor: COLORS.cardBG,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },
  incidentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end', // Resolved pill aligns right
  },
  resolvedPill: {
    backgroundColor: COLORS.successBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
  },
  resolvedText: {
    color: COLORS.greenDeep,
    fontWeight: '800',
    fontSize: 12.5,
  },

  incidentTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 10,
  },
  iconPill: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#E0E7FF',
    borderWidth: 1,
  },
  incidentTitle: {
    color: COLORS.text,
    fontWeight: '800',
    fontSize: 16,
  },
  incidentSubtitle: {
    color: COLORS.muted,
    fontSize: 13.5,
    lineHeight: 20,
    marginTop: 6,
  },

  metaRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    color: COLORS.muted,
    fontSize: 12.5,
  },
});
