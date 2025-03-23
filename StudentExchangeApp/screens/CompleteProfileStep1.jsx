// screens/CompleteProfileStep1.jsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import styles from '../styles/completeProfileStyles';

DropDownPicker.setMode('SCROLLVIEW');

export default function CompleteProfileStep1({ navigation, route }) {
  const { userId } = route.params; // ✅ make sure we get userId from previous screen

  const [studyChoice, setStudyChoice] = useState(route.params?.studyChoice || '');
  const [preferredLanguage, setPreferredLanguage] = useState(route.params?.preferredLanguage || '');
  const [studyOpen, setStudyOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);

  const [studyItems, setStudyItems] = useState([
    { label: 'Computer Science', value: 'Computer Science' },
    { label: 'Business', value: 'Business' },
    { label: 'Engineering', value: 'Engineering' },
    { label: 'Art', value: 'Art' },
    { label: 'Other', value: 'Other' },
  ]);

  const [languageItems, setLanguageItems] = useState([
    { label: 'English', value: 'English' },
    { label: 'French', value: 'French' },
    { label: 'Spanish', value: 'Spanish' },
    { label: 'Korean', value: 'Korean' },
    { label: 'German', value: 'German' },
  ]);

  const handleNext = () => {
    if (!studyChoice || !preferredLanguage) {
      alert('Please select both study choice and language.');
      return;
    }

    navigation.navigate('CompleteProfileStep2', {
      userId, // ✅ pass userId to step 2
      studyChoice,
      preferredLanguage,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Step 1: Study Info</Text>

      <View style={{ zIndex: 1000 }}>
        <Text style={styles.label}>Study Choice</Text>
        <DropDownPicker
          open={studyOpen}
          value={studyChoice}
          items={studyItems}
          setOpen={setStudyOpen}
          setValue={setStudyChoice}
          setItems={setStudyItems}
          placeholder="Select Study Choice"
          searchable={true}
          allowCustomValue={true}
        />
      </View>

      <View style={{ zIndex: 500, marginTop: 20 }}>
        <Text style={styles.label}>Preferred Language</Text>
        <DropDownPicker
          open={languageOpen}
          value={preferredLanguage}
          items={languageItems}
          setOpen={setLanguageOpen}
          setValue={setPreferredLanguage}
          setItems={setLanguageItems}
          placeholder="Select Preferred Language"
          searchable={true}
        />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleNext}>
        <Text style={styles.submitText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}