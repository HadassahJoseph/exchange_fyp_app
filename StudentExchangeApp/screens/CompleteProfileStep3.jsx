import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import styles from '../styles/completeProfileStyles';

const hobbiesList = ['Crochet', 'Movies', 'Yoga', 'Painting', 'Cooking', 'Reading'];
const interestList = ['Accommodation', 'Sightseeing', 'Language Exchange', 'Student Deals'];

export default function CompleteProfileStep3({ navigation, route }) {
  const {
    userId,
    studyChoice,
    preferredLanguage,
    hostCountry,
    homeCountry,
  } = route.params;

  const [selectedHobbies, setSelectedHobbies] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);

  const toggleSelection = (item, list, setList) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedHobbies.length || !selectedInterests.length) {
      Alert.alert('Please select at least one hobby and one interest.');
      return;
    }

    try {
      await updateDoc(doc(db, 'users', userId), {
        studyChoice,
        preferredLanguage,
        hostCountry,
        homeCountry,
        hobbies: selectedHobbies,
        interests: selectedInterests,
      });

      Alert.alert('Profile completed!');
      navigation.navigate('AppNavigator', { screen: 'Profile' });
    } catch (error) {
      console.error(error);
      Alert.alert('Something went wrong', error.message);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.header}>Step 3: Hobbies & Interests</Text>

        <Text style={styles.subHeader}>Select Your Hobbies</Text>
        <View style={styles.grid}>
          {hobbiesList.map((hobby) => (
            <TouchableOpacity
              key={hobby}
              style={[styles.tag, selectedHobbies.includes(hobby) && styles.tagSelected]}
              onPress={() => toggleSelection(hobby, selectedHobbies, setSelectedHobbies)}
            >
              <Text style={styles.tagText}>{hobby}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.subHeader}>Select Your Interests</Text>
        <View style={styles.grid}>
          {interestList.map((interest) => (
            <TouchableOpacity
              key={interest}
              style={[styles.tag, selectedInterests.includes(interest) && styles.tagSelected]}
              onPress={() => toggleSelection(interest, selectedInterests, setSelectedInterests)}
            >
              <Text style={styles.tagText}>{interest}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Finish</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
