import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';

interface MessageBubbleProps {
  message: string;
  isUser?: boolean;
  timestamp?: number;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  isUser = false,
  timestamp
}) => {
  const formattedTime = timestamp 
    ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    : '';

  return (
    <View style={[
      styles.container,
      isUser ? styles.userContainer : styles.systemContainer
    ]}>
      <View style={[
        styles.bubble,
        isUser ? styles.userBubble : styles.systemBubble
      ]}>
        <Text style={[
          styles.messageText,
          isUser ? styles.userText : styles.systemText
        ]}>
          {message}
        </Text>
      </View>
      {timestamp && (
        <Text style={styles.timestamp}>{formattedTime}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    maxWidth: '80%',
    alignItems: 'flex-end',
  },
  userContainer: {
    alignSelf: 'flex-end',
  },
  systemContainer: {
    alignSelf: 'flex-start',
  },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 4,
  },
  userBubble: {
    backgroundColor: Colors.light.primary,
  },
  systemBubble: {
    backgroundColor: Colors.light.card,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: Colors.light.white,
  },
  systemText: {
    color: Colors.light.text,
  },
  timestamp: {
    fontSize: 12,
    color: Colors.light.textLight,
    marginHorizontal: 8,
  }
});