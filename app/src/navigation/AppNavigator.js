import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import WelcomeScreen from '../screens/WelcomeScreen';
import ChildFormScreen from '../screens/ChildFormScreen';
import StoryScreen from '../screens/StoryScreen';
import ImageScreen from '../screens/ImageScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ExistingStoryScreen from '../screens/ExistingStoryScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <SafeAreaView style={{ flex: 1 }}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="ChildForm" component={ChildFormScreen} />
          <Stack.Screen name="Story" component={StoryScreen} />
          <Stack.Screen name="Image" component={ImageScreen} />
          <Stack.Screen name="History" component={HistoryScreen} />
          <Stack.Screen name="ExistingStory" component={ExistingStoryScreen} />
        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
}
