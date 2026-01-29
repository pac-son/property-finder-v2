import { View, Text, TextInput, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';
import PropertyCard from '../../components/PropertyCard';
import { useRouter } from 'expo-router';

// Dummy Data (We will fetch this from Firebase later)
const PROPERTIES = [
  {
    id: '1',
    title: 'Luxury Lekki Apartment',
    location: 'Lekki Phase 1, Lagos',
    price: '3,500,000',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1600596542815-e32c630bd138?w=800&auto=format&fit=crop'
  },
  {
    id: '2',
    title: 'Modern Duplex in Ikeja',
    location: 'Ikeja GRA, Lagos',
    price: '6,000,000',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop'
  },
  {
    id: '3',
    title: 'Cozy Studio Yaba',
    location: 'Yaba, Lagos',
    price: '800,000',
    rating: 4.2,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop'
  }
];

export default function Home() {
  const [category, setCategory] = useState('House');
  const router = useRouter();


  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="px-6 pt-4" showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-gray-500 text-sm">Location</Text>
            <View className="flex-row items-center">
              <FontAwesome name="map-marker" size={16} color="#86EFAC" />
              <Text className="text-dark font-bold text-lg ml-2">Lagos, Nigeria</Text>
            </View>
          </View>
          <View className="bg-white p-2 rounded-full shadow-sm">
            <FontAwesome name="bell" size={20} color="black" />
          </View>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-white p-4 rounded-2xl shadow-sm mb-6">
          <FontAwesome name="search" size={20} color="gray" />
          <TextInput 
            placeholder="Search address, city, location" 
            className="flex-1 ml-3 text-dark"
          />
          <TouchableOpacity className="bg-dark p-2 rounded-lg ml-2">
            <FontAwesome name="sliders" size={20} color="#86EFAC" />
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-8">
          {['House', 'Apartment', 'Hotel', 'Land'].map((item) => (
            <TouchableOpacity 
              key={item}
              onPress={() => setCategory(item)}
              className={`mr-4 px-6 py-3 rounded-full ${category === item ? 'bg-dark' : 'bg-white'}`}
            >
              <Text className={`font-bold ${category === item ? 'text-primary' : 'text-gray-500'}`}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Featured Section Label */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-xl font-bold text-dark">Near from you</Text>
          <Text className="text-gray-500">See more</Text>
        </View>

        {/* RENDER THE CARDS */}
        <View className="pb-20"> 
          {PROPERTIES.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </View>

      </ScrollView>

      {/* Floating Action Button (FAB) */}
      <TouchableOpacity 
        onPress={() => router.push('/add-property')}
        className="absolute bottom-6 right-6 bg-dark w-14 h-14 rounded-full items-center justify-center shadow-lg"
      >
        <FontAwesome name="plus" size={24} color="#86EFAC" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}