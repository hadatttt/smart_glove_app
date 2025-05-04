// // app/page.tsx
// import React from 'react';
// import { Text, View, Button } from 'react-native';
// import { initializeApp } from 'firebase/app';
// import { getDatabase, ref, get } from 'firebase/database';

// // Cấu hình Firebase
// const firebaseConfig = {
//   apiKey: "AIzaSyCCSXItwVo5IMv6M8cAc4lTidEf10yUwrM",
//   authDomain: "sign-language-glove-4cc7c.firebaseapp.com",
//   databaseURL: "https://sign-language-glove-4cc7c-default-rtdb.firebaseio.com",
//   projectId: "sign-language-glove-4cc7c",
//   storageBucket: "sign-language-glove-4cc7c.appspot.com",
//   messagingSenderId: "1044775588976",
//   appId: "1:1044775588976:web:e95614abf5f793a4df50b5",
//   measurementId: "G-XCT00REF7V"
// };

// // Khởi tạo Firebase
// const app = initializeApp(firebaseConfig);
// const database = getDatabase(app);

// const SignLookup = () => {
//   const [letter, setLetter] = React.useState('');
//   const [sentence, setSentence] = React.useState('');

//   const getSentence = () => {
//     const reference = ref(database, `signs/${letter.toUpperCase()}`);
//     get(reference).then((snapshot) => {
//       if (snapshot.exists()) {
//         setSentence(snapshot.val());
//       } else {
//         setSentence('Không tìm thấy dữ liệu!');
//       }
//     });
//   };

//   return (
//     <View style={{ padding: 20 }}>
//       <TextInput
//         placeholder="Nhập chữ cái (A, B, C...)"
//         value={letter}
//         onChangeText={setLetter}
//         style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
//       />
//       <Button title="Lấy câu" onPress={getSentence} />
//       <Text style={{ marginTop: 20, fontSize: 18 }}>{sentence}</Text>
//     </View>
//   );
// };

// export default SignLookup;
