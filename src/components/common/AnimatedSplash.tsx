import { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    Easing,
    Image,
    StyleSheet,
    View,
} from 'react-native';
import Svg, {
    Circle,
    Defs,
    G,
    Path,
    Rect,
    Stop,
    LinearGradient as SvgLinearGradient,
} from 'react-native-svg';

type Props = {
  onFinish?: () => void;
};

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

// Letter stroke paths (each in its own viewBox 0 0 100 120)
const PATH_R = 'M 25,100 L 25,20 C 25,20 75,20 75,55 C 75,80 25,60 25,60 L 75,100';
const PATH_I = 'M 25,20 L 75,20 M 50,20 L 50,100 M 25,100 L 75,100';
const PATH_C = 'M 75,20 C 50,15 25,30 25,60 C 25,90 50,105 75,100';

// Ice crack network (viewBox 0 0 1000 1000)
const PATH_CRACK =
  'M 120,0 L 260,240 L 480,420 L 520,440 L 800,720 M 480,420 L 300,580 L 100,880 M 520,440 L 730,310 L 950,50 M 260,240 L 50,300 M 730,310 L 900,370';

const LDASH = 460; // dash length for letters
const CIRC = 580; // circle circumference (~2π·92)
const CRACK_DASH = 1500;

// Scale factor for the crack network, expressed as an SVG transform string
const CRACK_SCALE = SCREEN_W / 1000;

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// Frost particles (static config, animated per-instance)
const PARTICLES = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  left: (i * 8 + 4) % 100,
  size: 2 + (i % 3),
  duration: 2600 + (i % 5) * 400,
  delay: (i % 6) * 220,
  opacity: 0.15 + (i % 4) * 0.05,
}));

