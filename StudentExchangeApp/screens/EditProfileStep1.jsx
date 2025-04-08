
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert, Platform, KeyboardAvoidingView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { auth, db } from '../firebase/firebaseConfig';
import { getDoc, updateDoc, doc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import styles from '../styles/completeProfileStyles';
import { useNavigation } from '@react-navigation/native';

export default function EditProfileStep1() {
  const navigation = useNavigation();
  const user = auth.currentUser;
  const userId = user?.uid;

  const [profilePic, setProfilePic] = useState(null);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [homeCountry, setHomeCountry] = useState('');
  const [hostCountry, setHostCountry] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        const docSnap = await getDoc(doc(db, 'users', userId));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfilePic(data.profilePic || null);
          setUsername(data.username || '');
          setBio(data.bio || '');
          setHomeCountry(data.homeCountry || '');
          setHostCountry(data.hostCountry || '');
        }
      }
    };
    fetchData();
  }, []);

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

  const handleNext = async () => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        profilePic,
        username,
        bio,
        homeCountry,
        hostCountry
      });
      navigation.navigate('EditProfileStep2');
    } catch (err) {
      console.error(err);
      Alert.alert('Error updating profile.');
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={[styles.container, { paddingTop: 20 }]} keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: 20 }}>
          <Ionicons name="arrow-back" size={28} color="#A8E9DC" />
        </TouchableOpacity>
        <Text style={styles.header}>Edit Your Profile</Text>

        <TouchableOpacity onPress={pickImage} style={{ alignItems: 'center', marginBottom: 25 }}>
          {profilePic ? (
            <Image source={{ uri: profilePic }} style={{ width: 100, height: 100, borderRadius: 50 }} />
          ) : (
            <View style={{
              width: 100, height: 100, borderRadius: 50, backgroundColor: '#333',
              justifyContent: 'center', alignItems: 'center'
            }}>
              <Ionicons name="camera" size={28} color="#A8E9DC" />
              <Text style={{ color: '#ccc', fontSize: 12 }}>Add Photo</Text>
            </View>
          )}
        </TouchableOpacity>

        {[
          { label: 'Username', value: username, setValue: setUsername },
          { label: 'Short bio', value: bio, setValue: setBio, multiline: true },
          { label: 'Home Country', value: homeCountry, setValue: setHomeCountry },
          { label: 'Host Country', value: hostCountry, setValue: setHostCountry }
        ].map((field, index) => (
          <View key={index} style={{ marginBottom: 15 }}>
            <Text style={styles.label}>{field.label}</Text>
            <TextInput
              style={styles.input}
              value={field.value}
              onChangeText={field.setValue}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              placeholderTextColor="#aaa"
              multiline={field.multiline || false}
            />
          </View>
        ))}

        <TouchableOpacity style={styles.submitButton} onPress={handleNext}>
          <Text style={styles.submitText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
