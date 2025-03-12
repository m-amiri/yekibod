
# Yeki Bod - Storytelling App for Kids

Welcome to **Yeki Bod**, a storytelling app that generates personalized stories and images for children based on their interests.

## 🚀 How to Run the Project

### 1️⃣ Install Dependencies
Make sure you have **Node.js** and **Expo CLI** installed.
```bash
npm install -g expo-cli
npm install
```

### 2️⃣ Start the Project
```bash
expo start
```

## 🛠️ Project Structure
```
yeki-bod-app/
├── App.js
├── package.json
├── tailwind.config.js
├── babel.config.js
├── src/
│   ├── navigation/
│   │   └── AppNavigator.js
│   ├── screens/
│   │   ├── WelcomeScreen.js
│   │   ├── ChildFormScreen.js
│   │   ├── StoryScreen.js
│   │   ├── ImageScreen.js
│   │   └── HistoryScreen.js
│   └── services/
│       └── api.js
```

## 🖌️ Styling
This project uses **NativeWind** (Tailwind CSS for React Native) for fast and consistent styling.

### Install NativeWind (if not installed)
```bash
npm install nativewind
```

## 🌐 Backend API Endpoints
- `POST /story` - Generate a personalized story.
- `POST /image` - Generate an image based on the story.
- `GET /history/:userId` - Retrieve saved stories.

## 📝 .env Configuration
Create a `.env` file with the following keys:
```
OPENAI_API_KEY=your-openai-api-key
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-key
```

## ✅ Features
- Enter child details (name, age, interests).
- Generate personalized stories using GPT.
- Create AI-generated images for each story.
- Save and view story history.

## 💡 Future Plans
- Voice narration for stories.
- Multi-profile support.
- Advanced story recommendations.

---
Made with ❤️ for children by the Yeki Bod team.
