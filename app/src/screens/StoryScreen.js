import { useEffect, useState, useRef } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, Switch, Dimensions, Animated } from 'react-native';
import { generateStory } from '../../services/api';
import { getUserId } from '../../services/userServices';
import { PanGestureHandler, State, GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get("window");

export default function StoryScreen({ route, navigation }) {
  const { name, age, gender, interests } = route.params;

  const [story, setStory] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generateImage, setGenerateImage] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);

  // مقدار اولیه انیمیشن
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // ایجاد داستان جدید
  const createNewStory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userId = await getUserId();
      if (!userId) throw new Error('دریافت شناسه کاربر با مشکل مواجه شد');

      const response = await generateStory({
        userId,
        name,
        age,
        gender,
        interests,
        generateImage
      });

      if (response?.data) {
        // تنظیم متن داستان
        if (response.data.story) {
          const storyText = response.data.story.split('\n').filter(text => text.trim() !== '');
          setStory(storyText);
        }

        // تنظیم تصویر
        if (response.data.imageUrl) {
          setImageUrl(response.data.imageUrl);
        }
      }
    } catch (error) {
      console.error("Error generating new story:", error);
      setError("خطا در ایجاد داستان جدید");
      setStory(["متأسفانه در ایجاد داستان مشکلی پیش آمده است."]);
    } finally {
      setLoading(false);
    }
  };

  // ایجاد داستان در لود اولیه و تغییر وضعیت تصویر
  useEffect(() => {
    createNewStory();
  }, [generateImage]);

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

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PanGestureHandler onHandlerStateChange={onSwipe}>
          <View style={{ flex: 1 }}>
            <ScrollView>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                <Text style={{ fontSize: 16, marginRight: 10 }}>تولید تصویر؟</Text>
                <Switch value={generateImage} onValueChange={setGenerateImage} />
              </View>

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
