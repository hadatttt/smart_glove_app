export interface Message {
    id: string;
    text: string;
    timestamp: number;
    isUser: boolean;
  }
  
  export interface ConnectionStatus {
    isConnected: boolean;
    lastConnected: number | null;
    deviceName: string | null;
  }
  
  export interface SignGesture {
    id: string;
    letter: string;
    name: string;
    description: string;
    imageUrl: string;
    difficulty: 'easy' | 'medium' | 'hard';
  }