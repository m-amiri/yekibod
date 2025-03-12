import { useEffect, useState } from 'react';
import { View, Image, Text, ActivityIndicator } from 'react-native';
import { generateStory } from '../../services/api';
import { getUserId } from '../../services/userServices';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ImageScreen({ route }) {
  const { description } = route.params;
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImage = async () => {
      setLoading(true);
      try {
        const userId = await getUserId();
        // استفاده از API جدید generate با پارامتر generateImage=true
        const response = await generateStory({ 
          userId, 
          name: 'تصویر', 
          age: '5', 
          gender: 'نامشخص',
          interests: [description], 
          generateImage: true 
        });
        setImageUrl(response.data.imageUrl);
      } catch (error) {
        console.error("Error generating image:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {loading ? (
          <ActivityIndicator size="large" color="#f39c12" />
        ) : imageUrl ? (
          <Image 
            source={{ uri: imageUrl }} 
            style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
          />
        ) : (
          <Text>خطا در تولید تصویر. لطفاً دوباره امتحان کنید.</Text>
        )}
      </View>
    </SafeAreaView>
  );
}
