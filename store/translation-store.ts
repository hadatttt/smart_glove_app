import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { database } from '../firebase/firebaseConfig';
import { ref, get as firebaseGet, onValue } from 'firebase/database';

interface TranslationMessage {
  id: string;
  text: string;
  cau?: string;
  timestamp: number;
  isPending?: boolean;
}

interface ConnectionStatus {
  connected: boolean;
  deviceName?: string;
  errorMessage?: string;
  firebaseConnected?: boolean;
}

interface TranslationState {
  currentLetter: string;
  currentSentence: string;
  messages: TranslationMessage[];
  connectionStatus: ConnectionStatus;
  readingSpeed: number;
  isRecording: boolean;

  setCurrentLetter: (letter: string) => void;
  setCurrentSentence: (sentence: string) => void;
  addMessage: (text: string, cau?: string, isPending?: boolean) => void;
  updateLastMessage: (text: string) => void;
  completeLastMessage: () => void;
  clearMessages: () => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
  setReadingSpeed: (speed: number) => void;
  toggleRecording: () => void;
  resetCurrentInput: () => void;
  addCharacterToSentence: (char: string) => void;
  checkFirebaseConnection: () => void;
}

export const useTranslationStore = create<TranslationState>()(
  persist(
    (set, getState) => ({
      currentLetter: '',
      currentSentence: '',
      messages: [],
      connectionStatus: {
        connected: false,
      },
      readingSpeed: 1.0,
      isRecording: false,

      setCurrentLetter: async (letter) => {
        if (!letter) return;
        let sentence = 'Không có câu cho chữ này';
        try {
          const snapshotBB = await firebaseGet(ref(database, `signs/${letter}${letter}`));
          if (snapshotBB.exists && typeof snapshotBB.exists === 'function' && snapshotBB.exists()) {
            const data = snapshotBB.val();
            sentence = typeof data === 'string' ? data : (data.sentence || 'Không có câu cho chữ này');
            console.log(`Data at signs/${letter}${letter}:`, data);
          } else {
            const snapshotSingle = await firebaseGet(ref(database, `signs/${letter}`));
            if (snapshotSingle.exists && typeof snapshotSingle.exists === 'function' && snapshotSingle.exists()) {
              const data = snapshotSingle.val();
              sentence = typeof data === 'string' ? data : (data.sentence || 'Không có câu cho chữ này');
              console.log(`Data at signs/${letter}:`, data);
            } else {
              console.log(`No data at signs/${letter}${letter} or signs/${letter}`);
            }
          }
        } catch (error) {
          console.error('Lỗi khi đọc Firebase:', error);
          sentence = 'Lỗi khi lấy dữ liệu';
        }

        set((state) => ({
          currentLetter: letter,
          currentSentence: sentence,
          messages: [
            ...state.messages,
            {
              id: Date.now().toString(),
              text: letter,
              cau: sentence,
              timestamp: Date.now(),
            },
          ],
        }));
      },

      setCurrentSentence: (sentence) => set({ currentSentence: sentence }),

      addMessage: (text, cau, isPending = false) => set((state) => {
        if (isPending && state.messages.length > 0 && state.messages[state.messages.length - 1].isPending) {
          const updatedMessages = [...state.messages];
          updatedMessages[updatedMessages.length - 1] = {
            ...updatedMessages[updatedMessages.length - 1],
            text,
            cau: cau || updatedMessages[updatedMessages.length - 1].cau,
            timestamp: Date.now(),
          };
          return { messages: updatedMessages };
        }

        return {
          messages: [
            ...state.messages,
            {
              id: Date.now().toString(),
              text,
              cau,
              timestamp: Date.now(),
              isPending,
            },
          ],
        };
      }),

      updateLastMessage: (text) => set((state) => {
        if (state.messages.length === 0) return {};

        const updatedMessages = [...state.messages];
        updatedMessages[updatedMessages.length - 1] = {
          ...updatedMessages[updatedMessages.length - 1],
          text,
          timestamp: Date.now(),
        };

        return { messages: updatedMessages };
      }),

      completeLastMessage: () => set((state) => {
        if (state.messages.length === 0) return {};

        const updatedMessages = [...state.messages];
        const lastMessage = updatedMessages[updatedMessages.length - 1];

        if (lastMessage.isPending) {
          updatedMessages[updatedMessages.length - 1] = {
            ...lastMessage,
            isPending: false,
          };
          return { messages: updatedMessages };
        }

        return {};
      }),

      clearMessages: () => set({
        messages: [],
        currentLetter: '',
        currentSentence: '',
      }),

      setConnectionStatus: (status) => set({ connectionStatus: status }),

      setReadingSpeed: (speed) => set({ readingSpeed: speed }),

      toggleRecording: () => set((state) => ({
        isRecording: !state.isRecording,
        ...(!state.isRecording ? {
          currentLetter: '',
          currentSentence: '',
        } : {}),
      })),

      resetCurrentInput: () => set({
        currentLetter: '',
        currentSentence: '',
      }),

      addCharacterToSentence: (char) => set((state) => {
        const updatedSentence = state.currentSentence + char;
        return { currentSentence: updatedSentence };
      }),

      checkFirebaseConnection: () => {
        const connectionRef = ref(database, '.info/connected');
        onValue(
          connectionRef,
          (snapshot) => {
            if (snapshot.val() === true) {
              console.log('Kết nối đến Firebase Realtime Database thành công!');
              set((state) => ({
                connectionStatus: {
                  ...state.connectionStatus,
                  firebaseConnected: true,
                  errorMessage: undefined,
                },
              }));
              const testRef = ref(database, 'signs/B');
              firebaseGet(testRef).then((snap) => {
                if (snap.exists()) {
                  console.log('Dữ liệu test từ signs/B:', snap.val());
                } else {
                  console.log('Không tìm thấy dữ liệu tại signs/B');
                }
              }).catch((error) => {
                console.error('Lỗi khi đọc dữ liệu test:', error);
              });
            } else {
              console.log('Không thể kết nối đến Firebase Realtime Database!');
              set((state) => ({
                connectionStatus: {
                  ...state.connectionStatus,
                  firebaseConnected: false,
                  errorMessage: 'Không thể kết nối đến Firebase',
                },
              }));
            }
          },
          (error) => {
            // console.error('Lỗi khi kiểm tra kết nối Firebase:', error);
            set((state) => ({
              connectionStatus: {
                ...state.connectionStatus,
                firebaseConnected: false,
                errorMessage: error.message,
              },
            }));
          }
        );
      },
    }),
    {
      name: 'translation-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        messages: state.messages.filter(m => !m.isPending),
        readingSpeed: state.readingSpeed,
      }),
    }
  )
);