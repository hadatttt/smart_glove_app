import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Colors from '@/constants/colors';
import { LearningCardList } from '@/components/LearningCardList';
import { LearningDetail } from '@/components/LearningDetail';
import { LearningItem } from '@/types/translation';

export default function LearningScreen() {
  const [selectedItem, setSelectedItem] = useState<LearningItem | null>(null);

  const handleSelectItem = (item: LearningItem) => {
    setSelectedItem(item);
  };

  const handleBack = () => {
    setSelectedItem(null);
  };

  if (selectedItem) {
    return <LearningDetail item={selectedItem} onBack={handleBack} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.content}>
        <Text style={styles.subtitle}>
          Học ngôn ngữ ký hiệu qua các ký hiệu phổ biến dưới đây
        </Text>
        
        <LearningCardList onItemPress={handleSelectItem} />
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
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textLight,
    marginBottom: 24,
    textAlign: 'center',
  },
});