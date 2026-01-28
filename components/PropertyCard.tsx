import { View, Text, Image, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Define what a Property looks like
interface PropertyProps {
  id: string;
  title: string;
  location: string;
  price: string;
  rating: number;
  image: string;
}

export default function PropertyCard({ property }: { property: PropertyProps }) {
  const router = useRouter();

  return (
    <TouchableOpacity 
      onPress={() => router.push({
        pathname: '/listing/[id]',
        params: { id: property.id }
      })}
      className="bg-white rounded-2xl shadow-sm mb-6 overflow-hidden border border-gray-100"
    >
      {/* Image Section */}
      <View>
        <Image 
          source={{ uri: property.image }} 
          // NativeWind for styling, but inline style for guaranteed Layout
          className="w-full"
          style={{ height: 200, width: '100%' }} 
          resizeMode="cover"
        />
        {/* Price Badge */}
        <View className="absolute bottom-4 right-4 bg-dark/90 px-3 py-1.5 rounded-lg">
          <Text className="text-primary font-bold">₦{property.price}/yr</Text>
        </View>
        {/* Rating Badge */}
        <View className="absolute top-4 right-4 bg-white/90 px-2 py-1 rounded-lg flex-row items-center">
          <FontAwesome name="star" size={12} color="#F59E0B" />
          <Text className="text-xs font-bold ml-1">{property.rating}</Text>
        </View>
      </View>

      {/* Details Section */}
      <View className="p-4">
        <Text className="text-lg font-bold text-dark mb-1">{property.title}</Text>
        <View className="flex-row items-center">
          <FontAwesome name="map-marker" size={14} color="#9CA3AF" />
          <Text className="text-gray-500 text-sm ml-2">{property.location}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}