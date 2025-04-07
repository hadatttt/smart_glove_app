import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { signGestures } from '@/mocks/gestures';
import { GestureDetailModal } from '@/components/GestureDetailModal';
import Colors from '@/constants/colors';
import { SignGesture } from '@/types';

export default function GestureDetailScreen() {
  const { id } = useLocalSearchParams();
  const [gesture, setGesture] = useState<SignGesture | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      const foundGesture = signGestures.find(g => g.id === id);
      setGesture(foundGesture || null);
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [id]);
  
  const handleClose = () => {
    router.back();
  };
  
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ 
        headerShown: false,
        presentation: 'modal'
      }} />
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
        </View>
      ) : (
        gesture ? (
          <GestureDetailModal
            gesture={gesture}
            onClose={handleClose}
          />
        ) : (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.light.primary} />
          </View>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});