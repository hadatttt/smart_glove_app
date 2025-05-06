import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCCSXItwVo5IMv6M8cAc4lTidEf10yUwrM",
  authDomain: "sign-language-glove-4cc7c.firebaseapp.com",
  databaseURL: "https://sign-language-glove-4cc7c-default-rtdb.firebaseio.com",
  projectId: "sign-language-glove-4cc7c",
  storageBucket: "sign-language-glove-4cc7c.firebasestorage.app",
  messagingSenderId: "1044775588976",
  appId: "1:1044775588976:web:e95614abf5f793a4df50b5",
};

// Kiểm tra xem đã có app nào với tên [DEFAULT] chưa
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const database = getDatabase(app);

export { database };