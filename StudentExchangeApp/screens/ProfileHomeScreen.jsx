// screens/ProfileHomeScreen.jsx
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/ProfileHomeStyles';

export default function ProfileHomeScreen() {
  const navigation = useNavigation();

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
        <Text style={styles.username}>@your_username</Text>
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
    </ScrollView>
  );
}