export default function AnimatedSplash({ onFinish }: Props) {
  // Container fade + cinematic group transforms
  const containerOpacity = useRef(new Animated.Value(1)).current;
  const groupScale = useRef(new Animated.Value(1.05)).current;
  const groupOpacity = useRef(new Animated.Value(1)).current;

  // Top logos
  const topOpacity = useRef(new Animated.Value(0)).current;

  // Stroke draw offsets
  const crackOff = useRef(new Animated.Value(CRACK_DASH)).current;
  const circleOff = useRef(new Animated.Value(CIRC)).current;
  const rOff = useRef(new Animated.Value(LDASH)).current;
  const iOff = useRef(new Animated.Value(LDASH)).current;
  const cOff = useRef(new Animated.Value(LDASH)).current;

  // Subtitle
  const subOpacity = useRef(new Animated.Value(0)).current;
  const subTranslate = useRef(new Animated.Value(10)).current;

  // Footer loader
  const progress = useRef(new Animated.Value(0)).current;
  const footerOpacity = useRef(new Animated.Value(1)).current;

  // Aurora glow pulse
  const aurora = useRef(new Animated.Value(0)).current;

  // Frost particle animated values
  const particleY = useRef(PARTICLES.map(() => new Animated.Value(0))).current;

  const onFinishRef = useRef(onFinish);
  useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  useEffect(() => {
    const draw = (v: Animated.Value, toValue: number, duration: number, delay: number) =>
      Animated.timing(v, {
        toValue,
        duration,
        delay,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      });

    // Top logos in
    Animated.timing(topOpacity, {
      toValue: 1,
      duration: 400,
      useNativeDriver: false,
    }).start();

    // Stage 1: cracks (50ms, 2200ms)
    draw(crackOff, 0, 2200, 50).start();
    // Stage 2: circle (100ms, 850ms)
    draw(circleOff, 0, 850, 100).start();
    // Stage 3-5: R / I / C
    draw(rOff, 0, 450, 850).start();
    draw(iOff, 0, 450, 1250).start();
    draw(cOff, 0, 450, 1650).start();

    // Footer loader (0 -> 1 over 1800ms)
    Animated.timing(progress, {
      toValue: 1,
      duration: 1800,
      easing: Easing.bezier(0.3, 0.8, 0.3, 1),
      useNativeDriver: false,
    }).start();

    // Aurora pulse loop
    const auroraLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(aurora, { toValue: 1, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
        Animated.timing(aurora, { toValue: 0, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
      ])
    );
    auroraLoop.start();

    // Frost particles floating up
    const particleLoops = particleY.map((v, i) =>
      Animated.loop(
        Animated.timing(v, {
          toValue: 1,
          duration: PARTICLES[i].duration,
          delay: PARTICLES[i].delay,
          easing: Easing.linear,
          useNativeDriver: false,
        })
      )
    );
    particleLoops.forEach((a) => a.start());

    // Stage 6: subtitle + bubble pulse (2100ms)
    const t6 = setTimeout(() => {
      Animated.parallel([
        Animated.timing(subOpacity, { toValue: 1, duration: 400, useNativeDriver: false }),
        Animated.timing(subTranslate, { toValue: 0, duration: 400, useNativeDriver: false }),
        Animated.sequence([
          Animated.timing(groupScale, { toValue: 1.12, duration: 250, easing: Easing.out(Easing.ease), useNativeDriver: false }),
          Animated.timing(groupScale, { toValue: 1.05, duration: 250, easing: Easing.out(Easing.ease), useNativeDriver: false }),
        ]),
      ]).start();
    }, 2100);

    // Stage 7: cinematic zoom-through (2750ms)
    const t7 = setTimeout(() => {
      Animated.parallel([
        Animated.timing(groupScale, { toValue: 3.5, duration: 500, easing: Easing.in(Easing.ease), useNativeDriver: false }),
        Animated.timing(groupOpacity, { toValue: 0, duration: 500, easing: Easing.in(Easing.ease), useNativeDriver: false }),
        Animated.timing(footerOpacity, { toValue: 0, duration: 300, useNativeDriver: false }),
      ]).start();
    }, 2750);

    // Stage 8: fade out container (2950ms)
    const t8 = setTimeout(() => {
      Animated.timing(containerOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }, 2950);

    // Stage 9: complete (3250ms)
    const t9 = setTimeout(() => onFinishRef.current?.(), 3250);

    return () => {
      clearTimeout(t6);
      clearTimeout(t7);
      clearTimeout(t8);
      clearTimeout(t9);
      auroraLoop.stop();
      particleLoops.forEach((a) => a.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const progressWidth = progress.interpolate({ inputRange: [0, 1], outputRange: [0, 208] });

  const letterGlow = { color: '#000aa2', width: 13 };
  const letterInk = { color: '#e0f2fe', width: 11 };

  const renderLetter = (d: string, off: Animated.Value) => (
    <Svg width={52} height={62} viewBox="0 0 100 120">
      {/* faint background trace */}
      <Path d={d} stroke="rgba(255,255,255,0.06)" strokeWidth={11} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* glow stroke */}
      <AnimatedPath
        d={d}
        stroke={letterGlow.color}
        strokeWidth={letterGlow.width}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.6}
        strokeDasharray={LDASH}
        strokeDashoffset={off}
      />
      {/* ink stroke */}
      <AnimatedPath
        d={d}
        stroke={letterInk.color}
        strokeWidth={letterInk.width}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={LDASH}
        strokeDashoffset={off}
      />
    </Svg>
  );

  return (
    <Animated.View style={[styles.container, { opacity: containerOpacity }]} pointerEvents="none">
      {/* Deep-navy vertical gradient + ice cracks */}
      <Svg style={StyleSheet.absoluteFill} width={SCREEN_W} height={SCREEN_H}>
        <Defs>
          <SvgLinearGradient id="navy" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#000213" />
            <Stop offset="0.4" stopColor="#00052a" />
            <Stop offset="0.75" stopColor="#000aa2" />
            <Stop offset="1" stopColor="#00010c" />
          </SvgLinearGradient>
        </Defs>
        <Rect x={0} y={0} width={SCREEN_W} height={SCREEN_H} fill="url(#navy)" />

        {/* Ice crack network (scaled to screen) */}
        <G transform={`scale(${CRACK_SCALE})`} opacity={0.3}>
          <AnimatedPath
            d={PATH_CRACK}
            stroke="#4d5aff"
            strokeWidth={2}
            fill="none"
            strokeDasharray={CRACK_DASH}
            strokeDashoffset={crackOff}
          />
        </G>
      </Svg>

      {/* Aurora top glow */}
      <Animated.View
        style={[
          styles.aurora,
          { opacity: aurora.interpolate({ inputRange: [0, 1], outputRange: [0.25, 0.6] }) },
        ]}
      />

      {/* Frost particles */}
      {PARTICLES.map((p, i) => (
        <Animated.View
          key={p.id}
          style={{
            position: 'absolute',
            bottom: -10,
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            borderRadius: p.size / 2,
            backgroundColor: '#FFFFFF',
            opacity: particleY[i].interpolate({
              inputRange: [0, 0.1, 0.9, 1],
              outputRange: [0, p.opacity, p.opacity, 0],
            }),
            transform: [
              {
                translateY: particleY[i].interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -(SCREEN_H + 40)],
                }),
              },
            ],
          }}
        />
      ))}

      {/* Top row - TCS logo centered horizontally */}
      <Animated.View style={[styles.topRow, { opacity: topOpacity }]}>
        <Image
          source={require('../../assets/images/logo-tcs.png')}
          style={styles.tcsLogo}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Center stage */}
      <View style={styles.center}>
        <Animated.View
          style={{
            width: 300,
            height: 300,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: groupOpacity,
            transform: [{ scale: groupScale }],
          }}
        >
          {/* Glass backplate */}
          <View style={styles.glassCircle} />
          <View style={styles.glowCircle} />

          {/* Drawing circle */}
          <Svg style={StyleSheet.absoluteFill} viewBox="0 0 200 200">
            <Circle cx={100} cy={100} r={92} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={2.5} />
            <G transform="rotate(-90 100 100)">
              <AnimatedCircle
                cx={100}
                cy={100}
                r={92}
                fill="none"
                stroke="#e0f2fe"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeDasharray={CIRC}
                strokeDashoffset={circleOff}
              />
            </G>
          </Svg>

          {/* Letters + subtitle */}
          <View style={styles.centerContent}>
            <View style={styles.lettersRow}>
              {renderLetter(PATH_R, rOff)}
              {renderLetter(PATH_I, iOff)}
              {renderLetter(PATH_C, cOff)}
            </View>

            <Animated.Text
              style={[
                styles.subtitle,
                { opacity: subOpacity, transform: [{ translateY: subTranslate }] },
              ]}
            >
              RETAIL IT COMPANION
            </Animated.Text>
          </View>
        </Animated.View>
      </View>

      {/* Footer loader bar */}
      <Animated.View style={[styles.footer, { opacity: footerOpacity }]}>
        <View style={styles.loaderTrack}>
          <Animated.View style={[styles.loaderFill, { width: progressWidth }]} />
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00010c',
    zIndex: 999,
    elevation: 999,
  },

  aurora: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: SCREEN_H * 0.55,
    backgroundColor: 'rgba(0,10,162,0.18)',
  },

  topRow: {
    position: 'absolute',
    top: 56,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tcsLogo: {
    width: 150,
    height: 36,
  },

  center: { alignItems: 'center', justifyContent: 'center' },

  glassCircle: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 150,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  glowCircle: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 150,
    backgroundColor: 'rgba(0,10,162,0.15)',
  },

  centerContent: { alignItems: 'center', justifyContent: 'center' },
  lettersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  subtitle: {
    marginTop: 16,
    color: '#e0f2fe',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 5,
    textShadowColor: 'rgba(255,255,255,0.35)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },

  footer: {
    position: 'absolute',
    bottom: 70,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  loaderTrack: {
    width: 208,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.12)',
    overflow: 'hidden',
  },
  loaderFill: {
    height: 3,
    borderRadius: 2,
    backgroundColor: '#4da3ff',
  },
});
