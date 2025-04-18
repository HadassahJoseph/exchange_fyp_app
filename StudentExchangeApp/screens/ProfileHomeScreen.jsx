import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, FlatList } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase/firebaseConfig';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, getDocs, collection } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/ProfileHomeStyles';

export default function ProfileHomeScreen() {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchProfileData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(docRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUsername(userData.username || 'Unknown');
          setProfilePic(userData.profilePic || null);

          // Load pending requests
          const pending = userData.connectionRequests || [];
          const snapshot = await getDocs(collection(db, 'users'));
          const requestUsers = snapshot.docs
            .filter(doc => pending.includes(doc.id))
            .map(doc => ({ id: doc.id, ...doc.data() }));
          setRequests(requestUsers);
        }
      }
    };

    fetchProfileData();
  }, []);

  const acceptConnection = async (otherId) => {
    const userId = auth.currentUser.uid;
    const userRef = doc(db, 'users', userId);
    const otherRef = doc(db, 'users', otherId);

    await updateDoc(userRef, {
      connections: arrayUnion(otherId),
      connectionRequests: arrayRemove(otherId)
    });

    await updateDoc(otherRef, {
      connections: arrayUnion(userId),
      connectionRequests: arrayRemove(userId)
    });

    setRequests(prev => prev.filter(u => u.id !== otherId));
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigation.replace('LoginScreen');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileHeader}>
        <Image
          source={profilePic ? { uri: profilePic } : require('../assets/user.png')}
          style={styles.avatar}
        />
        <Text style={styles.username}>@{username}</Text>

        <TouchableOpacity onPress={() => navigation.navigate('EditProfileStep1')}>
          <Text style={styles.link}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.section} onPress={() => navigation.navigate('FavouritesScreen')}>
        <Text style={styles.sectionText}>Favourite Items</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.section} onPress={() => navigation.navigate('ProfileViewScreen')}>
        <Text style={styles.sectionText}>View Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.section} onPress={() => navigation.navigate('EditContentScreen')}>
        <Text style={styles.sectionText}>Edit Posts / Discussions / Favourites</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.section} onPress={() => navigation.navigate('SettingsScreen')}>
        <Text style={styles.sectionText}>Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.section} onPress={handleLogout}>
        <Text style={[styles.sectionText, { color: 'red' }]}>Log Out</Text>
      </TouchableOpacity>

    
    </ScrollView>
  );
}
