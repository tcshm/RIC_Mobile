
// StoreHealthCard.tsx
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import ECGWave from './ECGWave';

export default function StoreHealthCard() {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Store Health</Text>        
        <Pressable
          hitSlop={8}
          onPress={() =>
            router.push({
              pathname: '/incidents',
              params: { id: 'active', title: 'Health Status' },
            })
          }
        >
          <Text style={styles.statusLink}>View Status</Text>
        </Pressable>
      </View>

      {/* ECG: no grid, yellow line, moving over blue card */}
      <ECGWave
      
        height={90}            // taller display area (was ~80)
        stroke="#FACC15"       // amber line
        lineWidth={2.2}
        speedMs={6000}         // smooth left scroll; lower for faster
        ampScale={1.8} 

          // ensure grid is off
      />
    </View>  //#132f8bff
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#0b3d91', // ⬅️ Blue background card
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  statusLink: {
    color: '#FFFFFF',
    textDecorationLine: 'underline',
    fontSize: 14,
    fontWeight: '500',
  },
});
