import { View, Text } from 'react-native';

export default function Home() {
  return (
    <View className="flex-1 items-center justify-center bg-dark">
      <Text className="text-primary text-2xl font-bold">It Works!</Text>
      <View className="w-20 h-20 bg-red-500 mt-5 rounded-full" />
    </View>
  );
}