import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  HEADER_COMPACT_MIN_HEIGHT,
  HEADER_COMPACT_VERTICAL_PADDING,
  HEADER_HORIZONTAL_PADDING,
  HEADER_MIN_HEIGHT,
  HEADER_VERTICAL_PADDING,
  RIC_CIRCLE_SIZE,
  RIC_CIRCLE_SIZE_COMPACT,
} from './theme-header';

type HeaderProps = {
  compact?: boolean;
};

export default function Header({ compact = false }: HeaderProps) {
  return (
    <SafeAreaView edges={['top']} accessibilityRole="header">
      <View style={[styles.brandBar, compact && styles.brandBarCompact]}>
        
        {/* MAIN ROW */}
        <View style={styles.logoGroup} pointerEvents="none">
          
          {/* LEFT LOGO - TCS */}
          <View style={[styles.logoBox, compact && styles.logoBoxCompact]}>
            <Image
              source={require('../../assets/images/logo-tcs.png')}
              style={styles.logo}
              accessibilityLabel="TCS logo"
              accessibilityIgnoresInvertColors
            />
          </View>

          {/* CENTER LOGO - RIC (PERFECT CIRCLE FILL) */}
          <View style={styles.centerWrapper}>
            <View
              style={[
                styles.logoCircleBox,
                compact && styles.logoCircleBoxCompact,
              ]}
            >
              <Image
                source={require('../../assets/images/ric-logo.png')}
                style={styles.circleImage}
                accessibilityLabel="RIC circular logo"
                accessibilityIgnoresInvertColors
              />
            </View>
          </View>

          {/* RIGHT LOGO - FOLLETT */}
          {/* <View style={[styles.logoBox, compact && styles.logoBoxCompact]}>
            <Image
              source={require('../../assets/images/kroger.png')}
              style={styles.logo}
              accessibilityLabel="Follett logo"
              accessibilityIgnoresInvertColors
            />
          </View> */}

        </View>
      </View>
    </SafeAreaView>
  );
}

/* =========================
   STYLES
   ========================= */
const styles = StyleSheet.create({
  /* Header container */
  brandBar: {
    backgroundColor: '#3b3bf4',
    paddingHorizontal: HEADER_HORIZONTAL_PADDING,
    paddingVertical: HEADER_VERTICAL_PADDING,
    minHeight: HEADER_MIN_HEIGHT,
    zIndex: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    justifyContent: 'center',
  },

  brandBarCompact: {
    paddingVertical: HEADER_COMPACT_VERTICAL_PADDING,
    minHeight: HEADER_COMPACT_MIN_HEIGHT,
  },

  /* LOGO ROW */
  logoGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },

  /* LEFT + RIGHT RECTANGLE LOGOS */
  logoBox: {
    width: 120,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoBoxCompact: {
    width: 100,
    height: 32,
  },

  /* Generic image (rectangular logos) */
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },

  /* Centers RIC logo perfectly */
  centerWrapper: {
    flex: 1,
    alignItems: 'flex-end',
  },

  /* Circle container for RIC */
  logoCircleBox: {
    width: RIC_CIRCLE_SIZE,
    height: RIC_CIRCLE_SIZE,
    borderRadius: RIC_CIRCLE_SIZE / 2,
    overflow: 'hidden',
  },

  logoCircleBoxCompact: {
    width: RIC_CIRCLE_SIZE_COMPACT,
    height: RIC_CIRCLE_SIZE_COMPACT,
    borderRadius: RIC_CIRCLE_SIZE_COMPACT / 2,
  },

  /* PERFECT circle image fill (no cutting, no gaps) */
  circleImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',   // <<< KEY FIX
  },
});