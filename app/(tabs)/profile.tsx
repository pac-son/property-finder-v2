import { View, Text, TouchableOpacity, Image, Alert, ActivityIndicator, ScrollView, SafeAreaView, Platform, StatusBar } from 'react-native';
import { auth, db } from '../../utils/firebaseConfig';
import { signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore'; // Added updateDoc
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker'; // Added ImagePicker

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false); // Track upload status

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

  // 2. Pick & Upload Image Function
  const handleUpdateAvatar = async () => {
    // A. Pick the image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Square aspect ratio for profile pics
      quality: 0.2,   // Low quality to save space
      base64: true,   // Get text string
    });

    if (!result.canceled && auth.currentUser) {
      setUploading(true);
      try {
        // B. Create the Base64 string
        const base64Img = `data:image/jpeg;base64,${result.assets[0].base64}`;

        // C. Update Firestore
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, {
          avatar: base64Img
        });

        // D. Update Local State (so we see it instantly)
        setUser({ ...user, avatar: base64Img });
        Alert.alert("Success", "Profile picture updated!");

      } catch (error) {
        Alert.alert("Error", "Could not update image. Try a smaller file.");
      } finally {
        setUploading(false);
      }
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      "Log Out",
      "Are you sure?",
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

  // Default placeholder if no avatar exists
  const defaultAvatar = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

  return (
    <SafeAreaView 
      className="flex-1 bg-gray-50"
      style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}
    >
      <ScrollView className="flex-1">
        
        {/* Header Section */}
        <View className="bg-white p-6 mb-4 items-center rounded-b-3xl shadow-sm">
          <View className="relative">
            {/* Profile Image */}
            <Image 
              source={{ uri: user?.avatar || defaultAvatar }} 
              className="w-24 h-24 rounded-full bg-gray-200 mb-4"
            />
            
            {/* Camera Button */}
            <TouchableOpacity 
              onPress={handleUpdateAvatar}
              disabled={uploading}
              className="absolute bottom-4 right-0 bg-primary p-2 rounded-full border-2 border-white"
            >
              {uploading ? (
                <ActivityIndicator size="small" color="black" />
              ) : (
                <FontAwesome name="camera" size={12} color="black" />
              )}
            </TouchableOpacity>
          </View>
          
          <Text className="text-2xl font-bold text-dark">{user?.fullName || 'User'}</Text>
          <Text className="text-gray-500 mb-2">{user?.email || auth.currentUser?.email}</Text>
          
          <View className={`px-4 py-1 rounded-full ${user?.role === 'agent' ? 'bg-black' : 'bg-green-100'}`}>
            <Text className={`font-bold uppercase text-xs ${user?.role === 'agent' ? 'text-primary' : 'text-green-800'}`}>
              {user?.role || 'User'} Account
            </Text>
          </View>
        </View>

        {/* Menu Options */}
        <View className="px-6 space-y-4">
          <Text className="text-gray-500 font-bold mb-2 ml-2">General</Text>
          
          {user?.role === 'agent' && (
            <TouchableOpacity 
              onPress={() => router.push('/my-listings')}
              className="bg-white p-4 rounded-xl flex-row items-center shadow-sm"
            >
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

          <Text className="text-gray-500 font-bold mb-2 mt-4 ml-2">Account</Text>

          <TouchableOpacity 
            onPress={handleLogout}
            className="bg-red-50 p-4 rounded-xl flex-row items-center border border-red-100 mb-10"
          >
            <View className="bg-red-100 p-2 rounded-lg"><FontAwesome name="sign-out" size={18} color="#EF4444" /></View>
            <Text className="flex-1 ml-4 font-bold text-red-500">Log Out</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}