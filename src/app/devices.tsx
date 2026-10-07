
// app/devices.tsx
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { memo } from 'react';
import {
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PageTitle from '../components/common/PageTitle';
import TCSHeader from '../components/common/TCSHeader';

/* ---------- Theme ---------- */
const COLORS = {
  blue700: '#0046BE',
  bg: '#dcdcdcff',
  cardBG: '#FFFFFF',
  text: '#1F2937',
  muted: '#6B7280',
};

/** Small helper so the icon usage stays terse/consistent */
const CommunityIcon = ({
  name,
  size = 32,
  color = '#254dc5',
}: {
  name: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  size?: number;
  color?: string;
}) => <MaterialCommunityIcons name={name} size={size} color={color} />;

/** Use community icons instead of direct icons/emojis */
const NetIcons = {
  pos: <CommunityIcon name="typewriter" />,
  printer: <CommunityIcon name="printer" />,
  rfGun: <CommunityIcon name="remote" />,
  register: <CommunityIcon name="note-edit" />, // server for network AND server
};

type Status = 'green' | 'yellow' | 'red';

type Tile = {
  title: string;
  icon: React.ReactNode;
  route: string;
  status?: Status;
};

const tiles: Tile[] = [
  { title: 'POS', icon: NetIcons.pos, route: '/devices/pos', status: 'yellow' },
  { title: 'Printers', icon: NetIcons.printer, route: '/devices/printers', status: 'green' },
  { title: 'RF Guns', icon: NetIcons.rfGun, route: '/devices/rf-guns', status: 'green' },
  { title: 'Cash Registers', icon: NetIcons.register, route: '/devices/registers', status: 'yellow' },
];

export default function DevicesScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.blue700} />

      <TCSHeader showBack />
      <PageTitle title="Devices" />

      {/* Tiles grid */}
      <View style={styles.content}>
        <View style={styles.grid}>
          {tiles.map((t) => (
            <TouchableOpacity
              key={t.title}
              style={styles.tile}
              activeOpacity={0.85}
              onPress={() => router.push(t.route as any)}
              accessibilityRole="button"
              accessible
              accessibilityLabel={`${t.title}${t.status ? `, status ${t.status}` : ''}`}
            >
              <View style={styles.tileHeader}>
                {t.status ? <StatusDot status={t.status} /> : <View style={{ width: 10 }} />}
              </View>

              {/* Use a View wrapper for icons (not Text) */}
              <View style={styles.tileIconBox}>{t.icon}</View>

              <Text style={styles.tileLabel}>{t.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

/* ---------- Status Dot (Tile) ---------- */
const StatusDot = memo(function StatusDot({ status }: { status: Status }) {
  const bg =
    status === 'green' ? '#22C55E' :
    status === 'yellow' ? '#F59E0B' : '#EF4444';
  return <View style={[styles.statusDot, { backgroundColor: bg }]} />;
});

/* ---------- Reusable List Page for each device type ---------- */
export type DeviceItem = {
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
  status?: Status;
  incident?: string;
  incidentId?: string;
  onPress?: () => void;
};

export function DeviceListScreen({ pageTitle, items }: { pageTitle: string; items: DeviceItem[] }) {
  return (
    <SafeAreaView style={styles.safe}>
      <TCSHeader showBack />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 16 }}
      >
        <PageTitle title={pageTitle} />

        {/* ❌ was <view> ... </view> causing the crash */}
        <View style={styles.content}>
          <View style={{ paddingHorizontal: 16, width: '100%' }}>
            {items.map((item, idx) => {
              const dotColor =
                item.status === 'green' ? '#22C55E' :
                item.status === 'yellow' ? '#F59E0B' :
                item.status === 'red' ? '#EF4444' : undefined;

              // --- Render icon helper ---
              const renderIcon = () => {
                // If it's a valid React element (e.g., <CommunityIcon .../>), return as-is.
                if (React.isValidElement(item.icon)) return item.icon;

                // If it's a string (e.g., 'printer'), render via MDI
                if (typeof item.icon === 'string') {
                  return (
                    <MaterialCommunityIcons
                      name={item.icon as any}
                      size={28}
                      color="#254dc5"
                    />
                  );
                }

                // Fallback: printer icon
                return <MaterialCommunityIcons name="printer" size={28} color="#254dc5" />;
              };

              return (
                <TouchableOpacity
                  key={`${item.title}-${idx}`}
                  style={styles.card}
                  activeOpacity={0.9}
                  onPress={item.onPress}
                  accessibilityRole="button"
                  accessible
                  accessibilityLabel={`${item.title}${item.status ? `, status ${item.status}` : ''}${item.incident ? ', has incident' : ''}`}
                >
                  {/* Status dot (top-right) */}
                  {dotColor ? (
                    <View style={[styles.statusDotCard, { backgroundColor: dotColor }]} />
                  ) : (
                    <View style={[styles.statusDotCard, { opacity: 0 }]} />
                  )}

                  {/* Left icon */}
                  <View style={styles.leftIconWrap}>
                    <View style={[styles.leftIconBox]}>
                      {renderIcon()}
                    </View>
                  </View>

                  {/* Title + subtitle */}
                  <View style={styles.textWrap}>
                    <View style={styles.titleRow}>
                      <Text style={styles.itemTitle}>{item.title}</Text>

                      {/* Pressable INC pill (navigates only if incidentId present) */}
                      {item.incident ? (
                        <Pressable
                          onPress={() => {
                            if (item.incidentId) {
                              router.push({
                                pathname: '/incidents/[id]',
                                params: { id: item.incidentId },
                              });
                            }
                          }}
                          style={styles.incBadge}
                          accessibilityRole="button"
                          accessibilityLabel={`Open incident ${item.incidentId ?? ''}`}
                        >
                          <Text style={styles.incBadgeText}>{item.incident}</Text>
                        </Pressable>
                      ) : null}
                    </View>

                    <Text style={styles.itemSub}>{item.subtitle}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },

  content: { flex: 1, paddingHorizontal: 16, paddingTop: 12, alignItems: 'flex-start' },

  card: {
    width: '100%',
    maxWidth: 540,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBG,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginBottom: 10,
    shadowColor: '#101828',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
    position: 'relative',
  },
  leftIconWrap: { width: 34, alignItems: 'center', justifyContent: 'center', marginRight: 10 },

  // wrappers for icons (avoid putting icon elements inside Text)
  leftIconBox: { alignItems: 'center', justifyContent: 'center' },
  tileIconBox: { alignItems: 'center', justifyContent: 'center', marginTop: 2, height: 32 },

  leftIcon: { fontSize: 22 },
  textWrap: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  itemTitle: { color: COLORS.text, fontSize: 15, fontWeight: '700' },
  itemSub: { color: COLORS.muted, fontSize: 13, marginTop: 4 },

  incBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    right: 25,
    top: -4,
  },
  incBadgeText: { color: '#FFFFFF', fontWeight: '700', fontSize: 11 },

  grid: {
    width: '100%',
    maxWidth: 540,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  tile: {
    width: '48%',
    backgroundColor: COLORS.cardBG,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginBottom: 12,
    shadowColor: '#101828',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  tileHeader: { width: '100%', alignItems: 'flex-end', marginBottom: 4 },
  statusDot: { width: 10, height: 10, borderRadius: 5 }, // for tiles
  tileLabel: { color: COLORS.text, fontSize: 14, fontWeight: '700', textAlign: 'center', marginTop: 8 },

  // status dot for list cards (top-right)
  statusDotCard: {
    position: 'absolute',
    right: 12,
    top: 12,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
