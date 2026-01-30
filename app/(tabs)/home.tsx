import { View, Text, TextInput, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator, RefreshControl } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../utils/firebaseConfig'; 
import PropertyCard from '../../components/PropertyCard';

export default function Home() {
  const router = useRouter();
  const [category, setCategory] = useState('House');
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Function to fetch data from Firebase
  const fetchProperties = async () => {
    try {
      // Get reference to the collection
      // We try to order by 'createdAt' desc so newest show first
      // Note: If this fails initially, remove orderBy and just use collection(db, "properties")
      const q = query(collection(db, "properties")); 
      
      const querySnapshot = await getDocs(q);
      
      const fetchedProperties: any[] = [];
      querySnapshot.forEach((doc) => {
        fetchedProperties.push({
          id: doc.id,
          ...doc.data()
        });
      });

      setProperties(fetchedProperties);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch when screen loads
  useEffect(() => {
    fetchProperties();
  }, []);

  // Pull-to-refresh logic
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProperties();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView 
        className="px-6 pt-4" 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#86EFAC" />
        }
      >
        
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

        {/* LIST OF PROPERTIES */}
        {loading ? (
          <View className="mt-10">
            <ActivityIndicator size="large" color="#86EFAC" />
            <Text className="text-center text-gray-400 mt-2">Finding homes...</Text>
          </View>
        ) : properties.length === 0 ? (
          <View className="mt-10 items-center">
             <Text className="text-gray-400">No properties found.</Text>
             <Text className="text-gray-400 text-xs">Be the first to add one!</Text>
          </View>
        ) : (
          <View className="pb-20"> 
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </View>
        )}

      </ScrollView>

      {/* Floating Action Button (FAB) */}
      <TouchableOpacity 
        onPress={() => router.push('/add-property')}
        className="absolute bottom-6 right-6 bg-dark w-14 h-14 rounded-full items-center justify-center shadow-lg"
        style={{ elevation: 5 }} // Shadow for Android
      >
        <FontAwesome name="plus" size={24} color="#86EFAC" />
      </TouchableOpacity>

    </SafeAreaView>
  );
}