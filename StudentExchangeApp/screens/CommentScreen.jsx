import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

export default function CommentScreen({ route }) {
  const { postId } = route.params;
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const userId = 'demoUserId'; // Replace with real user ID

  useEffect(() => {
    const fetchPost = async () => {
      const postRef = doc(db, 'posts', postId);
      const docSnap = await getDoc(postRef);
      if (docSnap.exists()) {
        setComments(docSnap.data().comments || []);
      }
    };
    fetchPost();
  }, []);

  const handleComment = async () => {
    if (!comment.trim()) return;
    const newComment = {
      text: comment,
      userId,
      timestamp: new Date(),
    };
    const updatedComments = [...comments, newComment];
    await updateDoc(doc(db, 'posts', postId), {
      comments: updatedComments
    });
    setComments(updatedComments);
    setComment('');
  };

  return (
    <View style={{ padding: 20 }}>
      <FlatList
        data={comments}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text style={styles.comment}>{item.text}</Text>
        )}
      />
      <TextInput
        placeholder="Write a comment..."
        value={comment}
        onChangeText={setComment}
        style={styles.input}
      />
      <Button title="Post Comment" onPress={handleComment} />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderColor: '#ccc', borderWidth: 1, borderRadius: 5, padding: 10, marginTop: 10, marginBottom: 10
  },
  comment: {
    padding: 10, borderBottomWidth: 1, borderColor: '#eee'
  }
});
