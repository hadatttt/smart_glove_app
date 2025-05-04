import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { RotateCcw, Volume2, Volume1 } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useTranslationStore } from '@/store/translation-store';
import { speakText } from '@/services/raspberry-pi-service';

export const ControlButtons = () => {
  const {
    clearMessages,
    readingSpeed,
    setReadingSpeed,
    connectionStatus,
    currentSentence,
  } = useTranslationStore();

  const rotateAnim = useRef(new Animated.Value(0)).current;

  const handleReset = () => {
    const textToRead = 'Đã xóa cuộc trò chuyện';
    speakText(textToRead, 1.0);
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start(() => rotateAnim.setValue(0));

    clearMessages();
  };

  const handleSpeak = () => {
    if (!currentSentence || !currentSentence.trim()) {
      console.log('Không có câu để đọc!');
      speakText('Không có câu để đọc!', readingSpeed);
      return;
    }
    console.log('Đang đọc câu:', currentSentence);
    speakText(currentSentence, readingSpeed);
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.buttonsContainer}>
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <TouchableOpacity style={styles.actionButton} onPress={handleReset}>
            <RotateCcw size={20} color={Colors.white} />
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleSpeak}
        >
          <Volume2 size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.speedContainer}>
        {[0.5, 1.0, 1.5, 2.0].map((speed) => (
          <TouchableOpacity
            key={speed}
            style={styles.speedButton}
            onPress={() => setReadingSpeed(speed)}
            disabled={readingSpeed === speed}
          >
            <Volume1
              size={speed === 0.5 ? 14 : speed === 1.0 ? 14 : speed === 1.5 ? 16 : 18}
              color={readingSpeed === speed ? Colors.primaryDark : Colors.textLight}
            />
            <Text
              style={[
                styles.speedText,
                readingSpeed === speed && styles.activeSpeedText,
              ]}
            >
              {speed}x
            </Text>
          </TouchableOpacity>
        ))}
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
  disabledButton: {
    backgroundColor: Colors.textLight,
    opacity: 0.6,
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