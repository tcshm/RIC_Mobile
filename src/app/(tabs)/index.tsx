import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Href, router } from 'expo-router';
import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ActionCard from '../../components/home/ActionCard';
import Header from '../../components/home/Header';
import StoreHealthCard from '../../components/home/StoreHealthCard';

const colors = {
  bg: '#dcdcdcff',
  blue700: '#1566f1ff', //#0046BE
  blue600: '#0B57D0',
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
  alert: <CommunityIcon name="bell" />,
  appointment: <CommunityIcon name="calendar" />,
  notification: <CommunityIcon name="message-alert" />,
  devices: <CommunityIcon name="devices" />,
  application: <CommunityIcon name="apps" />,
  network: <CommunityIcon name="server" />,
  diy: <CommunityIcon name='wrench' />,
  incident: <CommunityIcon name="alert" color='#f7c706' />, // server for network AND server
  major: <CommunityIcon name='information-outline' color='#f70606'/>
};


// --- Next appointment preview for the modal ---
const NEXT_APPOINTMENT = {
  title: 'Site Visit - Field Tech Engineer',
  reason: 'POS Terminal Hardware Replacement',
  when: 'Today 12:00 PM',
  note: 'POS terminal hardware failure. Tech is scheduled for replacement at 12 PM.',
};

// --- Latest notification preview for the modal ---
const LATEST_NOTIFICATION = {
  title:
    'Network maintenance activity scheduled tonight at 1 AM - No action needed from stores',
  
};

type MidCard = {
  title: string;
  icon: string;
  route?: Href;
};

export default function HomeScreen() {
  const userName = 'Saurabh';
  const storeInfo = { number: '#1234', city: 'Chennai, IN' };

  // ---- Modal state
  const [aptVisible, setAptVisible] = useState(false);
  const [notifVisible, setNotifVisible] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false); // NEW

  // ---- Handlers to open preview modals
  const openAppointmentsPreview = () => setAptVisible(true);
  const openNotificationsPreview = () => setNotifVisible(true);
  const openFeedbackPreview = () => setFeedbackVisible(true); // NEW

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right', 'bottom']}>
      {/* <StatusBar barStyle="light-content" backgroundColor={colors.blue700} /> */}
      <StatusBar barStyle="dark-content" backgroundColor="#ECECEC" translucent={false} />

      <Header
        compact
      />

      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        
 <View style={styles.welcomePanel} accessible accessibilityRole="summary">
    <Text style={styles.welcomeText} numberOfLines={1}>
      Welcome back <Text style={styles.welcomeName}>{userName}</Text>!
    </Text>

    <View style={styles.infoRow}>
      <Text style={styles.storeText} numberOfLines={1}>
        Store: {storeInfo.number}
      </Text>
      <Text style={styles.storeDivider} accessibilityElementsHidden>
        •
      </Text>
      <Text style={styles.storeSub} numberOfLines={1}>
        {storeInfo.city}
      </Text>
    </View>
  </View>

        {/* Store Health */}
        <StoreHealthCard
          // onPressStatus={() => {
          //   // Redirect to Active Incidents with heading "Health Status"
          //   router.push({
          //     pathname: '/incidents',
          //     params: { heading: 'Health Status' },
          //   } as any);
          // }}
        />

        {/* ---------- Quick actions: 3-UP single row ---------- */}
        
{/* -------- Row 1: Small 3-up (unchanged) -------- */}
<View style={[styles.gridRow, styles.gridRowNoWrap]}>
  {/* Alerts navigates directly */}
  <ActionCard
    title="Alerts"
    icon={NetIcons.alert}
    badge={6}
    cols={3}
    compact
    onPress={() => router.push('/alerts' as Href)}
  />

  {/* Appointments opens preview modal */}
  <ActionCard
    title="Appointments"
    icon={NetIcons.appointment}
    badge={5}
    cols={3}
    compact
    onPress={openAppointmentsPreview}
  />

  {/* Notifications opens preview modal */}
  <ActionCard
    title="Notifications"
    icon={NetIcons.notification}
    badge={10}
    cols={3}
    compact
    onPress={openNotificationsPreview}
  />
