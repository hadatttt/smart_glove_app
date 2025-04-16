import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useTranslationStore } from '@/store/translation-store';
import { connectToRaspberryPi } from '@/services/raspberry-pi-service';

export const ConnectionStatus = () => {
  const { connectionStatus } = useTranslationStore();
  const [isConnecting, setIsConnecting] = React.useState(false);
  const [ipAddress, setIpAddress] = React.useState('10.0.2.2');
  const [port, setPort] = React.useState('8080');

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await connectToRaspberryPi(ipAddress, parseInt(port, 10));
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <View style={styles.container}>
      {connectionStatus.connected ? (
        <View style={styles.statusContainer}>
          <Wifi size={16} color={Colors.success} />
          <Text style={styles.statusText}>Đã kết nối với {connectionStatus.deviceName}</Text>
        </View>
      ) : (
        <View style={styles.disconnectedContainer}>
          <View style={styles.statusContainer}>
            <WifiOff size={16} color={Colors.error} />
            <Text style={styles.statusText}>
              {connectionStatus.errorMessage || 'Chưa kết nối'}
            </Text>
          </View>
          
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={ipAddress}
              onChangeText={setIpAddress}
              placeholder="IP"
              placeholderTextColor={Colors.textLight}
            />
            <Text style={styles.separator}>:</Text>
            <TextInput
              style={[styles.input, styles.portInput]}
              value={port}
              onChangeText={setPort}
              placeholder="Port"
              placeholderTextColor={Colors.textLight}
              keyboardType="numeric"
            />
            <TouchableOpacity 
              style={styles.button} 
              onPress={handleConnect}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <RefreshCw size={16} color={Colors.white} style={styles.spinningIcon} />
              ) : (
                <Text style={styles.buttonText}>Kết nối</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  disconnectedContainer: {
    gap: 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    fontSize: 14,
    color: Colors.text,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  input: {
    backgroundColor: Colors.white,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 14,
    flex: 1,
    color: Colors.text,
  },
  portInput: {
    flex: 0.4,
  },
  separator: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: Colors.primaryDark,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 70,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '500',
  },
  spinningIcon: {
    transform: [{ rotate: '45deg' }],
  },
});