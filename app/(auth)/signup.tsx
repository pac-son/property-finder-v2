import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore'; // New imports for Database
import { auth, db } from '../../utils/firebaseConfig';
import { FontAwesome } from '@expo/vector-icons';

export default function Signup() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'agent'>('user'); // Default to User
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!email || !password || !fullName) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      // 1. Create User in Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Update Auth Profile
      await updateProfile(user, { displayName: fullName });

      // 3. Save User Data to Firestore (Database)
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: email,
        fullName: fullName,
        role: role, // 'user' or 'agent'
        createdAt: new Date().toISOString(),
      });

      // 4. Navigate
      Alert.alert("Success", `Welcome, ${role === 'agent' ? 'Agent ' : ''}${fullName}!`);
      router.replace('../(tabs)/home');

    } catch (error: any) {
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
      <View className="flex-row bg-gray-100 p-1 rounded-xl mb-6 mx-4">
        <TouchableOpacity 
          onPress={() => setRole('user')}
          className={`flex-1 py-3 rounded-lg ${role === 'user' ? 'bg-white shadow-sm' : 'bg-transparent'}`}
        >
          <Text className={`text-center font-bold ${role === 'user' ? 'text-dark' : 'text-gray-400'}`}>
            I want to Buy
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => setRole('agent')}
          className={`flex-1 py-3 rounded-lg ${role === 'agent' ? 'bg-white shadow-sm' : 'bg-transparent'}`}
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