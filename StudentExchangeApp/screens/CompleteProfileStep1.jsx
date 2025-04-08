import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image, ScrollView, Platform, KeyboardAvoidingView, Linking } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';
import styles from '../styles/completeProfileStyles';

DropDownPicker.setMode('SCROLLVIEW');

export default function CompleteProfileStep1({ navigation, route }) {
  const { userId } = route.params;

  const [profilePic, setProfilePic] = useState(null);
  const [uploadingPic, setUploadingPic] = useState(false);
  const [bio, setBio] = useState('');

  const [studyOpen, setStudyOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [exchangeOpen, setExchangeOpen] = useState(false);

  const [studyChoice, setStudyChoice] = useState('');
  const [customStudy, setCustomStudy] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('');
  const [customLanguage, setCustomLanguage] = useState('');
  const [exchangeStage, setExchangeStage] = useState('');

  const [studyItems, setStudyItems] = useState([
    { label: 'Computer Science', value: 'Computer Science' },
    { label: 'Business', value: 'Business' },
    { label: 'Engineering', value: 'Engineering' },
    { label: 'Law', value: 'Law' },
    { label: 'Medicine', value: 'Medicine' },
    { label: 'Art & Design', value: 'Art & Design' },
    { label: 'Other', value: 'Other' },
  ]);

  const [languageItems, setLanguageItems] = useState([
    { label: 'en (English)', value: 'EN' },
    { label: 'fr (French)', value: 'FR' },
    { label: 'es (Spanish)', value: 'ES' },
    { label: 'ko (Korean)', value: 'KO' },
    { label: 'de (German)', value: 'DE' },
    { label: 'Other', value: 'Other' },
  ]);

  const [exchangeItems] = useState([
    { label: 'Incoming', value: 'Incoming' },
    { label: 'Currently Abroad', value: 'Currently Abroad' },
    { label: 'Returned', value: 'Returned' },
  ]);

  const handlePickProfilePic = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission denied', 'You need to allow photo access.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.5 });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setUploadingPic(true);
      try {
        const blob = await (await fetch(uri)).blob();
        const fileName = `profile_${Date.now()}.jpg`;
        const storageRef = ref(getStorage(), `profilePics/${userId}/${fileName}`);
        await uploadBytes(storageRef, blob);
        const downloadUrl = await getDownloadURL(storageRef);
        setProfilePic(downloadUrl);
      } catch (err) {
        console.error(err);
        Alert.alert('Upload failed');
      }
      setUploadingPic(false);
    }
  };

  const handleHelpPress = () => {
    Alert.alert(
      'Language Code Help',
      'Use the two-letter code (e.g., EN for English).',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'View Codes',
          onPress: () => Linking.openURL('https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes'),
        },
      ]
    );
  };

  const handleNext = async () => {
    const finalStudyChoice = studyChoice === 'Other' ? customStudy : studyChoice;
    const finalLang = preferredLanguage === 'Other' ? customLanguage : preferredLanguage;

    if (!finalStudyChoice || !finalLang || !exchangeStage || !profilePic || !bio) {
      Alert.alert('Incomplete', 'Please fill all fields and upload a profile picture.');
      return;
    }

    try {
      await updateDoc(doc(db, 'users', userId), {
        profilePic,
        bio,
        studyChoice: finalStudyChoice,
        preferredLanguage: finalLang,
        exchangeStage,
      });

      navigation.navigate('CompleteProfileStep2', {
        userId,
        studyChoice: finalStudyChoice,
        preferredLanguage: finalLang,
        exchangeStage,
      });
    } catch (err) {
      console.error(err);
      Alert.alert('Something went wrong');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.header}>Step 1: Study Info</Text>

        <TouchableOpacity onPress={handlePickProfilePic} style={{ alignItems: 'center', marginBottom: 20 }}>
          {profilePic ? (
            <Image source={{ uri: profilePic }} style={{ width: 100, height: 100, borderRadius: 50 }} />
          ) : (
            <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: '#333', justifyContent: 'center', alignItems: 'center' }}>
              <Ionicons name="camera" size={28} color="#A8E9DC" />
              <Text style={{ color: '#ccc', fontSize: 12 }}>Add Photo</Text>
            </View>
          )}
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Short bio about yourself"
          placeholderTextColor="#ccc"
          multiline
          numberOfLines={3}
          value={bio}
          onChangeText={setBio}
        />

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
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          textStyle={styles.dropdownTextStyle}
          placeholderStyle={styles.dropdownPlaceholderStyle}
          labelStyle={{ color: '#ffffff' }}
        />
        {studyChoice === 'Other' && (
          <TextInput
            style={styles.input}
            placeholder="Enter your course"
            placeholderTextColor="#ccc"
            value={customStudy}
            onChangeText={setCustomStudy}
          />
        )}

        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
          <Text style={[styles.label, { marginRight: 6 }]}>Preferred Language</Text>
          <TouchableOpacity onPress={handleHelpPress}>
            <Ionicons name="information-circle-outline" size={18} color="#A8E9DC" />
          </TouchableOpacity>
        </View>
        <DropDownPicker
          open={languageOpen}
          value={preferredLanguage}
          items={languageItems}
          setOpen={setLanguageOpen}
          setValue={setPreferredLanguage}
          setItems={setLanguageItems}
          placeholder="Select Language Code"
          searchable={true}
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          textStyle={styles.dropdownTextStyle}
          placeholderStyle={styles.dropdownPlaceholderStyle}
          labelStyle={{ color: '#ffffff' }}
        />
        {preferredLanguage === 'Other' && (
          <TextInput
            style={styles.input}
            placeholder="Enter custom language code"
            placeholderTextColor="#ccc"
            value={customLanguage}
            onChangeText={setCustomLanguage}
          />
        )}

        <Text style={styles.label}>Exchange Stage</Text>
        <DropDownPicker
          open={exchangeOpen}
          value={exchangeStage}
          items={exchangeItems}
          setOpen={setExchangeOpen}
          setValue={setExchangeStage}
          setItems={() => {}}
          placeholder="Where are you in your exchange?"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          textStyle={styles.dropdownTextStyle}
          placeholderStyle={styles.dropdownPlaceholderStyle}
          labelStyle={{ color: '#ffffff' }}
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleNext}>
          <Text style={styles.submitText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
