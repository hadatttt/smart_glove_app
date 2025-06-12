import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, TextInput, Modal } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { ref, set } from 'firebase/database';
import { database } from '../firebase/firebaseConfig';
import Colors from '@/constants/colors';
import imageMap from '@/constants/imageMap';
import { LearningItem } from '@/types/types';
import userSentences from '@/store/userSentences';

function getCurrentUserId() {
  // @ts-ignore
  if (typeof globalThis !== 'undefined' && globalThis.loggedInUser && globalThis.loggedInUser.id) {
    // @ts-ignore
    return globalThis.loggedInUser.id;
  }
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem('userId') || '';
  }
  return '';
}

interface LearningDetailProps {
  item: LearningItem;
  onBack: () => void;
}

export const LearningDetail = ({ item, onBack }: LearningDetailProps) => {
  // Lấy câu tuỳ chỉnh theo userId nếu có
  const userId = getCurrentUserId();
  const userCustom = userSentences.find((s) => s.char === item.letter && s.userId === userId);
  const displaySentence = userCustom ? userCustom.sentence : item.sentences;

  // State cho modal chỉnh sửa
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editedSentence, setEditedSentence] = useState(displaySentence || '');

  const handleEditSentence = () => {
    setEditedSentence(displaySentence || '');
    setIsEditModalVisible(true);
  };

  const handleSaveEdit = async () => {
    if (!editedSentence.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập câu mới!');
      return;
    }
    try {
      // Lưu local
      const idx = userSentences.findIndex((s) => s.char === item.letter && s.userId === userId);
      if (idx !== -1) {
        userSentences[idx].sentence = editedSentence;
      } else {
        userSentences.push({ char: item.letter, sentence: editedSentence, userId });
      }
      // Lưu lên Firebase
      const userSentenceRef = ref(database, `usersentences/${userId}/${item.letter}`);
      await set(userSentenceRef, {
        char: item.letter,
        sentence: editedSentence,
        userId,
      });
      setIsEditModalVisible(false);
      // Cập nhật lại displaySentence ngay sau khi chỉnh sửa
      // (bằng cách setEditedSentence hoặc force update nếu cần)
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể cập nhật câu!');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: 30 }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{item.letter}</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Image 
          source={imageMap[item.imageKey] || imageMap['default']}
          style={styles.image}
          resizeMode="contain"
        />
        
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{item.letter}</Text>
          <Text style={styles.description}>{item.description}</Text>
          
          {displaySentence && (
            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionsTitle}>Ví dụ sử dụng:</Text>
              <Text style={styles.stepText}>{displaySentence}</Text>
              <TouchableOpacity style={{marginTop: 8, alignSelf: 'flex-end'}} onPress={handleEditSentence}>
                <Text style={{color: Colors.primary, fontWeight: 'bold'}}>Chỉnh sửa</Text>
              </TouchableOpacity>
            </View>
          )}

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
      <Modal
        visible={isEditModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0,0,0,0.5)'}}>
          <View style={{backgroundColor:'#fff',borderRadius:16,padding:20,width:'80%'}}>
            <Text style={{fontWeight:'bold',fontSize:18,marginBottom:8}}>Chỉnh sửa ví dụ sử dụng</Text>
            <TextInput
              style={{borderWidth:1,borderColor:Colors.secondary,borderRadius:8,padding:8,minHeight:60,marginBottom:12}}
              value={editedSentence}
              onChangeText={setEditedSentence}
              placeholder="Nhập câu mới..."
              multiline
            />
            <View style={{flexDirection:'row',justifyContent:'flex-end',gap:12}}>
              <TouchableOpacity onPress={handleSaveEdit} style={{backgroundColor:Colors.primary,paddingVertical:8,paddingHorizontal:16,borderRadius:8}}>
                <Text style={{color:'#fff',fontWeight:'bold'}}>Lưu</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>setIsEditModalVisible(false)} style={{backgroundColor:Colors.secondary,paddingVertical:8,paddingHorizontal:16,borderRadius:8}}>
                <Text style={{color:Colors.text,fontWeight:'bold'}}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    marginTop: 16,
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