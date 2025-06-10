import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/auth-store';
import Colors from '@/constants/colors';
import { Lock, User } from 'lucide-react-native';
import { ref, get } from 'firebase/database';
import { database } from '@/firebase/firebaseConfig';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    try {
      const usersRef = ref(database, 'users');
      const usersSnap = await get(usersRef);
      if (!usersSnap.exists()) {
        Alert.alert('Lỗi', 'Không tìm thấy tài khoản!');
        return;
      }
      const users = usersSnap.val();
      const foundUser = Object.values(users).find((u: any) => u.username === username && u.password === password);
      if (!foundUser) {
        Alert.alert('Lỗi', 'Tên đăng nhập hoặc mật khẩu không đúng!');
        return;
      }
      login();
      // @ts-ignore
      globalThis.loggedInUser = { username };
      router.replace('/(tabs)');
    } catch (error) {
      console.log('Lỗi đăng nhập:', error);
      Alert.alert('Lỗi', 'Đăng nhập thất bại! ' + ((error as any)?.message || ''));
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.card}>
          <Text style={styles.header}>Chào mừng bạn!</Text>
          <Text style={styles.subHeader}>Đăng nhập để tiếp tục</Text>
          <View style={styles.inputWrapper}>
            <User size={20} color={Colors.primaryDark} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Tên đăng nhập"
              placeholderTextColor={Colors.textLight}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              returnKeyType="next"
            />
          </View>
          <View style={styles.inputWrapper}>
            <Lock size={20} color={Colors.primaryDark} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Mật khẩu"
              placeholderTextColor={Colors.textLight}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              returnKeyType="done"
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Đăng nhập</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.registerLink} onPress={() => router.replace('/register')}>
            <Text style={styles.registerText}>Chưa có tài khoản? <Text style={{color: Colors.primaryDark, fontWeight: 'bold'}}>Đăng ký</Text></Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: Colors.primary,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 28,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.primaryDark,
    marginBottom: 8,
    marginTop: 4,
  },
  subHeader: {
    fontSize: 15,
    color: Colors.textLight,
    marginBottom: 28,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    borderRadius: 10,
    marginBottom: 16,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputIcon: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: Colors.text,
    backgroundColor: 'transparent',
  },
  button: {
    width: '100%',
    backgroundColor: Colors.primaryDark,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  registerLink: {
    marginTop: 18,
    alignItems: 'center',
  },
  registerText: {
    color: Colors.textLight,
    fontSize: 15,
  },
});
