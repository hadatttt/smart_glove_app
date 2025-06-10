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
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginTop: 50 }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', color: Colors.text }}>Dịch Ngôn Ngữ Ký Hiệu</Text>
        {isLoggedIn ? (
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.primaryDark, borderRadius: 20, padding: 8 }}
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
              borderRadius: 20,
              paddingVertical: 8,
              paddingHorizontal: 16,
              shadowColor: Colors.shadow,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 4,
              elevation: 4,
            }}
            activeOpacity={0.85}
            onPress={() => router.replace('/login')}
          >
            <LogIn size={18} color={Colors.white} style={{ marginRight: 6 }} />
            <Text style={{ color: Colors.white, fontWeight: 'bold', fontSize: 15 }}>Đăng nhập</Text>
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