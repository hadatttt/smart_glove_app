import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text } from 'react-native';
import { LearningCard } from './LearningCard';
import { database } from '../firebase/firebaseConfig';
import { ref, onValue } from 'firebase/database';
import { LearningItem, SignData } from '../types/types';

interface LearningCardListProps {
  onItemPress?: (item: LearningItem) => void;
}

export const LearningCardList = ({ onItemPress }: LearningCardListProps) => {
  const [learningItems, setLearningItems] = useState<LearningItem[]>([]);

  useEffect(() => {
    const signsRef = ref(database, 'signs');
    const unsubscribe = onValue(signsRef, (snapshot) => {
      const data = snapshot.val();
      // console.log('Dữ liệu thô từ Firebase:', data); // Log dữ liệu thô
      if (data) {
        const itemsArray = Object.entries(data).map(([key, signData]) => {
          const typedSignData = signData as SignData;
          const item: LearningItem = {
            id: key,
            letter: typedSignData.letter || key,
            description: typedSignData.description || 'Không có mô tả',
            sentences: typedSignData.sentences || 'Không có câu',
            imageKey: typedSignData.imageKey || `hand_sign_${key.toLowerCase()}`,
          };
          // console.log('Item được tạo:', item); // Log từng item
          return item;
        });
        setLearningItems(itemsArray);
        // console.log('Dữ liệu itemsArray:', itemsArray); // Log toàn bộ mảng
      } else {
        setLearningItems([]);
        console.log('Không có dữ liệu từ Firebase');
      }
    }, (error) => {
      console.error('Lỗi khi lấy dữ liệu từ Firebase:', error);
    });

    return () => unsubscribe();
  }, []);

  const handlePress = (item: LearningItem) => {
    console.log('Đã nhấn vào:', item);
    if (onItemPress) {
      onItemPress(item);
    }
  };

  return (
    <FlatList
      data={learningItems}
      renderItem={({ item }) => (
        <LearningCard item={item} onPress={handlePress} />
      )}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.list}
      ListEmptyComponent={<Text style={styles.emptyText}>Không có dữ liệu</Text>}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 8,
  },
  row: {
    justifyContent: 'space-between',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    padding: 16,
  },
});