import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Colors from '@/constants/colors';
import { useTranslationStore } from '@/store/translation-store';

export const LetterDisplay = () => {
  const { currentLetter, currentSentence, checkFirebaseConnection, connectionStatus } = useTranslationStore();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    checkFirebaseConnection();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [checkFirebaseConnection, fadeAnim]);

  const displaySentence = currentSentence || 
    (connectionStatus.firebaseConnected === false ? 'Không kết nối Firebase' : 'Đang chờ đầu vào...');

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.letterContainer}>
        <Text style={styles.letter}>{currentLetter || ' '}</Text>
      </View>
      <View style={styles.sentenceContainer}>
        <Text style={styles.sentence} numberOfLines={2}>
          {displaySentence}
        </Text>
        {!connectionStatus.firebaseConnected && (
          <Text style={styles.connectionStatus}>
            {/* {connectionStatus.errorMessage || 'Kiểm tra kết nối'} */}
          </Text>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 20,
    padding: 16,
    backgroundColor: Colors.white,
    borderRadius: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  letterContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  letter: {
    fontSize: 60,
    fontWeight: 'bold',
    color: Colors.white,
  },
  sentenceContainer: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    width: '100%',
    minHeight: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sentence: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.text,
    textAlign: 'center',
  },
  connectionStatus: {
    fontSize: 12,
    color: Colors.error,
    marginTop: 4,
    textAlign: 'center',
  },
});