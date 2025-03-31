// screens/CreatePostScreen.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, FlatList, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { db } from '../firebase/firebaseConfig';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import styles from '../styles/PostStyles'; // Create this if you want custom styling

export default function CreatePostScreen() {
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState(null);

  const storage = getStorage();
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe;
  }, []);

  const handlePickImages = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert("Permission to access images is required.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      selectionLimit: 4,
      quality: 0.7
    });

    if (!result.canceled) {
      const newImages = result.assets.map(asset => asset.uri);
      setImages([...images, ...newImages]);
    }

    if (!userId) {
      Alert.alert('Error', 'User not authenticated.');
      return;
    }
  };

  const handleUpload = async () => {
    if (!caption || images.length === 0) {
      Alert.alert("Missing Fields", "Please enter a caption and upload at least one image.");
      return;
    }

    setUploading(true);
    try {
      const imageUrls = [];

      for (let uri of images) {
        const response = await fetch(uri);
        const blob = await response.blob();
        const postId = Date.now(); // or generate a proper postId if needed
        const filename = `${userId}_${postId}_${Math.random().toString(36).substr(2, 5)}.jpg`;
        const storageRef = ref(storage, `posts/${userId}/${postId}/${filename}`);
        await uploadBytes(storageRef, blob);
        const downloadUrl = await getDownloadURL(storageRef);
        imageUrls.push(downloadUrl);
      }

      await addDoc(collection(db, 'posts'), {
        caption,
        hashtags,
        imageUrls,
        userId: user.uid,
        createdAt: new Date(),
      });

      Alert.alert("Success", "Your post has been uploaded.");
      setCaption('');
      setHashtags('');
      setImages([]);
    } catch (error) {
      console.error("Upload failed:", error);
      Alert.alert("Error", "Failed to upload post.");
    }
    setUploading(false);
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <TextInput
        placeholder="Write a caption..."
        style={styles.input}
        value={caption}
        onChangeText={setCaption}
        multiline
      />

      <TextInput
        placeholder="Hashtags (comma separated)"
        style={styles.input}
        value={hashtags}
        onChangeText={setHashtags}
      />

      <TouchableOpacity onPress={handlePickImages} style={styles.imageButton}>
        <Ionicons name="images" size={22} color="#00796B" />
        <Text style={styles.imageButtonText}>Upload Images</Text>
      </TouchableOpacity>

      <FlatList
        data={images}
        horizontal
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.imagePreview} />
        )}
        style={{ marginVertical: 10 }}
      />

      <TouchableOpacity
        style={styles.uploadButton}
        onPress={handleUpload}
        disabled={uploading}
      >
        <Text style={styles.uploadText}>{uploading ? "Uploading..." : "Post"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
