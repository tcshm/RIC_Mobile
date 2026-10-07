// app/incidents/[id].tsx
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import {
  getIncidentById,
  getOtherThree,
} from './__data';

import { SafeAreaView } from 'react-native-safe-area-context';
import TCSHeader from '../../components/common/TCSHeader';

const COLORS = {
  blue700: '#0046BE',
  blue600: '#0B57D0',
  bg: '#dcdcdcff',
  cardBG: '#FFFFFF',
  text: '#1F2937',
  muted: '#6B7280',
};

export default function IncidentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const incident = useMemo(() => (id ? getIncidentById(String(id)) : undefined), [id]);
  const others = useMemo(() => (incident ? getOtherThree(incident.id) : []), [incident]);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.blue700} />

      {/* Header */}
      <TCSHeader showBack />

      {/* Page content */}
      <View style={styles.content}>

        {/* Title */}
        <View style={styles.pageTitleRow}>
          <Text style={styles.pageTitle}>{incident?.title ?? 'Incident'}</Text>
        </View>

        {/* ✅ UPDATED PRIMARY DETAILS CARD with inline strings */}
        <View style={styles.detailCard}>

          {/* Incident ID */}
          <View style={styles.row}>
            <Text style={styles.idLabel}>{incident?.id}</Text>
          </View>

          {/* ✅ Service */}
          

        {!!incident?.service && (
          <Text style={{ marginBottom: 12, color: COLORS.muted, fontSize: 14 }}>
            {incident.service}
          </Text>
        )}



          {/* ✅ Incident Type */}
          <Text style={styles.sectionBody}>
            <Text style={styles.sectionLabel}>Incident Type: </Text>
            {incident?.incidentType}
          </Text>

          {/* ✅ Incident Status */}
          <Text style={styles.sectionBody}>
            <Text style={styles.sectionLabel}>Incident Status: </Text>
            {incident?.incidentStatusNew}
          </Text>

          {/* ✅ Summary */}
          {!!incident?.summary && (
            <Text style={styles.sectionBody}>
              <Text style={styles.sectionLabel}>Incident Summary: </Text>
              {incident.summary}
            </Text>
          )}

          {/* ✅ Resolution ETA */}
          <Text style={styles.sectionBody}>
            <Text style={styles.sectionLabel}>Resolution ETA: </Text>
            {incident?.resolutionETA}
          </Text>

          {/* ✅ Resolution Group */}
          <Text style={styles.sectionBody}>
            <Text style={styles.sectionLabel}>Resolution Group: </Text>
            {incident?.resolutionGroup}
          </Text>

        </View>

        {/* ✅ Related incidents (UNCHANGED) */}
        <View style={styles.relatedWrap}>
          <Text style={styles.relatedTitle}>Related Incidents</Text>

          {others.map((rel) => {
            return (
              <View key={rel.id} style={styles.relatedCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.relatedId}>{rel.id}</Text>
                  <Text style={styles.relatedTitleText}>{rel.title}</Text>
                </View>

                <TouchableOpacity
                  style={styles.viewBtn}
                  onPress={() =>
                    router.replace({
                      pathname: '/incidents/[id]',
                      params: { id: rel.id }
                    })
                  }
                  activeOpacity={0.85}
                >
                  <Text style={styles.viewBtnText}>View</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },

  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    alignItems: 'center',
  },

  pageTitleRow: {
    width: '100%',
    maxWidth: 420,
    marginBottom: 16,
    marginTop: 12,
  },
  pageTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'left',
  },

  detailCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: COLORS.cardBG,
    borderRadius: 16,
    padding: 16,
    elevation: 4,
    shadowColor: '#101828',
    shadowOpacity: 0.15,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    marginBottom: 20,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  idLabel: {
    color: COLORS.blue600,
    fontSize: 14,
    fontWeight: '700',
  },
  serviceText: {
    color: COLORS.muted,
    fontSize: 14,
    marginBottom: 12,
  },

  sectionLabel: {
    color: COLORS.blue700,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 6,
  },
  sectionBody: {
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 20,
    marginTop:12,
  },

  relatedWrap: {
    width: '100%',
    maxWidth: 420,
    marginTop: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
  },
  relatedTitle: {
    color: COLORS.blue700,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
  },
  relatedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBG,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#101828',
    shadowOpacity: 0.10,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  relatedId: {
    color: COLORS.blue600,
    fontSize: 13,
    fontWeight: '700',
  },
  relatedTitleText: {
    color: COLORS.text,
    fontSize: 14,
    marginTop: 4,
  },
  viewBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: COLORS.blue700,
  },
  viewBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});