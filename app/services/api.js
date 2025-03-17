import axios from 'axios';
import Config from '../config';

// ایجاد نمونه axios با تنظیمات پایه
const api = axios.create({
  baseURL: Config.API_URL,
  timeout: 120000, // تایم‌اوت ۲ دقیقه
  headers: {
    'Content-Type': 'application/json',
  }
});

// اضافه کردن interceptor برای لاگ درخواست‌ها
api.interceptors.request.use(request => {
  console.log('API Request:', {
    method: request.method,
    url: request.url,
    data: request.data,
    headers: request.headers
  });
  return request;
}, error => {
  console.error('API Request Error:', error);
  return Promise.reject(error);
});

// اضافه کردن interceptor برای لاگ پاسخ‌ها
api.interceptors.response.use(response => {
  console.log('API Response:', {
    status: response.status,
    url: response.config.url,
    data: response.data
  });
  return response;
}, error => {
  console.error('API Response Error:', {
    status: error.response?.status,
    data: error.response?.data,
    message: error.message,
    config: {
      url: error.config?.url,
      method: error.config?.method,
      baseURL: error.config?.baseURL,
    }
  });

  // برای خطاهای شبکه، اطلاعات بیشتری لاگ کنیم
  if (error.message === 'Network Error') {
    console.error('Network Error details:', {
      API_URL: Config.API_URL,
      timeout: api.defaults.timeout
    });
    
    // برای storyEnhancer، مقادیر پیش‌فرض برگردانیم
    if (error.config?.url?.includes('/storyEnhancer/enhance')) {
      console.log('Returning mock emojis for network error');
      return Promise.resolve({ data: { emojis: '🌟 🎈 🦁 🌈 🏰' } });
    }
  }

  return Promise.reject(error);
});

// تابع تست ساده برای بررسی اتصال به سرور
export const pingServer = () => api.get('/ping');

export const generateStory = (data) => api.post('/generate', data);
export const getHistory = (userId, page = 1, limit = 10) => 
  api.get(`/history/${userId}?page=${page}&limit=${limit}`);
export const updateStoryRating = ({ storyId, rating }) => api.post('/rating', { storyId, rating });
// درخواست برای خلاصه داستان و ایموجی‌ها
export const getStoryEnhancement = (story) => api.post('/storyEnhancer/enhance', { story });
