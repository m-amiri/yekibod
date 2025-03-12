const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function saveStory({ userId, storyText, imageUrl }) {
  const { data, error } = await supabase
    .from('stories')
    .insert([{ user_id: userId, story_text: storyText, image_url: imageUrl }])
    .select();
  
  if (error) throw error;
  return data[0].id;
}

async function getUserStories(userId, page = 1, limit = 10) {
  // محاسبه تعداد آیتم‌هایی که باید رد شوند
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // گرفتن تعداد کل رکوردها
  const { count: totalCount } = await supabase
    .from('stories')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId);

  // گرفتن داستان‌ها با pagination
  const { data, error } = await supabase
    .from('stories')
    .select('id, story_text, image_url, rating, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw error;

  return {
    stories: data,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalItems: totalCount,
      hasMore: from + data.length < totalCount
    }
  };
}

async function updateStoryRating({ storyId, rating }) {
  const { error } = await supabase
    .from('stories')
    .update({ rating })
    .eq('id', storyId);

  if (error) throw error;
}

module.exports = { saveStory, updateStoryRating, getUserStories };
