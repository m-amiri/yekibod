import axios from 'axios';
import Config from '../config';

// ایجاد نمونه axios با تنظیمات پایه
const api = axios.create({
  baseURL: Config.API_URL,
  timeout: 60000, // تایم‌اوت ۱ دقیقه
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
    message: error.message
  });
  return Promise.reject(error);
});

export const generateStory = (data) => api.post('/generate', data);
export const getHistory = (userId, page = 1, limit = 10) => 
  api.get(`/history/${userId}?page=${page}&limit=${limit}`);
export const updateStoryRating = ({ storyId, rating }) => api.post('/rating', { storyId, rating });