import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { signInAnonymously } from "firebase/auth";
import { auth } from "../../utils/firebaseConfig"; 

export default function Welcome() {
  const router = useRouter();

  const handleTestLogin = async () => {
    try {
      const userCredential = await signInAnonymously(auth);
      console.log("User signed in:", userCredential.user.uid);
      alert("Firebase Connected! User ID: " + userCredential.user.uid);
    } catch (error) {
      console.error(error);
      alert("Connection Failed. Check console.");
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Top Image Section */}
      <View className="flex-1 justify-center items-center p-4">
        <Image 
          // Placeholder image (replace with your asset later)
          source={{ uri: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1000&auto=format&fit=crop' }} 
          className="w-full h-[400px] rounded-3xl"
        />
      </View>

      {/* Bottom Text & Button Section */}
      <View className="flex-1 px-8 pt-8">
        <Text className="text-4xl font-bold text-center text-dark mb-4">
          Discover your <Text className="text-primary">Dream House</Text>
        </Text>
        
        <Text className="text-gray-500 text-center text-lg mb-10">
          Find the perfect place to live with just a few taps.
        </Text>

        <TouchableOpacity 
          onPress={() => router.push('/(auth)/login')}
          className="bg-dark py-4 rounded-full shadow-lg"
        >
          <Text className="text-primary text-center font-bold text-xl">
            Get Started
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={handleTestLogin}
          className="mt-4"
        >
          <Text className="text-center text-gray-400 underline">
            Test Firebase Connection
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}