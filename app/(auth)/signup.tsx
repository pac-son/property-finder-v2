import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../utils/firebaseConfig';
import { FontAwesome } from '@expo/vector-icons';

export default function Signup() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'agent'>('user');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!email || !password || !fullName) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      console.log("Starting signup..."); // Debug log 1

      // 1. Create User in Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("User created:", user.uid); // Debug log 2

      // 2. Update Auth Profile
      await updateProfile(user, { displayName: fullName });

      // 3. Save User Data to Firestore
      // NOTE: This is likely where it was failing before the Rules fix
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: email,
        fullName: fullName,
        role: role,
        createdAt: new Date().toISOString(),
      });
      console.log("Firestore data saved!"); // Debug log 3

      // 4. Success Alert & Navigate
      Alert.alert(
        "Success", 
        "Account created!", 
        [
          { text: "OK", onPress: () => router.replace('/(tabs)/home') }
        ]
      );

    } catch (error: any) {
      console.error("Signup Error:", error); // Print full error to terminal
      Alert.alert('Signup Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white px-6 justify-center"
    >
      <View className="items-center mb-6">
        <Text className="text-3xl font-bold text-dark">Create Account</Text>
        <Text className="text-gray-500 mt-2">Join us to find your dream home</Text>
      </View>

      {/* Role Selection Toggle */}
      {/* Role Selection Toggle - Crash Proof Version */}
      <View className="flex-row bg-gray-100 p-1 rounded-xl mb-6 mx-4">
        <TouchableOpacity 
          onPress={() => setRole('user')}
          className="flex-1 py-3 rounded-lg"
          // We use inline style for dynamic values to prevent the crash
          style={{ 
            backgroundColor: role === 'user' ? '#FFFFFF' : 'transparent',
            elevation: role === 'user' ? 2 : 0, // Android Shadow
            shadowColor: '#000',                // iOS Shadow
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: role === 'user' ? 0.1 : 0,
            shadowRadius: 2
          }}
        >
          <Text className={`text-center font-bold ${role === 'user' ? 'text-dark' : 'text-gray-400'}`}>
            I want to Buy
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => setRole('agent')}
          className="flex-1 py-3 rounded-lg"
          style={{ 
            backgroundColor: role === 'agent' ? '#FFFFFF' : 'transparent',
            elevation: role === 'agent' ? 2 : 0,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: role === 'agent' ? 0.1 : 0,
            shadowRadius: 2
          }}
        >
          <Text className={`text-center font-bold ${role === 'agent' ? 'text-dark' : 'text-gray-400'}`}>
            I'm an Agent
          </Text>
        </TouchableOpacity>
      </View>

      <View className="space-y-4">
        <View className="bg-gray-100 rounded-xl px-4 py-3 border border-gray-200">
          <TextInput placeholder="Full Name" value={fullName} onChangeText={setFullName} className="text-dark" />
        </View>
        <View className="bg-gray-100 rounded-xl px-4 py-3 border border-gray-200">
          <TextInput placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" className="text-dark" />
        </View>
        <View className="bg-gray-100 rounded-xl px-4 py-3 border border-gray-200">
          <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry className="text-dark" />
        </View>
      </View>

      <TouchableOpacity 
        onPress={handleSignup}
        disabled={loading}
        className={`bg-dark py-4 rounded-xl shadow-md mt-6 ${loading ? 'opacity-70' : 'opacity-100'}`}
      >
        {loading ? <ActivityIndicator color="#86EFAC" /> : <Text className="text-primary text-center font-bold text-lg">Sign Up as {role === 'agent' ? 'Agent' : 'User'}</Text>}
      </TouchableOpacity>
      
      <View className="flex-row justify-center mt-6">
        <Text className="text-gray-500">Already have an account? </Text>
        <TouchableOpacity onPress={() => router.back()}><Text className="text-green-600 font-bold">Log In</Text></TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}