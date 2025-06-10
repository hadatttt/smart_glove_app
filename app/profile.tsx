import ProfileScreen from '@/components/ProfileScreen';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { database } from '@/firebase/firebaseConfig';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/auth-store';

export default function Profile() {
  const [user, setUser] = useState<any>({});
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const fetchUser = async () => {
      // @ts-ignore
      const globalUser = globalThis.loggedInUser;
      if (!globalUser?.username) return;
      // Lấy toàn bộ users từ Firebase
      const usersRef = ref(database, 'users');
      const usersSnap = await get(usersRef);
      if (usersSnap.exists()) {
        const users = usersSnap.val();
        // Tìm user theo username
        const found = Object.values(users).find((u: any) => u.username === globalUser.username);
        if (found) setUser(found);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    logout();
    // @ts-ignore
    globalThis.loggedInUser = undefined;
    router.replace('/login');
  };

  const handleBack = () => {
    if (router.canGoBack?.()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ProfileScreen user={user} onLogout={handleLogout} onBack={handleBack} />
    </>
  );
}
