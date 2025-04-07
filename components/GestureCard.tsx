import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { SignGesture } from '@/types';

interface GestureCardProps {
  gesture: SignGesture;
  onPress: (gesture: SignGesture) => void;
}

export const GestureCard: React.FC<GestureCardProps> = ({ gesture, onPress }) => {
  const { letter, name, difficulty, imageUrl } = gesture;
  
  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'easy':
        return Colors.light.success;
      case 'medium':
        return Colors.light.warning;
      case 'hard':
        return Colors.light.danger;
      default:
        return Colors.light.info;
    }
  };
  
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(gesture)}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={[styles.letterBadge, { backgroundColor: Colors.light.primary }]}>
          <Text style={styles.letterText}>{letter}</Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.name}>{name}</Text>
        <View style={styles.difficultyContainer}>
          <View
            style={[
              styles.difficultyBadge,
              { backgroundColor: getDifficultyColor() },
            ]}
          >
            <Text style={styles.difficultyText}>
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.chevronContainer}>
        <ChevronRight size={20} color={Colors.light.textLight} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.light.white,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  imageContainer: {
    width: 80,
    height: 80,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  letterBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: Colors.light.primary,
  },
  letterText: {
    color: Colors.light.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
  },
  difficultyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  difficultyText: {
    color: Colors.light.white,
    fontSize: 12,
    fontWeight: '500',
  },
  chevronContainer: {
    justifyContent: 'center',
    paddingRight: 12,
  },
});