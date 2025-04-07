import React, { useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView,
  FlatList
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Colors from '@/constants/colors';
import { useTranslationStore } from '@/stores/translation-store';
import { MessageBubble } from '@/components/MessageBubble';
import { RecordButton } from '@/components/RecordButton';
import { ResetButton } from '@/components/ResetButton';
import { ConnectionStatus } from '@/components/ConnectionStatus';
import { Message } from '@/types';

export default function TranslateScreen() {
  const { 
    currentLetter, 
    currentSentence, 
    messages, 
    isRecording 
  } = useTranslationStore();
  
  const scrollViewRef = useRef<ScrollView>(null);
  const flatListRef = useRef<FlatList>(null);
  
  // Scroll to bottom when new messages arrive
  React.useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        if (flatListRef.current) {
          flatListRef.current.scrollToEnd({ animated: true });
        }
      }, 100);
    }
  }, [messages]);
  
  const renderMessage = ({ item }: { item: Message }) => (
    <MessageBubble
      message={item.text}
      isUser={item.isUser}
      timestamp={item.timestamp}
    />
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.letterContainer}>
        <Text style={styles.letterText}>
          {currentLetter || (isRecording ? '...' : 'Ready')}
        </Text>
      </View>
      
      <View style={styles.sentenceContainer}>
        <Text style={styles.sentenceText}>
          {currentSentence || (isRecording ? 'Listening...' : 'Tap the mic to start')}
        </Text>
      </View>
      
      <ConnectionStatus />
      
      <View style={styles.conversationContainer}>
        <View style={styles.conversationHeader}>
          <Text style={styles.conversationTitle}>Conversation</Text>
        </View>
        
        {messages.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No messages yet. Start signing to begin a conversation.
            </Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messagesContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
      
      <View style={styles.controlsContainer}>
        <ResetButton />
        <RecordButton />
        <View style={styles.placeholderButton} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  letterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  letterText: {
    fontSize: 64,
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
  sentenceContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sentenceText: {
    fontSize: 18,
    textAlign: 'center',
    color: Colors.light.text,
  },
  conversationContainer: {
    flex: 1,
    backgroundColor: Colors.light.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  conversationHeader: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  conversationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.light.textLight,
    textAlign: 'center',
    lineHeight: 24,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 20,
    backgroundColor: Colors.light.white,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  placeholderButton: {
    width: 50,
  },
});