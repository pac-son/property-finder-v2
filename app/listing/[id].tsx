import { View, Text, Image, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../utils/firebaseConfig';

export default function ListingDetails() {
  const { id } = useLocalSearchParams(); // Get the ID passed from Home
  const router = useRouter();
  
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        // Fetch the specific document using the ID
        const docRef = doc(db, "properties", id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProperty(docSnap.data());
        } else {
          alert("Property not found!");
          router.back();
        }
      } catch (error) {
        console.error("Error fetching details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPropertyDetails();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#86EFAC" />
      </View>
    );
  }

  if (!property) return null;

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" />
      
      {/* Scrollable Content */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        
        {/* Header Image */}
        <View className="relative">
          <Image 
            source={{ uri: property.image }} 
            className="w-full bg-gray-300"
            style={{ height: 350 }} // Inline style to ensure height
            resizeMode="cover"
          />
          
          {/* Back Button */}
          <TouchableOpacity 
            onPress={() => router.back()}
            className="absolute top-12 left-6 bg-white/30 p-3 rounded-full"
            style={{ backdropFilter: 'blur(10px)' }} // Visual touch
          >
            <FontAwesome name="arrow-left" size={20} color="white" />
          </TouchableOpacity>

          {/* Favorite Button */}
          <TouchableOpacity className="absolute top-12 right-6 bg-white/30 p-3 rounded-full">
            <FontAwesome name="heart-o" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Content Container */}
        <View className="-mt-10 bg-white rounded-t-3xl px-6 pt-8 pb-32">
          
          {/* Title & Rating */}
          <View className="flex-row justify-between items-start mb-2">
            <View className="flex-1 mr-4">
              <Text className="text-2xl font-bold text-dark">{property.title}</Text>
              <View className="flex-row items-center mt-1">
                <FontAwesome name="map-marker" size={14} color="#9CA3AF" />
                <Text className="text-gray-500 ml-1">{property.location}</Text>
              </View>
            </View>
            <View className="flex-row items-center bg-gray-100 px-2 py-1 rounded-lg">
              <FontAwesome name="star" size={14} color="#F59E0B" />
              <Text className="ml-1 font-bold">{property.rating || 'N/A'}</Text>
            </View>
          </View>

          {/* Price Tag (Big & Bold) */}
          <Text className="text-3xl font-bold text-green-600 mt-2 mb-6">
            ₦{property.price}<Text className="text-sm font-normal text-gray-400">/yr</Text>
          </Text>

          {/* Description */}
          <Text className="text-lg font-bold text-dark mb-2">Description</Text>
          <Text className="text-gray-500 leading-6 mb-8">{property.description}</Text>

          {/* Agent Section */}
          <Text className="text-lg font-bold text-dark mb-4">Listing Agent</Text>
          <View className="flex-row items-center bg-gray-50 p-4 rounded-xl mb-4">
            <View className="w-12 h-12 bg-gray-300 rounded-full items-center justify-center">
              <FontAwesome name="user" size={20} color="white" />
            </View>
            <View className="ml-4 flex-1">
              <Text className="font-bold text-dark text-lg">Agent</Text>
              <Text className="text-gray-500 text-xs">View Profile</Text>
            </View>
            <TouchableOpacity className="bg-gray-200 p-3 rounded-full">
               <FontAwesome name="phone" size={20} color="black" />
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View className="absolute bottom-0 w-full bg-white border-t border-gray-100 px-6 py-4 pb-8">
        <TouchableOpacity 
            className="bg-dark w-full py-4 rounded-2xl shadow-lg items-center"
            onPress={() => alert('Chat functionality coming in Phase 2!')}
        >
          <Text className="text-primary font-bold text-lg">Message Agent</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}