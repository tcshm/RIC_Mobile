
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { type ComponentProps } from 'react';
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
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

// Type for valid MaterialCommunityIcons names
type MdiName = ComponentProps<typeof MaterialCommunityIcons>['name'];

// Helper to render icons consistently (with optional top padding)
const CommunityIcon = ({
  name,
  size = 22,
  color = '#254dc5',
  paddingTop = 6,
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

type DIYCard = {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode; // ← changed from string to ReactNode
  slug: string;
};

const CARDS: DIYCard[] = [
  {
    id: 'g1',
    title: 'How to Reset POS Terminal',
    subtitle: 'Self-help guide',
    icon: <CommunityIcon name="hammer-wrench" />, 
    slug: 'reset-pos-terminal',
  },
  {
    id: 'g2',
    title: 'Printer Setup Guide',
    subtitle: 'Network',
    icon: <CommunityIcon name="printer" />, 
    slug: 'printer-setup',
  },
];

export default function DIYHomeScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.blue700} />

      {/* TCS header (no DIY title inside header) */}
      <TCSHeader showBack />

      {/* Centered hero block below header */}
      <View style={styles.hero}>
        {/* If you want a hero icon, you can use:
            <View style={{ marginTop: 2 }}>
              <MaterialCommunityIcons name="tools" size={28} color={COLORS.blue700} />
            </View>
        */}
        <Text style={styles.heroTitle}>DIY Companion</Text>
        <Text style={styles.heroSub}>Self-help guides and troubleshooting</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Start Virtual Assistant Support */}
        <TouchableOpacity
          style={styles.primaryBtn}
          activeOpacity={0.85}
          onPress={() => router.push('/diy/assistant')}
          accessibilityRole="button"
          accessibilityLabel="Start Virtual Assistant Support"
        >
          
          <Text style={styles.primaryBtnIcon}>🤖</Text>
          <Text style={styles.primaryBtnText}>Start Virtual Assistant Support</Text>
        </TouchableOpacity>

        {/* Guide cards */}
        <View style={styles.list}>
          {CARDS.map((c) => (
            <TouchableOpacity
              key={c.id}
              style={styles.card}
              activeOpacity={0.85}
              onPress={() => {
                if (c.slug === 'printer-setup') {
                  router.push('/diy/printer-setup');
                } else if (c.slug === 'reset-pos-terminal') {
                  router.push('/diy/reset-pos-terminal');
                } else {
                  router.push({ pathname: '/diy/[slug]', params: { slug: c.slug } });
                }
              }}
              accessibilityRole="button"
              accessibilityLabel={`${c.title}, ${c.subtitle}`}
            >
              <View style={styles.cardIconWrap}>
                {/* Render React element (icon) inside View instead of Text */}
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>{c.icon}</View>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{c.title}</Text>
                <Text style={styles.cardSub}>{c.subtitle}</Text>
              </View>

              <Text style={styles.chev}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


/* ---------------- styles ---------------- */
const CIRCLE_SIZE = 42;
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },

  hero: { alignItems: 'center', paddingHorizontal:16, paddingVertical: 14 },
  // heroIcon: { fontSize: 28},
  heroTitle: { fontSize: 20, fontWeight: '700', color: COLORS.text, marginTop: 6 },
  heroSub: { fontSize: 12.5, color: COLORS.muted, marginTop: 2, marginBottom:10 },

  content: { paddingHorizontal: 16, paddingBottom: 24, alignItems: 'center' },
  primaryBtn: {
    width: '100%', maxWidth: 420,
    backgroundColor: COLORS.blue600,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 16,
    flexDirection: 'row', alignItems: 'center', gap: 10,
    shadowColor: '#101828', shadowOpacity: 0.12, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 3,
  },
  primaryBtnIcon: { fontSize: 18, color: '#fff' },
  primaryBtnIconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1, // small visual alignment tweak
  },

  primaryBtnText: { color: '#FFFFFF', fontWeight: '700' },

  list: { width: '100%', maxWidth: 420, marginTop: 16, gap: 20 },
  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.cardBG, borderRadius: 14,
    paddingHorizontal: 12, paddingVertical: 12,
    shadowColor: '#101828', shadowOpacity: 0.12, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 3,
  },
  cardIconWrap: {
       width: 36, height: 44, borderRadius: 8, backgroundColor: '#EEF2FF',
    alignItems: 'center', justifyContent: 'center', marginRight: 10,
  },
  cardIcon: { fontSize: 22 },
  cardTitle: { color: COLORS.text, fontSize: 16, fontWeight: '700' },
  cardSub: { color: COLORS.muted, fontSize: 13.5, marginTop: 2 },
  chev: { color: COLORS.muted, fontSize: 26, marginLeft: 8 },
})