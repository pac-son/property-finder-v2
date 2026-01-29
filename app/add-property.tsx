import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { db, storage, auth } from '../utils/firebaseConfig';
import { FontAwesome } from '@expo/vector-icons';

export default function AddProperty() {
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);

  // 1. Pick Image from Gallery
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5, // Compress image to save data
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // 2. Upload Logic
  const handleUpload = async () => {
    if (!image || !title || !price || !location) {
      Alert.alert('Error', 'Please fill all fields and add an image');
      return;
    }

    setUploading(true);
    try {
      // A. Upload Image to Firebase Storage
      const response = await fetch(image);
      const blob = await response.blob();
      const filename = `properties/${Date.now()}.jpg`;
      const storageRef = ref(storage, filename);
      
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);

      // B. Save Metadata to Firestore
      await addDoc(collection(db, "properties"), {
        title: title,
        price: price,
        location: location,
        description: description,
        image: downloadURL,
        agentId: auth.currentUser?.uid,
        createdAt: new Date().toISOString(),
        rating: 4.5, // Default rating for now
      });

      Alert.alert("Success", "Property Listed!");
      router.replace('/(tabs)/home');

    } catch (error: any) {
      Alert.alert("Upload Failed", error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white px-6 py-6">
      <Text className="text-2xl font-bold text-dark mb-6">List a New Property</Text>

      {/* Image Picker */}
      <TouchableOpacity onPress={pickImage} className="w-full h-52 bg-gray-100 rounded-2xl items-center justify-center mb-6 overflow-hidden border border-gray-300 border-dashed">
        {image ? (
          <Image source={{ uri: image }} className="w-full h-full" />
        ) : (
          <View className="items-center">
            <FontAwesome name="camera" size={40} color="gray" />
            <Text className="text-gray-500 mt-2">Tap to add photo</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Form Fields */}
      <View className="space-y-4 mb-8">
        <View className="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <TextInput placeholder="Property Title (e.g. Luxury Villa)" value={title} onChangeText={setTitle} />
        </View>
        
        <View className="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <TextInput placeholder="Price per Year (₦)" keyboardType="numeric" value={price} onChangeText={setPrice} />
        </View>

        <View className="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <TextInput placeholder="Location (City, Area)" value={location} onChangeText={setLocation} />
        </View>

        <View className="bg-gray-50 p-4 rounded-xl border border-gray-200 h-32">
          <TextInput 
            placeholder="Description..." 
            multiline 
            value={description} 
            onChangeText={setDescription} 
            style={{ textAlignVertical: 'top' }} // Fix for Android text alignment
          />
        </View>
      </View>

      {/* Submit Button */}
      <TouchableOpacity 
        onPress={handleUpload} 
        disabled={uploading}
        className={`bg-dark py-4 rounded-xl mb-10 ${uploading ? 'opacity-50' : ''}`}
      >
        {uploading ? (
          <ActivityIndicator color="#86EFAC" />
        ) : (
          <Text className="text-primary text-center font-bold text-lg">Post Listing</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}