import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { User, ArrowLeft } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface ProfileProps {
  user: {
    username?: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  onLogout: () => void;
  onBack: () => void;
}

export default function ProfileScreen({ user, onLogout, onBack }: ProfileProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ width: '100%', position: 'absolute', top: 24, left: 0, zIndex: 20 }}>
        <TouchableOpacity style={{ padding: 8, alignSelf: 'flex-start' }} onPress={onBack}>
          <ArrowLeft size={28} color={Colors.white} />
        </TouchableOpacity>
      </View>
      <View style={styles.headerBox}>
        <User size={70} color={Colors.white} style={styles.avatar} />
        <Text style={styles.username}>{user.username || 'Tài khoản'}</Text>
      </View>
      <View style={styles.infoBox}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>{user.email || '---'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Số điện thoại:</Text>
          <Text style={styles.infoValue}>{user.phone || '---'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Địa chỉ:</Text>
          <Text style={styles.infoValue}>{user.address || '---'}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary, 
    alignItems: 'center',
    paddingTop: 60,
  },
  headerBox: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 10,
    position: 'relative',
    width: '100%',
  },
  avatar: {
    marginTop: 10,
    marginBottom: 8,
  },
  infoBox: {
    width: '92%',
    backgroundColor: Colors.secondary,
    borderRadius: 18,
    padding: 28,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 32,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  infoLabel: {
    fontSize: 16,
    color: Colors.textLight,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 17,
    color: Colors.text,
    fontWeight: 'bold',
    flexShrink: 1,
    textAlign: 'right',
  },
  logoutButton: {
    marginTop: 10,
    backgroundColor: Colors.primaryDark,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 40,
    alignSelf: 'center',
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 0.5,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
    marginTop: 8,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
});
