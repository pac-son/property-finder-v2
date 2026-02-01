import { View, Text, FlatList, TouchableOpacity, SafeAreaView, Platform, StatusBar, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { auth, db } from '../../utils/firebaseConfig';
import { FontAwesome } from '@expo/vector-icons';

export default function Inbox() {
  const router = useRouter();
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) return;

    // Query: Find all chats where I am a participant
    const q = query(
      collection(db, "chats"),
      where("participants", "array-contains", currentUser.uid),
      orderBy("updatedAt", "desc") // Show newest chats first
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setChats(chatList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView 
      className="flex-1 bg-white"
      style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}
    >
      <View className="px-6 py-4 border-b border-gray-100">
        <Text className="text-2xl font-bold text-dark">Messages</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#86EFAC" className="mt-10" />
      ) : chats.length === 0 ? (
        <View className="flex-1 justify-center items-center px-10">
          <View className="bg-gray-100 p-6 rounded-full mb-4">
            <FontAwesome name="comment-o" size={40} color="gray" />
          </View>
          <Text className="text-gray-500 font-bold text-lg">No messages yet</Text>
          <Text className="text-gray-400 text-center mt-2">
            Contact an agent from a property page to start a chat.
          </Text>
        </View>
      ) : (
        <FlatList 
          data={chats}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity 
              onPress={() => router.push(`/chat/${item.id}`)}
              className="flex-row items-center bg-gray-50 p-4 rounded-xl mb-3 border border-gray-100"
            >
              {/* Avatar Placeholder */}
              <View className="w-12 h-12 bg-gray-300 rounded-full items-center justify-center mr-4">
                <FontAwesome name="user" size={20} color="white" />
              </View>
              
              {/* Message Info */}
              <View className="flex-1">
                <Text className="font-bold text-dark text-lg">Chat</Text>
                <Text className="text-gray-500" numberOfLines={1}>
                  {item.lastMessage || "No messages yet"}
                </Text>
              </View>

              {/* Time (Optional: Just an arrow for now) */}
              <FontAwesome name="angle-right" size={20} color="gray" />
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}