
// app/appointments.tsx
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PageTitle from '../components/common/PageTitle';
import TCSHeader from '../components/common/TCSHeader';

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
  diy: <CommunityIcon name='wrench' />,
  person: <CommunityIcon name="account" />, // server for network AND server
};

const COLORS = {
  blue700: '#0046BE',
  blue600: '#0B57D0',
  bg: '#dcdcdcff',
  cardBG: '#FFFFFF',
  text: '#1F2937',
  muted: '#6B7280',
};

type Appointment = {
  id: string;
  title: string;
  subTitle: string;
  when: string;
  icon?: React.ReactNode;
  /** Extra descriptive details for the modal */
  details?: string;
};

const APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-001',
    title: 'Site Visit - Field Tech Engineer',
    subTitle: 'POS Terminal Hardware Replacement',
    when: 'Today at 12:00 PM',
    icon: NetIcons.diy,
    details:
      'POS terminal hardware failure. Tech is scheduled for replacement at 12 PM.',
  },
  {
    id: 'apt-002',
    title: 'ISP Technician',
    subTitle: 'AT&T Link Restoration',
    when: 'Today at 1:00 PM',
    icon: NetIcons.diy,
    details: 'AT&T technician visit to store to check ISP device for restoring the primary link.',
  },
  {
    id: 'apt-003',
    title: 'Third Party Technician',
    subTitle: 'Network Access Point-004 Replacement',
    when: 'Today at 2:00 PM',
    icon: NetIcons.diy,
    details:
      'Access point A004 is offline. Remote troubleshooting indicates issue with AP itself.',
  },
  {
    id: 'apt-004',
    title: 'John Martinez',
    subTitle: 'Laptop Setup',
    when: 'Today at 3:30 PM',
    icon: NetIcons.person,
    details:
      'New hire device imaging, security baseline application, and profile setup.',
  },
  {
    id: 'apt-005',
    title: 'Sarah Chen',
    subTitle: 'Phone Screen Repair',
    when: 'Tomorrow at 11:00 AM',
    icon: NetIcons.person,
    details: 'Device screen cracked. Part in stock; 45-minute repair slot.',
  },
];

export default function AppointmentsScreen() {
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [visible, setVisible] = useState(false);

  const openDetails = (apt: Appointment) => {
    setSelected(apt);
    setVisible(true);
  };
  const closeDetails = () => {
    setVisible(false);
    setSelected(null);
  };

  const onViewAllAppointments = () => {
    // TODO: wire this to navigation if needed (e.g., navigation.navigate('Appointments'))
    // For now, we’ll just close the modal.
    closeDetails();
  };

  const data = useMemo(() => APPOINTMENTS, []);

  // Format "Today at 12:00 PM" => "Today 12:00 PM" to match the screenshot
  const formatWhen = (when?: string) =>
    (when ?? '').replace(' at ', ' ');

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.blue700} />
      <TCSHeader showBack />
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={<PageTitle title="Appointments" />}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.itemCard}
            onPress={() => openDetails(item)}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={`Open appointment ${item.id}: ${item.title}`}
          >
            <View style={styles.itemIconWrap}>
              <Text style={styles.itemIcon}>{item.icon ?? '🔧'}</Text>
            </View>

            <View style={styles.itemTextWrap}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemSubBlue}>{item.subTitle}</Text>
              <Text style={styles.itemWhen}>{item.when}</Text>
            </View>
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
      />

      {/* Details modal — styled to match the landing page pop-up */}
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={closeDetails}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {/* Pop-up header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderTitle}>Appointments</Text>
              <Pressable
                onPress={closeDetails}
                accessibilityRole="button"
                accessibilityLabel="Close appointment details"
                hitSlop={8}
              >
                <Text style={styles.modalCloseIcon}>✕</Text>
              </Pressable>
            </View>

            {/* Content block */}
            <View style={styles.modalContent}>
              <Text style={styles.modalSectionLabel}>NEXT APPOINTMENT</Text>

              {!!selected?.when && (
                <Text style={styles.modalTime}>{formatWhen(selected?.when)}</Text>
              )}

              {!!selected?.title && (
                <Text style={styles.modalItemTitle}>{selected?.title}</Text>
              )}

              {!!selected?.subTitle && (
                <Text style={styles.modalItemSub}>{selected?.subTitle}</Text>
              )}

              {!!selected?.details && (
                <Text style={styles.modalItemDesc}>{selected?.details}</Text>
              )}

              <TouchableOpacity
                onPress={onViewAllAppointments}
                activeOpacity={0.8}
                accessibilityRole="link"
                accessibilityLabel="View all appointments"
              >
                <Text style={styles.modalLinkText}>View all appointments</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/* ---------------- styles ---------------- */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },

  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    rowGap: 10,
  },

  // Item card
  itemCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBG,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 14,
    shadowColor: '#101828',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  itemIconWrap: {
    width: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  itemIcon: { fontSize: 20 },
  itemTextWrap: { flex: 1 },
  itemTitle: { color: COLORS.text, fontSize: 15, fontWeight: '700', lineHeight: 20 },
  itemSubBlue: { color: COLORS.blue600, fontWeight: '500' },
  itemWhen: { color: COLORS.muted, fontSize: 13, marginTop: 4 },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(16,24,40,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden', // ensure header rounded corners
    shadowColor: '#101828',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },

  // Pop-up header (blue strip with title and X)
  modalHeader: {
    backgroundColor: COLORS.blue700,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  modalHeaderTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  modalCloseIcon: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },

  // Content area to match screenshot style
  modalContent: {
    padding: 16,
    gap: 6,
  },
  modalSectionLabel: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  modalTime: {
    color: COLORS.blue700,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  modalItemTitle: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '700',
    marginTop: 4,
  },
  modalItemSub: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '500',
  },
  modalItemDesc: {
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  modalLinkText: {
    color: COLORS.blue600,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 8,
  },
});
