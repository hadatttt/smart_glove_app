import { Platform } from 'react-native';
import { useTranslationStore } from '@/store/translation-store';

// Địa chỉ WebSocket mặc định
const DEFAULT_WEBSOCKET_URL = 'ws://10.0.2.2:8080';

// Biến lưu trữ kết nối WebSocket
let websocket: WebSocket | null = null;

// Kết nối với Raspberry Pi qua WebSocket
export const connectToRaspberryPi = async (ipAddress: string = '10.0.2.2', port: number = 8080) => {
  try {
    // Đóng kết nối cũ nếu có
    if (websocket) {
      websocket.close();
    }

    // Tạo URL WebSocket
    const wsUrl = `ws://${ipAddress}:${port}`;
    console.log(`Đang kết nối đến: ${wsUrl}`);
    
    // Cập nhật trạng thái đang kết nối
    useTranslationStore.getState().setConnectionStatus({
      connected: false,
      deviceName: `Đang kết nối...`,
    });

    // Tạo kết nối WebSocket mới
    return new Promise((resolve, reject) => {
      websocket = new WebSocket(wsUrl);

      // Xử lý sự kiện khi kết nối mở
      websocket.onopen = () => {
        console.log('Kết nối WebSocket đã được thiết lập');
        useTranslationStore.getState().setConnectionStatus({
          connected: true,
          deviceName: `Raspberry Pi (${ipAddress}:${port})`,
        });
        resolve(true);
      };

      // Xử lý sự kiện khi nhận tin nhắn
      websocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Nhận dữ liệu:', data);
          
          // Xử lý dữ liệu nhận được
          if (data.letter) {
            // Cập nhật chữ cái hiện tại
            useTranslationStore.getState().setCurrentLetter(data.letter);
            
            // Tích lũy vào câu hiện tại
            const currentSentence = useTranslationStore.getState().currentSentence + data.letter;
            useTranslationStore.getState().setCurrentSentence(currentSentence);
          }
          
          if (data.sentence) {
            // Thêm câu hoàn chỉnh vào danh sách tin nhắn
            useTranslationStore.getState().addMessage(data.sentence);
          }
        } catch (error) {
          console.error('Lỗi khi xử lý dữ liệu WebSocket:', error);
        }
      };

      // Xử lý sự kiện khi đóng kết nối
      websocket.onclose = (event) => {
        console.log(`Kết nối WebSocket đã đóng: ${event.code} ${event.reason}`);
        useTranslationStore.getState().setConnectionStatus({
          connected: false,
          errorMessage: 'Kết nối đã đóng',
        });
      };

      // Xử lý sự kiện khi có lỗi
      websocket.onerror = (error) => {
        console.error('Lỗi WebSocket:', error);
        useTranslationStore.getState().setConnectionStatus({
          connected: false,
          errorMessage: 'Không thể kết nối đến máy chủ',
        });
        reject(error);
      };

      // Đặt thời gian chờ kết nối
      setTimeout(() => {
        if (websocket?.readyState !== WebSocket.OPEN) {
          websocket?.close();
          useTranslationStore.getState().setConnectionStatus({
            connected: false,
            errorMessage: 'Kết nối bị quá thời gian',
          });
          reject(new Error('Kết nối bị quá thời gian'));
        }
      }, 5000);
    });
  } catch (error) {
    console.error('Lỗi khi kết nối WebSocket:', error);
    useTranslationStore.getState().setConnectionStatus({
      connected: false,
      errorMessage: error instanceof Error ? error.message : 'Đã xảy ra lỗi không xác định',
    });
    return false;
  }
};

// Ngắt kết nối WebSocket
export const disconnectFromRaspberryPi = async () => {
  if (websocket) {
    websocket.close();
    websocket = null;
  }
  
  useTranslationStore.getState().setConnectionStatus({
    connected: false,
  });
  
  return true;
};

// Bắt đầu lắng nghe dữ liệu
export const startListeningForData = () => {
  if (!websocket || websocket.readyState !== WebSocket.OPEN) {
    // Nếu không có kết nối WebSocket, thử kết nối lại
    connectToRaspberryPi();
  }
  
  // Gửi lệnh bắt đầu ghi âm đến máy chủ (nếu cần)
  if (websocket && websocket.readyState === WebSocket.OPEN) {
    websocket.send(JSON.stringify({ command: 'start_recording' }));
  }
  
  // Trả về hàm dọn dẹp
  return () => {
    // Gửi lệnh dừng ghi âm đến máy chủ (nếu cần)
    if (websocket && websocket.readyState === WebSocket.OPEN) {
      websocket.send(JSON.stringify({ command: 'stop_recording' }));
    }
  };
};
import * as Speech from 'expo-speech';
// Mô phỏng chuyển văn bản thành giọng nói
export const speakText = (text: string, speed: number = 1.0) => {
  if (!text?.trim()) return;

  if (Platform.OS === 'web') {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN';
      utterance.rate = speed;

      const voices = window.speechSynthesis.getVoices();
      const vietnameseVoice = voices.find(voice =>
        voice.lang === 'vi-VN' || voice.lang.startsWith('vi')
      );
      if (vietnameseVoice) {
        utterance.voice = vietnameseVoice;
      }

      window.speechSynthesis.speak(utterance);
    }
  } else {
    Speech.speak(text, {
      language: 'vi-VN',
      rate: speed,
    });
  }
};