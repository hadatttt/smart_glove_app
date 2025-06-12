import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, TextInput, Modal, Alert } from 'react-native';
import { RotateCcw, Volume2, Volume1, Edit } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useTranslationStore } from '@/store/translation-store';
import { speakText } from '@/services/raspberry-pi-service';
import { database } from '../firebase/firebaseConfig';
import { ref, set } from 'firebase/database';
import userSentences, { UserSentence } from '@/store/userSentences';
import { useAuthStore } from '@/store/auth-store';

export const ControlButtons = () => {
  const {
    clearMessages,
    readingSpeed,
    setReadingSpeed,
    connectionStatus,
    currentLetter,
    currentSentence,
    setCurrentSentence,
  } = useTranslationStore();

  const rotateAnim = useRef(new Animated.Value(0)).current;
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editedSentence, setEditedSentence] = useState('');

  const handleReset = () => {
    const textToRead = 'Đã xóa cuộc trò chuyện';
    speakText(textToRead, 1.0);
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start(() => rotateAnim.setValue(0));

    clearMessages();
  };

  // const handleSpeak = () => {
  //   if (!currentSentence || !currentSentence.trim()) {
  //     console.log('Không có câu để đọc!');
  //     speakText('Không có câu để đọc!', readingSpeed);
  //     return;
  //   }
  //   console.log('Đang đọc câu:', currentSentence);
  //   speakText(currentSentence, readingSpeed);
  // };
const [lastSpokenLetter, setLastSpokenLetter] = useState<string | null>(null);

  const handleSpeak = () => {
    if (!currentSentence || !currentSentence.trim()) {
      console.log('Không có câu để đọc!');
      speakText('Không có câu để đọc!', readingSpeed);
      return;
    }
    // Nếu ký tự hiện tại trùng với ký tự đã đọc trước đó, không đọc lại
    if (currentLetter && lastSpokenLetter === currentLetter) {
      console.log('Đã đọc ký tự này rồi, bỏ qua.');
      return;
    }
    console.log('Đang đọc câu:', currentSentence);
    speakText(currentSentence, readingSpeed);
    setLastSpokenLetter(currentLetter || null);
  };
  const handleEdit = () => {
    setEditedSentence(currentSentence || '');
    setIsEditModalVisible(true);
  };

  function getCurrentUserId() {
    // @ts-ignore
    if (typeof globalThis !== 'undefined' && globalThis.loggedInUser && globalThis.loggedInUser.id) {
      // @ts-ignore
      return globalThis.loggedInUser.id;
    }
    // Lấy userId từ store nếu đã đăng nhập
    const authUser = useAuthStore.getState().user;
    if (authUser && authUser.id) {
      return authUser.id;
    }
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('userId') || '';
    }
    return '';
  }

  const handleSaveEdit = async () => {
    if (!editedSentence.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập câu mới!');
      return;
    }

    if (!currentLetter) {
      Alert.alert('Lỗi', 'Không có chữ cái để cập nhật!');
      return;
    }

    try {
      const userId = getCurrentUserId();
      // Lưu vào userSentences local (theo userId)
      const idx = userSentences.findIndex((s) => s.char === currentLetter && s.userId === userId);
      if (idx !== -1) {
        userSentences[idx].sentence = editedSentence;
      } else {
        userSentences.push({ char: currentLetter, sentence: editedSentence, userId });
      }
      // Lưu lên Firebase theo usersentences/userId/letter
      const userSentenceRef = ref(database, `usersentences/${userId}/${currentLetter}`);
      await set(userSentenceRef, {
        char: currentLetter,
        sentence: editedSentence,
        userId,
      });
      // Không ghi đè signs nữa!
      setCurrentSentence(editedSentence);
      speakText(`Đã cập nhật: ${editedSentence}`, readingSpeed);
    } catch (error) {
      console.error('Lỗi khi lưu userSentences:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật câu!');
    }

    setIsEditModalVisible(false);
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.buttonsContainer}>
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <TouchableOpacity style={styles.actionButton} onPress={handleReset}>
            <RotateCcw size={20} color={Colors.white} />
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity style={styles.actionButton} onPress={handleSpeak}>
          <Volume2 size={20} color={Colors.white} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleEdit}>
          <Edit size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.speedContainer}>
        {[0.5, 1.0, 1.5, 2.0].map((speed) => (
          <TouchableOpacity
            key={speed}
            style={styles.speedButton}
            onPress={() => setReadingSpeed(speed)}
            disabled={readingSpeed === speed}
          >
            <Volume1
              size={speed === 0.5 ? 14 : speed === 1.0 ? 14 : speed === 1.5 ? 16 : 18}
              color={readingSpeed === speed ? Colors.primaryDark : Colors.textLight}
            />
            <Text
              style={[
                styles.speedText,
                readingSpeed === speed && styles.activeSpeedText,
              ]}
            >
              {speed}x
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Modal
        visible={isEditModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chỉnh sửa</Text>
            <Text style={styles.modalLetter}>Chữ cái: {currentLetter || 'Không có'}</Text>
            <TextInput
              style={styles.textInput}
              value={editedSentence}
              onChangeText={setEditedSentence}
              placeholder="Nhập câu mới..."
              multiline={true}
              numberOfLines={3}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleSaveEdit}
              >
                <Text style={styles.modalButtonText}>Lưu</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setIsEditModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Hủy</Text>
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
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    marginBottom: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: Colors.textLight,
    opacity: 0.6,
  },
  speedContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    backgroundColor: Colors.secondary,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  speedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    padding: 4,
  },
  speedText: {
    fontSize: 12,
    color: Colors.textLight,
  },
  activeSpeedText: {
    color: Colors.primaryDark,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  modalLetter: {
    fontSize: 16,
    color: Colors.textLight,
    marginBottom: 12,
  },
  textInput: {
    width: '100%',
    height: 80,
    borderWidth: 1,
    borderColor: Colors.secondary,
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
    textAlignVertical: 'top',
    color: Colors.text,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    backgroundColor: Colors.primaryDark,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  modalButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
});