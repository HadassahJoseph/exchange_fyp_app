import React, { useState } from 'react';
import { View, Text, Alert, TextInput, TouchableOpacity } from 'react-native';
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged } from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import { auth, db, functions } from '../firebase/firebaseConfig';
import { setDoc, doc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/authStyles';

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const universityDomains = ['mytudublin.ie', 'ucd.ie', 'ul.ie', 'mu.ie', 'gmail.com'];

  const handleSignUp = async () => {
    if (!email || !password || !username) {
      Alert.alert('Missing Fields', 'Please fill out all fields.');
      return;
    }

    const emailDomain = email.split('@')[1];
    const isUniversityEmail = universityDomains.includes(emailDomain);

    if (!isUniversityEmail) {
      Alert.alert('Invalid Email', 'Please use a valid university email.');
      return;
    }

    try {
      console.log('[SignUp] Creating account...');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      console.log('[SignUp] Saving user to Firestore...');
      await setDoc(doc(db, 'users', userId), {
        email,
        username,
        isVerified: false,
        trustLevel: 'Pending Verification',
        status: 'Awaiting PIN',
      });

      console.log('[SignUp] Waiting for Firebase auth state confirmation...');
      const waitForAuth = new Promise((resolve, reject) => {
        let attempts = 0;
        const unsubscribe = onAuthStateChanged(getAuth(), async (user) => {
          if (user) {
            try {
              console.log('[SignUp] User authenticated. Refreshing token...');
              await user.getIdToken(true);
              unsubscribe();
              resolve(user);
            } catch (err) {
              console.error('[SignUp] Token refresh failed:', err);
              reject(err);
            }
          } else if (attempts >= 10) {
            console.warn('[SignUp] Firebase auth took too long.');
            unsubscribe();
            reject(new Error('Firebase auth timeout'));
          }
          attempts++;
        });
      });

      await waitForAuth;

      console.log('[SignUp] About to call sendPin with:', { email, userId, username });
      const sendPin = httpsCallable(functions, 'sendVerificationPin');
      const result = await sendPin({ email, userId, username });
      console.log('[SignUp] Email function result:', result);

      await AsyncStorage.setItem('onboardingSeen', 'true');

      navigation.replace('StudentVerificationScreen', {
        userId,
        email,
        username,
        isUniversityEmail,
      });

    } catch (error) {
      console.error('[SignUp] Error:', error);
      Alert.alert('Error', error.message || 'Something went wrong during sign-up.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#ccc"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="University Email"
        placeholderTextColor="#ccc"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#ccc"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
        <Text style={styles.linkText}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignUpScreen;