</View>

{/* -------- Row 2: 2-up -> Active Incidents & Major Incidents -------- */}
<View style={[styles.gridRow, { alignItems: 'stretch' }]}>
  <View style={{ flex: 1 }}>
    <ActionCard
      title="Active Incidents"
      icon={NetIcons.incident}
      badge={4}
      onPress={() => router.push('/incidents' as any)}
    />
  </View>

  <View style={{ flex: 1 }}>
    <ActionCard
      title="Major Incidents"
      icon={NetIcons.major /* or NetIcons.majorIncident if that's your key */}
      badge={0}
      showZero
      onPress={() => router.push('/major-incidents' as any)}
    />
  </View>
</View>


{/* -------- Row 3: EXACTLY like Row 1 (3-up compact) -------- */}
<View style={[styles.gridRow, styles.gridRowNoWrap]}>
  <ActionCard
    title="Devices"
    icon={NetIcons.devices}
    cols={3}
    compact
    onPress={() => router.push('/devices' as any)}
  />

  <ActionCard
    title="Applications"
    icon={NetIcons.application}
    cols={3}
    compact
    onPress={() => router.push('/applications' as any)}
  />

  <ActionCard
    title="N/w & Server"
    icon={NetIcons.network}
    cols={3}
    compact
    onPress={() => router.push('/network' as any)}
  />
</View>


{/* -------- Row 4: Full-width DIY Companion -------- */}
<View style={styles.gridRow}>
  <ActionCard
    title="DIY Companion"
    icon={NetIcons.diy}
    full
    onPress={() => router.push('/diy' as any)}
  />
