
// ECGWave.tsx (React Native)
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, View } from "react-native";
import Svg, { Path } from "react-native-svg";

type ECGWaveProps = {
  height?: number;         // viewport height in px
  stroke?: string;         // line color
  lineWidth?: number;      // main line thickness
  speedMs?: number;        // time to scroll one viewport width
  ampScale?: number;       // scales vertical amplitude around baseline=50
};

const BASELINE = 50;

const ECGWave: React.FC<ECGWaveProps> = ({
  height = 96,            // ↑ taller than h-32 (~128px in web-TW), tune to taste
  stroke = "#FACC15",     // Tailwind amber-300
  lineWidth = 2.5,
  speedMs = 6000,         // smooth scroll; lower for faster
  ampScale = 1.6,         // >1 makes wave taller (try 1.8–2.0 for more)
}) => {
  const [width, setWidth] = useState(320);
  const translateX = useRef(new Animated.Value(0)).current;

  // Your single beat path
  const singleBeatPath =
    "M0,50 L20,50 L25,45 L30,50 L35,50 L40,20 L45,80 L50,50 L65,50 L75,40 L85,50 L100,50";

  // Scale Y around the baseline (50) by ampScale
  const scaleYAround = (d: string, baseline: number, scale: number): string => {
    return d.replace(/([ML])(\d+),(\d+)/g, (_m, cmd, xStr, yStr) => {
      const x = parseFloat(xStr);
      const y = parseFloat(yStr);
      const yScaled = baseline + (y - baseline) * scale;
      return `${cmd}${x},${Math.round(yScaled)}`;
    });
  };

  // Shift all X coordinates by a constant offset
  const offsetPathX = (d: string, offset: number): string => {
    return d.replace(/([ML])(\d+),/g, (_m, cmd, xStr) => {
      const x = parseInt(xStr, 10);
      return `${cmd}${x + offset},`;
    });
  };

  // Build a long path to cover 200% width (like the web version)
  const path = useMemo(() => {
    const scaledBeat = scaleYAround(singleBeatPath, BASELINE, ampScale);
    // each beat spans 100 units in X; compute how many beats to cover width*2
    const repeats = Math.ceil((width * 2) / 100) + 1;
    const parts: string[] = [];
    for (let i = 0; i < repeats; i++) {
      parts.push(offsetPathX(scaledBeat, i * 100));
    }
    return parts.join(" ");
  }, [ampScale, width]);

  // Animation: translate the SVG group left from 0 to -width, then loop
  useEffect(() => {
    let mounted = true;
    const start = () => {
      translateX.setValue(0);
      Animated.timing(translateX, {
        toValue: -width,
        duration: speedMs,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start(() => {
        if (mounted) start();
      });
    };
    start();
    return () => {
      mounted = false;
      translateX.stopAnimation();
    };
  }, [width, speedMs, translateX]);

  return (
    <View
      style={{ height, width: "100%", overflow: "hidden" }}
      onLayout={(e) => {
        const w = Math.round(e.nativeEvent.layout.width);
        if (w > 0) setWidth(w);
      }}
    >
      <Animated.View style={{ transform: [{ translateX }] }}>
        {/* SVG is 200% of viewport width, like in your web version */}
        <Svg
          width={width * 2}
          height={height}
          viewBox={`0 0 ${Math.ceil((width * 2) / 100) * 100} 100`}
          preserveAspectRatio="none"
        >
          {/* Main ECG line */}
          <Path
            d={path}
            fill="none"
            stroke={stroke}
            strokeWidth={lineWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Glowing effect (thicker, semi-transparent) */}
          <Path
            d={path}
            fill="none"
            stroke={stroke}
            strokeOpacity={0.30}
            strokeWidth={lineWidth * 1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </Animated.View>
    </View>
  );
};

export default ECGWave;
