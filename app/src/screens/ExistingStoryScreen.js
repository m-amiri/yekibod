import { useState, useRef } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, Dimensions, Animated, TouchableOpacity } from 'react-native';
import { updateStoryRating } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PanGestureHandler, State, GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get("window");

export default function ExistingStoryScreen({ route, navigation }) {
  const { story: existingStory } = route.params;

  const [story, setStory] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rating, setRating] = useState(existingStory?.rating || null);

  // مقدار اولیه انیمیشن
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // بارگذاری داستان
  useState(() => {
    try {
      setLoading(true);
      
      if (existingStory) {
        // تنظیم متن داستان
        const storyText = existingStory.story_text;
        if (storyText) {
          const pages = storyText.split('\n').filter(line => line.trim());
          setStory(pages);
        }

        // تنظیم تصویر
        if (existingStory.image_url) {
          setImageUrl(existingStory.image_url);
        }
      }
    } catch (error) {
      console.error('Error loading story:', error);
      setError('خطا در بارگذاری داستان. لطفا دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  }, []);

  // تابع تغییر صفحه همراه با انیمیشن
  const changePage = (newPage) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true
    }).start(() => {
      setPage(newPage);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true
      }).start();
    });
  };

  // کنترل Swipe برای تغییر صفحه
  const onSwipe = (event) => {
    const { translationX, velocityX, state } = event.nativeEvent;
    const SWIPE_THRESHOLD = 65;

    if (state === State.END) {
      if (translationX < -SWIPE_THRESHOLD && velocityX < -0.3 && page < story.length - 1) {
        changePage(page + 1);
      }

      if (translationX > SWIPE_THRESHOLD && velocityX > 0.3 && page > 0) {
        changePage(page - 1);
      }
    }
  };

  const handleRating = async (newRating) => {
    if (!existingStory.id) {
      setError("امکان امتیازدهی به این داستان وجود ندارد.");
      return;
    }

    try {
      setRating(newRating);
      await AsyncStorage.setItem(`story_rating_${existingStory.id}`, newRating.toString());
      await updateStoryRating({ storyId: existingStory.id, rating: newRating });
    } catch (error) {
      console.error('Error updating story rating:', error);
      setError("خطا در ثبت امتیاز");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PanGestureHandler onHandlerStateChange={onSwipe}>
          <View style={{ flex: 1 }}>
            <ScrollView>
              {loading ? (
                <ActivityIndicator size="large" color="#f39c12" />
              ) : (
                <>
                  {error && (
                    <Text style={{ color: 'red', marginBottom: 10, textAlign: 'center' }}>{error}</Text>
                  )}
                  
                  {imageUrl && (
                    <Image 
                      source={{ uri: imageUrl }} 
                      style={{ width: width * 0.8, height: height * 0.4, marginBottom: 20, alignSelf: 'center' }}
                      onError={() => setImageUrl(null)}
                    />
                  )}

                  {/* افکت انیمیشنی روی متن */}
                  <Animated.View style={{ opacity: fadeAnim }}>
                    <Text style={{ fontSize: 18, textAlign: "center", paddingHorizontal: 20, lineHeight: 30 }}>
                      {story[page]}
                    </Text>
                  </Animated.View>

                  {/* دکمه‌های لایک و دیسلایک */}
                  <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
                    <TouchableOpacity 
                      onPress={() => handleRating(1)}
                      style={{ padding: 10 }}
                    >
                      <Text style={{ fontSize: 24, color: rating === 1 ? 'green' : 'black' }}>👍</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => handleRating(-1)}
                      style={{ padding: 10, marginLeft: 20 }}
                    >
                      <Text style={{ fontSize: 24, color: rating === -1 ? 'red' : 'black' }}>👎</Text>
                    </TouchableOpacity>
                  </View>

                  {story.length > 1 && (
                    <Text style={{ marginTop: 20, fontSize: 14, color: "gray", textAlign: "center" }}>
                      {page + 1} / {story.length}
                    </Text>
                  )}
                </>
              )}
            </ScrollView>
          </View>
        </PanGestureHandler>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
} 