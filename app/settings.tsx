import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Wifi, Volume2, HelpCircle, Info, Settings2 } from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function SettingsScreen() {
  const [autoConnect, setAutoConnect] = React.useState(false);
  const [autoSpeak, setAutoSpeak] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Kết nối</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Wifi size={20} color={Colors.text} />
            <Text style={styles.settingText}>Tự động kết nối khi khởi động</Text>
          </View>
          <Switch
            value={autoConnect}
            onValueChange={setAutoConnect}
            trackColor={{ false: Colors.border, true: Colors.primary }}
            thumbColor={Colors.white}
          />
        </View>
        
        <Text style={styles.sectionTitle}>Giọng nói</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Volume2 size={20} color={Colors.text} />
            <Text style={styles.settingText}>Tự động đọc tin nhắn mới</Text>
          </View>
          <Switch
            value={autoSpeak}
            onValueChange={setAutoSpeak}
            trackColor={{ false: Colors.border, true: Colors.primary }}
            thumbColor={Colors.white}
          />
        </View>
        
        <Text style={styles.sectionTitle}>Giao diện</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Settings2 size={20} color={Colors.text} />
            <Text style={styles.settingText}>Chế độ tối</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: Colors.border, true: Colors.primary }}
            thumbColor={Colors.white}
          />
        </View>
        
        <Text style={styles.sectionTitle}>Thông tin</Text>
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <HelpCircle size={20} color={Colors.text} />
            <Text style={styles.settingText}>Trợ giúp & Hỗ trợ</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Info size={20} color={Colors.text} />
            <Text style={styles.settingText}>Về Dịch Ngôn Ngữ Ký Hiệu</Text>
          </View>
        </TouchableOpacity>
        
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Phiên bản 1.0.0</Text>
        </View>
      </ScrollView>
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
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primaryDark,
    marginTop: 24,
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingText: {
    fontSize: 16,
    color: Colors.text,
  },
  versionContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 14,
    color: Colors.textLight,
  },
});