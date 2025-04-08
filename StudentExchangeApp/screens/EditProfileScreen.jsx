import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert, Platform, KeyboardAvoidingView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import * as ImagePicker from 'expo-image-picker';
import { auth, db } from '../firebase/firebaseConfig';
import { getDoc, updateDoc, doc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import styles from '../styles/completeProfileStyles';
import { useNavigation } from '@react-navigation/native';

DropDownPicker.setMode('SCROLLVIEW');

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const user = auth.currentUser;
  const userId = user?.uid;

  const [profilePic, setProfilePic] = useState(null);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [studyChoice, setStudyChoice] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('');
  const [exchangeStage, setExchangeStage] = useState('');
  const [homeCountry, setHomeCountry] = useState('');
  const [hostCountry, setHostCountry] = useState('');
  const [interests, setInterests] = useState('');
  const [hobbies, setHobbies] = useState('');

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
        const userRef = doc(db, 'users', userId);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfilePic(data.profilePic || null);
          setUsername(data.username || '');
          setBio(data.bio || '');
          setStudyChoice(data.studyChoice || '');
          setPreferredLanguage(data.preferredLanguage || '');
          setExchangeStage(data.exchangeStage || '');
          setHomeCountry(data.homeCountry || '');
          setHostCountry(data.hostCountry || '');
          setInterests(data.interests || '');
          setHobbies(data.hobbies || '');
        }
      }
    };
    fetchData();
  }, [userId]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.5 });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const blob = await (await fetch(uri)).blob();
      const fileName = `profile_${Date.now()}.jpg`;
      const storageRef = ref(getStorage(), `profilePics/${userId}/${fileName}`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      setProfilePic(downloadURL);
    }
  };

  const handleUpdate = async () => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        profilePic,
        username,
        bio,
        studyChoice,
        preferredLanguage,
        exchangeStage,
        homeCountry,
        hostCountry,
        interests,
        hobbies,
      });
      Alert.alert('Updated!', 'Your profile was successfully updated.');
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert('Error updating profile.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.container, { paddingBottom: 100, flexGrow: 1, paddingTop: 20 }]}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: 20 }}>
          <Ionicons name="arrow-back" size={28} color="#A8E9DC" />
        </TouchableOpacity>
  
        <Text style={styles.header}>Edit Your Profile</Text>
  
        <TouchableOpacity onPress={pickImage} style={{ alignItems: 'center', marginBottom: 25 }}>
          {profilePic ? (
            <Image source={{ uri: profilePic }} style={{ width: 100, height: 100, borderRadius: 50 }} />
          ) : (
            <View style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: '#333',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Ionicons name="camera" size={28} color="#A8E9DC" />
              <Text style={{ color: '#ccc', fontSize: 12 }}>Add Photo</Text>
            </View>
          )}
        </TouchableOpacity>
  
          {[
            { label: 'Username', value: username, onChange: setUsername, placeholder: 'Enter username' },
            { label: 'Short bio', value: bio, onChange: setBio, placeholder: 'Write your bio', multiline: true },
            { label: 'Home Country', value: homeCountry, onChange: setHomeCountry, placeholder: 'e.g. Ireland' },
            { label: 'Host Country', value: hostCountry, onChange: setHostCountry, placeholder: 'e.g. South Korea' },
            { label: 'Interests', value: interests, onChange: setInterests, placeholder: 'e.g. Reading, Hiking' },
            { label: 'Hobbies', value: hobbies, onChange: setHobbies, placeholder: 'e.g. Crochet, Photography' }
          ].map((field, i) => (
            <View key={i} style={{ marginBottom: 15 }}>
              <Text style={styles.label}>{field.label}</Text>
              <TextInput
                style={styles.input}
                value={field.value}
                onChangeText={field.onChange}
                placeholder={field.placeholder}
                placeholderTextColor="#aaa"
                multiline={field.multiline || false}
              />
            </View>
          ))}
  
          {/* Study Choice */}
          <View style={{ marginBottom: 15 }}>
            <Text style={styles.label}>Study Choice</Text>
            <DropDownPicker
              open={studyOpen}
              value={studyChoice}
              items={studyItems}
              setOpen={setStudyOpen}
              setValue={setStudyChoice}
              placeholder="Choose study"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              textStyle={styles.dropdownTextStyle}
              placeholderStyle={styles.dropdownPlaceholderStyle}
            />
          </View>
  
          {/* Language */}
          <View style={{ marginBottom: 15 }}>
            <Text style={styles.label}>Preferred Language</Text>
            <DropDownPicker
              open={languageOpen}
              value={preferredLanguage}
              items={languageItems}
              setOpen={setLanguageOpen}
              setValue={setPreferredLanguage}
              placeholder="Language (e.g., EN)"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              textStyle={styles.dropdownTextStyle}
              placeholderStyle={styles.dropdownPlaceholderStyle}
            />
            <Text style={{ color: '#A8E9DC', fontSize: 12, marginTop: 5 }}>IMPORTANT: Use language codes</Text>
          </View>
  
          {/* Exchange Stage */}
          <View style={{ marginBottom: 15 }}>
            <Text style={styles.label}>Exchange Stage</Text>
            <DropDownPicker
              open={exchangeOpen}
              value={exchangeStage}
              items={exchangeItems}
              setOpen={setExchangeOpen}
              setValue={setExchangeStage}
              placeholder="Where are you now?"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              textStyle={styles.dropdownTextStyle}
              placeholderStyle={styles.dropdownPlaceholderStyle}
            />
          </View>
          </ScrollView>

        {/* Update Button */}
        <View style={{ padding: 20, backgroundColor: '#1e1e1e' }}>
        <TouchableOpacity style={styles.submitButton} onPress={handleUpdate}>
            <Text style={styles.submitText}>Update</Text>
        </TouchableOpacity>
        </View>
        </KeyboardAvoidingView>
        );
}
