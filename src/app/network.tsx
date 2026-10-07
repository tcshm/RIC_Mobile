// app/network.tsx
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    Modal,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import TCSHeader from '../components/common/TCSHeader';

const COLORS = {
  blue700: '#0046BE',
  blue600: '#0B57D0',
  bg: '#dcdcdcff',
  cardBG: '#FFFFFF',
  text: '#1F2937',
  muted: '#6B7280',
  green: '#22C55E',
  yellow: '#F59E0B',
  red: '#EF4444',
  divider: '#E5E7EB',
};

type Status = 'green' | 'yellow' | 'red';
type WiredConnection = { id: string; name: string; status: Status };
type AccessPoint = {
  id: string;
  name: string;       // e.g., AP-004
  location: string;   // e.g., Back Office
  port: string;       // e.g., 11
  incidents?: { id: string; title: string }[];
  status: Status;
};


const NetIcons = {
  router: <MaterialCommunityIcons name="router-wireless" size={22} color="#4291ce" />,
  switch: <MaterialCommunityIcons name="server-network" size={22} color="#4291ce" />,
  primaryLink: <MaterialCommunityIcons name="link" size={22} color="#4291ce" />,
  wifiIcon:<MaterialCommunityIcons name="wifi" size={22} color="#4291ce" />
};

/* ---------- Demo Data ---------- */

const WIRED_TILES = [
  { id: 'r1', label: 'RN01234N001-1', sub: 'Primary Router', status: 'green' as Status, icon: 'router' },
  { id: 'r2', label: 'RN01234N001-2', sub: 'Secondary Router', status: 'green' as Status, icon: 'router' },
  { id: 's1', label: 'SW01234N201', sub: 'Main Switch', status: 'green' as Status, icon: '🔀' },
  { id: 's2', label: 'SW01234N301', sub: 'Back Office Switch', status: 'green' as Status, icon: '🔀' },
  { id: 's3', label: 'SW01234N004', sub: 'First Floor Switch', status: 'green' as Status, icon: '🔀' },
];

const WIRED_CONNECTIONS: WiredConnection[] = [
  { id: 'wc-1', name: 'RN01234N001-1', status: 'green' },
  { id: 'wc-2', name: 'RN01234N001-2', status: 'green' },
  { id: 'wc-3', name: 'SW01234N201', status: 'green' },
  { id: 'wc-4', name: 'SW01234N301', status: 'green' },
  { id: 'wc-5', name: 'SW01234N004', status: 'green' },
  { id: 'wc-6', name: 'POS Terminal-01', status: 'green' },
  { id: 'wc-7', name: 'POS Terminal-02', status: 'green' },
  { id: 'wc-8', name: 'POS Terminal-03', status: 'green' },
  { id: 'wc-9', name: 'Workstation-GS01',   status: 'green' },
  { id: 'wc-10',name: 'Printer-Network-01', status: 'green' },
  { id: 'wc-11',name: 'SecurityCam-NVR',    status: 'green' },

];

const AP_LIST: AccessPoint[] = [
  { id: 'ap-001', name: 'AP-001', location: 'Front Entrance', port: '5', status: 'green' },
  { id: 'ap-002', name: 'AP-002', location: 'Sales Floor', port: '7', status: 'green' },
  { id: 'ap-003', name: 'AP-003', location: 'Sales Floor', port: '9', status: 'green' },
  {
    id: 'ap-004',
    name: 'AP-004',
    location: 'Back Office',
    port: '11',
    status: 'red', // shows "Offline"
    incidents: [
      { id: 'INC00001257', title: 'ISP - Primary Link' },
      { id: 'INC00001258', title: 'POS Terminal 03 - System Offline' },
      { id: 'INC00001256', title: 'Network - Primary Router' },
    ],
  },
  { id: 'ap-005', name: 'AP-005', location: 'First Floor', port: '13', status: 'green' },
];

/* ---------- Helpers ---------- */
function StatusDot({ status }: { status: Status }) {
  const bg = status === 'green' ? COLORS.green : status === 'yellow' ? COLORS.yellow : COLORS.red;
  return <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: bg }} />;
}

/* ---------- Component ---------- */

