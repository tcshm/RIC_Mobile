
import { router } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PageTitle from '../components/common/PageTitle';
import TCSHeader from '../components/common/TCSHeader';

const COLORS = {
  blue700: '#0046BE', // header
  cardBG: '#FFFFFF',
  bg: '#dcdcdcff',
  text: '#1F2937',
  muted: '#6B7280',
  border1: '#eeeff0',
  border: '#9ea1a4',
  success: '#10B981',
  menuBG: '#FFFFFF',
};

type AlertItem = {
  id: string;
  title: string;
  detail: string;
  incidentId?: string;
};

const ALERTS: AlertItem[] = [
  {
    id: '1',
    title: 'Possible network slowness across workstations & IT devices',
    detail:
      'Possible network slowness across workstations & IT devices as the store is operating in secondary link due to issue in primary network link.',
    incidentId: 'INC00001234',
  },
  {
    id: '2',
    title: 'Primary link failed 3 times this month',
    detail:
      'Primary link failed 3 times in this month - IT will escalate with Telco provider for possible permanent fix.',
  },
  {
    id: '3',
    title: 'POS Terminal Hardware Failure',
    detail:
      'Checkout 3 will be effected because of POS Terminal Failure.',
    incidentId: 'INC00001235',
  },
  {
    id: '4',
    title: 'WiFi signal weak in back-office area',
    detail:
      'WIFI signal will be weak in the back-office area due to ongoing network access point down.',
    incidentId: 'INC00001237',
  },

  {
    id: '6',
    title: 'Provide resolution confirmation for cash register incident',
    detail:
      'Cash register incident marked as resolved. Please confirm if POS is operational and reports are accurate.',
    incidentId: 'INC00001236',
  },
  {
    id: '5',
    title: 'Automatic detection of WiFi coverage gaps',
    detail:
      'Automatic detection of WIFI coverage gaps in the shop floor printer section - Network Ops was notified about this.',
  },
  
  
];

const RES_OPTIONS = ['Device Lost', 'Device damaged', 'Others'];

