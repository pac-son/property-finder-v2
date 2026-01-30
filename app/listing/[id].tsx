import { View, Text, Image, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore'; 
import { db, auth } from '../../utils/firebaseConfig';

export default function ListingDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false); 
  const [favLoading, setFavLoading] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // 1. Fetch Property Details
        const docRef = doc(db, "properties", id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProperty(docSnap.data());
        } else {
          Alert.alert("Error", "Property not found!");
          router.back();
          return;
        }

        // 2. Check if already favorite
        const user = auth.currentUser;
        if (user) {
          const favRef = doc(db, "users", user.uid, "favorites", id as string);
          const favSnap = await getDoc(favRef);
          if (favSnap.exists()) setIsFavorite(true);
        }

      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetails();
  }, [id]);

  // --- HANDLE FAVORITE TOGGLE ---
  const toggleFavorite = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Sign In Required", "Please log in to save properties.");
      return;
    }

    setFavLoading(true);
    try {
      const favRef = doc(db, "users", user.uid, "favorites", id as string);

      if (isFavorite) {
        // UN-LIKE: Remove from database
        await deleteDoc(favRef);
        setIsFavorite(false);
      } else {
        // LIKE: Save snapshot to database
        await setDoc(favRef, {
          id: id,
          title: property.title,
          location: property.location,
          price: property.price,
          image: property.image,
          rating: property.rating || 4.5
        });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Fav Error:", error);
      Alert.alert("Error", "Could not update favorites.");
    } finally {
      setFavLoading(false);
    }
  };

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
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        
        {/* Header Image */}
        <View className="relative">
          <Image 
            source={{ uri: property.image }} 
            className="w-full bg-gray-300"
            style={{ height: 350 }} 
            resizeMode="cover"
          />
          
          <TouchableOpacity 
            onPress={() => router.back()}
            className="absolute top-12 left-6 bg-white/30 p-3 rounded-full"
          >
            <FontAwesome name="arrow-left" size={20} color="white" />
          </TouchableOpacity>

          {/* ACTIVE FAVORITE BUTTON */}
          <TouchableOpacity 
            onPress={toggleFavorite}
            disabled={favLoading}
            className="absolute top-12 right-6 bg-white/30 p-3 rounded-full"
          >
            {/* Toggle Icon based on state */}
            <FontAwesome 
              name={isFavorite ? "heart" : "heart-o"} 
              size={20} 
              color={isFavorite ? "#EF4444" : "white"} // Red if liked, White if not
            />
          </TouchableOpacity>
        </View>

        <View className="-mt-10 bg-white rounded-t-3xl px-6 pt-8 pb-32">
          
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

          <Text className="text-3xl font-bold text-green-600 mt-2 mb-6">
            ₦{property.price}<Text className="text-sm font-normal text-gray-400">/yr</Text>
          </Text>

          <Text className="text-lg font-bold text-dark mb-2">Description</Text>
          <Text className="text-gray-500 leading-6 mb-8">{property.description}</Text>

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

      <View className="absolute bottom-0 w-full bg-white border-t border-gray-100 px-6 py-4 pb-8">
        <TouchableOpacity 
            className="bg-dark w-full py-4 rounded-2xl shadow-lg items-center"
            onPress={() => Alert.alert('Message Sent', 'The agent will contact you shortly.')}
        >
          <Text className="text-primary font-bold text-lg">Message Agent</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}