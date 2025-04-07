import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { SignGesture } from '@/types';

interface GestureDetailModalProps {
  gesture: SignGesture;
  onClose: () => void;
}

export const GestureDetailModal: React.FC<GestureDetailModalProps> = ({ 
  gesture, 
  onClose 
}) => {
  const { letter, name, description, imageUrl, difficulty } = gesture;
  
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{name}</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <X size={24} color={Colors.light.text} />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
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
        
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Difficulty:</Text>
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
          
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>How to sign:</Text>
            <Text style={styles.description}>{description}</Text>
          </View>
          
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>Tips:</Text>
            <View style={styles.tipItem}>
              <View style={styles.tipBullet} />
              <Text style={styles.tipText}>Practice in front of a mirror</Text>
            </View>
            <View style={styles.tipItem}>
              <View style={styles.tipBullet} />
              <Text style={styles.tipText}>Focus on hand position and finger placement</Text>
            </View>
            <View style={styles.tipItem}>
              <View style={styles.tipBullet} />
              <Text style={styles.tipText}>Try to make smooth, confident movements</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.practiceButton}
          activeOpacity={0.8}
        >
          <Text style={styles.practiceButtonText}>Practice This Sign</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: 250,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  letterBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  letterText: {
    color: Colors.light.white,
    fontWeight: 'bold',
    fontSize: 18,
  },
  infoContainer: {
    padding: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginRight: 8,
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  difficultyText: {
    color: Colors.light.white,
    fontSize: 14,
    fontWeight: '500',
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.light.textLight,
  },
  tipsContainer: {
    marginBottom: 20,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  tipBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.light.primary,
    marginTop: 8,
    marginRight: 8,
  },
  tipText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: Colors.light.textLight,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  practiceButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  practiceButtonText: {
    color: Colors.light.white,
    fontSize: 16,
    fontWeight: '600',
  },
});