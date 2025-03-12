import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../src/screens/WelcomeScreen';
import ChildFormScreen from '../src/screens/ChildFormScreen';
import StoryScreen from '../src/screens/StoryScreen';
import HistoryScreen from '../src/screens/HistoryScreen';
import ExistingStoryScreen from '../src/screens/ExistingStoryScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="ChildForm" component={ChildFormScreen} />
      <Stack.Screen name="Story" component={StoryScreen} />
      <Stack.Screen name="History" component={HistoryScreen} />
      <Stack.Screen name="ExistingStory" component={ExistingStoryScreen} />
    </Stack.Navigator>
  );
} 