import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { TouchableOpacity, Text } from 'react-native';
import LoginScreen from '@/components/LoginScreen';
import { Stack } from 'expo-router';

export default function Login() {
  const router = useRouter();
  return (
    <>
    {/* an header mac dinhdinh */}
      <Stack.Screen options={{ headerShown: false }} /> 
      <TouchableOpacity
        style={{ position: 'absolute', top: 24, left: 16, zIndex: 10, flexDirection: 'row', alignItems: 'center' }}
        onPress={() => router.replace('/(tabs)')}
      >
        <ArrowLeft size={24} color={'#FF7A93'} />
        <Text style={{ color: '#FF7A93', fontWeight: 'bold', fontSize: 16, marginLeft: 4 }}>Trang chủ</Text>
      </TouchableOpacity>
      <LoginScreen />
    </>
  );
}
