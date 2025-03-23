// screens/HomeScreen.jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎉 Welcome to StudyBuddy</Text>
      <Text style={styles.subtitle}>This is your Home Screen</Text>
      <Text style={styles.placeholder}>We'll soon show recommendations based on your home/host country, culture tips, and posts from other students here! 🌍✨</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#4CAF50',
    marginBottom: 20,
  },
  placeholder: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center'
  },
});