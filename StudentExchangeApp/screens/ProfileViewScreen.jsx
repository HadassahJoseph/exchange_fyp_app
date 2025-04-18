import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { auth, db } from '../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons'; // or 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/ProfileHomeStyles';

export default function ProfileViewScreen() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const docRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(docRef);
      if (userDoc.exists()) {
        setProfileData(userDoc.data());
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#A8E9DC" />
      </View>
    );
  }

  if (!profileData) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <Text style={{ color: '#ccc' }}>No profile data found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={{ position: 'absolute', top: 50, left: 20, zIndex: 2 }} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#A8E9DC" />
      </TouchableOpacity>

      <View style={[styles.profileHeader, { marginTop: 80 }]}>
        <Image
          source={profileData.profilePic ? { uri: profileData.profilePic } : require('../assets/user.png')}
          style={styles.avatar}
        />
        <Text style={styles.username}>@{profileData.username || 'Unknown'}</Text>
      </View>

      <View
        style={{
          width: '100%',
          paddingHorizontal: 20,
          paddingVertical: 15,
          backgroundColor: '#2a2a2a',
          borderRadius: 12,
          marginTop: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 5,
        }}
      >
        <ProfileInfo label="Bio" value={profileData.bio} />
        <ProfileInfo label="Home Country" value={profileData.homeCountry} />
        <ProfileInfo label="Host Country" value={profileData.hostCountry} />
        <ProfileInfo label="Preferred Language" value={profileData.preferredLanguage} />
        <ProfileInfo label="Study Choice" value={profileData.studyChoice} />
        <ProfileInfo label="Exchange Stage" value={profileData.exchangeStage} />
      </View>
    </ScrollView>
  );
}

const ProfileInfo = ({ label, value }) => (
  <View style={{ marginBottom: 15 }}>
    <Text style={{ color: '#A8E9DC', fontSize: 14, fontWeight: 'bold' }}>{label}</Text>
    <Text style={{ color: '#ccc', fontSize: 16 }}>{value || 'Not provided'}</Text>
  </View>
);
