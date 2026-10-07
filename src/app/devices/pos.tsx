
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import PageTitle from '../../components/common/PageTitle';
import TCSHeader from '../../components/common/TCSHeader';

const COLORS = {
  blue700: '#0046BE',
  bg: '#dcdcdcff',
  cardBG: '#FFFFFF',
  text: '#1F2937',
  muted: '#6B7280',
  green: '#22C55E',
  yellow: '#F59E0B',
  red: '#EF4444',
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

const NetIcons = {
  pos: <CommunityIcon name='typewriter' />,
};

type PosItem = {
  id: string;
  name: string;        // POS Terminal 01
  location: string;    // Checkout 1
  status: 'green' | 'yellow' | 'red';
  incident?: boolean;
};

const POS_LIST: PosItem[] = [
  { id: 'pos-01', name: 'POS Terminal 01', location: 'Checkout 1', status: 'green' },
  { id: 'pos-02', name: 'POS Terminal 02', location: 'Checkout 2', status: 'green' },
  { id: 'pos-03', name: 'POS Terminal 03', location: 'Checkout 3', status: 'yellow', incident: true }, // ✅ has INC
  { id: 'pos-04', name: 'POS Terminal 04', location: 'Checkout 4', status: 'green' },
  { id: 'pos-05', name: 'POS Terminal 05', location: 'Customer Service', status: 'green' },
  { id: 'pos-06', name: 'POS Terminal 06', location: 'Electronics', status: 'green' },
];

export default function PosTerminalsScreen() {
  const params = useLocalSearchParams<{ highlight?: string; highlightStatus?: string }>();
  const highlight = params.highlight ?? null;
  const highlightStatus = (params.highlightStatus ?? null) as 'green' | 'yellow' | null;

  // Pulsing opacity for the highlighted card
  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (!highlight) { pulseAnim.setValue(1); return; }
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.35, duration: 650, useNativeDriver: false }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 650, useNativeDriver: false }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [highlight]);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.blue700} />

      {/* Header */}
      <TCSHeader showBack />
        <PageTitle title="POS Terminals" />
      {/* List */}
      <View style={styles.content}>
        {POS_LIST.map((item) => {
          const isHighlighted = highlight === item.id;
          const displayStatus: 'green' | 'yellow' | 'red' =
            isHighlighted && highlightStatus ? highlightStatus : item.status;
          const borderColor = displayStatus === 'yellow' ? COLORS.yellow : COLORS.green;

          const cardEl = (
            <TouchableOpacity
              key={`card-${item.id}`}
              style={[
                styles.card,
                isHighlighted && {
                  borderWidth: 2.5,
                  borderColor,
                  shadowColor: borderColor,
                  shadowOpacity: 0.55,
                  shadowRadius: 10,
                  elevation: 8,
                },
              ]}
              activeOpacity={0.85}
              onPress={() => {}}
            >
              <View style={styles.leftIconWrap}>
                <Text style={styles.leftIcon}>{NetIcons.pos}</Text>
              </View>

              <View style={styles.textWrap}>
                <View style={styles.titleRow}>
                  <Text style={styles.itemTitle}>{item.name}</Text>
                  <StatusDot status={displayStatus} highlighted={isHighlighted} />
                </View>
                <Text style={styles.itemSub}>{item.location}</Text>
              </View>

              {item.incident ? (
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: '/incidents/[id]',
                      params: { id: 'INC00001235' },
                    })
                  }
                  style={styles.incBadge}
                  activeOpacity={0.85}
                  accessibilityRole="button"
                  accessibilityLabel="Open incident INC00004567"
                >
                  <Text style={styles.incBadgeText}>INC</Text>
                </TouchableOpacity>
              ) : null}
            </TouchableOpacity>
          );

          return isHighlighted ? (
            <Animated.View key={item.id} style={{ opacity: pulseAnim, width: '100%', maxWidth: 420 }}>
              {cardEl}
            </Animated.View>
          ) : (
            <View key={item.id} style={{ width: '100%', maxWidth: 420 }}>
              {cardEl}
            </View>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

/* ---------- Status Dot ---------- */
function StatusDot({ status, highlighted }: { status: 'green' | 'yellow' | 'red'; highlighted?: boolean }) {
  const bg =
    status === 'green' ? COLORS.green :
    status === 'yellow' ? COLORS.yellow : COLORS.red;
  const size = highlighted ? 13 : 10;
  return (
    <View
      style={[
        { width: size, height: size, borderRadius: size / 2, backgroundColor: bg },
        highlighted && { shadowColor: bg, shadowOpacity: 0.9, shadowRadius: 6, elevation: 5 },
      ]}
    />
  );
}

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },

  header: {
    backgroundColor: COLORS.blue700,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  backBtn: { paddingVertical: 6, paddingRight: 8, paddingLeft: 2, marginRight: 6 },
  backIcon: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
  brandLogo: { width: 120, height: 32 },
  headerTitle: { color: '#000000', fontSize: 20, fontWeight: '700', marginTop: 10 },

  content: { flex: 1, paddingHorizontal: 16, paddingTop: 12, alignItems: 'center' },

  card: {
    width: '100%',
    maxWidth: 420,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBG,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginBottom: 10,
    // shadow
    shadowColor: '#101828',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
    position: 'relative',
  },
  leftIconWrap: { width: 34, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  leftIcon: { fontSize: 20 },
  textWrap: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  itemTitle: { color: COLORS.text, fontSize: 15, fontWeight: '700' },
  itemSub: { color: COLORS.muted, fontSize: 13, marginTop: 4 },

  incBadge: {
    position: 'absolute',
    right: 35,
    top: 8,
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  incBadgeText: { color: '#FFFFFF', fontWeight: '700', fontSize: 11 },
});
