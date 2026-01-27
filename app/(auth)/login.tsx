import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../utils/firebaseConfig';
import { FontAwesome } from '@expo/vector-icons'; // Icon library

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Success! Navigate to the main app
      router.replace('../(tabs)/home');
    } catch (error: any) {
      // Show user-friendly error messages
      let msg = error.message;
      if (msg.includes('auth/invalid-email')) msg = 'Invalid email address.';
      if (msg.includes('auth/invalid-credential')) msg = 'Wrong email or password.';
      Alert.alert('Login Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white px-6 justify-center"
    >
      {/* Header */}
      <View className="items-center mb-10">
        <View className="bg-primary/20 p-4 rounded-full mb-4">
           <FontAwesome name="user" size={40} color="#86EFAC" />
        </View>
        <Text className="text-3xl font-bold text-dark">Welcome Back!</Text>
        <Text className="text-gray-500 mt-2">Log in to your account</Text>
      </View>

      {/* Input Fields */}
      <View className="space-y-4">
        <View className="bg-gray-100 rounded-xl px-4 py-3 border border-gray-200 focus:border-primary">
          <TextInput 
            placeholder="Email Address" 
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            className="text-dark text-base"
          />
        </View>

        <View className="bg-gray-100 rounded-xl px-4 py-3 border border-gray-200 focus:border-primary">
          <TextInput 
            placeholder="Password" 
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            className="text-dark text-base"
          />
        </View>
        
        {/* Forgot Password Link */}
        <TouchableOpacity className="items-end mb-6">
          <Text className="text-gray-500">Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      {/* Login Button */}
      <TouchableOpacity 
        onPress={handleLogin}
        disabled={loading}
        className={`bg-dark py-4 rounded-xl shadow-md ${loading ? 'opacity-70' : 'opacity-100'}`}
      >
        {loading ? (
          <ActivityIndicator color="#86EFAC" />
        ) : (
          <Text className="text-primary text-center font-bold text-lg">Log In</Text>
        )}
      </TouchableOpacity>

      {/* Sign Up Link */}
      <View className="flex-row justify-center mt-8">
        <Text className="text-gray-500">Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
          <Text className="text-green-600 font-bold">Sign Up</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}