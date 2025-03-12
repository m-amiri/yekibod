import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <View style={styles.container}>
        <Text style={styles.title}>به یکی بود خوش آمدید!</Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('ChildForm')}
        >
          <Text style={styles.buttonText}>شروع کنید</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.historyButton]}
          onPress={() => navigation.navigate('History')}
        >
          <Text style={styles.buttonText}>📚 تاریخچه داستان‌ها</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#f39c12',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    marginBottom: 15,
  },
  historyButton: {
    backgroundColor: '#3498db',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
