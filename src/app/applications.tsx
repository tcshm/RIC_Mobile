
// app/applications.tsx
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
    StatusBar,
    StyleSheet,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PageTitle from '../components/common/PageTitle';
import TCSHeader from '../components/common/TCSHeader';

const COLORS = {
  blue700: '#0046BE',
  bg: '#dcdcdcff',
  cardBG: '#FFFFFF',
  text: '#1F2937',
  muted: '#6B7280',
  green: '#22C55E',
};

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
export default function ApplicationsScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.blue700} />

      <TCSHeader showBack />
      <PageTitle title="Applications" />

      <View style={styles.content} />
    </SafeAreaView>
  );
}

/* ---------------- styles co-located ---------------- */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },

  // Content
  content: { flex: 1 },
});
