import React, { useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Colors from '@/constants/colors';
import { ConnectionStatus } from '@/components/ConnectionStatus';
import { LetterDisplay } from '@/components/LetterDisplay';
import { ChatDialog } from '@/components/ChatDialog';
import { ControlButtons } from '@/components/ControlButtons';
import { useRouter } from 'expo-router';
import { LogIn, User } from 'lucide-react-native';
import { useAuthStore } from '@/store/auth-store';

export default function TranslationScreen() {
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    // Lấy username từ local/session hoặc global state nếu cần
    if (isLoggedIn) {
      const storedUser = globalThis.loggedInUser;
      setUsername(storedUser?.username || null);
    } else {
      setUsername(null);
    }
  }, [isLoggedIn]);

  return (
    <SafeAreaView style={[styles.container, { paddingTop: 0 }]}>
      <StatusBar style="dark" />
<View style={{ 
  flexDirection: 'row', 
  justifyContent: 'space-between', 
  alignItems: 'center', 
  paddingHorizontal: 16, 
  marginTop: 50,
  position: 'relative'
}}>
  {/* Text ở giữa */}
  <Text style={{ 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: Colors.text,
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
  }}>
    Dịch Ngôn Ngữ Ký Hiệu
  </Text>

  {/* Icon hoặc button login/profile nằm phải */}
  {isLoggedIn ? (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.primaryDark,
        borderRadius: 20,
        padding: 8,
        marginLeft: 'auto',
      }}
      activeOpacity={0.85}
      onPress={() => router.replace('/profile')}
    >
      <User size={22} color={Colors.white} />
    </TouchableOpacity>
  ) : (
<TouchableOpacity
  style={{
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryDark,
    borderRadius: 12,             // nhỏ hơn
    paddingVertical: 4,           // giảm padding
    paddingHorizontal: 10,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
    marginLeft: 'auto',
  }}
  activeOpacity={0.85}
  onPress={() => router.replace('/login')}
>
  <LogIn size={22} color={Colors.white} style={{ marginRight: 4 }} />
</TouchableOpacity>

  )}
</View>

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