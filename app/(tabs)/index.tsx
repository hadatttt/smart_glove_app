import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Colors from '@/constants/colors';
import { ConnectionStatus } from '@/components/ConnectionStatus';
import { LetterDisplay } from '@/components/LetterDisplay';
import { ChatDialog } from '@/components/ChatDialog';
import { ControlButtons } from '@/components/ControlButtons';

export default function TranslationScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.content}>
        <ConnectionStatus />
        <View style={styles.mainContent}>
          <LetterDisplay />
          <ChatDialog />
        </View>
        <ControlButtons />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
});