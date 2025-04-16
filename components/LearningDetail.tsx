import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { LearningItem } from '@/types/translation';

interface LearningDetailProps {
  item: LearningItem;
  onBack: () => void;
}

export const LearningDetail = ({ item, onBack }: LearningDetailProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{item.word || item.letter}</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Image 
          source={{ uri: item.imageUrl }} 
          style={styles.image}
          resizeMode="contain"
        />
        
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{item.word || item.letter}</Text>
          <Text style={styles.description}>{item.description}</Text>
          
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>Cách thực hiện:</Text>
            <View style={styles.instructionStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.stepText}>Đặt tay của bạn như trong hình</Text>
            </View>
            <View style={styles.instructionStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.stepText}>Đảm bảo các ngón tay ở đúng vị trí</Text>
            </View>
            <View style={styles.instructionStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.stepText}>Thực hành chuyển động nếu cần thiết</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 16,
    marginBottom: 24,
    backgroundColor: Colors.secondary,
  },
  infoContainer: {
    backgroundColor: Colors.secondary,
    borderRadius: 16,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 24,
    lineHeight: 24,
  },
  instructionsContainer: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  instructionStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  stepText: {
    fontSize: 14,
    color: Colors.text,
    flex: 1,
  },
});