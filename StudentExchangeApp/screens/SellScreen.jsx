// screens/SellScreen.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { db } from '../firebase/firebaseConfig';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import DropDownPicker from 'react-native-dropdown-picker';
import styles from '../styles/SellStyles';

export default function SellScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState([]); // Upload to Firebase using userId + timestamp
  const [uploading, setUploading] = useState(false);
  const [userId, setUserId] = useState(null);

  const navigation = useNavigation();
  const auth = getAuth();
  const storage = getStorage();

  // Add these inside your SellScreen component
    const [condition, setCondition] = useState('Used');
    const [conditionOpen, setConditionOpen] = useState(false);
    const [conditionItems, setConditionItems] = useState([
    { label: 'New', value: 'New' },
    { label: 'Used', value: 'Used' },
    ]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        Alert.alert("Login required", "Please log in again.");
        if (navigation && typeof navigation.navigate === 'function') {
          navigation.navigate('LoginScreen');
        }
      }
    });
    return unsubscribe;
  }, []);

  const handlePickImages = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permission to access photos is required!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 5,
      quality: 0.7,
    });

    if (!result.canceled) {
      const newImages = result.assets.map(asset => asset.uri);
      setImages([...images, ...newImages]);
    }
  };

  const handleUpload = async () => {
    if (!title || !description || !category || !price || images.length === 0) {
      Alert.alert('Missing fields', 'Please complete all fields and upload at least one photo.');
      return;
    }

    if (!userId) {
      Alert.alert('Error', 'User ID is missing. Please log in again.');
      return;
    }

    setUploading(true);
    try {
      const imageUrls = [];

      for (let uri of images) {
        const response = await fetch(uri);
        const blob = await response.blob();
        const filename = `${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}.jpg`;
        const storageRef = ref(storage, `marketplace/${userId}/${filename}`);
        await uploadBytes(storageRef, blob);
        const downloadUrl = await getDownloadURL(storageRef);
        imageUrls.push(downloadUrl);
      }

      await addDoc(collection(db, 'marketplace'), {
        title,
        description,
        category,
        price,
        condition,
        imageUrls,
        sellerId: userId,
        createdAt: new Date(),
        isSold: false,
      });

      Alert.alert('Success', 'Your item has been listed!');
      setTitle('');
      setDescription('');
      setCategory('');
      setPrice('');
      setImages([]);
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', 'Something went wrong during upload.');
    }
    setUploading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <Text style={styles.header}>Sell an item</Text>
        <Text style={styles.subtext}>Add up to 5 photos. <Text style={styles.link}>See photo tips.</Text></Text>

        <TouchableOpacity style={styles.photoButton} onPress={handlePickImages}>
          <Ionicons name="cloud-upload-outline" size={24} color="#00796B" />
          <Text style={styles.photoText}>Upload photos</Text>
        </TouchableOpacity>

        <FlatList
          data={images}
          horizontal
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Image source={{ uri: item }} style={styles.imagePreview} />
          )}
          contentContainerStyle={{ marginBottom: 15 }}
        />

        <TextInput
          style={styles.input}
          placeholder="e.g. White COS Jumper"
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="e.g. only worn a few times, true to size"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <TextInput
          style={styles.input}
          placeholder="Category"
          value={category}
          onChangeText={setCategory}
        />

        <TextInput
          style={styles.input}
          placeholder="Price"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
        />

        <Text style={{ marginBottom: 5, fontWeight: 'bold' }}>Condition</Text>
        <DropDownPicker
        open={conditionOpen}
        value={condition}
        items={conditionItems}
        setOpen={setConditionOpen}
        setValue={setCondition}
        setItems={setConditionItems}
        style={{ marginBottom: 15 }}
        />


        <TouchableOpacity style={styles.uploadButton} onPress={handleUpload} disabled={uploading}>
          <Text style={styles.uploadText}>{uploading ? 'Uploading...' : 'Upload'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
