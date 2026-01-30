import { View, Text, ScrollView, SafeAreaView, ActivityIndicator, RefreshControl } from 'react-native';
import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router'; // IMPORTANT: Loads data every time you open the tab
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../../utils/firebaseConfig';
import PropertyCard from '../../components/PropertyCard';
import { FontAwesome } from '@expo/vector-icons';

export default function Saved() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch Favorites Function
  const fetchFavorites = async () => {
    const user = auth.currentUser;
    if (!user) {
        setLoading(false);
        return;
    }

    try {
      // Look inside users -> uid -> favorites
      const querySnapshot = await getDocs(collection(db, "users", user.uid, "favorites"));
      const favs: any[] = [];
      querySnapshot.forEach((doc) => {
        favs.push(doc.data());
      });
      setFavorites(favs);
    } catch (error) {
      console.error("Error fetching favs:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // useFocusEffect runs every time you switch to this tab
  useFocusEffect(
    useCallback(() => {
      fetchFavorites();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchFavorites();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-6 py-4 border-b border-gray-100">
        <Text className="text-2xl font-bold text-dark">Saved Homes</Text>
      </View>

      <ScrollView 
        className="px-6 pt-4" 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#86EFAC" />}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#86EFAC" className="mt-10" />
        ) : favorites.length === 0 ? (
          <View className="items-center justify-center mt-20">
            <View className="bg-gray-100 p-6 rounded-full mb-4">
                <FontAwesome name="heart-o" size={40} color="gray" />
            </View>
            <Text className="text-gray-500 font-bold text-lg">No saved properties yet</Text>
            <Text className="text-gray-400 text-center mt-2 px-10">
              Tap the heart icon on any property to save it here.
            </Text>
          </View>
        ) : (
          <View className="pb-10">
            {favorites.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}