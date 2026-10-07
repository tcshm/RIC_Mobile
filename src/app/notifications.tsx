// app/notifications.tsx
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useCallback, useMemo, useState, type ComponentProps } from 'react';
import {
    FlatList,
    LayoutChangeEvent,
    Modal,
    Pressable,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import TCSHeader from '../components/common/TCSHeader';

// ---- Theme tokens ----
const COLORS = {
  blue700: '#0046BE',
  blue600: '#0B57D0',
  bg: '#dcdcdcff',
  cardBG: '#FFFFFF',
  text: '#1F2937',
  muted: '#6B7280',
  danger: '#DC2626',
};

// ---- Categories ----
const CATEGORY_ORDER = [
  'Appointment',
  'Incidents',
  'Maintenance',
] as const;
type Category = (typeof CATEGORY_ORDER)[number];

const CATEGORY_ICON: Record<Category, string> = {
  Appointment: '📅',
  Incidents: '🚨',
  Maintenance: '🛠️',
};

// ---- Types ----
type NotificationItem = {
  id: string;
  title: string;
  description?: string;
  createdAt: Date;
  icon?: React.ReactNode;
  sendTo?: string;
  category: Category;
};

type MdiName = ComponentProps<typeof MaterialCommunityIcons>['name'];

// Small helper for consistent size/color + optional top padding
const CommunityIcon = ({
  name,
  size = 28,
  color = COLORS.blue700,
  paddingTop = 4,
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
// ---- Seed notifications (newest first) ----
const initialNotifications: NotificationItem[] = [
  {
    id: 'n-001',
    title:
      'Network maintenance activity scheduled tonight at 1 AM - No action needed from stores',
    description:
      'Planned maintenance window tonight at 1 AM. No action is needed from stores at this time.',
    createdAt: new Date(Date.now() - 1 * 60 * 1000), // 1 min ago
    icon: <CommunityIcon name="bell" />,
    category: 'Maintenance',
  },
  {
    id: 'n-003',
    title: 'Incident INC00001234 Updated',
    description: 'Incident details were updated by the technical team.',
    createdAt: new Date(Date.now() - 45 * 60 * 1000), // 45 min ago
    icon: <CommunityIcon name="alert" color='#ea2020'/>,
    category: 'Incidents',
  },
  {
    id: 'n-004',
    title: 'New Appointment: ISP Technician at 01:00 PM',
    description: 'ISP tech scheduled for link restoration.',
    createdAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hr ago
    icon: <CommunityIcon name="calendar"/>,
    category: 'Appointment',
  },
  {
    id: 'n-005',
    title: 'AP-004 Hardware Replacement Scheduled',
    description: 'AP-004 will be replaced today 4 PM.',
    createdAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000), // 2.5 hr ago
    icon: <CommunityIcon name="wrench" color='#f8df3b' />,
    category: 'Appointment',
  },
  {
    id: 'n-006',
    title: 'Network Health Alert: Primary Link Down',
    description: 'Failover active. Monitoring ongoing.',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hr ago
    icon: <CommunityIcon name="router-wireless" color='#ea2020' />,
    category: 'Incidents',
  },
  {
    id: 'n-007',
    title: 'POS Terminal 03 Offline',
    description: 'POS terminal is offline. Incident is raised. Please go to the incident page for more details.',
    createdAt:new Date(Date.now() - 12 * 60 * 60 * 1000),
    icon: <CommunityIcon name="typewriter" />,
    category: 'Incidents',
  },
  {
    id: 'n-009',
    title: 'Store Manager Message: Team Meeting at 3PM',
    description: 'Store manager has scheduled a team meeting today at 3 PM. Please ensure attendance and review agenda beforehand.',
    createdAt:new Date(Date.now() - 24 * 60 * 60 * 1000),
    icon: <CommunityIcon name="message"  />,
    category: 'Maintenance',
  }
  
];

// ---- Screen component ----
export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    initialNotifications
  );

  // Which category sections are expanded
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const toggleCategory = useCallback((cat: string) => {
    setExpanded((prev) => ({ ...prev, [cat]: !prev[cat] }));
  }, []);

  // Group notifications by category, newest first inside each group
  const groupedNotifications = useMemo(
    () =>
      CATEGORY_ORDER.map((cat) => ({
        category: cat,
        items: notifications
          .filter((n) => n.category === cat)
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
      })).filter((g) => g.items.length > 0),
    [notifications]
  );

  // Details modal
  const [selected, setSelected] = useState<NotificationItem | null>(null);
  const [detailsVisible, setDetailsVisible] = useState(false);

  // Add New modal state
  const [addVisible, setAddVisible] = useState(false);
  const [sendTo, setSendTo] = useState<string>('Crisis Team');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

  // Dropdown overlay (absolute, anchored via onLayout)
  const [selectOpen, setSelectOpen] = useState<boolean>(false);
  const [anchor, setAnchor] = useState<{ x: number; y: number; w: number; h: number }>({
    x: 0, y: 0, w: 0, h: 0,
  });

  // Options for "Send To"
  const sendToOptions = useMemo(
    () => ['Crisis Team', 'Network Team', 'Retail EUC', 'Field Tech', 'All'],
    []
  );

  // ---- Handlers ----
  const onOpenDetails = useCallback((item: NotificationItem) => {
    setSelected(item);
    setDetailsVisible(true);
  }, []);

  const onCloseDetails = useCallback(() => {
    setSelected(null);
    setDetailsVisible(false);
  }, []);

  const relativeTime = useCallback((date: Date) => {
    const diffMs = Date.now() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin} min ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr} hr${diffHr > 1 ? 's' : ''} ago`;
    const diffDay = Math.floor(diffHr / 24);
    return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
  }, []);

  const validate = useCallback(() => {
    const e: { title?: string; description?: string } = {};
    if (!title.trim()) e.title = 'Title is required';
    if (!description.trim()) e.description = 'Description is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [title, description]);

  const onSend = useCallback(() => {
    if (!validate()) return;
    const newItem: NotificationItem = {
      id: `n-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      createdAt: new Date(),
      icon: '📣',
      sendTo,
      category: 'Maintenance',
    };
    setNotifications((prev) => [newItem, ...prev]);
    // Reset & close
    setTitle('');
    setDescription('');
    setErrors({});
    setSelectOpen(false);
    setAddVisible(false);
  }, [title, description, sendTo, validate]);

  // Measure the "Send To" wrapper relative to the modal card
  const onSelectLayout = useCallback((e: LayoutChangeEvent) => {
    const { x, y, width, height } = e.nativeEvent.layout;
    setAnchor({ x, y, w: width, h: height });
  }, []);

  // ---- Single notification renderer ----
  const renderNotification = useCallback(
    (item: NotificationItem) => (
      <TouchableOpacity
        key={item.id}
        style={styles.itemCard}
        onPress={() => onOpenDetails(item)}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel={`Open notification: ${item.title}`}
      >
        <View style={styles.itemIconWrap}>
          <Text style={styles.itemIcon}>{item.icon ?? '📣'}</Text>
        </View>
        <View style={styles.itemTextWrap}>
          <Text style={styles.itemTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.itemWhen}>{relativeTime(item.createdAt)}</Text>
        </View>
      </TouchableOpacity>
    ),
    [onOpenDetails, relativeTime]
  );

  // ---- Category (collapsible) renderer ----
  const renderCategory = useCallback(
    ({ item: group }: { item: { category: Category; items: NotificationItem[] } }) => {
      const isOpen = !!expanded[group.category];
      return (
        <View style={styles.categoryBlock}>
          <TouchableOpacity
            style={styles.categoryHeader}
            onPress={() => toggleCategory(group.category)}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={`${group.category} notifications`}
          >
            <Text style={styles.categoryIcon}>{CATEGORY_ICON[group.category]}</Text>
            <Text style={styles.categoryTitle}>{group.category}</Text>
            <View style={styles.categoryCount}>
              <Text style={styles.categoryCountText}>{group.items.length}</Text>
            </View>
            <Text style={styles.categoryChevron}>{isOpen ? '▲' : '▼'}</Text>
          </TouchableOpacity>

          {isOpen ? (
            <View style={styles.categoryItems}>
              {group.items.map((it) => renderNotification(it))}
            </View>
          ) : null}
        </View>
      );
    },
    [expanded, toggleCategory, renderNotification]
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.blue700} />

      {/* Header - back + TCS logo only */}
      <TCSHeader showBack />

      {/* Content */}
      <View style={styles.content}>
        <FlatList
          data={groupedNotifications}
          keyExtractor={(g) => g.category}
          renderItem={renderCategory}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}

          // ✅ Make the title row scroll WITH the list
          ListHeaderComponent={
            <View style={styles.pageTitleRow}>
              <Text style={styles.pageTitle}>Notifications</Text>

              <Pressable
                style={styles.pageActionBtn}
                onPress={() => {
                  setAddVisible(true);
                  setSelectOpen(false);
                }}
                accessibilityRole="button"
                accessibilityLabel="Add notification"
              >
                <Text style={styles.pageActionIcon}>➕</Text>
              </Pressable>
            </View>
          }

          // Optional: add bottom padding so last item isn’t blocked by nav bars
          ListFooterComponent={<View style={{ height: 24 }} />}

          // Keep padding on the list itself (instead of wrapping view) if you prefer:
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>


      {/* ---------------- Details modal ---------------- */}
      <Modal
        visible={detailsVisible}
        transparent
        animationType="fade"
        onRequestClose={onCloseDetails}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCardEnhanced}>
            {/* Header strip */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderTitle}>Notification</Text>
              <Pressable
                onPress={onCloseDetails}
                accessibilityRole="button"
                accessibilityLabel="Close notification details"
                hitSlop={8}
              >
                <Text style={styles.modalCloseIcon}>✕</Text>
              </Pressable>
            </View>

            {/* Body */}
            <View style={styles.modalContent}>
              {/* <Text style={styles.modalSectionLabel}>NOTIFICATION</Text> */}

              {/* Relative time in blue (similar to appointments time) */}
              {/* {selected ? (
                <Text style={styles.modalTime}>{relativeTime(selected.createdAt)}</Text>
              ) : null} */}

              {/* Title */}
              <Text style={styles.modalItemTitle}>{selected?.title}</Text>

              {/* Description (only in pop-up) */}
              {selected?.description ? (
                <Text style={styles.modalItemDesc}>
                  {/* Split and style the URL part as blue+underline; still non-clickable */}
                  {(() => {
                    const text = selected.description!;
                    const urlRegex = /(https?:\/\/\S+)/;
                    const parts = text.split(urlRegex);
                    return parts.map((chunk, i) => {
                      if (urlRegex.test(chunk)) {
                        return (
                          <Text key={i} style={styles.modalLinkInline}>
                            {chunk}
                          </Text>
                        );
                      }
                      return <Text key={i}>{chunk}</Text>;
                    });
                  })()}
                </Text>
              ) : null}

              {/* Meta row (optional) */}
              <Text style={styles.modalBodyMeta}>
                {selected?.sendTo ? `Sent to: ${selected.sendTo}` : ''}
                {selected?.sendTo ? ' • ' : ''}
                {selected ? relativeTime(selected.createdAt) : ''}
              </Text>
            </View>
          </View>
        </View>
      </Modal>


      {/* ---------------- Add New Notification modal ---------------- */}
      <Modal
        visible={addVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setSelectOpen(false);
          setAddVisible(false);
        }}
      >
        <View style={styles.modalOverlay}>
          {/* Fixed-size card; dropdown overlays above fields and does not resize card */}
          <View style={[styles.modalCard, { maxWidth: 420 }]}>
            <Text style={styles.modalTitle}>New Notification</Text>

            {/* Send To (dropdown trigger + anchor) */}
            <Text style={styles.label}>Send To</Text>
            <View onLayout={onSelectLayout} style={{ position: 'relative' }}>
              <Pressable
                style={styles.select}
                onPress={() => setSelectOpen((prev) => !prev)}
                accessibilityRole="button"
                accessibilityLabel="Select recipients"
              >
                <Text style={styles.selectText}>{sendTo}</Text>
                <Text style={styles.chevron}>▾</Text>
              </Pressable>
            </View>

            {/* Form body (Title + Description + Actions) */}
            <View
              style={styles.formBody}
              pointerEvents={selectOpen ? 'none' : 'auto'}  // block touches while dropdown open
            >
              {/* Title */}
              <Text style={styles.label}>Title</Text>
              <TextInput
                placeholder="Enter title"
                value={title}
                onChangeText={setTitle}
                style={[styles.input, errors.title ? styles.inputError : undefined]}
              />
              {errors.title ? <Text style={styles.errorText}>{errors.title}</Text> : null}

              {/* Description */}
              <Text style={styles.label}>Description</Text>
              <TextInput
                placeholder="Enter description"
                value={description}
                onChangeText={setDescription}
                style={[
                  styles.input,
                  styles.inputMultiline,
                  errors.description ? styles.inputError : undefined,
                ]}
                multiline
                numberOfLines={3}
              />
              {errors.description ? (
                <Text style={styles.errorText}>{errors.description}</Text>
              ) : null}

              {/* Actions */}
              <View style={styles.actionsRow}>
                <Pressable
                  style={[styles.btn, styles.btnGhost]}
                  onPress={() => {
                    setSelectOpen(false);
                    setAddVisible(false);
                  }}
                >
                  <Text style={[styles.btnText, styles.btnGhostText]}>Cancel</Text>
                </Pressable>

                <Pressable style={[styles.btn, styles.btnPrimary]} onPress={onSend}>
                  <Text style={[styles.btnText, styles.btnPrimaryText]}>Send</Text>
                </Pressable>
              </View>
            </View>

            {/* Dropdown overlay (rendered LAST so it stacks in front) */}
            {selectOpen && (
              <>
                {/* Tap-away area inside card */}
                <Pressable
                  style={styles.dropdownBackdrop}
                  onPress={() => setSelectOpen(false)}
                />
                <View
                  style={[
                    styles.selectOverlay,
                    {
                      top: anchor.y + anchor.h + 4, // directly below Send To field
                      left: anchor.x,
                      width: anchor.w,
                    },
                  ]}
                >
                  {sendToOptions.map((opt) => (
                    <Pressable
                      key={opt}
                      style={[
                        styles.selectOption,
                        sendTo === opt ? styles.selectOptionActive : null,
                      ]}
                      onPress={() => {
                        setSendTo(opt);
                        setSelectOpen(false);
                      }}
                      accessibilityRole="button"
                      accessibilityLabel={`Select ${opt}`}
                    >
                      <Text
                        style={[
                          styles.selectOptionText,
                          sendTo === opt ? styles.selectOptionTextActive : null,
                        ]}
                      >
                        {opt}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ---------------- styles co-located ----------------
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },

  // Content area
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 0 },

  // Title row outside header
  pageTitleRow: {
    width: '100%',
    maxWidth: 420,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    marginTop: 18,
  },
  pageTitle: { color: COLORS.text, fontSize: 18, fontWeight: '700' },
  pageActionBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#EEF2FF',
  },
  pageActionIcon: { color: COLORS.blue700, fontSize: 18, fontWeight: '700' },

  // FlatList content
  listContent: { paddingBottom: 16, rowGap: 10 },

  // Item card
  itemCard: {
    width:'100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBG,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    shadowColor: '#101828',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  itemIconWrap: { width: 34, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  itemIcon: { fontSize: 20 },
  itemTextWrap: { flex: 1 },
  itemTitle: { color: COLORS.text, fontSize: 15, fontWeight: '700', lineHeight: 20 },
  itemDesc: { color: COLORS.text, fontSize: 13, marginTop: 4, lineHeight: 18 },
  itemWhen: { color: COLORS.muted, fontSize: 12, marginTop: 6 },

  // Category (collapsible) section
  categoryBlock: { width: '100%', maxWidth: 420 },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBG,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    shadowColor: '#101828',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  categoryIcon: { fontSize: 18, marginRight: 10 },
  categoryTitle: { flex: 1, color: COLORS.text, fontSize: 15.5, fontWeight: '800' },
  categoryCount: {
    minWidth: 24,
    height: 22,
    paddingHorizontal: 7,
    borderRadius: 11,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  categoryCountText: { color: COLORS.blue700, fontSize: 12, fontWeight: '800' },
  categoryChevron: { color: COLORS.muted, fontSize: 12, fontWeight: '700' },
  categoryItems: { marginTop: 10, rowGap: 10 },

  // Modals (shared)
  
  modalCardEnhanced: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden', // to clip header corners
    shadowColor: '#101828',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },

  // Blue header strip
  modalHeader: {
    backgroundColor: COLORS.blue700,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  modalHeaderTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  modalCloseIcon: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },

  // Body section
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
  modalItemDesc: {
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  modalBodyMeta: { fontSize: 13, color: COLORS.muted, marginTop: 8 },

  // Inline link styling — blue + underline (non-clickable)
  modalLinkInline: {
    color: COLORS.blue600,
    textDecorationLine: 'underline',
  },

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
    padding: 16,
    shadowColor: '#101828',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
    overflow: 'visible', // let overlays render on top
  },
  modalTitle: { fontSize: 16, fontWeight: '700', color: COLORS.blue700,alignSelf:'center', marginBottom: 8 },
  modalBodyTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  modalBodyDesc: { fontSize: 13, color: COLORS.text, marginTop: 6, lineHeight: 18 },
  modalBtn: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.blue700,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 14,
  },
  modalBtnText: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 },

  // Add form
  label: { color: COLORS.text, fontSize: 13, fontWeight: '600', marginTop: 6 },
  select: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.text,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectText: { color: COLORS.text, fontSize: 14 },
  chevron: { color: COLORS.muted, fontSize: 16 },

  // Form body (fields below dropdown)
  formBody: {
    position: 'relative',
    zIndex: 0, // overlay sits above
  },

  // Dropdown overlay (absolute, inside card; sits above form)
  dropdownBackdrop: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 9998,
  },
  selectOverlay: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    backgroundColor: '#FFFFFF', // opaque: hides underlying fields
    overflow: 'hidden',
    zIndex: 9999,
    elevation: 24, // Android stacking
    shadowColor: '#101828',
    shadowOpacity: 0.16,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    maxHeight: 240,
  },
  selectOption: { paddingHorizontal: 12, paddingVertical: 10 },
  selectOptionActive: { backgroundColor: '#F5F8FF' },
  selectOptionText: { fontSize: 14, color: COLORS.text },
  selectOptionTextActive: { color: COLORS.blue600, fontWeight: '700' },

  // Inputs & actions
  input: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.text,
    backgroundColor: '#FFFFFF',
  },
  inputMultiline: { minHeight: 90, textAlignVertical: 'top' },
  inputError: { borderColor: COLORS.danger },
  errorText: { color: COLORS.danger, fontSize: 12, marginTop: 4 },

  actionsRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 16 },
  btn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  btnText: { fontSize: 14, fontWeight: '600' },
  btnGhost: { backgroundColor: '#EEF2FF' },
  btnGhostText: { color: COLORS.blue600 },
  btnPrimary: { backgroundColor: COLORS.blue700 },
  btnPrimaryText: { color: '#FFFFFF' },
});
