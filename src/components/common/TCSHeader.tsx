import { router } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { HEADER_HORIZONTAL_PADDING } from '../home/theme-header';

type Props = {
  showBack?: boolean;
};

// ✅ Reduce this to move TCS more left (closer to back button)
const BACK_BUTTON_SPACE = 44;
const CIRCLE_SIZE = 48;

export default function TCSHeader({ showBack = true }: Props) {
  return (
    <View style={styles.header}>
      <View style={styles.headerRow}>
        {/* BACK BUTTON (absolute; doesn't affect logo spacing) */}
        {showBack && (
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
        )}

        {/* LOGO ROW: TCS --- RIC --- IKEA (equal gaps) */}
        <View style={styles.logoRow}>
          {/* TCS (left, just right of back button) */}
          <Image
            source={require('../../assets/images/logo-tcs.png')}
            style={styles.tcsLogo}
          />

          {/* RIC (centered between TCS and IKEA with equal gap) */}
          <View style={styles.logoCircle}>
            <Image
              source={require('../../assets/images/ric-logo.png')}
              style={styles.logoImg}
            />
          </View>

          {/* IKEA (right end) */}
          {/* <Image
            source={require('../../assets/images/kroger.png')}
            style={styles.ikeaLogo}
          /> */}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#2941f0',
    paddingHorizontal: HEADER_HORIZONTAL_PADDING,
    paddingTop: 6,
    paddingBottom: 12,
  },

  headerRow: {
    minHeight: 65,
    justifyContent: 'center',
    position: 'relative',
  },

  /* BACK BUTTON */
  backBtn: {
    position: 'absolute',
    left: 8,
    top: '40%',
    transform: [{ translateY: -14 }],
    padding: 6,
    zIndex: 10,
  },

  backIcon: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
  },

  /**
   * ✅ Requirements satisfied:
   * - TCS starts just after back button via paddingLeft
   * - IKEA is at right end
   * - RIC stays exactly between TCS and IKEA with equal spacing
   */
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: BACK_BUTTON_SPACE,
    width: '100%',
  },

  /* LOGOS */
  tcsLogo: {
    width: 160,
    height: 38,
    resizeMode: 'contain',
  },

  ikeaLogo: {
    width: 110,
    height: 30,
    resizeMode: 'contain',
  },

  logoCircle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    overflow: 'hidden',
  },

  logoImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});