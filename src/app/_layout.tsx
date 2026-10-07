import { useColorScheme } from '@/hooks/use-color-scheme';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import 'react-native-reanimated';

import AnimatedSplash from '@/components/common/AnimatedSplash';

export const unstable_settings = {
  // anchor: '(tabs)',
  initialRouteName: 'index',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [showSplash, setShowSplash] = useState(true);

  
return (
    <View style={{ flex: 1 }}>
    <Stack screenOptions={{ headerShown: false }}>
      
{/* Auth screen */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      {/* Welcome splash */}
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="incidents/index" />
      <Stack.Screen name="incidents/[id]" />
      <Stack.Screen name="incidents/data" />
      <Stack.Screen name="alerts" />
      <Stack.Screen name="applications" />
      <Stack.Screen name="appointments" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="devices" />
      <Stack.Screen name="devices/pos" />
      <Stack.Screen name="devices/cameras" />
      <Stack.Screen name="network" />
      <Stack.Screen name="mobile-noc" />
      <Stack.Screen name="diy/index" />
      <Stack.Screen name="diy/[slug]" />
      <Stack.Screen name="diy/assistant" />
    </Stack>

      {showSplash && <AnimatedSplash onFinish={() => setShowSplash(false)} />}
    </View>
  );

}