</View>






        {/* ----------- NEW: Feedback Card (bottom) ----------- */}
        <View style={styles.gridRow}>
          <Pressable style={styles.feedbackCard} onPress={openFeedbackPreview}>
            <Text style={styles.feedbackTitle}>Feedback</Text>
            {/* No icon as requested */}
          </Pressable>
        </View>
      </ScrollView>

      {/* ---------------- Appointments Preview Modal ---------------- */}
      <Modal
        visible={aptVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAptVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {/* Header bar */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>Appointments</Text>
              <Pressable onPress={() => setAptVisible(false)}>
                <Text style={styles.closeX}>✕</Text>
              </Pressable>
            </View>

            {/* Body content */}
            <View style={styles.modalBody}>
              <Text style={styles.nextLabel}>NEXT APPOINTMENT</Text>
              <Text style={styles.whenText}>{NEXT_APPOINTMENT.when}</Text>
              <Text style={styles.titleText}>{NEXT_APPOINTMENT.title}</Text>
              <Text style={styles.subTitle}>{NEXT_APPOINTMENT.reason}</Text>
              <Text style={styles.noteText}>{NEXT_APPOINTMENT.note}</Text>
            </View>

            {/* Footer CTA */}
            <Pressable
              style={styles.viewAllBtn}
              onPress={() => {
                setAptVisible(false);
                router.push('/appointments' as Href);
              }}
            >
              <Text style={styles.viewAllText}>View all appointments</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* ---------------- Notifications Preview Modal ---------------- */}
      <Modal
        visible={notifVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setNotifVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {/* Header bar */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>Notifications</Text>
              <Pressable onPress={() => setNotifVisible(false)}>
                <Text style={styles.closeX}>✕</Text>
              </Pressable>
            </View>

            {/* Body content */}
            <View style={styles.modalBody}>
              <Text style={styles.nextLabel}>LATEST NOTIFICATION</Text>
              <Text style={styles.titleText}>{LATEST_NOTIFICATION.title}</Text>
              {/* <Text style={styles.noteText}>{LATEST_NOTIFICATION.detail}</Text> */}
            </View>

            {/* Footer CTA */}
            <Pressable
              style={styles.viewAllBtn}
              onPress={() => {
                setNotifVisible(false);
                router.push('/notifications' as Href);
              }}
            >
              <Text style={styles.viewAllText}>View all notifications</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* ---------------- NEW: Feedback Modal ---------------- */}
      <Modal
        visible={feedbackVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setFeedbackVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>

            {/* Body content */}
            <View style={styles.modalBody}>
              <Text style={styles.titleText}>Feedback</Text>
              <Text style={styles.noteText}>Feedback form would open here</Text>
            </View>

            {/* Bottom-right Close button */}
            <View style={styles.modalBottomBar}>
              <Pressable
                style={styles.modalRightCloseBtn}
                onPress={() => setFeedbackVisible(false)}
              >
                <Text style={styles.modalRightCloseText}>OK</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/* ---------------- styles co-located ---------------- */
const styles = StyleSheet.create({
  safe: { 
    flex: 1, 
    backgroundColor: colors.bg 
  },
  contentContainer: { 
    padding: 16, 
    alignItems: 'center' 
  },
  
welcomePanel: {
    alignSelf: 'stretch',      // ensures full width even when alignItems:'center'
    backgroundColor: colors.bg,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  welcomeText: {
    color: 'rgb(16, 71, 200)', // slate-900 #0F172A
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  welcomeName: {
    fontWeight: '900',
    color: 'rgb(16, 71, 200)',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
  },
  storeText: {
    color: '#3e4d63', // slate-700  #334155
    fontSize: 14,
    fontWeight: '600',
  },
  storeDivider: {
    marginHorizontal: 8,
    color: '#94A3B8', // slate-400
    fontSize: 14,
  },
  storeSub: {
    color: '#3e4d63', // match "Store: #1025" text
    fontSize: 13,
  },


  gridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    width: '100%',
    maxWidth: 420,
    marginTop: 16,
  },
  gridRowNoWrap: {
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
  },

  // Modal styles (shared)
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(16,24,40,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#101828',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  modalHeader: {
    backgroundColor: colors.blue600,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalHeaderText: { 
    color: '#FFFFFF', 
    fontSize: 16, 
    fontWeight: '700' 
  },
  closeX: { 
    color: '#FFFFFF', 
    fontSize: 18, 
    fontWeight: '700' 
  },
  modalBody: { 
    padding: 16 
  },
  nextLabel: { 
    color: colors.muted, 
    fontSize: 12, 
    fontWeight: '700', 
    marginBottom: 8 
  },
  whenText: { 
    color: colors.blue600, 
    fontSize: 14, 
    fontWeight: '700' 
  },
  titleText: { 
    color: colors.text, 
    fontSize: 16, 
    fontWeight: '700', 
    marginTop: 6 
  },
  subTitle: { 
    color: colors.text, 
    fontSize: 14, 
    marginTop: 4 
  },
  noteText: { 
    color: colors.text, 
    fontSize: 13, 
    marginTop: 8 
  },
  viewAllBtn: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  viewAllText: { 
    color: colors.blue600, 
    fontWeight: '700' 
  },

  // -------- NEW: Feedback Card styles --------
  feedbackCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: colors.blue600, // Blue background as requested
    marginTop: 14
  },
  feedbackTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },

  // -------- NEW: Feedback Modal bottom-right close --------
  modalBottomBar: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalRightCloseBtn: {
    backgroundColor: colors.blue600,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  modalRightCloseText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  
scroll: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  infoContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  infoContainerCompact: {
    paddingVertical: 8,
  },

  /** Text styles */
  welcome: {
    color: '#0F172A', // slate-900
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  welcomeCompact: {
    fontSize: 16,
    marginBottom: 4,
  },
  name: {
    fontWeight: '900',
    color: '#0F172A',
  },
  storeTextCompact: {
    fontSize: 12,
    fontWeight: '700',
  },
  storeDividerCompact: {
    marginHorizontal: 6,
    fontSize: 12,
  },
  storeSubCompact: {
    fontSize: 11,
  },

  /** Demo cards for scroll area */
  spacer: { height: 12 },
  card: {
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E7EB',
    padding: 12,
    backgroundColor: '#FAFAFA',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  cardText: {
    fontSize: 13,
    color: '#475569',
  },

});