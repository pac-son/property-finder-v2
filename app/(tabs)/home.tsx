import { View, Text, TextInput, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';

export default function Home() {
  const [category, setCategory] = useState('House');

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

        {/* Placeholder for Property Cards (We will fill this next) */}
        <View className="h-40 bg-white rounded-2xl items-center justify-center shadow-sm">
          <Text className="text-gray-400">Property Listings Loading...</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}