import { View, Text, Image, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

// Mock Data (In the future, we fetch this from Firebase using the ID)
const PROPERTY_DETAILS = {
  id: '1',
  title: 'Luxury Lekki Apartment',
  location: 'Lekki Phase 1, Lagos',
  price: '3,500,000',
  rating: 4.8,
  description: 'Experience luxury living in the heart of Lekki. This fully serviced apartment comes with 24/7 electricity, a swimming pool, and a fully fitted gym. Perfect for young professionals.',
  beds: 3,
  baths: 2,
  sqft: 1200,
  agent: {
    name: 'Agent Smith',
    image: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  image: 'https://images.unsplash.com/photo-1600596542815-e32c630bd138?w=800&auto=format&fit=crop'
};

export default function ListingDetails() {
  const { id } = useLocalSearchParams(); // This gets the ID from the URL
  const router = useRouter();

  // In a real app, you would use useEffect to fetch data for this specific `id`
  const property = PROPERTY_DETAILS; 

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" />
      
      {/* Scrollable Content */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        
        {/* Header Image */}
        <View className="relative">
          <Image 
            source={{ uri: property.image }} 
            className="w-full h-80 bg-gray-300"
            resizeMode="cover"
          />
          
          {/* Back Button Overlay */}
          <TouchableOpacity 
            onPress={() => router.back()}
            className="absolute top-12 left-6 bg-white/30 p-2 rounded-full backdrop-blur-md"
          >
            <FontAwesome name="arrow-left" size={20} color="white" />
          </TouchableOpacity>

          {/* Favorite Button Overlay */}
          <TouchableOpacity className="absolute top-12 right-6 bg-white/30 p-2 rounded-full">
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
              <Text className="ml-1 font-bold">{property.rating}</Text>
            </View>
          </View>

          {/* Features Grid */}
          <View className="flex-row justify-between mt-6 mb-8 bg-gray-50 p-4 rounded-xl">
            <View className="items-center">
              <FontAwesome name="bed" size={20} color="#86EFAC" />
              <Text className="text-gray-500 text-xs mt-1">{property.beds} Beds</Text>
            </View>
            <View className="items-center">
              <FontAwesome name="bath" size={20} color="#86EFAC" />
              <Text className="text-gray-500 text-xs mt-1">{property.baths} Baths</Text>
            </View>
            <View className="items-center">
              <FontAwesome name="square" size={20} color="#86EFAC" />
              <Text className="text-gray-500 text-xs mt-1">{property.sqft} sqft</Text>
            </View>
          </View>

          {/* Description */}
          <Text className="text-lg font-bold text-dark mb-2">Description</Text>
          <Text className="text-gray-500 leading-6 mb-8">{property.description}</Text>

          {/* Agent Card */}
          <Text className="text-lg font-bold text-dark mb-4">Listing Agent</Text>
          <View className="flex-row items-center bg-gray-50 p-4 rounded-xl mb-4">
            <Image 
              source={{ uri: property.agent.image }} 
              className="w-12 h-12 rounded-full"
            />
            <View className="ml-4 flex-1">
              <Text className="font-bold text-dark text-lg">{property.agent.name}</Text>
              <Text className="text-gray-500 text-xs">Real Estate Agent</Text>
            </View>
            <View className="flex-row space-x-3">
               <TouchableOpacity className="bg-gray-200 p-2 rounded-full">
                 <FontAwesome name="phone" size={20} color="black" />
               </TouchableOpacity>
            </View>
          </View>

        </View>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View className="absolute bottom-0 w-full bg-white border-t border-gray-100 px-6 py-4 flex-row items-center justify-between pb-8">
        <View>
          <Text className="text-gray-500 text-xs">Total Price</Text>
          <Text className="text-xl font-bold text-dark">₦{property.price}<Text className="text-sm font-normal text-gray-400">/yr</Text></Text>
        </View>
        
        <TouchableOpacity 
            className="bg-dark px-8 py-4 rounded-2xl shadow-lg"
            onPress={() => alert('Chat feature coming next!')}
        >
          <Text className="text-primary font-bold text-lg">Message Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}