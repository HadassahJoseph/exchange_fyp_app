import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase/firebaseConfig';
import styles from '../styles/authStyles';

export default function StudentVerificationScreen({ navigation }) {
  const [pin, setPin] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserId(currentUser.uid);
      console.log("[StudentVerification] Loaded with userId:", currentUser.uid);
    } else {
      console.warn("[StudentVerification] No current user — redirecting to Login.");
      navigation.replace("LoginScreen");
    }
  }, []);

  const handlePinVerification = async () => {
    if (!pin) {
      Alert.alert("Missing PIN", "Please enter the code sent to your email.");
      return;
    }

    if (!userId) return;

    setIsVerifying(true);

    try {
      const codeRef = doc(db, 'verificationCodes', userId);
      const codeSnap = await getDoc(codeRef);

      if (!codeSnap.exists()) {
        console.warn("[StudentVerification] No PIN found in Firestore for:", userId);
        throw new Error('Verification code not found. Please try signing up again.');
      }

      const { pin: validPin } = codeSnap.data();
      console.log("[StudentVerification] Valid PIN from Firestore:", validPin);

      if (pin !== validPin) {
        Alert.alert("Incorrect PIN", "The code you entered is invalid.");
        return;
      }

      console.log("[StudentVerification] PIN matched! Updating user status...");

      await updateDoc(doc(db, 'users', userId), {
        trustLevel: 'Verified Student',
        status: 'Verified',
        verificationMethod: 'PIN Email',
      });

      Alert.alert("Success", "Your email has been verified!");
      navigation.replace('OnboardingScreen');

    } catch (error) {
      console.error("[StudentVerification] Error during verification:", error);
      Alert.alert("Error", error.message || "Verification failed. Please try again later.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Verification Code</Text>
      <Text style={{ color: '#ccc', marginBottom: 15, textAlign: 'center' }}>
        A 6-digit code was sent to your university email. Please enter it below to complete verification.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter PIN"
        placeholderTextColor="#ccc"
        value={pin}
        onChangeText={setPin}
        keyboardType="numeric"
        maxLength={6}
      />

      <TouchableOpacity style={styles.button} onPress={handlePinVerification} disabled={isVerifying}>
        <Text style={styles.buttonText}>{isVerifying ? 'Verifying...' : 'Verify'}</Text>
      </TouchableOpacity>
    </View>
  );
}
