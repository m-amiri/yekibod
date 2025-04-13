class StoryGenerator {
  async generateStory({ name, age, gender, interests }) {
    throw new Error('generateStory must be implemented');
  }
}

class ImageGenerator {
  async generateImage(description) {
    throw new Error('generateImage must be implemented');
  }
}

class StorySummarizer {
  async summarizeStory(story) {
    throw new Error('summarizeStory must be implemented');
  }
}

class EmojiGenerator {
  async generateEmojis(summary) {
    throw new Error('generateEmojis must be implemented');
  }
}

module.exports = {
  StoryGenerator,
  ImageGenerator,
  StorySummarizer,
  EmojiGenerator
}; 