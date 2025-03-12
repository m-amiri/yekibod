import AsyncStorage from '@react-native-async-storage/async-storage';
// از روش ساده‌تر برای تولید ID استفاده می‌کنیم
// import { v4 as uuidv4 } from 'uuid';

// تابع ساده برای تولید ID تصادفی
const generateSimpleId = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15) + 
         Date.now().toString(36);
};

export const getUserId = async () => {
  try {
    let userId = await AsyncStorage.getItem('userId');
    if (!userId) {
      // userId = uuidv4();
      userId = generateSimpleId();
      await AsyncStorage.setItem('userId', userId);
    }
    return userId;
  } catch (error) {
    console.error('Error fetching user ID:', error);
    return generateSimpleId(); // در صورت خطا، یک ID جدید برگردان
  }
};