export interface LearningItem {
    id: string;
    letter: string;
    description: string;
    sentences: string;
    imageKey: string;
  }
  
  export interface SignData {
    letter?: string;
    description?: string;
    sentences?: string;
    imageKey?: string;
  }