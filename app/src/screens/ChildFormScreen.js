import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChildFormScreen({ navigation }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('پسر'); // مقدار پیش‌فرض: پسر
  const [interests, setInterests] = useState('');

  const handleSubmit = () => {
    navigation.navigate('Story', {
      name,
      age: parseInt(age),
      gender,
      interests: interests.split(',').map(i => i.trim())
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <View style={styles.container}>
        <Text style={styles.title}>اطلاعات کودک</Text>
        
        <TextInput
          style={styles.input}
          placeholder="نام کودک"
          value={name}
          onChangeText={setName}
        />
        
        <TextInput
          style={styles.input}
          placeholder="سن کودک"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />
        
        <View style={styles.genderContainer}>
          <TouchableOpacity 
            style={[styles.genderButton, gender === 'پسر' && styles.selectedGender]}
            onPress={() => setGender('پسر')}
          >
            <Text style={[styles.genderText, gender === 'پسر' && styles.selectedGenderText]}>پسر</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.genderButton, gender === 'دختر' && styles.selectedGender]}
            onPress={() => setGender('دختر')}
          >
            <Text style={[styles.genderText, gender === 'دختر' && styles.selectedGenderText]}>دختر</Text>
          </TouchableOpacity>
        </View>
        
        <TextInput
          style={styles.input}
          placeholder="علاقه‌مندی‌ها (با کاما جدا کنید)"
          value={interests}
          onChangeText={setInterests}
        />
        
        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>تولید داستان</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  genderButton: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    flex: 1,
    marginHorizontal: 5,
  },
  selectedGender: {
    backgroundColor: '#f39c12',
    borderColor: '#f39c12',
  },
  genderText: {
    textAlign: 'center',
    fontSize: 16,
  },
  selectedGenderText: {
    color: 'white',
  },
  submitButton: {
    backgroundColor: '#f39c12',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