export default function NetworkScreen() {
  const [wiredModal, setWiredModal] = useState(false);
  const [apModal, setApModal] = useState(false);
  const [apDetailModal, setApDetailModal] = useState<AccessPoint | null>(null);

  // Access Points button shows warning dot if any AP non-green
  const hasApWarning = AP_LIST.some((ap) => ap.status !== 'green');

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.blue700} />

      {/* Header (TCS) */}
      <TCSHeader showBack />

      {/* Main content */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* ---------- Wired ---------- */}
        {/* <Text style={styles.sectionTitle}>Wired</Text> */}
        <View  style={styles.hero}>
        {/* <Text style={styles.heroIcon}>🗄️</Text> */}
          <Text style={styles.heroTitle}>Network</Text>
          
        </View>

        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>Wired</Text>
          <Pressable style={styles.chevBtn} onPress={() => setWiredModal(true)}>
            <Text style={styles.chevText}>›</Text>
          </Pressable>
        </View>

        <View style={styles.grid}>
          {WIRED_TILES.map((t) => (
            <View key={t.id} style={styles.tile}>
              <View style={styles.tileHeader}>
                {/* <Text style={styles.tileIcon}>{t.icon}</Text> */}
                <View style={{ minWidth: 24, minHeight: 24, justifyContent: 'center', alignItems: 'center' }}>
                  {NetIcons[t.icon as keyof typeof NetIcons] ? (
                  NetIcons[t.icon as keyof typeof NetIcons]
                    ) : (
                   <Text style={styles.tileIcon}>{t.icon}</Text> // emoji or any text fallback
                   )}
                </View>
                <StatusDot status={t.status as Status} />
              </View>
              <Text style={styles.tileLabelBold}>{t.label}</Text>
              <Text style={styles.tileSub}>{t.sub}</Text>
            </View>
          ))}
        </View>

        {/* ---------- Wireless ---------- */}
        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Wireless</Text>

        <TouchableOpacity
          style={styles.fullBtn}
          activeOpacity={0.85}
          onPress={() => setApModal(true)}
        >
          <Text style={styles.fullBtnIcon}>{NetIcons.wifiIcon}</Text>
          <Text style={styles.fullBtnLabel}>Access Points</Text>
          <View style={{ marginLeft: 'auto' }}>
            <StatusDot status={hasApWarning ? 'yellow' : 'green'} />
          </View>
        </TouchableOpacity>

        {/* ---------- ISP ---------- */}
        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>ISP</Text>

        <View style={styles.grid}>
          {/* Primary Link (INC → navigate) */}
          <View style={styles.tile}>
            <View style={styles.tileHeader}>
              <Text style={styles.tileIcon}>{NetIcons.primaryLink}</Text>
              <StatusDot status={'yellow'} />
            </View>

            <View style={styles.titleRow}>
              <Text style={styles.tileLabelBold}>Primary Link</Text>

              {/* INC pill → navigate to the ISP incident */}
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: '/incidents/[id]',
                    params: { id: 'INC00001234' },    // ✅ ISP - Primary Link
                  })
                }
                style={styles.incBadge}
              >
                <Text style={styles.incBadgeText}>INC</Text>
              </Pressable>
            </View>
          </View>

          {/* Secondary Link */}
          <View style={styles.tile}>
            <View style={styles.tileHeader}>
              <Text style={styles.tileIcon}>{NetIcons.primaryLink}</Text>
              <StatusDot status={'green'} />
            </View>
            <Text style={styles.tileLabelBold}>Secondary Link</Text>
          </View>

        </View>
      </ScrollView>

      {/* ---------- Wired Connections Modal ---------- */}  
      <Modal
        visible={wiredModal}
        transparent
        animationType="fade"
        onRequestClose={() => setWiredModal(false)}
      >
        <View style={styles.modalOverlay}>
          {/* Fixed-height card; width same as before */}
          <View style={[styles.modalCard, { maxWidth: 480, height: 360 }]}>
            <View style={[styles.modalHeader, { backgroundColor: COLORS.blue600 }]}>
              <Text style={styles.modalHeaderText}>Wired Connections</Text>
              <Pressable onPress={() => setWiredModal(false)}>
                <Text style={styles.closeX}>✕</Text>
              </Pressable>
            </View>

            {/* Table header (stays fixed) */}
            <View style={[styles.tableRow, { borderBottomWidth: 1, borderBottomColor: COLORS.divider, paddingHorizontal: 16, paddingVertical: 10 }]}>
              <Text style={[styles.tableCell, styles.tableHead]}>Name</Text>
              <Text style={[styles.tableCell, styles.tableHead, { textAlign: 'right' }]}>Status</Text>
            </View>

            {/* Scrollable rows area inside fixed-height card */}
            <View style={styles.tableScrollableArea}>
              <ScrollView
                contentContainerStyle={styles.tableScrollContent}
                showsVerticalScrollIndicator
              >
                {WIRED_CONNECTIONS.map((w) => (
                  <View key={w.id} style={[styles.tableRow, { paddingHorizontal: 16, paddingVertical: 10 }]}>
                    <Text style={styles.tableCell}>{w.name}</Text>
                    <Text style={[styles.tableCell, { textAlign: 'right', color: w.status === 'green' ? COLORS.green : w.status === 'yellow' ? COLORS.yellow : COLORS.red }]}>
                      {w.status === 'green' ? 'Online' : w.status === 'yellow' ? 'Degraded' : 'Offline'}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>


      {/* ---------- Access Points Modal (with heading & INC) ---------- */}
      <Modal
        visible={apModal}
        transparent
        animationType="fade"
        onRequestClose={() => setApModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { maxWidth: 480 }]}>
            <View style={[styles.modalHeader, { backgroundColor: COLORS.blue600 }]}>
              <Text style={styles.modalHeaderText}>Access Points</Text>
              <Pressable onPress={() => setApModal(false)}>
                <Text style={styles.closeX}>✕</Text>
              </Pressable>
            </View>

            
            {/* Table header */}
            <View style={[styles.tableRow, { borderBottomWidth: 1, borderBottomColor: COLORS.divider }]}>
            <Text style={[styles.thText, { flex: 1.2 }]}>Access Point</Text>
            <Text style={[styles.thText, { flex: 1 }]}>Location</Text>
            <Text style={[styles.thText, { flex: 0.6, textAlign: 'center' }]}>Port</Text>
            <Text style={[styles.thText, { flex: 0.8, textAlign: 'right' }]}>Status</Text>
            </View>


            {/* Rows */}
            {AP_LIST.map((ap) => {
            const statusLabel =
                ap.status === 'green' ? 'Online' :
                ap.status === 'yellow' ? 'Degraded' : 'Offline';
            const statusColor =
                ap.status === 'green' ? COLORS.green :
                ap.status === 'yellow' ? COLORS.yellow : COLORS.red;

            
            return (
            <Pressable
              key={ap.id}
              style={[
                styles.apRow,
                { borderBottomColor: COLORS.divider },
                ap.id === 'ap-004' && styles.apRowDisabled, // optional visual cue
              ]}
              disabled={ap.id === 'ap-004'} // 🚫 disable row presses for AP-004
              accessibilityState={{ disabled: ap.id === 'ap-004' }}
              onPress={() => {
                if (ap.id !== 'ap-004') {
                  setApDetailModal(ap); // ✅ open AP detail popup for other rows
                }
                // For AP-004 row, do nothing
              }}
            >
              {/* Access Point */}
              <Text style={[styles.cellText, styles.cellName, { flex: 1.2 }]}>
                {ap.name}
              </Text>

              {/* Location */}
              <Text style={[styles.cellText, { flex: 1 }]}>
                {ap.location}
              </Text>

              {/* Port (centered) + INC pill */}
              <View style={[styles.portCell, { flex: 0.6 }]}>
                <Text style={[styles.portText, { textAlign: 'center', flex: 1 }]}>
                  {ap.port}
                </Text>

                {ap.id === 'ap-004' ? (
                  <Pressable
                    style={styles.incPill}
                    onPress={(e) => {
                      e.stopPropagation();   // ✅ don't trigger the row's onPress
                      setApModal(false);     // ✅ close the Access Points modal
                      router.push({
                        pathname: '/incidents/[id]',
                        params: { id: 'INC00001237' }, // ✅ navigate to the full incident page
                      });
                    }}
                  >
                    <Text style={styles.incPillText}>INC</Text>
                  </Pressable>
                ) : null}
              </View>

              {/* Status (right aligned, color-coded) */}
              <Text
                style={[
                  styles.cellText,
                  { flex: 0.8, textAlign: 'right', color: statusColor },
                ]}
              >
                {statusLabel}
              </Text>
            </Pressable>
            );
            })}
          </View>
        </View>
      </Modal>

      {/* ---------- Access Point Detail Modal (Wireless – AP A004) ---------- */}
      <Modal
        visible={!!apDetailModal}
        transparent
        animationType="fade"
        onRequestClose={() => setApDetailModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { maxWidth: 480 }]}>
            <View style={[styles.modalHeader, { backgroundColor: COLORS.blue600 }]}>
              <Text style={styles.modalHeaderText}>
                Wireless - {apDetailModal?.name} {apDetailModal ? `(${apDetailModal.location})` : ''}
              </Text>
              <Pressable onPress={() => setApDetailModal(null)}>
                <Text style={styles.closeX}>✕</Text>
              </Pressable>
            </View>

            {/* Summary card */}
            <View style={styles.detailBlock}>
              <Text style={styles.detailTitle}>INC00001237</Text>
              <Text style={styles.detailSub}>Access Point - {apDetailModal?.location}</Text>

              <Text style={[styles.detailLabel, { marginTop: 8 }]}>Short Description:</Text>
              <Text style={styles.detailText}>
                Dynatrace - OPEN ENVIRONMENT PROBLEM{'\n'}
                PoD: Network accesspoint unavailable (10.1.2.3), retry. AP hardware health degraded.
              </Text>

              <Text style={[styles.detailLabel, { marginTop: 8 }]}>Summary:</Text>
              <Text style={styles.detailText}>
                Access point {apDetailModal?.name} is offline. Remote troubleshooting indicates issue with AP itself.
                New AP hardware has been ordered; once delivered, tech will be assigned for doing the replacement.
              </Text>
            </View>

            {/* Related incidents → View (navigate to full page) */}
            <Text style={[styles.detailLabel, { marginTop: 12 }]}>Related Incidents</Text>
            {(apDetailModal?.incidents ?? []).map((inc) => (
              <View key={inc.id} style={styles.relatedRow}>
                <Text style={styles.relatedId}>{inc.id}</Text>
                <Text style={styles.relatedTitle}>{inc.title}</Text>
                
                <Pressable
                    onPress={() =>
                        router.push({
                        pathname: '/incidents/[id]',
                            params: { id: inc.id.toLowerCase() },
                        })
                    }
                    style={styles.relatedViewBtn}
                    >
                    <Text style={styles.relatedViewText}>View</Text>
                </Pressable>
              </View>
            ))}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/* ---------- Styles ---------- */
const CIRCLE_SIZE = 42;
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },

  hero: { alignItems: 'flex-start', paddingHorizontal:0, paddingTop: 10,paddingBottom:20 },
  // heroIcon: { fontSize: 28 },
  heroTitle: { fontSize: 22, fontWeight: '700', color: COLORS.text, marginTop: 6 },
  heroSub: { fontSize: 12.5, color: COLORS.muted, marginTop: 2 },

  content: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24, alignItems: 'flex-start' },
  sectionTitle: { width: '100%', maxWidth: 420, fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 8 },
  sectionSub: { fontSize: 13, fontWeight: '600', color: COLORS.muted },
  rowBetween: { width: '100%', maxWidth: 420, flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  chevBtn: {
    marginLeft: 'auto',
    marginRight:10,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    shadowColor: '#101828',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  chevText: { fontSize: 20, fontWeight: '700', color: COLORS.text },

  grid: {
    width: '100%',
    maxWidth: 420,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
  },
  tile: {
    width: '48%',
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
  tileHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  tileIcon: { fontSize: 18 },
  tileLabelBold: { color: COLORS.text, fontSize: 14.5, fontWeight: '700', marginTop: 6 },
  tileSub: { color: COLORS.muted, fontSize: 12, marginTop: 2 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 },

  fullBtn: {
    width: '100%',
    maxWidth: 420,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
  fullBtnIcon: { fontSize: 18 },
  fullBtnLabel: { color: COLORS.text, fontSize: 14.5, fontWeight: '700' },

  incBadge: { backgroundColor: COLORS.red, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  incBadgeText: { color: '#FFFFFF', fontWeight: '700', fontSize: 11 },

  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(16,24,40,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    width: '100%',
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalHeaderText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  closeX: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  
  tableScrollableArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  tableScrollContent: {
    paddingBottom: 12,
  },


  // Wired table
  tableRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  tableCell: { flex: 1, color: COLORS.text, fontSize: 14 },
  tableHead: { fontWeight: '700' },

  // AP list row
  
    apCellText: { color: COLORS.text, fontSize: 14 },           // for <Text>
    apNameText: { fontWeight: '700' },                          // for <Text> name cell
    
    // Header cell text
    thText: {
    fontWeight: '700',
    color: COLORS.text,
    fontSize: 14,
    },

    // Row container
    apRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    },
    
  apRowDisabled: {
    opacity: 0.9,           // subtle visual cue
  },
    
// Text cells
cellText: {
  color: COLORS.text,
  fontSize: 14,
},
cellName: { fontWeight: '700' },

    // Port container and text
    portCell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    },
    portText: {
    color: COLORS.text,
    fontSize: 14,
    },

  apName: { fontWeight: '700' },

 
    // INC pill
    incPill: {
    backgroundColor: COLORS.red,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    },
    incPillText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 11,
    },

  // AP detail
  detailBlock: { margin: 16, backgroundColor: '#F9FAFB', borderRadius: 12, padding: 12 },
  detailTitle: { fontSize: 14.5, fontWeight: '700', color: COLORS.text },
  detailSub: { fontSize: 13, color: COLORS.muted, marginTop: 4 },
  detailLabel: { fontSize: 13, fontWeight: '700', color: COLORS.text },
  detailText: { fontSize: 13, color: COLORS.text, marginTop: 4, lineHeight: 18 },
  relatedRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: COLORS.divider },
  relatedId: { fontSize: 13, fontWeight: '700', color: COLORS.text, width: 120 },
  relatedTitle: { fontSize: 13, color: COLORS.text, flex: 1 },
  relatedViewBtn: { backgroundColor: COLORS.blue700, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  relatedViewText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
});
