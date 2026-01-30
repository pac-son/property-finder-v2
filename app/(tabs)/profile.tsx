import { View, Text, TouchableOpacity, Image, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { auth, db } from '../../utils/firebaseConfig'; 
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { FontAwesome } from '@expo/vector-icons';

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 1. Fetch User Data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            setUser(userDoc.data());
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // 2. Logout Function
  const handleLogout = async () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Log Out", 
          style: "destructive",
          onPress: async () => {
            await signOut(auth);
            router.replace('/(auth)/login');
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#86EFAC" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      
      {/* Header Section */}
      <View className="bg-white p-6 mb-4 items-center rounded-b-3xl shadow-sm">
        <View className="relative">
          <Image 
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }} 
            className="w-24 h-24 rounded-full bg-gray-200 mb-4"
          />
          <View className="absolute bottom-4 right-0 bg-primary p-2 rounded-full border-2 border-white">
            <FontAwesome name="camera" size={12} color="black" />
          </View>
        </View>
        
        <Text className="text-2xl font-bold text-dark">{user?.fullName || 'User'}</Text>
        <Text className="text-gray-500 mb-2">{user?.email || auth.currentUser?.email}</Text>
        
        {/* Role Badge */}
        <View className={`px-4 py-1 rounded-full ${user?.role === 'agent' ? 'bg-black' : 'bg-green-100'}`}>
          <Text className={`font-bold uppercase text-xs ${user?.role === 'agent' ? 'text-primary' : 'text-green-800'}`}>
            {user?.role || 'User'} Account
          </Text>
        </View>
      </View>

      {/* Menu Options */}
      <View className="px-6 space-y-4">
        
        <Text className="text-gray-500 font-bold mb-2 ml-2">General</Text>
        
        <TouchableOpacity className="bg-white p-4 rounded-xl flex-row items-center shadow-sm">
          <View className="bg-gray-100 p-2 rounded-lg"><FontAwesome name="user" size={18} color="black" /></View>
          <Text className="flex-1 ml-4 font-bold text-dark">Edit Profile</Text>
          <FontAwesome name="angle-right" size={18} color="gray" />
        </TouchableOpacity>

        {user?.role === 'agent' && (
          <TouchableOpacity className="bg-white p-4 rounded-xl flex-row items-center shadow-sm">
            <View className="bg-gray-100 p-2 rounded-lg"><FontAwesome name="list" size={18} color="black" /></View>
            <Text className="flex-1 ml-4 font-bold text-dark">My Listings</Text>
            <FontAwesome name="angle-right" size={18} color="gray" />
          </TouchableOpacity>
        )}

        <TouchableOpacity className="bg-white p-4 rounded-xl flex-row items-center shadow-sm">
          <View className="bg-gray-100 p-2 rounded-lg"><FontAwesome name="bell" size={18} color="black" /></View>
          <Text className="flex-1 ml-4 font-bold text-dark">Notifications</Text>
          <FontAwesome name="angle-right" size={18} color="gray" />
        </TouchableOpacity>

        <TouchableOpacity className="bg-white p-4 rounded-xl flex-row items-center shadow-sm">
          <View className="bg-gray-100 p-2 rounded-lg"><FontAwesome name="lock" size={18} color="black" /></View>
          <Text className="flex-1 ml-4 font-bold text-dark">Security</Text>
          <FontAwesome name="angle-right" size={18} color="gray" />
        </TouchableOpacity>

        <Text className="text-gray-500 font-bold mb-2 mt-4 ml-2">Account</Text>

        {/* Logout Button */}
        <TouchableOpacity 
          onPress={handleLogout}
          className="bg-red-50 p-4 rounded-xl flex-row items-center border border-red-100 mb-10"
        >
          <View className="bg-red-100 p-2 rounded-lg"><FontAwesome name="sign-out" size={18} color="#EF4444" /></View>
          <Text className="flex-1 ml-4 font-bold text-red-500">Log Out</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}