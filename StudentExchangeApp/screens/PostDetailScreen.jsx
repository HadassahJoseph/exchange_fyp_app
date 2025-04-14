import React, { useEffect, useState } from 'react';
import {
  View, Text, Image, FlatList, TextInput,
  TouchableOpacity, ScrollView, SafeAreaView, Platform, StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { db } from '../firebase/firebaseConfig';
import styles from '../styles/PostDetailStyles';

export default function PostDetailScreen({ route }) {
  const { post } = route.params;
  const navigation = useNavigation();
  const [author, setAuthor] = useState({ username: 'Unknown', profilePic: null });
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [likes, setLikes] = useState(post.likes || []);
  const userId = getAuth().currentUser.uid;

  useEffect(() => {
    fetchAuthor();
    fetchCommentsWithUserData();
  }, []);

  const fetchAuthor = async () => {
    try {
      const userSnap = await getDoc(doc(db, 'users', post.userId));
      if (userSnap.exists()) {
        const userData = userSnap.data();
        setAuthor({
          username: userData.username || 'Unknown',
          profilePic: userData.avatarUrl || null,
        });
      }
    } catch (err) {
      console.error('Error fetching author:', err);
    }
  };

  const fetchCommentsWithUserData = async () => {
    const enriched = await Promise.all(
      (post.comments || []).map(async (c) => {
        let username = 'Unknown';
        let avatarUrl = null;
        try {
          const userSnap = await getDoc(doc(db, 'users', c.userId));
          if (userSnap.exists()) {
            const uData = userSnap.data();
            username = uData.username || 'Unknown';
            avatarUrl = uData.avatarUrl || null;
          }
        } catch (err) {
          console.log('Comment user error:', err);
        }

        return { ...c, username, avatarUrl };
      })
    );
    setComments(enriched);
  };

  const handleLike = async () => {
    const updated = likes.includes(userId)
      ? likes.filter(id => id !== userId)
      : [...likes, userId];
    setLikes(updated);
    await updateDoc(doc(db, 'posts', post.id), { likes: updated });
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;

    const newComment = {
      text: commentText.trim(),
      userId,
    };

    setCommentText('');
    setComments(prev => [...prev, newComment]);

    await updateDoc(doc(db, 'posts', post.id), {
      comments: arrayUnion(newComment),
    });

    fetchCommentsWithUserData();
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 10 }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        
        {/* Back Button */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: 16 }}>
          <Ionicons name="arrow-back" size={28} color="#A8E9DC" />
        </TouchableOpacity>

        {/* Author Info */}
        <View style={styles.authorRow}>
          {author.profilePic && (
            <Image source={{ uri: author.profilePic }} style={styles.authorAvatar} />
          )}
          <Text style={styles.authorName}>{author.username}</Text>
        </View>

        {/* Post Images */}
        {post.imageUrls?.length > 0 && (
          <FlatList
            horizontal
            data={post.imageUrls}
            keyExtractor={(uri, index) => `${index}-${uri}`}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.image} />
            )}
            showsHorizontalScrollIndicator={false}
          />
        )}

        {/* Caption */}
        <Text style={styles.caption}>{post.caption}</Text>

        {/* Likes */}
        <View style={styles.footerRow}>
          <TouchableOpacity onPress={handleLike}>
            <Ionicons
              name={likes.includes(userId) ? 'heart' : 'heart-outline'}
              size={22}
              color={likes.includes(userId) ? 'red' : '#A8E9DC'}
              style={styles.heartIcon}
            />
          </TouchableOpacity>
          <Text style={styles.likesText}>{likes.length} likes</Text>
        </View>

        {/* Comments */}
        {comments.map((c, i) => (
          <View key={i} style={styles.commentContainer}>
            {c.avatarUrl && (
              <Image source={{ uri: c.avatarUrl }} style={styles.commentAvatar} />
            )}
            <View style={styles.commentMeta}>
              <Text style={styles.commentUsername}>{c.username}</Text>
              <Text style={styles.commentBody}>{c.text}</Text>
            </View>
          </View>
        ))}

        {/* Add a Comment */}
        <TextInput
          placeholder="Add a comment..."
          placeholderTextColor="#999"
          value={commentText}
          onChangeText={setCommentText}
          style={styles.input}
        />
        <TouchableOpacity onPress={handleComment}>
          <Text style={styles.commentButton}>Post Comment</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}
