import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Image, SafeAreaView, Platform, StatusBar } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '../utils/firebaseConfig';
import { FontAwesome } from '@expo/vector-icons';

export default function MyListings() {
  const router = useRouter();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyListings = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      // Query: Select * FROM properties WHERE agentId = 'ME'
      const q = query(collection(db, "properties"), where("agentId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      
      const myProps: any[] = [];
      querySnapshot.forEach((doc) => {
        myProps.push({ id: doc.id, ...doc.data() });
      });
      setListings(myProps);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, []);

  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete Property",
      "Are you sure? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            await deleteDoc(doc(db, "properties", id));
            // Remove from local state so it disappears instantly
            setListings(listings.filter(item => item.id !== id));
            Alert.alert("Deleted", "Property removed successfully.");
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView 
      className="flex-1 bg-gray-50"
      style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}
    >
      {/* Header */}
      <View className="px-6 py-4 flex-row items-center border-b border-gray-200 bg-white">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <FontAwesome name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-dark">Manage Inventory</Text>
      </View>

      <ScrollView className="p-6">
        {loading ? (
          <ActivityIndicator size="large" color="#86EFAC" />
        ) : listings.length === 0 ? (
          <View className="items-center mt-20">
            <Text className="text-gray-400">You haven't posted any properties yet.</Text>
          </View>
        ) : (
          listings.map((item) => (
            <View key={item.id} className="bg-white p-4 rounded-xl mb-4 flex-row shadow-sm">
              {/* Thumbnail */}
              <Image source={{ uri: item.image }} className="w-20 h-20 rounded-lg bg-gray-200" />
              
              {/* Info */}
              <View className="flex-1 ml-4 justify-center">
                <Text className="font-bold text-dark text-lg" numberOfLines={1}>{item.title}</Text>
                <Text className="text-green-600 font-bold">₦{item.price}</Text>
                <Text className="text-gray-400 text-xs">{item.location}</Text>
              </View>

              {/* Actions */}
              <View className="justify-center space-y-4">
                {/* EDIT BUTTON */}
                <TouchableOpacity 
                   onPress={() => router.push(`../edit-property/${item.id}`)}
                   className="bg-blue-50 p-3 rounded-lg border border-blue-100"
                >
                  <FontAwesome name="pencil" size={18} color="#3B82F6" />
                </TouchableOpacity>

                <TouchableOpacity 
                   onPress={() => handleDelete(item.id)}
                   className="bg-red-50 p-3 rounded-lg border border-red-100"
                >
                  <FontAwesome name="trash" size={18} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}