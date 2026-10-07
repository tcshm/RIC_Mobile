
import React from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PageTitle from '../../components/common/PageTitle';
import TCSHeader from '../../components/common/TCSHeader';

const COLORS = {
  blue700: '#0046BE',
  bg: '#dcdcdcff',
  cardBG: '#FFFFFF',
  text: '#1F2937',
  muted: '#6B7280',
  green: '#22C55E',
};

import { MaterialCommunityIcons } from '@expo/vector-icons';
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
  camera: <CommunityIcon name='camera' />,
};

type CameraItem = { id: string; name: string; location: string; status: 'green' };


const CAM_LIST: CameraItem[] = [
  { id: 'c-01', name: 'Security Camera 01', location: 'Front Entrance', status: 'green' },
  { id: 'c-02', name: 'Security Camera 02', location: 'Back Entrance', status: 'green' },
  { id: 'c-03', name: 'Security Camera 03', location: 'Sales Floor - East', status: 'green' },
  { id: 'c-04', name: 'Security Camera 04', location: 'Sales Floor - West', status: 'green' },
  { id: 'c-05', name: 'Security Camera 05', location: 'Sales Floor', status: 'green' },
  { id: 'c-06', name: 'Security Camera 06', location: 'Checkout Area', status: 'green' },
];

export default function CamerasScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.blue700} />

      {/* Header */}
      <TCSHeader showBack />
      <PageTitle title="Cameras" />

      {/* List */}
      <View style={styles.content}>
        {CAM_LIST.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.leftIconWrap}>
              <Text style={styles.leftIcon}>{NetIcons.camera}</Text>
            </View>
            <View style={styles.textWrap}>
              <View style={styles.titleRow}>
                <Text style={styles.itemTitle}>{item.name}</Text>
                <StatusDot />
              </View>
              <Text style={styles.itemSub}>{item.location}</Text>
            </View>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

/* ---------- Status Dot (always green) ---------- */
function StatusDot() {
  return <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.green }} />;
}

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },

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
  },
  leftIconWrap: { width: 34, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  leftIcon: { fontSize: 20 },
  textWrap: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
   itemTitle: { color: COLORS.text, fontSize: 15, fontWeight: '700' },
  itemSub: { color: COLORS.muted, fontSize: 13, marginTop: 4 },
})