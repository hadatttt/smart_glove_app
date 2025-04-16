import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TranslationMessage {
  id: string;
  text: string;
  timestamp: number;
  isPending?: boolean;
}

interface ConnectionStatus {
  connected: boolean;
  deviceName?: string;
  errorMessage?: string;
}

interface TranslationState {
  currentLetter: string;
  currentSentence: string;
  messages: TranslationMessage[];
  connectionStatus: ConnectionStatus;
  readingSpeed: number;
  isRecording: boolean;
  
  // Actions
  setCurrentLetter: (letter: string) => void;
  setCurrentSentence: (sentence: string) => void;
  addMessage: (text: string, isPending?: boolean) => void;
  updateLastMessage: (text: string) => void;
  completeLastMessage: () => void;
  clearMessages: () => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
  setReadingSpeed: (speed: number) => void;
  toggleRecording: () => void;
  resetCurrentInput: () => void;
}

export const useTranslationStore = create<TranslationState>()(
  persist(
    (set, get) => ({
      currentLetter: '',
      currentSentence: '',
      messages: [],
      connectionStatus: {
        connected: false,
      },
      readingSpeed: 1.0,
      isRecording: false,
      
      setCurrentLetter: (letter) => {
        set({ currentLetter: letter });
        // Tự động thêm vào câu hiện tại
        if (letter) {
          set({ currentSentence: get().currentSentence + letter });
        }
      },
      
      setCurrentSentence: (sentence) => set({ currentSentence: sentence }),
      
      addMessage: (text, isPending = false) => set((state) => {
        // Nếu là tin nhắn pending và đã có tin nhắn pending trước đó, cập nhật nó
        if (isPending && state.messages.length > 0 && state.messages[state.messages.length - 1].isPending) {
          const updatedMessages = [...state.messages];
          updatedMessages[updatedMessages.length - 1] = {
            ...updatedMessages[updatedMessages.length - 1],
            text,
            timestamp: Date.now(),
          };
          return { messages: updatedMessages };
        }
        
        // Thêm tin nhắn mới
        return {
          messages: [
            ...state.messages,
            {
              id: Date.now().toString(),
              text,
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
        
        // Chuyển tin nhắn pending thành hoàn chỉnh
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
        currentSentence: '' 
      }),
      
      setConnectionStatus: (status) => set({ connectionStatus: status }),
      
      setReadingSpeed: (speed) => set({ readingSpeed: speed }),
      
      toggleRecording: () => set((state) => ({ 
        isRecording: !state.isRecording,
        // Reset khi bắt đầu ghi âm mới
        ...(!state.isRecording ? { 
          currentLetter: '', 
          currentSentence: '' 
        } : {})
      })),
      
      resetCurrentInput: () => set({ 
        currentLetter: '', 
        currentSentence: '' 
      }),
    }),
    {
      name: 'translation-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Chỉ lưu trữ những dữ liệu cần thiết
      partialize: (state) => ({
        messages: state.messages.filter(m => !m.isPending), // Không lưu tin nhắn tạm
        readingSpeed: state.readingSpeed,
      }),
    }
  )
);