import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, FlatList } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase/firebaseConfig';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/ProfileHomeStyles';

export default function ProfileHomeScreen() {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
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

          // Load pending requests
          const pending = userData.connectionRequests || [];
          const snapshot = await getDocs(collection(db, 'users'));
          const requestUsers = snapshot.docs.filter(doc => pending.includes(doc.id)).map(doc => ({ id: doc.id, ...doc.data() }));
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
          source={{ uri: 'https://via.placeholder.com/100' }}
          style={styles.avatar}
        />
        <Text style={styles.username}>@{username}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('CompleteProfileStep1', { userId: auth.currentUser?.uid })}>
          <Text style={styles.link}>View my profile</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.section} onPress={() => navigation.navigate('FavouritesScreen')}>
        <Text style={styles.sectionText}>❤️ Favourite Items</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.section} onPress={() => navigation.navigate('HistoryScreen')}>
        <Text style={styles.sectionText}>🕓 History</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.section} onPress={() => navigation.navigate('PostsScreen')}>
        <Text style={styles.sectionText}>✍️ My Posts</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.section} onPress={() => navigation.navigate('SettingsScreen')}>
        <Text style={styles.sectionText}>⚙️ Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.section} onPress={handleLogout}>
        <Text style={[styles.sectionText, { color: 'red' }]}>🚪 Log Out</Text>
      </TouchableOpacity>

      {requests.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <Text style={styles.sectionText}>🤝 Pending Requests</Text>
          <FlatList
            data={requests}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.requestCard}>
                <Image
                  source={{ uri: item.avatarUrl || 'https://via.placeholder.com/100' }}
                  style={styles.avatar}
                />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: 'bold' }}>{item.username}</Text>
                  <TouchableOpacity onPress={() => acceptConnection(item.id)} style={styles.acceptBtn}>
                    <Text style={{ color: 'white' }}>Accept</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      )}
    </ScrollView>
  );
}



