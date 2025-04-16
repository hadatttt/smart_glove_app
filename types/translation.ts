export interface TranslationMessage {
  id: string;
  text: string;
  timestamp: number;
}

export interface ConnectionStatus {
  connected: boolean;
  deviceName?: string;
  errorMessage?: string;
}

export interface LearningItem {
  id: string;
  letter: string;
  word?: string;
  description: string;
  imageUrl: string;
}