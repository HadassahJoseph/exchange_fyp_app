import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { auth, db } from '../firebase/firebaseConfig';
import { collection, getDocs, query, where, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import styles from '../styles/EditContentStyles';


export default function EditContentScreen() {
  const [activeTab, setActiveTab] = useState('items');
  const [items, setItems] = useState([]);
  const [posts, setPosts] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) setUserId(user.uid);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchContent = async () => {
      if (!userId) return;

      try {
        const itemSnap = await getDocs(
            query(collection(db, 'marketplace'), where('sellerId', '==', userId)));
          
        const postSnap = await getDocs(query(collection(db, 'posts'), where('userId', '==', userId)));
        const discussionSnap = await getDocs(query(collection(db, 'questions'), where('userId', '==', userId)));

        setItems(itemSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setPosts(postSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setDiscussions(discussionSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('Firestore fetch error:', error.message);
      }
    };

    fetchContent();
  }, [userId]);

  const handleDelete = async (type, id) => {
    const collectionMap = {
      items: 'marketplace',
      discussions: 'questions',
      posts: 'posts',
    };

    Alert.alert('Confirm Delete', 'Are you sure you want to delete this?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteDoc(doc(db, collectionMap[type], id));
          if (type === 'items') setItems(prev => prev.filter(i => i.id !== id));
          if (type === 'posts') setPosts(prev => prev.filter(p => p.id !== id));
          if (type === 'discussions') setDiscussions(prev => prev.filter(d => d.id !== id));
        },
      },
    ]);
  };

  const toggleSoldStatus = async (itemId, currentStatus) => {
    const newStatus = !currentStatus;
    await updateDoc(doc(db, 'marketplace', itemId), { isSold: newStatus });
    setItems(prev =>
      prev.map(item => (item.id === itemId ? { ...item, sold: newStatus } : item))
    );
  };

  const renderTabContent = () => {
    if (activeTab === 'items') {
      return items.length === 0 ? (
        <Text style={styles.emptyText}>No items found.</Text>
      ) : (
        items.map((item) => (
          <View key={item.id} style={styles.card}>
            <Image source={{ uri: item.imageUrls?.[0] }} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>€{item.price}</Text>
            <Text style={{ color: item.isSold ? 'red' : 'green' }}>
              {item.isSold ? 'Sold' : 'Available'}
            </Text>

            <TouchableOpacity
              onPress={() => toggleSoldStatus(item.id, item.isSold)}
              style={styles.soldButton}
            >
              <Text style={styles.soldButtonText}>
                {item.isSold ? 'Mark as Available' : 'Mark as Sold'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleDelete('items', item.id)}>
              <Text style={styles.delete}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))
      );
    }

    if (activeTab === 'posts') {
      return posts.length === 0 ? (
        <Text style={styles.emptyText}>No posts found.</Text>
      ) : (
        posts.map((post) => (
          <View key={post.id} style={styles.card}>
            <Image source={{ uri: post.imageUrls?.[0] }} style={styles.image} />
            <Text style={styles.description}>{post.caption}</Text>
            <TouchableOpacity onPress={() => handleDelete('posts', post.id)}>
              <Text style={styles.delete}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))
      );
    }

    if (activeTab === 'discussions') {
      return discussions.length === 0 ? (
        <Text style={styles.emptyText}>No discussions found.</Text>
      ) : (
        discussions.map((disc) => (
          <View key={disc.id} style={styles.card}>
            <Text style={styles.description}>{disc.question}</Text>
            <TouchableOpacity onPress={() => handleDelete('discussions', disc.id)}>
              <Text style={styles.delete}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))
      );
    }

    return null;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1e1e1e' }}>
  <View style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, flex: 1 }}>
    <View style={styles.tabsContainer}>
      {['items', 'posts', 'discussions'].map((tab) => (
        <TouchableOpacity
          key={tab}
          onPress={() => setActiveTab(tab)}
          style={[
            styles.tab,
            { borderBottomColor: activeTab === tab ? '#A8E9DC' : 'transparent' },
          ]}
        >
          <Text style={{ color: activeTab === tab ? '#A8E9DC' : '#aaa', fontWeight: 'bold' }}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>

    <ScrollView contentContainerStyle={styles.container}>
      {renderTabContent()}
    </ScrollView>
  </View>
</SafeAreaView>
  );
}
