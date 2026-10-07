
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  G,
  LinearGradient,
  Path,
  Stop,
} from 'react-native-svg';

export type CircularPanelProps = {
  size?: number;
  storeLabel?: string;
  storeCode?: string;
  onDevices: () => void;
  onApplications: () => void; // used by "Apps"
  onNetwork: () => void;
  onServer: () => void;       // used by "Server"
  theme?: 'default' | 'deepBlue' | 'electric';
};

const PALETTE = {
  text: '#1F2937',
  blue600: '#0B57D0',
  outline: '#E5E7EB',
  sep: '#C7CCD6',
};

function themeColors(theme: CircularPanelProps['theme'] = 'deepBlue') {
  // Wedge fills (soft gradients)
  // Rim gradient colors (stroke) – smooth, premium blues
  switch (theme) {
    case 'electric':
      return {
        fills: [
          ['#EAF2FF', '#D9E8FF'], // Devices
          ['#E6FFFA', '#C7FFF5'], // Apps
          ['#EDE9FE', '#DDD6FE'], // Network
          ['#E0F2FE', '#BAE6FD'], // Server
        ],
        rim: [
          ['#1D4ED8', '#3B82F6'], // Devices
          ['#0EA5E9', '#38BDF8'], // Apps
          ['#6D28D9', '#8B5CF6'], // Network
          ['#0B57D0', '#1566F1'], // Server
        ],
        icon: {
          devices: '#EA580C',
          apps: '#06B6D4',
          network: '#2563EB',
          server: '#D97706',
        },
      };
    case 'default':
    case 'deepBlue':
    default:
      return {
        fills: [
          ['#F8FAFF', '#EEF4FF'], // Devices
          ['#F0FEFF', '#E6FBFE'], // Apps
          ['#F5F7FF', '#EBEEFF'], // Network
          ['#EAF7FF', '#DEF0FF'], // Server
        ],
        rim: [
          ['#155EE8', '#3B82F6'], // Devices
          ['#0B8BD6', '#22C8FF'], // Apps
          ['#4338CA', '#6366F1'], // Network
          ['#0B57D0', '#1566F1'], // Server
        ],
        icon: {
          devices: '#EA580C',
          apps: '#0891B2',
          network: '#2563EB',
          server: '#D97706',
        },
      };
  }
}

/* ------------------ Geometry helpers ------------------ */
function toRad(d: number) {
  return ((d - 90) * Math.PI) / 180;
}
function polar(cx: number, cy: number, r: number, deg: number) {
  const a = toRad(deg);
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}
function wedgePath(
  cx: number,
  cy: number,
  rOut: number,
  rIn: number,
  startDeg: number,
  endDeg: number
) {
  const s = toRad(startDeg);
  const e = toRad(endDeg);

  const x1 = cx + rOut * Math.cos(s);
  const y1 = cy + rOut * Math.sin(s);
  const x2 = cx + rOut * Math.cos(e);
  const y2 = cy + rOut * Math.sin(e);
  const x3 = cx + rIn * Math.cos(e);
  const y3 = cy + rIn * Math.sin(e);
  const x4 = cx + rIn * Math.cos(s);
  const y4 = cy + rIn * Math.sin(s);

  const largeArc = endDeg - startDeg > 180 ? 1 : 0;

  return [
    `M ${x1} ${y1}`,
    `A ${rOut} ${rOut} 0 ${largeArc} 1 ${x2} ${y2}`,
    `L ${x3} ${y3}`,
    `A ${rIn} ${rIn} 0 ${largeArc} 0 ${x4} ${y4}`,
    'Z',
  ].join(' ');
}
function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const s = toRad(startDeg);
  const e = toRad(endDeg);
  const x1 = cx + r * Math.cos(s);
  const y1 = cy + r * Math.sin(s);
  const x2 = cx + r * Math.cos(e);
  const y2 = cy + r * Math.sin(e);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
}

