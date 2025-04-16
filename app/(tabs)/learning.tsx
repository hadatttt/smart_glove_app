import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, FlatList, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Colors from '@/constants/colors';
import { LearningCard } from '@/components/LearningCard';
import { LearningDetail } from '@/components/LearningDetail';
import { useLearningStore } from '@/store/learning-store';
import { LearningItem } from '@/types/translation';

export default function LearningScreen() {
  const { items } = useLearningStore();
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
        
        <FlatList
          data={items}
          renderItem={({ item }) => (
            <LearningCard item={item} onPress={handleSelectItem} />
          )}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
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
  columnWrapper: {
    justifyContent: 'space-between',
  },
  listContent: {
    paddingBottom: 24,
  },
});