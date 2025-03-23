import React, { useEffect, useState } from 'react';
import { View, Text, Alert, TextInput, TouchableOpacity } from 'react-native';
import { createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import styles from '../styles/authStyles';

const SignUpScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    const universityDomains = ['tudublin.ie', 'ucd.ie', 'ul.ie', 'mu.ie'];

    // 🔁 Keep user logged in
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigation.replace('CompleteProfileScreen', { userId: user.uid });
              }              
        });
        return unsubscribe;
    }, []);

    const handleSignUp = async () => {
        if (!email || !password || !username) {
            Alert.alert("Please fill out all fields.");
            return;
        }

        const emailDomain = email.split('@')[1];
        const isUniversityEmail = universityDomains.includes(emailDomain);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const userId = userCredential.user.uid;

            if (isUniversityEmail) {
                navigation.navigate('StudentVerificationScreen', {
                    userId,
                    email,
                    username,
                    isUniversityEmail: true
                });
            } else {
                navigation.navigate('StudentVerificationScreen', {
                    userId,
                    email,
                    username,
                    isUniversityEmail: false
                });
            }
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>
            <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} />
            <TextInput style={styles.input} placeholder="University Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
            <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
                <Text style={styles.linkText}>Already have an account? Log in</Text>
            </TouchableOpacity>
        </View>
    );
};

export default SignUpScreen;