/* ------------------ Component ------------------ */
export default function CircularPanel({
  size = 400,
  storeLabel = 'Store IT',
  storeCode = 'IN-1234',  // updated default
  onDevices,
  onApplications,
  onNetwork,
  onServer,
  theme = 'deepBlue',
}: CircularPanelProps) {
  const { fills, rim, icon } = themeColors(theme);

  // Keep strokes safely inside the frame (avoid clipping)
  const OUTER_RIM_W = 7;
  const GAP_DEG = 8;     // visible angular gaps
  const CAP_PAD = 0.6;   // rounded cap clearance
  const SAFE_PAD = OUTER_RIM_W + 6;

  // Geometry
  const cx = size / 2;
  const cy = size / 2;

  const outerRadius = Math.round(size / 2 - SAFE_PAD);
  const ringWidth   = Math.round(size * 0.26);
  const innerRadius = outerRadius - ringWidth;

  const outerRimR   = outerRadius - OUTER_RIM_W / 2;
  const centerR     = innerRadius - 18;
  const labelR      = innerRadius + ringWidth * 0.42;

  /**
   * ORDER (mathematical quarters, clockwise from top):
   * 1st (top)     → Devices
   * 2nd (right)   → Apps
   * 3rd (bottom)  → Network
   * 4th (left)    → Server (onServer handler)
   */
  const segments = [
     {key: 'apps',     start:   -90, label: 'Apps',     icon: 'view-grid'            as const, onPress: onApplications,  fillGrad: 'grad-0', rimGrad: 'rim-0' },
    { key: 'devices',  start: 0, label: 'Devices',  icon: 'monitor'               as const, onPress: onDevices,      fillGrad: 'grad-1', rimGrad: 'rim-1' },
    { key: 'server', start: 90, label: 'Server', icon: 'server'               as const, onPress: onServer,        fillGrad: 'grad-2', rimGrad: 'rim-2' },
    { key: 'network',  start:  180, label: 'Network',  icon: 'access-point-network' as const, onPress: onNetwork,       fillGrad: 'grad-3', rimGrad: 'rim-3' },
    
  ] as const;

  const styles = StyleSheet.create({
    root: {
      width: size,
      height: size,
      alignItems: 'center',
      justifyContent: 'center',
    },
    centerOverlay: {
      position: 'absolute',
      left: cx - 76,
      top: cy - 76,
      width: 152,
      height: 152,
      borderRadius: 76,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FFFFFF',
    },
    hubTitle: {
      marginTop: 8,
      color: PALETTE.blue600,
      fontWeight: '900',
      letterSpacing: 2,
      textTransform: 'uppercase' as const,
    },
    hubBadge: {
      marginTop: 6,
      backgroundColor: '#F3F4F6',
      paddingHorizontal: 12,
      paddingVertical: 3,
      borderRadius: 99,
    },
    hubBadgeText: {
      color: '#6B7280',
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 0.5,
    },
    labelWrap: {
      position: 'absolute',
      width: 126,
      height: 58,
      alignItems: 'center',
      justifyContent: 'center',
    },
    label: {
      marginTop: 4,
      color: PALETTE.text,
      fontWeight: '900',
      letterSpacing: 1.5,
      textTransform: 'uppercase' as const,
    },
  });

  return (
    <View style={styles.root}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          {/* Fills for wedges */}
          {fills.map((pair, i) => (
            <LinearGradient
              key={`grad-${i}`}
              id={`grad-${i}`}
              x1="0"
              y1="0"
              x2="1"
              y2="1"
            >
              <Stop offset="0%" stopColor={pair[0]} />
              <Stop offset="100%" stopColor={pair[1]} />
            </LinearGradient>
          ))}

          {/* Gradient strokes for outer rims */}
          {rim.map((pair, i) => (
            <LinearGradient
              key={`rim-${i}`}
              id={`rim-${i}`}
              x1="0"
              y1="0"
              x2="1"
              y2="0"
            >
              <Stop offset="0%" stopColor={pair[0]} />
              <Stop offset="100%" stopColor={pair[1]} />
            </LinearGradient>
          ))}
        </Defs>

        <G>
          {/* 1) Wedge fills (reach exactly to the perimeter) */}
          {segments.map((seg, i) => {
            const start = seg.start + GAP_DEG / 2;
            const end   = seg.start + 90 - GAP_DEG / 2;
            return (
              <Path
                key={`wedge-${seg.key}`}
                d={wedgePath(cx, cy, outerRadius, innerRadius, start, end)}
                fill={`url(#${seg.fillGrad})`}
                stroke={PALETTE.outline}
                strokeWidth={1}
              />
            );
          })}

          {/* 2) OUTER rim only (gradient stroke). SIDE & INNER rims removed */}
          {segments.map((seg) => {
            const start = seg.start + GAP_DEG / 2 + CAP_PAD;
            const end   = seg.start + 90 - GAP_DEG / 2 - CAP_PAD;
            return (
              <Path
                key={`rim-${seg.key}`}
                d={arcPath(cx, cy, outerRimR, start, end)}
                fill="none"
                stroke={`url(#${seg.rimGrad})`}
                strokeWidth={OUTER_RIM_W}
                strokeLinecap="round"
              />
            );
          })}

          {/* 3) Optional subtle separators (spokes) */}
          {[-90, 0, 90, 180].map((ang) => {
            const p1 = polar(cx, cy, innerRadius + 2, ang);
            const p2 = polar(cx, cy, outerRadius - OUTER_RIM_W - 2, ang);
            return (
              <Path
                key={`sep-${ang}`}
                d={`M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`}
                stroke={PALETTE.sep}
                strokeWidth={Platform.OS === 'android' ? 1.2 : 1}
              />
            );
          })}

          {/* 4) Center hub (double ring) */}
          <Circle cx={cx} cy={cy} r={centerR + 10} fill="#FFFFFF" stroke={PALETTE.outline} strokeWidth={1} />
          <Circle cx={cx} cy={cy} r={centerR} fill="#FFFFFF" stroke="#F3F4F6" strokeWidth={1} />
        </G>
      </Svg>

      {/* Center overlay (icon + label + code) — green dot removed, bigger icon */}
      <View style={styles.centerOverlay} pointerEvents="none">
        <MaterialCommunityIcons name="store" size={66} color={PALETTE.blue600} />
        <Text style={styles.hubTitle}>{storeLabel}</Text>
        <View style={styles.hubBadge}>
          <Text style={styles.hubBadgeText}>{storeCode}</Text>
        </View>
      </View>

      {/* Labels + icons (pressable overlays) */}
      {segments.map((seg) => {
        const mid = seg.start + 45; // midpoint of each 90° wedge
        const pos = polar(cx, cy, labelR, mid);
        const onPress = seg.onPress;

        const iconColor =
          seg.key === 'devices'  ? icon.devices
        : seg.key === 'apps'     ? icon.apps
        : seg.key === 'network'  ? icon.network
        : icon.server;

        return (
          <Pressable
            key={`lbl-${seg.key}`}
            onPress={onPress}
            style={{
              position: 'absolute',
              left: pos.x - 63,
              top: pos.y - 30,
              width: 126,
              height: 60,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            accessibilityRole="button"
            accessibilityLabel={seg.label}
          >
            <MaterialCommunityIcons name={seg.icon} size={24} color={iconColor} />
            <Text style={styles.label}>{seg.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
