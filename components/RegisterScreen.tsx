import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import { Lock, User, Mail, Phone, MapPin } from 'lucide-react-native';
import { ref, set, get } from 'firebase/database';
import { database } from '@/firebase/firebaseConfig';
import uuid from 'react-native-uuid';

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    if (!username.trim() || !password.trim() || !confirmPassword.trim() || !email.trim() || !phone.trim() || !address.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp!');
      return;
    }
    // Kiểm tra định dạng email đơn giản
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      Alert.alert('Lỗi', 'Email không hợp lệ!');
      return;
    }
    // Kiểm tra số điện thoại là số và có độ dài hợp lý
    if (!/^\d{9,12}$/.test(phone)) {
      Alert.alert('Lỗi', 'Số điện thoại không hợp lệ!');
      return;
    }
    try {
      // Kiểm tra trùng username hoặc email
      const usersRef = ref(database, 'users');
      const usersSnap = await get(usersRef);
      if (usersSnap.exists()) {
        const users = usersSnap.val();
        // Kiểm tra username hoặc email đã tồn tại
        const isUsernameTaken = Object.values(users).some((u: any) => u.username === username);
        const isEmailTaken = Object.values(users).some((u: any) => u.email === email);
        if (isUsernameTaken) {
          Alert.alert('Lỗi', 'Tên đăng nhập đã tồn tại!');
          return;
        }
        if (isEmailTaken) {
          Alert.alert('Lỗi', 'Email đã được sử dụng!');
          return;
        }
      }
      // Tạo ID mới cho tài khoản
      const id = uuid.v4();
      const userRef = ref(database, `users/${id}`);
      await set(userRef, { id, username, password, email, phone, address });
      Alert.alert('Thành công', 'Đăng ký thành công!');
      router.replace('/login');
    } catch (error) {
      console.log('Đăng ký lỗi:', error);
      Alert.alert('Lỗi', 'Đăng ký thất bại! ' + ((error as any)?.message || ''));
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.card}>
          <Text style={styles.header}>Tạo tài khoản mới</Text>
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
            <Mail size={20} color={Colors.primaryDark} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={Colors.textLight}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="next"
            />
          </View>
          <View style={styles.inputWrapper}>
            <Phone size={20} color={Colors.primaryDark} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Số điện thoại"
              placeholderTextColor={Colors.textLight}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              returnKeyType="next"
            />
          </View>
          <View style={styles.inputWrapper}>
            <MapPin size={20} color={Colors.primaryDark} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Địa chỉ"
              placeholderTextColor={Colors.textLight}
              value={address}
              onChangeText={setAddress}
              autoCapitalize="sentences"
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
              returnKeyType="next"
            />
          </View>
          <View style={styles.inputWrapper}>
            <Lock size={20} color={Colors.primaryDark} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Xác nhận mật khẩu"
              placeholderTextColor={Colors.textLight}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              returnKeyType="done"
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Đăng ký</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.loginLink} onPress={() => router.replace('/login')}>
            <Text style={styles.loginText}>Đã có tài khoản? <Text style={{color: Colors.primaryDark, fontWeight: 'bold'}}>Đăng nhập</Text></Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primaryDark,
    marginBottom: 24,
    marginTop: 4,
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
  loginLink: {
    marginTop: 18,
    alignItems: 'center',
  },
  loginText: {
    color: Colors.textLight,
    fontSize: 15,
  },
});
