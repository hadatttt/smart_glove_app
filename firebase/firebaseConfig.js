import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database"; // Thêm getDatabase

const firebaseConfig = {
  apiKey: "AIzaSyCCSXItwVo5IMv6M8cAc4lTidEf10yUwrM",
  authDomain: "sign-language-glove-4cc7c.firebaseapp.com",
  databaseURL: "https://sign-language-glove-4cc7c-default-rtdb.firebaseio.com",
  projectId: "sign-language-glove-4cc7c",
  storageBucket: "sign-language-glove-4cc7c.firebasestorage.app",
  messagingSenderId: "1044775588976",
  appId: "1:1044775588976:web:e95614abf5f793a4df50b5",
  measurementId: "G-XCT00REF7V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app); // Khởi tạo Realtime Database

export { database }; // Export để sử dụng trong các file khác