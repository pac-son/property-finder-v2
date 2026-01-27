import { View, Text, TouchableOpacity } from 'react-native';
import { auth } from '../../utils/firebaseConfig';
import { useRouter } from 'expo-router';

export default function Profile() {
  const router = useRouter();

  const handleLogout = async () => {
    await auth.signOut();
    router.replace('/(auth)/login');
  };

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold mb-4">Profile</Text>
      <TouchableOpacity onPress={handleLogout} className="bg-red-500 px-6 py-3 rounded-xl">
        <Text className="text-white font-bold">Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}