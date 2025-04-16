import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { Mic, RotateCcw, Volume2, Volume1 } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useTranslationStore } from '@/store/translation-store';
import { startListeningForData, speakText } from '@/services/raspberry-pi-service';

export const ControlButtons = () => {
  const { isRecording, toggleRecording, messages, clearMessages, readingSpeed, setReadingSpeed, connectionStatus } = useTranslationStore();
  
  // Hiệu ứng cho nút ghi âm
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  
  // Bắt đầu/dừng lắng nghe khi trạng thái ghi âm thay đổi
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    
    if (isRecording && connectionStatus.connected) {
      cleanup = startListeningForData();
      
      // Bắt đầu hiệu ứng nhịp đập
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      // Dừng hiệu ứng nhịp đập
      pulseAnim.setValue(1);
      Animated.timing(pulseAnim).stop();
    }
    
    return () => {
      if (cleanup) cleanup();
    };
  }, [isRecording, connectionStatus.connected, pulseAnim]);
  
  const handleReset = () => {
    const textToRead = 'Đã xóa cuộc trò chuyện';
    speakText(textToRead, 1.0);
    // Hiệu ứng xoay
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      rotateAnim.setValue(0);
    });
    
    clearMessages();
  };
  
  const handleSpeak = () => {
    if (messages.length > 0) {
      const latestMessage = messages[messages.length - 1];
      speakText(latestMessage.text, readingSpeed);
    }
  };
  
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  
  return (
    <View style={styles.container}>
      <View style={styles.buttonsContainer}>
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <TouchableOpacity
            style={[
              styles.recordButton, 
              isRecording && styles.recordingButton,
              !connectionStatus.connected && styles.disabledButton
            ]}
            onPress={toggleRecording}
            disabled={!connectionStatus.connected}
          >
            <Mic size={24} color={Colors.white} />
          </TouchableOpacity>
        </Animated.View>
        
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <TouchableOpacity style={styles.actionButton} onPress={handleReset}>
            <RotateCcw size={20} color={Colors.white} />
          </TouchableOpacity>
        </Animated.View>
        
        <TouchableOpacity 
          style={[styles.actionButton, messages.length === 0 && styles.disabledButton]} 
          onPress={handleSpeak}
          disabled={messages.length === 0}
        >
          <Volume2 size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.speedContainer}>
        <TouchableOpacity 
          style={styles.speedButton} 
          onPress={() => setReadingSpeed(0.5)}
          disabled={readingSpeed === 0.5}
        >
          <Volume1 size={14} color={readingSpeed === 0.5 ? Colors.primaryDark : Colors.textLight} />
          <Text style={[styles.speedText, readingSpeed === 0.5 && styles.activeSpeedText]}>0.5x</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.speedButton} 
          onPress={() => setReadingSpeed(1.0)}
          disabled={readingSpeed === 1.0}
        >
          <Volume2 size={14} color={readingSpeed === 1.0 ? Colors.primaryDark : Colors.textLight} />
          <Text style={[styles.speedText, readingSpeed === 1.0 && styles.activeSpeedText]}>1.0x</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.speedButton} 
          onPress={() => setReadingSpeed(1.5)}
          disabled={readingSpeed === 1.5}
        >
          <Volume2 size={16} color={readingSpeed === 1.5 ? Colors.primaryDark : Colors.textLight} />
          <Text style={[styles.speedText, readingSpeed === 1.5 && styles.activeSpeedText]}>1.5x</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.speedButton} 
          onPress={() => setReadingSpeed(2.0)}
          disabled={readingSpeed === 2.0}
        >
          <Volume2 size={18} color={readingSpeed === 2.0 ? Colors.primaryDark : Colors.textLight} />
          <Text style={[styles.speedText, readingSpeed === 2.0 && styles.activeSpeedText]}>2.0x</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    marginBottom: 12,
  },
  recordButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
  },
  recordingButton: {
    backgroundColor: Colors.error,
  },
  disabledButton: {
    backgroundColor: Colors.textLight,
    opacity: 0.6,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  speedContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    backgroundColor: Colors.secondary,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  speedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    padding: 4,
  },
  speedText: {
    fontSize: 12,
    color: Colors.textLight,
  },
  activeSpeedText: {
    color: Colors.primaryDark,
    fontWeight: 'bold',
  },
});