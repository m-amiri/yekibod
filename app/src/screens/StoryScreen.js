import { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Switch, Dimensions, Animated, Easing } from 'react-native';
import { generateStory, getStoryEnhancement, pingServer } from '../../services/api';
import { getUserId } from '../../services/userServices';
import { PanGestureHandler, State, GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get("window");

export default function StoryScreen({ route, navigation }) {
  const { name, age, gender, interests } = route.params;

  const [story, setStory] = useState([]);
  const [emojis, setEmojis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generateImage, setGenerateImage] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [retryCount, setRetryCount] = useState(0);

  const fadeAnim = useRef(new Animated.Value(0)).current; // انیمیشن فید
  const bounceAnim = useRef(new Animated.Value(0)).current; // انیمیشن بونس (جهش)

  const createNewStory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userId = await getUserId();
      if (!userId) throw new Error('دریافت شناسه کاربر با مشکل مواجه شد');

      // تست ارتباط با سرور
      if (retryCount > 0) {
        try {
          await pingServer();
          console.log("بک‌اند در دسترس است");
        } catch (pingError) {
          console.error("خطا در ارتباط با بک‌اند:", pingError);
          throw new Error("خطا در ارتباط با سرور. لطفا اتصال اینترنت خود را بررسی کنید.");
        }
      }

      const response = await generateStory({
        userId,
        name,
        age,
        gender,
        interests,
        generateImage
      });

      if (response?.data) {
        if (response.data.story) {
          const storyText = response.data.story.split('\n').filter(text => text.trim() !== '');
          setStory(storyText);

          // درخواست ایموجی‌های مرتبط
          try {
            const enhancement = await getStoryEnhancement(response.data.story);
            if (enhancement?.data?.emojis) {
              setEmojis(enhancement.data.emojis);
              
              // فعال کردن انیمیشن وقتی ایموجی‌ها دریافت شدند
              Animated.sequence([
                Animated.timing(fadeAnim, {
                  toValue: 1,
                  duration: 400,
                  easing: Easing.out(Easing.exp),
                  useNativeDriver: true
                }),
                Animated.spring(bounceAnim, {
                  toValue: 1,
                  friction: 3,
                  tension: 40,
                  useNativeDriver: true
                })
              ]).start();
            }
          } catch (emojiError) {
            console.error("Error getting story enhancement:", emojiError);
            // خطای ایموجی نباید کل فرآیند را متوقف کند
          }
        }
      }
    } catch (error) {
      console.error("Error generating new story:", error);
      if (error.message.includes("Network Error") || error.message.includes("ارتباط با سرور")) {
        setError("خطا در ارتباط با سرور. لطفا اتصال اینترنت خود را بررسی کنید.");
      } else {
        setError("خطا در ایجاد داستان جدید");
      }
      
      setStory(["متأسفانه در ایجاد داستان مشکلی پیش آمده است."]);
      
      // ریست کردن انیمیشن‌ها
      fadeAnim.setValue(1);
      bounceAnim.setValue(1);
    } finally {
      setLoading(false);
    }
  };

  // تلاش مجدد
  const retry = () => {
    setRetryCount(c => c + 1);
    createNewStory();
  };

  useEffect(() => {
    createNewStory();
  }, [generateImage]);

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
                    <View style={{ marginBottom: 20 }}>
                      <Text style={{ color: 'red', marginBottom: 10, textAlign: 'center' }}>{error}</Text>
                      <View style={{ alignItems: 'center' }}>
                        <Text 
                          onPress={retry}
                          style={{ 
                            color: '#f39c12', 
                            fontWeight: 'bold', 
                            padding: 10, 
                            borderWidth: 1, 
                            borderColor: '#f39c12', 
                            borderRadius: 5 
                          }}
                        >
                          تلاش مجدد
                        </Text>
                      </View>
                    </View>
                  )}
                  
                  {/* نمایش ایموجی‌های مرتبط با انیمیشن */}
                  {emojis && (
                    <Animated.Text 
                      style={{
                        fontSize: 40, 
                        textAlign: 'center', 
                        marginBottom: 10, 
                        opacity: fadeAnim, 
                        transform: [{ scale: bounceAnim }]
                      }}
                    >
                      {emojis}
                    </Animated.Text>
                  )}

                  <Animated.View style={{ opacity: fadeAnim }}>
                    <Text style={{ fontSize: 18, textAlign: "center", paddingHorizontal: 20, lineHeight: 30 }}>
                      {story[page]}
                    </Text>
                  </Animated.View>

                  <Text style={{ marginTop: 20, fontSize: 14, color: "gray", textAlign: "center" }}>
                    {page + 1} / {story.length}
                  </Text>
                </>
              )}
            </ScrollView>
          </View>
        </PanGestureHandler>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}
