import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Colors from '@/constants/colors';
import { LearningItem } from '@/types/translation';

interface LearningCardProps {
  item: LearningItem;
  onPress: (item: LearningItem) => void;
}

export const LearningCard = ({ item, onPress }: LearningCardProps) => {
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => onPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: item.imageUrl }} 
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.word || item.letter}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: '48%',
    marginBottom: 16,
  },
  imageContainer: {
    width: '100%',
    height: 120,
    backgroundColor: Colors.secondary,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    padding: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: Colors.textLight,
  },
});