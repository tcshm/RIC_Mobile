// components/home/ActionCard.tsx
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  title: string;
  icon: React.ReactNode;       
  badge?: number;
  showZero?: boolean;
  full?: boolean;        // spans full width
  onPress?: () => void;
  cols?: 1 | 2 | 3;      // NEW: how many columns this card participates in (default 2)
  compact?: boolean;     // NEW: tighter padding/font for dense rows
};

const colors = {
  blue600: '#0B57D0',
  cardBG: '#FFFFFF',
  badgeRed: '#E53935',
};

export default function ActionCard({
  title,
  icon,
  badge,
  full,
  cols = 2,
  compact = false,
  onPress,
}: Props) {
  // compute flex basis by column count
  const basis =
    full ? '100%' : cols === 3 ? '31%' : cols === 1 ? '100%' : '48%';

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        styles.card,
        styles.actionCard,
        { flexBasis: basis },
        compact ? styles.compact : null,
      ]}
    >
      {typeof badge === 'number' && badge >= 0 ? ( 
        <View
            style={[
              styles.badge,
              { backgroundColor: badge === 0 ? '#22C55E' : '#EF4444' }, // green if 0, else red
            ]}
          >
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      ) : null}

      <Text style={[styles.cardIcon, compact ? styles.cardIconCompact : null]}>
        {icon}
      </Text>
           <Text style={[styles.cardLabel, compact ? styles.cardLabelCompact : null]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBG,
    borderRadius: 16,
    padding: 16,
    width: '100%',
    // iOS shadow
    shadowColor: '#101828',
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    // Android elevation
    elevation: 4,
  },
  actionCard: {
    paddingVertical: 18,
    paddingHorizontal: 12,
    minHeight: 96,
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginTop: 12,
  },
  compact: {
    paddingVertical: 14,
    minHeight: 84,
  },
  cardIcon: {
    fontSize: 28,
    color: colors.blue600,
    marginBottom: 8,
  },
  cardIconCompact: {
    fontSize: 24,
    marginBottom: 6,
  },
  cardLabel: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
  },
  cardLabelCompact: {
    fontSize: 13,
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    minWidth: 24,
    height: 24,
    paddingHorizontal: 6,
    borderRadius: 12,
    backgroundColor: colors.badgeRed,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  badgeText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
})