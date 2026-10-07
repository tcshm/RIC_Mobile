
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  // icon?: string;      // emoji like 🔧, 📶, 🤖, 💻
  title: string;      // e.g., "DIY Companion"
  subtitle?: string;  // optional small description
};

export default function PageTitle({  title, subtitle }: Props) {
  return (
    <View style={styles.hero}>
      {/* {icon ? <Text style={styles.heroIcon}>{icon}</Text> : null} */}
      <Text style={styles.heroTitle}>{title}</Text>
      {subtitle ? <Text style={styles.heroSub}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'flex-start' , paddingLeft:20, paddingVertical: 14 },
  // heroIcon: { fontSize: 28 },
   heroTitle: { fontSize: 20, fontWeight: '700', color: '#1F2937', marginTop: 6, textAlign: 'left' },
  heroSub: { fontSize: 12.5, color: '#6B7280', marginTop: 2, textAlign: 'left' },
})