import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Colors from '@/constants/colors';
import { useTranslationStore } from '@/store/translation-store';
import { speakText } from '@/services/raspberry-pi-service';

export const ChatDialog = () => {
  const { messages, readingSpeed } = useTranslationStore();
  const flatListRef = React.useRef<FlatList>(null);

  // Tự động cuộn xuống dưới khi có tin nhắn mới
  React.useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  // Tự động đọc tin nhắn mới nhất
  React.useEffect(() => {
    if (messages.length > 0) {
      const latestMessage = messages[messages.length - 1];
      speakText(latestMessage.text, readingSpeed);
    }
  }, [messages, readingSpeed]);

  if (messages.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Chưa có tin nhắn</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={({ item }) => (
          <View style={styles.messageContainer}>
            <View style={styles.messageBubble}>
              <Text style={styles.messageText}>{item.text}</Text>
            </View>
            <Text style={styles.timestamp}>
              {new Date(item.timestamp).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,
    borderRadius: 16,
    marginVertical: 12,
    maxHeight: 200,
  },
  contentContainer: {
    padding: 12,
    gap: 8,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: Colors.secondary,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
    maxHeight: 200,
  },
  emptyText: {
    color: Colors.textLight,
    fontSize: 16,
  },
  messageContainer: {
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  messageBubble: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderBottomRightRadius: 4,
    maxWidth: '80%',
  },
  messageText: {
    color: Colors.text,
    fontSize: 14,
  },
  timestamp: {
    fontSize: 10,
    color: Colors.textLight,
    marginTop: 2,
  },
});