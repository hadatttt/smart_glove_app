import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';
import { useTranslationStore } from '@/store/translation-store';

export const LetterDisplay = () => {
  const { currentLetter, currentSentence } = useTranslationStore();

  return (
    <View style={styles.container}>
      <View style={styles.letterContainer}>
        <Text style={styles.letter}>{currentLetter || ' '}</Text>
      </View>
      <View style={styles.sentenceContainer}>
        <Text style={styles.sentence}>{currentSentence || 'Đang chờ đầu vào...'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 20,
  },
  letterContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  letter: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.white,
  },
  sentenceContainer: {
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    width: '100%',
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sentence: {
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
  },
});