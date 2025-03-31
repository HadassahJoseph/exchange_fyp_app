import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import styles from '../styles/authStyles';

export default function StudentVerificationScreen({ route, navigation }) {
    const { userId, email, username, isUniversityEmail } = route.params;
    const [studentIdImage, setStudentIdImage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const pickDocument = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setStudentIdImage(result.assets[0].uri);
        }
    };

    const handleVerification = async () => {
        setIsSubmitting(true);

        const trustLevel = isUniversityEmail ? 'Verified Student' : 'Unverified';
        const status = isUniversityEmail ? 'Verified' : 'Pending Manual Review';

        try {
            await setDoc(doc(db, "users", userId), {
                email,
                username,
                trustLevel,
                status,
                verificationMethod: isUniversityEmail ? 'Email Domain' : 'Manual Upload',
                ...(studentIdImage && { studentIdImage }), // Optional: Add image if uploaded
            });

            Alert.alert("Success", `Account ${isUniversityEmail ? "verified" : "pending review"}`);
            navigation.navigate('CompleteProfileStep1');
        } catch (error) {
            Alert.alert("Error", "Failed to save verification status.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Verify Student Status</Text>

            {isUniversityEmail ? (
                <>
                    <Text style={{ marginBottom: 10 }}>Email verified through university domain 🎓</Text>
                </>
            ) : (
                <>
                    <Text style={{ marginBottom: 10 }}>
                        Your email domain isn't on our list. Please upload a student ID or acceptance letter.
                    </Text>
                    <TouchableOpacity style={styles.button} onPress={pickDocument}>
                        <Text style={styles.buttonText}>Upload Student ID</Text>
                    </TouchableOpacity>

                    {studentIdImage && (
                        <Image source={{ uri: studentIdImage }} style={localStyles.imagePreview} />
                    )}
                </>
            )}

            <TouchableOpacity 
                style={[styles.button, { marginTop: 20 }]} 
                onPress={handleVerification} 
                disabled={isSubmitting}
            >
                <Text style={styles.buttonText}>{isSubmitting ? 'Submitting...' : 'Finish Sign-Up'}</Text>
            </TouchableOpacity>
        </View>
    );
}

const localStyles = StyleSheet.create({
    imagePreview: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
        marginTop: 15,
        borderRadius: 8,
        borderColor: '#ccc',
        borderWidth: 1,
    }
});
