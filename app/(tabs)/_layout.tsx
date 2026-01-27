import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { View } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // We will build custom headers in the screens
        tabBarStyle: {
          backgroundColor: '#1F2937', // Dark Grey Background
          borderTopColor: '#1F2937',  // Remove the top line
          height: 60,                 // Taller bar for modern look
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#86EFAC', // Green when active
        tabBarInactiveTintColor: '#9CA3AF', // Grey when inactive
        tabBarShowLabel: false, // Clean look (Icons only) - Change to true if you want text
      }}
    >
      {/* 1. Home Tab */}
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} />,
        }}
      />

      {/* 2. Search Tab */}
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ color }) => <FontAwesome name="search" size={24} color={color} />,
        }}
      />

      {/* 3. Saved/Favorites Tab */}
      <Tabs.Screen
        name="saved"
        options={{
          tabBarIcon: ({ color }) => <FontAwesome name="heart" size={24} color={color} />,
        }}
      />

      {/* 4. Profile Tab */}
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => <FontAwesome name="user" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}