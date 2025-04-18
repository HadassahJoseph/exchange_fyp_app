import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase/firebaseConfig';
import DropDownPicker from 'react-native-dropdown-picker';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/AskQuestionStyles';

export default function AskQuestionScreen() {
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(null);
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([
    { label: 'Accommodation', value: 'accommodation' },
    { label: 'Culture', value: 'culture' },
    { label: 'Visa', value: 'visa' },
    { label: 'Language', value: 'language' },
    { label: 'General', value: 'general' },
  ]);

  const handleSubmit = async () => {
    if (!title || !category) {
      Alert.alert("Missing fields", "Please enter a title and select a category.");
      return;
    }

    try {
      await addDoc(collection(db, 'questions'), {
        title,
        description,
        category,
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });

      Alert.alert("Success", "Your question has been posted!");
      setTitle('');
      setDescription('');
      setCategory(null);
    } catch (error) {
      console.error("Error adding question:", error);
      Alert.alert("Error", "Failed to post question.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#A8E9DC" />
        </TouchableOpacity>
        <Text style={styles.header}>Ask a Question</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Question Title"
        value={title}
        onChangeText={setTitle}
      />

      <DropDownPicker
        open={open}
        value={category}
        items={categories}
        setOpen={setOpen}
        setValue={setCategory}
        setItems={setCategories}
        placeholder="Select a Category"
        style={styles.dropdown}
        containerStyle={{ marginBottom: 15 }}
      />

      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Add more context (optional)"
        multiline
        value={description}
        onChangeText={setDescription}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Post Question</Text>
      </TouchableOpacity>
    </View>
  );
}
