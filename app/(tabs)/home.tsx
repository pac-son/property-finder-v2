import { View, Text, TextInput, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator, RefreshControl, Platform, StatusBar } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../../utils/firebaseConfig';
import PropertyCard from '../../components/PropertyCard';

export default function Home() {
  const router = useRouter();
  const [category, setCategory] = useState('All'); // Changed default to 'All'
  const [searchQuery, setSearchQuery] = useState(''); // New State for Search
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Function to fetch data
  const fetchProperties = async () => {
    try {
      const q = query(collection(db, "properties")); 
      const querySnapshot = await getDocs(q);
      const fetchedProperties: any[] = [];
      querySnapshot.forEach((doc) => {
        fetchedProperties.push({ id: doc.id, ...doc.data() });
      });
      setProperties(fetchedProperties);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProperties();
  }, []);

  // --- FILTER LOGIC ---
  // We filter the list based on Search Query AND Category
  const filteredProperties = properties.filter(property => {
    // 1. Search Filter (Case insensitive)
    const matchesSearch = 
      property.location.toLowerCase().includes(searchQuery.toLowerCase()) || 
      property.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    // 2. Category Filter (Optional: You can add category fields to your upload form later)
    // For now, we only filter if category is NOT 'All' and matches the title (simple check)
    const matchesCategory = category === 'All' || property.title.includes(category) || property.description?.includes(category);

    return matchesSearch && matchesCategory;
  });

  return (
    <SafeAreaView className="flex-1 bg-gray-50"
      style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
      <ScrollView 
        className="px-6 pt-4" 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#86EFAC" />}
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

        {/* Search Bar - NOW ACTIVE */}
        <View className="flex-row items-center bg-white p-4 rounded-2xl shadow-sm mb-6">
          <FontAwesome name="search" size={20} color="gray" />
          <TextInput 
            placeholder="Search address, city, location" 
            className="flex-1 ml-3 text-dark"
            value={searchQuery}         
            onChangeText={setSearchQuery} 
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
               <FontAwesome name="times-circle" size={20} color="gray" />
            </TouchableOpacity>
          )}
        </View>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-8">
          {['All', 'House', 'Apartment', 'Hotel', 'Land'].map((item) => (
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
          <Text className="text-xl font-bold text-dark">
            {searchQuery ? `Results for "${searchQuery}"` : 'Near from you'}
          </Text>
          <Text className="text-gray-500">See more</Text>
        </View>

        {/* LIST OF PROPERTIES */}
        {loading ? (
          <View className="mt-10">
            <ActivityIndicator size="large" color="#86EFAC" />
            <Text className="text-center text-gray-400 mt-2">Finding homes...</Text>
          </View>
        ) : filteredProperties.length === 0 ? (
          <View className="mt-10 items-center">
             <Text className="text-gray-400">No properties found.</Text>
             <Text className="text-gray-400 text-xs mt-1">Try a different search term.</Text>
          </View>
        ) : (
          <View className="pb-20"> 
            {/* Render the FILTERED list, not the full list */}
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </View>
        )}

      </ScrollView>

      {/* Floating Action Button (FAB) */}
      <TouchableOpacity 
        onPress={() => router.push('/add-property')}
        className="absolute bottom-6 right-6 bg-dark w-14 h-14 rounded-full items-center justify-center shadow-lg"
        style={{ elevation: 5 }}
      >
        <FontAwesome name="plus" size={24} color="#86EFAC" />
      </TouchableOpacity>

    </SafeAreaView>
  );
}