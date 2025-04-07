import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Message, ConnectionStatus } from '@/types';

interface TranslationState {
  // Current translation
  currentLetter: string;
  currentSentence: string;
  
  // Conversation history
  messages: Message[];
  
  // Device connection
  connectionStatus: ConnectionStatus;
  isRecording: boolean;
  
  // Actions
  setCurrentLetter: (letter: string) => void;
  setCurrentSentence: (sentence: string) => void;
  addMessage: (text: string, isUser?: boolean) => void;
  clearMessages: () => void;
  setConnectionStatus: (status: Partial<ConnectionStatus>) => void;
  setIsRecording: (isRecording: boolean) => void;
  
  // Mock functions for demo
  startMockRecording: () => void;
  stopMockRecording: () => void;
}

// Mock letters to simulate receiving data
const mockLetters = ['H', 'E', 'L', 'L', 'O'];
const mockPhrases = [
  "Hello, how are you?",
  "I need help please",
  "Thank you very much",
  "Nice to meet you",
  "Can you help me?",
  "I don't understand"
];

export const useTranslationStore = create<TranslationState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentLetter: '',
      currentSentence: '',
      messages: [],
      connectionStatus: {
        isConnected: false,
        lastConnected: null,
        deviceName: null
      },
      isRecording: false,
      
      // Actions
      setCurrentLetter: (letter) => set({ currentLetter: letter }),
      
      setCurrentSentence: (sentence) => set({ currentSentence: sentence }),
      
      addMessage: (text, isUser = false) => set((state) => ({
        messages: [
          ...state.messages,
          {
            id: Date.now().toString(),
            text,
            timestamp: Date.now(),
            isUser
          }
        ]
      })),
      
      clearMessages: () => set({ messages: [], currentLetter: '', currentSentence: '' }),
      
      setConnectionStatus: (status) => set((state) => ({
        connectionStatus: { ...state.connectionStatus, ...status }
      })),
      
      setIsRecording: (isRecording) => set({ isRecording }),
      
      // Mock functions for demo
      startMockRecording: () => {
        const { setIsRecording, setCurrentLetter, setCurrentSentence } = get();
        setIsRecording(true);
        
        // Simulate connecting to device
        set((state) => ({
          connectionStatus: {
            ...state.connectionStatus,
            isConnected: true,
            lastConnected: Date.now(),
            deviceName: "Raspberry Pi Sign Glove"
          }
        }));
        
        // Clear current letter and sentence
        setCurrentLetter('');
        setCurrentSentence('');
        
        // Simulate receiving letters one by one
        let letterIndex = 0;
        let currentWord = '';
        
        const letterInterval = setInterval(() => {
          if (letterIndex < mockLetters.length) {
            const letter = mockLetters[letterIndex];
            setCurrentLetter(letter);
            currentWord += letter;
            setCurrentSentence(currentWord);
            letterIndex++;
          } else {
            clearInterval(letterInterval);
            
            // After spelling out the word, simulate getting a full phrase
            setTimeout(() => {
              const randomPhrase = mockPhrases[Math.floor(Math.random() * mockPhrases.length)];
              setCurrentSentence(randomPhrase);
              
              // Add the message to history after a short delay
              setTimeout(() => {
                get().addMessage(randomPhrase);
                get().stopMockRecording();
              }, 500);
            }, 1000);
          }
        }, 800);
      },
      
      stopMockRecording: () => {
        const { setIsRecording } = get();
        setIsRecording(false);
      }
    }),
    {
      name: 'translation-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        messages: state.messages,
        connectionStatus: state.connectionStatus
      }),
    }
  )
);