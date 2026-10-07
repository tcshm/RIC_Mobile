
// app/incidents/index.tsx

import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  getIncidentsSortedDesc,
  incidents,
  relativeTime,
  severityMeta,
  statusMeta,
} from './__data';

import TCSHeader from '../../components/common/TCSHeader';

const COLORS = {
  blue700: '#0046BE',
  blue600: '#0B57D0',
  bg: '#dcdcdcff',
  cardBG: '#FFFFFF',
  text: '#1F2937',
  muted: '#6B7280',
};

export default function IncidentsListScreen() {
  const { title } = useLocalSearchParams<{ title?: string }>(); // ✅ title override

  const data = useMemo(() => getIncidentsSortedDesc(), []);

  const renderItem = useCallback(
    ({ item }: { item: (typeof incidents)[number] }) => {
      const sev = severityMeta(item.severity);
      const stat = statusMeta(item.status);

      return (
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.85}
          onPress={() =>
            router.push({ pathname: '/incidents/[id]', params: { id: item.id } })
          }
          accessibilityRole="button"
          accessibilityLabel={`Open incident ${item.id}: ${item.title}`}
        >
          {/* Icon */}
          <View style={styles.cardIconWrap}>
            <Text style={styles.cardIcon}>{item.icon ?? '⚠️'}</Text>
          </View>

          {/* Text block */}
          <View style={styles.cardTextWrap}>
            {/* Top row: ID + Severity pill */}
            <View style={styles.cardTopRow}>
              <Text style={styles.cardId}>{item.id}</Text>

              <View style={[styles.pill, { backgroundColor: sev.bg }]}>
                <Text style={[styles.pillText, { color: sev.text }]}>{sev.label}</Text>
              </View>
            </View>

            <Text style={styles.cardTitle}>{item.title}</Text>

            {/* Subtitle (not service) */}
            {!!item.subtitle && (
              <Text style={styles.cardService}>{item.subtitle}</Text>
            )}

            {/* Bottom row: when + plain badge text */}
            <View style={styles.cardBottomRow}>
              <Text style={styles.cardWhen}>{relativeTime(item.reportedAt)}</Text>
              <Text style={styles.cardBadgeText}>{item.badge ?? stat.label}</Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    []
  );

  // 👇 Header becomes part of the scrollable content
  const ListHeader = useMemo(
    () => (
      <View style={styles.pageTitleRow}>
        <Text style={styles.pageTitle}>
          {typeof title === 'string' && title.trim() ? title : 'Incidents'}
        </Text>
      </View>
    ),
    [title]
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.blue700} />

      {/* Fixed header (like network.tsx) */}
      <TCSHeader showBack />

      {/* FlatList is the only scroller; title is in ListHeaderComponent */}
      <FlatList
        data={data}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const CIRCLE_SIZE = 42;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },

  // Page title (now inside FlatList header)
  pageTitleRow: {
    width: '100%',
    maxWidth: 420,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  pageTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '700',
    paddingVertical: 10,
  },

  // List content padding for the whole page
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    rowGap: 10,
  },

  // Card
  card: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.cardBG,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    elevation: 3,
    shadowColor: '#101828',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  cardIconWrap: {
    width: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  cardIcon: { fontSize: 20 },
  cardTextWrap: { flex: 1 },

  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardId: { color: COLORS.blue600, fontSize: 12, fontWeight: '700' },
  cardTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '700',
    marginTop: 4,
  },

  // Subtitle (shown in card)
  cardService: { color: COLORS.muted, fontSize: 13, marginTop: 2 },

  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  cardWhen: { color: COLORS.muted, fontSize: 12 },

  // Plain badge text (no background color)
  cardBadgeText: { color: COLORS.text, fontSize: 12, fontWeight: '700' },

  pill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  pillText: { fontSize: 12, fontWeight: '700' },
});
