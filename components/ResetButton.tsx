import React from 'react';
import { TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import { RefreshCw } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useTranslationStore } from '@/stores/translation-store';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export const ResetButton: React.FC = () => {
  const { clearMessages } = useTranslationStore();
  const rotateAnim = new Animated.Value(0);
  
  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    // Rotate animation
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.bounce,
      useNativeDriver: true,
    }).start(() => {
      rotateAnim.setValue(0);
      clearMessages();
    });
  };
  
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <RefreshCw
          size={24}
          color={Colors.light.primary}
          strokeWidth={2.5}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.light.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.light.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
});