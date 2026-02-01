import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, SafeAreaView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../utils/firebaseConfig';
import { FontAwesome } from '@expo/vector-icons';

export default function ChatRoom() {
  const { id } = useLocalSearchParams(); // This is the CHAT ID
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  const currentUser = auth.currentUser;

  // 1. Real-time Listener for Messages
  useEffect(() => {
    if (!id) return;

    // Listen to the 'messages' subcollection inside this specific chat
    const q = query(
      collection(db, "chats", id as string, "messages"),
      orderBy("createdAt", "asc") // Oldest first
    );

    // onSnapshot runs every time the database changes
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [id]);

  // 2. Send Message Function
  const sendMessage = async () => {
    if (text.trim().length === 0) return;

    try {
      const messageText = text;
      setText(''); // Clear input immediately for speed

      // A. Add message to the subcollection
      await addDoc(collection(db, "chats", id as string, "messages"), {
        text: messageText,
        senderId: currentUser?.uid,
        createdAt: serverTimestamp(),
      });

      // B. Update the "Last Message" on the main chat document (for the Inbox list)
      await setDoc(doc(db, "chats", id as string), {
        lastMessage: messageText,
        updatedAt: serverTimestamp(),
      }, { merge: true });

    } catch (error) {
      console.error("Error sending:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="p-4 border-b border-gray-100 flex-row items-center pt-10">
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <Text className="ml-4 font-bold text-lg">Chat</Text>
      </View>

      {/* Messages List */}
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        className="flex-1 px-4"
        contentContainerStyle={{ paddingVertical: 20 }}
        renderItem={({ item }) => {
          const isMe = item.senderId === currentUser?.uid;
          return (
            <View className={`mb-3 max-w-[80%] rounded-2xl p-3 ${isMe ? 'self-end bg-dark' : 'self-start bg-gray-100'}`}>
              <Text className={isMe ? 'text-primary' : 'text-dark'}>{item.text}</Text>
            </View>
          );
        }}
      />

      {/* Input Area */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        keyboardVerticalOffset={10}
        className="flex-row items-center p-4 border-t border-gray-100 bg-white pb-8"
      >
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type a message..."
          className="flex-1 bg-gray-50 p-4 rounded-full mr-3"
        />
        <TouchableOpacity onPress={sendMessage} className="bg-dark p-4 rounded-full">
          <FontAwesome name="send" size={16} color="#86EFAC" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}