type Anchor = { x: number; y: number; w: number; h: number } | null;

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState<AlertItem[]>(ALERTS);

  const [selected, setSelected] = useState<AlertItem | null>(null);
  const [visible, setVisible] = useState(false);

  // Last-card form state
  const [resolution, setResolution] = useState<string | null>(null);
  const [reason, setReason] = useState<string>('');

  // Dropdown (nested Modal) state
  const [showResMenu, setShowResMenu] = useState<boolean>(false);
  const [menuAnchor, setMenuAnchor] = useState<Anchor>(null);
  const selectRef = useRef<View>(null);

  const lastAlertId = ALERTS[ALERTS.length - 2].id;
  const isLastAlert = useMemo(
    () => (selected ? selected.id === lastAlertId : false),
    [selected, lastAlertId]
  );

  const onOpen = (item: AlertItem) => {
    setSelected(item);
    setVisible(true);
    if (item.id === lastAlertId) {
      setResolution(null);
      setReason('');
      setShowResMenu(false);
      setMenuAnchor(null);
    }
  };

  const onClose = () => {
    setVisible(false);
    setSelected(null);
    setResolution(null);
    setReason('');
    setShowResMenu(false);
    setMenuAnchor(null);
  };

  const canSubmit = useMemo(() => {
    if (!selected || !isLastAlert) return false;
    if (!resolution) return false;
    if (resolution === 'Others' && reason.trim() === '') return false;
    return true;
  }, [selected, isLastAlert, resolution, reason]);

  const handleSubmit = () => {
    if (!selected || !isLastAlert || !canSubmit) return;
    setAlerts((prev) => prev.filter((a) => a.id !== selected.id));
    onClose();
  };

  const openResolutionMenu = () => {
    // Measure the select control to anchor menu exactly under it
    if (selectRef.current) {
      // @ts-ignore - RN type may not include measureInWindow, but it's available
      selectRef.current.measureInWindow((x: number, y: number, w: number, h: number) => {
        const { width: screenW, height: screenH } = Dimensions.get('window');
        // Clamp within screen bounds
        const clampedX = Math.max(8, Math.min(x, screenW - w - 8));
        const clampedY = Math.max(8, Math.min(y, screenH - h - 8));
        setMenuAnchor({ x: clampedX, y: clampedY, w, h });
        setShowResMenu(true);
      });
    } else {
      // Fallback: open centered if ref not available
      setMenuAnchor(null);
      setShowResMenu(true);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.blue700} />

      {/* Header (with back and TCS logo) */}
      <TCSHeader showBack />
      <PageTitle title="Alerts" />

      {/* Content */}
      <View style={styles.content}>
        {alerts.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>No alerts 🎉</Text>
          </View>
        ) : (
          <FlatList
            data={alerts}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => {
              const isLast = item.id === lastAlertId;
              const isRedAlert = item.id === '1' || item.id === '2';
              return (
                <TouchableOpacity
                  style={styles.alertCard}
                  onPress={() => onOpen(item)}
                  activeOpacity={0.85}
                >
                  <View style={styles.alertLeft}>
                    {/* Icon: red alert for first two, warning for last, bell otherwise */}
                    <Text style={styles.alertIcon}>
                      {isRedAlert ? '🚨' : isLast ? '⚠️' : '🔔'}
                    </Text>
                  </View>
                  <View style={styles.alertRight}>
                    <Text style={styles.alertTitle}>{item.title}</Text>
                  </View>

                  {/* Incident badge */}
                  {item.incidentId ? (
                    <TouchableOpacity
                      onPress={() =>
                        router.push({
                          pathname: '/incidents/[id]',
                          params: { id: item.incidentId! },
                        })
                      }
                      style={styles.incBadge}
                      activeOpacity={0.7}
                      hitSlop={8}
                      accessibilityRole="button"
                      accessibilityLabel={`Open incident ${item.incidentId}`}
                    >
                      <Text style={styles.incBadgeText}>INC</Text>
                      <Text style={styles.incBadgeChevron}>›</Text>
                    </TouchableOpacity>
                  ) : null}
                </TouchableOpacity>
              );
            }}
          />
        )}
      </View>

      {/* Details Modal */}
      <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Alert Details</Text>

            {!!selected && (
              <>
                <Text style={styles.modalBodyTitle}>
                  {/* {selected.title} */}
                  {isLastAlert ? ' - INC00001874' : ''}
                </Text>
                <Text style={styles.modalBody}>{selected.detail}</Text>
              </>
            )}

            {/* Last alert: Resolution select + optional reason + actions */}
            {isLastAlert ? (
              <>
                <Text style={styles.fieldLabel}>Resolution</Text>

                {/* Select field anchored (we measure this for menu position) */}
                <View style={styles.selectWrap} ref={selectRef}>
                  <Pressable style={styles.selectBtn} onPress={openResolutionMenu}>
                    <Text style={styles.selectValue}>
                      {resolution ?? 'Select an option...'}
                    </Text>
                    <Text style={styles.selectCaret}>▾</Text>
                  </Pressable>
                </View>

                {resolution === 'Others' && (
                  <TextInput
                    style={styles.input}
                    placeholder="Type reason..."
                    placeholderTextColor={COLORS.muted}
                    value={reason}
                    onChangeText={setReason}
                    multiline
                  />
                )}

                {/* Actions */}
                <View style={styles.actionsRow}>
                  <Pressable style={[styles.modalBtn, styles.btnClose]} onPress={onClose}>
                    <Text style={styles.modalBtnText}>Close</Text>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.modalBtn,
                      styles.btnSubmit,
                      !canSubmit && styles.btnDisabled,
                    ]}
                    onPress={handleSubmit}
                    disabled={!canSubmit}
                  >
                    <Text style={styles.modalBtnText}>Submit</Text>
                  </Pressable>
                </View>
              </>
            ) : (
              // Other alerts: only details + Close
              <View style={styles.actionsRow}>
                <Pressable style={[styles.modalBtn, styles.btnClose]} onPress={onClose}>
                  <Text style={styles.modalBtnText}>Close</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Nested Modal for Resolution options (always above buttons) */}
      <Modal
        visible={showResMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowResMenu(false)}
      >
        {/* Backdrop to close on tap */}
        <Pressable style={styles.menuBackdrop} onPress={() => setShowResMenu(false)} />

        {/* Floating menu panel — anchored under the select if we have coordinates */}
        {menuAnchor ? (
          <View
            style={[
              styles.menuPortalPanel,
              {
                left: menuAnchor.x,
                top: menuAnchor.y + menuAnchor.h + 4,
                width: menuAnchor.w,
              },
            ]}
          >
            {RES_OPTIONS.map((opt) => (
              <Pressable
                key={opt}
                style={styles.selectOption}
                onPress={() => {
                  setResolution(opt);
                  setShowResMenu(false);
                  if (opt !== 'Others') setReason('');
                }}
              >
                <Text style={styles.selectOptionText}>{opt}</Text>
              </Pressable>
            ))}
          </View>
        ) : (
          // Fallback centered menu if anchor failed (rare)
          <View style={styles.menuPortalContainer}>
            <View style={[styles.menuPortalPanel, { width: '86%' }]}>
              {RES_OPTIONS.map((opt) => (
                <Pressable
                  key={opt}
                  style={styles.selectOption}
                  onPress={() => {
                    setResolution(opt);
                    setShowResMenu(false);
                    if (opt !== 'Others') setReason('');
                  }}
                >
                  <Text style={styles.selectOptionText}>{opt}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}
      </Modal>
    </SafeAreaView>
  );
}

/* --------------------- Styles --------------------- */
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    // alignItems: 'center',
  },
  listContent: {
    width: '100%',
    maxWidth: 420,
    paddingBottom: 16,
    gap: 12,
    alignSelf: 'center'
  },

  emptyWrap: {
    marginTop: 32,
    padding: 32,
    backgroundColor: COLORS.cardBG,
    borderRadius: 12,
    elevation: 2,
  },
  emptyText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '600',
  },

  /* Alert card */
  alertCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBG,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 16,
    position: 'relative',
    // Shadow iOS
    shadowColor: '#101828',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    // Elevation Android
    elevation: 3,
  },
  alertLeft: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  alertIcon: {
    fontSize: 20,
  },
  alertRight: {
    flex: 1,
  },
  alertTitle: {
    color: COLORS.text,
    fontSize: 14.5,
    fontWeight: '600',
    lineHeight: 26,
  },

  incBadge: {
    position: 'absolute',
    right: 10,
    bottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingLeft: 10,
    paddingRight: 8,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#B91C1C',
    // shadow to signal it's tappable
    shadowColor: '#EF4444',
    shadowOpacity: 0.4,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  incBadgeText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  incBadgeChevron: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
    marginLeft: 3,
    marginTop: -1,
  },

  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(16, 24, 40, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    overflow: 'visible',
    position: 'relative',
    // Shadow iOS
    shadowColor: '#101828',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    // Elevation Android
    elevation: 6,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6,
  },
  modalBodyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 6,
  },
  modalBody: {
    fontSize: 14.5,
    color: COLORS.text,
    lineHeight: 22,
    marginBottom: 12,
  },

  fieldLabel: {
    fontSize: 12.5,
    color: COLORS.muted,
    marginBottom: 6,
  },

  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.text,
    minHeight: 44,
  },

  /* Select field (anchor) */
  selectWrap: {
    position: 'relative',
    marginBottom: 12,
  },
  selectBtn: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectValue: { fontSize: 14, color: COLORS.text },
  selectCaret: { fontSize: 16, color: COLORS.muted },

  /* Actions */
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 14,
  },
  modalBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  btnClose: { backgroundColor: COLORS.blue700 },
  btnSubmit: { backgroundColor: COLORS.success },
  btnDisabled: { opacity: 0.5 },
  modalBtnText: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 },

  /* Dropdown Portal (nested Modal) */
  menuBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  menuPortalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  menuPortalPanel: {
    position: 'absolute',
    backgroundColor: COLORS.menuBG,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    overflow: 'hidden',
    // Shadow / elevation so it floats clearly above modal content
    elevation: 24,
    shadowColor: '#101828',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  selectOption: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border1,
  },
  selectOptionText: { fontSize: 14, color: COLORS.text },
});
