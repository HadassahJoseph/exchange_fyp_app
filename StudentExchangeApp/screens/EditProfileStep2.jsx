
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { auth, db } from '../firebase/firebaseConfig';
import { getDoc, updateDoc, doc } from 'firebase/firestore';
import styles from '../styles/completeProfileStyles';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

DropDownPicker.setMode('SCROLLVIEW');

export default function EditProfileStep2() {
  const navigation = useNavigation();
  const user = auth.currentUser;
  const userId = user?.uid;

  const [interests, setInterests] = useState('');
  const [hobbies, setHobbies] = useState('');
  const [studyChoice, setStudyChoice] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('');
  const [exchangeStage, setExchangeStage] = useState('');

  const [studyOpen, setStudyOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [exchangeOpen, setExchangeOpen] = useState(false);

  const studyItems = [
    { label: 'Computer Science', value: 'Computer Science' },
    { label: 'Business', value: 'Business' },
    { label: 'Engineering', value: 'Engineering' },
    { label: 'Law', value: 'Law' },
    { label: 'Medicine', value: 'Medicine' },
    { label: 'Art & Design', value: 'Art & Design' },
    { label: 'Other', value: 'Other' },
  ];

  const languageItems = [
    { label: 'en (English)', value: 'EN' },
    { label: 'fr (French)', value: 'FR' },
    { label: 'es (Spanish)', value: 'ES' },
    { label: 'ko (Korean)', value: 'KO' },
    { label: 'de (German)', value: 'DE' },
    { label: 'Other', value: 'Other' },
  ];

  const exchangeItems = [
    { label: 'Incoming', value: 'Incoming' },
    { label: 'Currently Abroad', value: 'Currently Abroad' },
    { label: 'Returned', value: 'Returned' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        const docSnap = await getDoc(doc(db, 'users', userId));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setInterests(data.interests || '');
          setHobbies(data.hobbies || '');
          setStudyChoice(data.studyChoice || '');
          setPreferredLanguage(data.preferredLanguage || '');
          setExchangeStage(data.exchangeStage || '');
        }
      }
    };
    fetchData();
  }, []);

  const handleUpdate = async () => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        interests,
        hobbies,
        studyChoice,
        preferredLanguage,
        exchangeStage
      });
      Alert.alert('Updated!', 'Profile saved.');
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert('Error updating profile.');
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={[styles.container, { paddingBottom: 100 }]} keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: 20 }}>
          <Ionicons name="arrow-back" size={28} color="#A8E9DC" />
        </TouchableOpacity>

        <Text style={styles.header}>More About You</Text>

        {[
          { label: 'Interests', value: interests, setValue: setInterests, placeholder: 'e.g. Reading, Hiking' },
          { label: 'Hobbies', value: hobbies, setValue: setHobbies, placeholder: 'e.g. Crochet, Photography' }
        ].map((field, index) => (
          <View key={index} style={{ marginBottom: 15 }}>
            <Text style={styles.label}>{field.label}</Text>
            <TextInput
              style={styles.input}
              value={field.value}
              onChangeText={field.setValue}
              placeholder={field.placeholder}
              placeholderTextColor="#aaa"
            />
          </View>
        ))}

        <Text style={styles.label}>Study Choice</Text>
        <DropDownPicker
          open={studyOpen}
          value={studyChoice}
          items={studyItems}
          setOpen={setStudyOpen}
          setValue={setStudyChoice}
          placeholder="Select your course"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          textStyle={styles.dropdownTextStyle}
          placeholderStyle={styles.dropdownPlaceholderStyle}
        />

        <Text style={styles.label}>Preferred Language</Text>
        <DropDownPicker
          open={languageOpen}
          value={preferredLanguage}
          items={languageItems}
          setOpen={setLanguageOpen}
          setValue={setPreferredLanguage}
          placeholder="e.g. EN"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          textStyle={styles.dropdownTextStyle}
          placeholderStyle={styles.dropdownPlaceholderStyle}
        />
        <Text style={{ color: '#A8E9DC', fontSize: 12, marginTop: 5 }}>IMPORTANT: Use language codes</Text>

        <Text style={styles.label}>Exchange Stage</Text>
        <DropDownPicker
          open={exchangeOpen}
          value={exchangeStage}
          items={exchangeItems}
          setOpen={setExchangeOpen}
          setValue={setExchangeStage}
          placeholder="Select stage"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          textStyle={styles.dropdownTextStyle}
          placeholderStyle={styles.dropdownPlaceholderStyle}
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleUpdate}>
          <Text style={styles.submitText}>Update</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
