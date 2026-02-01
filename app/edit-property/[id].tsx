import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../utils/firebaseConfig';
import { FontAwesome } from '@expo/vector-icons';

export default function EditProperty() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); 

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  // Form State
  const [image, setImage] = useState<string | null>(null); 
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  // 1. Fetch Existing Data on Load
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const docRef = doc(db, "properties", id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title);
          setPrice(data.price);
          setLocation(data.location);
          setDescription(data.description);
          setImage(data.image); // Pre-fill the image
        } else {
          Alert.alert("Error", "Property not found");
          router.back();
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProperty();
  }, [id]);

  // 2. Pick New Image (Optional)
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.2, 
      base64: true,
    });

    if (!result.canceled) {
      // Update the state with the NEW image
      const newImage = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setImage(newImage);
    }
  };

  // 3. Update Logic
  const handleUpdate = async () => {
    if (!title || !price || !location) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setUpdating(true);
    try {
      const docRef = doc(db, "properties", id as string);
      
      // Update only the fields we changed
      await updateDoc(docRef, {
        title: title,
        price: price,
        location: location,
        description: description,
        image: image, // This might be the old URL or the new Base64 string
        updatedAt: new Date().toISOString()
      });

      Alert.alert("Success", "Property Updated!");
      router.back(); // Go back to My Listings

    } catch (error: any) {
      Alert.alert("Update Failed", error.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#86EFAC" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white px-6 py-6">
      <View className="flex-row items-center mb-6">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <FontAwesome name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-dark">Edit Property</Text>
      </View>

      {/* Image Picker */}
      <TouchableOpacity onPress={pickImage} className="w-full h-52 bg-gray-100 rounded-2xl items-center justify-center mb-6 overflow-hidden border border-gray-300 border-dashed">
        {image ? (
          <Image source={{ uri: image }} className="w-full h-full" />
        ) : (
          <View className="items-center">
             <FontAwesome name="camera" size={40} color="gray" />
             <Text className="text-gray-500 mt-2">Tap to change photo</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Form Fields */}
      <View className="space-y-4 mb-8">
        <View className="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <Text className="text-gray-500 text-xs mb-1">Title</Text>
          <TextInput value={title} onChangeText={setTitle} className="font-bold text-dark" />
        </View>
        
        <View className="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <Text className="text-gray-500 text-xs mb-1">Price (₦)</Text>
          <TextInput keyboardType="numeric" value={price} onChangeText={setPrice} className="font-bold text-dark" />
        </View>

        <View className="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <Text className="text-gray-500 text-xs mb-1">Location</Text>
          <TextInput value={location} onChangeText={setLocation} className="font-bold text-dark" />
        </View>

        <View className="bg-gray-50 p-4 rounded-xl border border-gray-200 h-32">
          <Text className="text-gray-500 text-xs mb-1">Description</Text>
          <TextInput 
            multiline 
            value={description} 
            onChangeText={setDescription} 
            style={{ textAlignVertical: 'top' }} 
            className="text-dark h-full"
          />
        </View>
      </View>

      {/* Update Button */}
      <TouchableOpacity 
        onPress={handleUpdate} 
        disabled={updating}
        className={`bg-dark py-4 rounded-xl mb-10 ${updating ? 'opacity-50' : ''}`}
      >
        {updating ? (
          <ActivityIndicator color="#86EFAC" />
        ) : (
          <Text className="text-primary text-center font-bold text-lg">Save Changes</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}