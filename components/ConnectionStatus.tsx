import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Wifi, WifiOff } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useTranslationStore } from '@/stores/translation-store';

export const ConnectionStatus: React.FC = () => {
  const { connectionStatus } = useTranslationStore();
  const { isConnected, deviceName } = connectionStatus;
  
  return (
    <View style={styles.container}>
      {isConnected ? (
        <View style={styles.connectedContainer}>
          <Wifi size={16} color={Colors.light.success} />
          <Text style={styles.connectedText}>
            Connected to {deviceName || 'Device'}
          </Text>
        </View>
      ) : (
        <View style={styles.disconnectedContainer}>
          <WifiOff size={16} color={Colors.light.textLight} />
          <Text style={styles.disconnectedText}>
            Not connected
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: Colors.light.card,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  connectedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  disconnectedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  connectedText: {
    fontSize: 14,
    color: Colors.light.success,
    fontWeight: '500',
  },
  disconnectedText: {
    fontSize: 14,
    color: Colors.light.textLight,
  },
});