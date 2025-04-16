import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LearningItem } from '@/types/translation';

interface LearningState {
  items: LearningItem[];
  selectedItem: LearningItem | null;
  
  // Actions
  setSelectedItem: (item: LearningItem | null) => void;
}

export const useLearningStore = create<LearningState>()(
  persist(
    (set) => ({
      items: [
        {
          id: '1',
          letter: 'A',
          description: 'Nắm tay lại với ngón cái hướng lên dọc theo cạnh bàn tay.',
          imageUrl: 'https://images.unsplash.com/photo-1591706493620-5a1a4c8d3e38?q=80&w=1000&auto=format&fit=crop'
        },
        {
          id: '2',
          letter: 'B',
          description: 'Giữ bàn tay phẳng, các ngón tay khép lại, ngón cái gập vào lòng bàn tay.',
          imageUrl: 'https://images.unsplash.com/photo-1591706493620-5a1a4c8d3e38?q=80&w=1000&auto=format&fit=crop'
        },
        {
          id: '3',
          letter: 'C',
          description: 'Cong các ngón tay và ngón cái để tạo thành hình chữ C.',
          imageUrl: 'https://images.unsplash.com/photo-1591706493620-5a1a4c8d3e38?q=80&w=1000&auto=format&fit=crop'
        },
        {
          id: '4',
          word: 'Xin chào',
          description: 'Bàn tay mở, các ngón tay dang rộng, lòng bàn tay hướng về phía trước, di chuyển qua lại.',
          imageUrl: 'https://images.unsplash.com/photo-1591706493620-5a1a4c8d3e38?q=80&w=1000&auto=format&fit=crop'
        },
        {
          id: '5',
          word: 'Cảm ơn',
          description: 'Chạm môi bằng đầu ngón tay, sau đó di chuyển bàn tay về phía trước.',
          imageUrl: 'https://images.unsplash.com/photo-1591706493620-5a1a4c8d3e38?q=80&w=1000&auto=format&fit=crop'
        },
        {
          id: '6',
          letter: 'D',
          description: 'Tạo hình tròn với ngón cái và ngón trỏ, các ngón khác duỗi thẳng lên.',
          imageUrl: 'https://images.unsplash.com/photo-1591706493620-5a1a4c8d3e38?q=80&w=1000&auto=format&fit=crop'
        },
        {
          id: '7',
          letter: 'E',
          description: 'Cong các ngón tay vào trong, với ngón cái gập dưới các ngón.',
          imageUrl: 'https://images.unsplash.com/photo-1591706493620-5a1a4c8d3e38?q=80&w=1000&auto=format&fit=crop'
        },
        {
          id: '8',
          letter: 'F',
          description: 'Chạm ngón cái vào ngón trỏ, các ngón khác duỗi thẳng lên.',
          imageUrl: 'https://images.unsplash.com/photo-1591706493620-5a1a4c8d3e38?q=80&w=1000&auto=format&fit=crop'
        },
        {
          id: '9',
          word: 'Làm ơn',
          description: 'Xoa lòng bàn tay theo chuyển động tròn trên ngực.',
          imageUrl: 'https://images.unsplash.com/photo-1591706493620-5a1a4c8d3e38?q=80&w=1000&auto=format&fit=crop'
        },
        {
          id: '10',
          word: 'Xin lỗi',
          description: 'Nắm tay lại và xoa theo chuyển động tròn trên ngực.',
          imageUrl: 'https://images.unsplash.com/photo-1591706493620-5a1a4c8d3e38?q=80&w=1000&auto=format&fit=crop'
        },
      ],
      selectedItem: null,
      
      setSelectedItem: (item) => set({ selectedItem: item }),
    }),
    {
      name: 'learning-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);