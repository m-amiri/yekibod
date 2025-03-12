import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { getUserId } from '../../services/userServices';
import { getHistory } from '../../services/api';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HistoryScreen({ navigation }) {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const ITEMS_PER_PAGE = 10;

  const fetchStories = async (page = 1, isLoadingMore = false) => {
    try {
      if (isLoadingMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const userId = await getUserId();
      const response = await getHistory(userId, page, ITEMS_PER_PAGE);
      
      const { stories: newStories, pagination } = response.data;
      
      if (isLoadingMore) {
        setStories(prev => [...prev, ...newStories]);
      } else {
        setStories(newStories);
      }

      setHasMore(pagination.hasMore);
      setTotalPages(pagination.totalPages);
      setTotalItems(pagination.totalItems);
      setCurrentPage(pagination.currentPage);
      
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchStories(nextPage, true);
    }
  };

  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ScrollView 
          onScroll={({ nativeEvent }) => {
            if (isCloseToBottom(nativeEvent)) {
              loadMore();
            }
          }}
          scrollEventThrottle={400}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <Text style={{ fontSize: 22, fontWeight: 'bold' }}>📚 تاریخچه داستان‌ها</Text>
            {totalItems > 0 && (
              <Text style={{ fontSize: 14, color: 'gray' }}>
                {totalItems} داستان
              </Text>
            )}
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#f39c12" />
          ) : stories.length === 0 ? (
            <Text>هیچ داستانی در تاریخچه شما وجود ندارد.</Text>
          ) : (
            <>
              {stories.map((story) => (
                <TouchableOpacity 
                  key={story.id} 
                  onPress={() => navigation.navigate('ExistingStory', { story })}
                  style={{ 
                    marginBottom: 20, 
                    padding: 15,
                    backgroundColor: '#f9f9f9', 
                    borderRadius: 10,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3
                  }}
                >
                  {story.image_url && (
                    <Image 
                      source={{ uri: story.image_url }} 
                      style={{ 
                        width: '100%', 
                        height: 150, 
                        borderRadius: 10, 
                        marginBottom: 10 
                      }} 
                      onError={(e) => console.log('Image loading error:', e.nativeEvent.error)}
                    />
                  )}
                  <Text style={{ 
                    fontSize: 16, 
                    fontWeight: 'bold',
                    lineHeight: 24
                  }}>
                    {story.story_text.substring(0, 100)}...
                  </Text>
                  <View style={{ 
                    flexDirection: 'row', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 10 
                  }}>
                    <Text style={{ fontSize: 12, color: 'gray' }}>
                      📅 {new Date(story.created_at).toLocaleDateString('fa-IR')}
                    </Text>
                    {story.rating !== null && (
                      <Text style={{ 
                        fontSize: 14, 
                        color: story.rating === 1 ? '#4CAF50' : '#f44336',
                        fontWeight: '500'
                      }}>
                        {story.rating === 1 ? '👍 پسندیده شد' : '👎 نپسندیده شد'}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
              
              {loadingMore && (
                <View style={{ paddingVertical: 20 }}>
                  <ActivityIndicator size="small" color="#f39c12" />
                </View>
              )}
              
              {!hasMore && stories.length > 0 && (
                <Text style={{ 
                  textAlign: 'center', 
                  color: 'gray', 
                  marginTop: 10,
                  paddingVertical: 10,
                  borderTopWidth: 1,
                  borderTopColor: '#eee'
                }}>
                  پایان داستان‌ها
                </Text>
              )}

              {hasMore && !loadingMore && (
                <TouchableOpacity 
                  onPress={loadMore}
                  style={{
                    backgroundColor: '#f39c12',
                    padding: 12,
                    borderRadius: 8,
                    marginTop: 10,
                    alignItems: 'center'
                  }}
                >
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>
                    نمایش داستان‌های بیشتر
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </ScrollView>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}
