import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Image, FlatList,
  Alert, ScrollView, SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { db } from '../firebase/firebaseConfig';
import styles from '../styles/PostStyles';

export default function CreatePostScreen() {
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState(null);

  const auth = getAuth();
  const storage = getStorage();
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe;
  }, []);

  const handlePickImages = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Please allow access to your media library.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      selectionLimit: 4,
      quality: 0.7,
    });

    if (!result.canceled) {
      const selectedUris = result.assets.map(asset => asset.uri);
      setImages(prev => [...prev, ...selectedUris]);
    }
  };

  const handleUpload = async () => {
    if (!caption.trim() || images.length === 0) {
      Alert.alert("Missing Fields", "Please enter a caption and upload at least one image.");
      return;
    }

    if (!user) {
      Alert.alert("Error", "You must be signed in to upload.");
      return;
    }

    setUploading(true);

    try {
      const postId = Date.now().toString();
      const imageUrls = [];

      for (const uri of images) {
        const response = await fetch(uri);
        const blob = await response.blob();
        const filename = `${user.uid}_${postId}_${Math.random().toString(36).slice(2)}.jpg`;
        const imageRef = ref(storage, `posts/${user.uid}/${postId}/${filename}`);
        await uploadBytes(imageRef, blob);
        const url = await getDownloadURL(imageRef);
        imageUrls.push(url);
      }

      await addDoc(collection(db, 'posts'), {
        caption: caption.trim(),
        hashtags: hashtags.trim(),
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
      Alert.alert("Error", "Failed to upload your post. Please try again.");
    }

    setUploading(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1e1e1e' }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Back Button */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: 10 }}>
          <Ionicons name="arrow-back" size={28} color="#A8E9DC" />
        </TouchableOpacity>

        <Text style={styles.header}>Create a Post</Text>

        <TextInput
          placeholder="Write a caption..."
          placeholderTextColor="#aaa"
          style={styles.input}
          value={caption}
          onChangeText={setCaption}
          multiline
        />

        <TextInput
          placeholder="Hashtags (comma separated)"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={hashtags}
          onChangeText={setHashtags}
        />

        <TouchableOpacity onPress={handlePickImages} style={styles.imageButton}>
          <Ionicons name="images" size={22} color="#00796B" />
          <Text style={styles.imageButtonText}>Upload Images</Text>
        </TouchableOpacity>

        {images.length > 0 && (
          <FlatList
            data={images}
            horizontal
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.imagePreview} />
            )}
            style={{ marginVertical: 10 }}
          />
        )}

        <TouchableOpacity
          style={styles.uploadButton}
          onPress={handleUpload}
          disabled={uploading}
        >
          <Text style={styles.uploadText}>{uploading ? 'Uploading...' : 'Post'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
