import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, FlatList, Image,
  SafeAreaView, Dimensions, TextInput
} from 'react-native';
import { collection, onSnapshot, doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase/firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/HomeStyles';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [selectedTab, setSelectedTab] = useState('Items');
  const [items, setItems] = useState([]);
  const [posts, setPosts] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [expandedDiscussionIds, setExpandedDiscussionIds] = useState([]);
  const [newDiscussionComments, setNewDiscussionComments] = useState({});
  const [userId, setUserId] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    setUserId(currentUser.uid);

    const unsubscribeItems = onSnapshot(collection(db, 'marketplace'), async (snapshot) => {
      const listings = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          let sellerAvatar = null;
          let sellerId = data.userId || data.sellerId || null;
          if (sellerId) {
            try {
              const userDoc = await getDoc(doc(db, 'users', sellerId));
              if (userDoc.exists()) {
                sellerAvatar = userDoc.data().avatarUrl || null;
              }
            } catch (err) {
              console.error('Error fetching user profile:', err);
            }
          }
          return { id: docSnap.id, ...data, sellerAvatar, userId: sellerId };
        })
      );
      setItems(listings);
    });

    const unsubscribePosts = onSnapshot(collection(db, 'posts'), async (snapshot) => {
      const allPosts = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          let authorAvatar = null;
          let username = 'Unknown';
          if (data.userId) {
            try {
              const userDoc = await getDoc(doc(db, 'users', data.userId));
              if (userDoc.exists()) {
                const userData = userDoc.data();
                authorAvatar = userData.avatarUrl || null;
                username = userData.username || 'Unknown';
              }
            } catch (err) {
              console.error('Error fetching user profile for post:', err);
            }
          }
          return { id: docSnap.id, ...data, authorAvatar, username };
        })
      );
      setPosts(allPosts);
    });

    const unsubscribeDiscussions = onSnapshot(collection(db, 'questions'), async (snapshot) => {
      const allQuestions = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          let username = 'Unknown';
          if (data.userId) {
            try {
              const userDoc = await getDoc(doc(db, 'users', data.userId));
              if (userDoc.exists()) {
                username = userDoc.data().username || 'Unknown';
              }
            } catch (err) {
              console.error('Error fetching user for question:', err);
            }
          }
          return { id: docSnap.id, ...data, username };
        })
      );
      setDiscussions(allQuestions);
    });

    return () => {
      unsubscribeItems();
      unsubscribePosts();
      unsubscribeDiscussions();
    };
  }, []);

  const handleLike = async (postId, currentLikes = []) => {
    if (!userId) return;
    const postRef = doc(db, 'posts', postId);
    const updatedLikes = currentLikes.includes(userId)
      ? currentLikes.filter(id => id !== userId)
      : [...currentLikes, userId];
    await updateDoc(postRef, { likes: updatedLikes });
  };

  const toggleExpand = (id) => {
    setExpandedDiscussionIds(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const handleDiscussionComment = async (id) => {
    if (!userId || !newDiscussionComments[id]) return;
    const ref = doc(db, 'questions', id);
    await updateDoc(ref, {
      comments: arrayUnion({ text: newDiscussionComments[id], userId })
    });
    setNewDiscussionComments(prev => ({ ...prev, [id]: '' }));
  };

  const handleDiscussionLike = async (id, currentLikes = []) => {
    if (!userId) return;
    const ref = doc(db, 'questions', id);
    const updatedLikes = currentLikes.includes(userId)
      ? currentLikes.filter(like => like !== userId)
      : [...currentLikes, userId];
    await updateDoc(ref, { likes: updatedLikes });
  };

  const renderDiscussion = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.category}</Text>
      <Text style={{ color: '#555', marginBottom: 5 }}>Asked by {item.username}</Text>
      <Text numberOfLines={expandedDiscussionIds.includes(item.id) ? undefined : 3}>{item.description}</Text>

      <TouchableOpacity onPress={() => toggleExpand(item.id)}>
        <Text style={{ color: '#00796B', marginTop: 5 }}>
          {expandedDiscussionIds.includes(item.id) ? 'Show less' : 'Read more'}
        </Text>
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
        <TouchableOpacity onPress={() => handleDiscussionLike(item.id, item.likes || [])}>
          <Ionicons
            name={(item.likes || []).includes(userId) ? 'heart' : 'heart-outline'}
            size={20}
            color={(item.likes || []).includes(userId) ? 'red' : '#00796B'}
            style={{ marginRight: 6 }}
          />
        </TouchableOpacity>
        <Text>{(item.likes || []).length} likes</Text>
      </View>

      {(item.comments || []).map((comment, index) => (
        <Text key={index} style={{ marginTop: 4, fontSize: 13, color: '#444' }}>- {comment?.text || comment}</Text>
      ))}

      <TextInput
        placeholder="Add a comment..."
        value={newDiscussionComments[item.id] || ''}
        onChangeText={(text) => setNewDiscussionComments(prev => ({ ...prev, [item.id]: text }))}
        style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 6, marginTop: 8 }}
      />
      <TouchableOpacity onPress={() => handleDiscussionComment(item.id)}>
        <Text style={{ color: '#00796B', marginTop: 4 }}>Post Comment</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPost = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        {item.authorAvatar && (
          <Image
            source={{ uri: item.authorAvatar }}
            style={{ width: 30, height: 30, borderRadius: 15, marginRight: 8 }}
          />
        )}
        <Text style={{ fontWeight: '600' }}>{item.username}</Text>
      </View>

      {item.imageUrls?.length > 0 && (
        <FlatList
          data={item.imageUrls}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(uri, index) => `${item.id}_${index}`}
          renderItem={({ item: uri }) => (
            uri ? <Image source={{ uri }} style={{ width: width - 32, height: 200, borderRadius: 10, marginRight: 8 }} /> : null
          )}
        />
      )}

      {item.imageUrl && !item.imageUrls && (
        <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
      )}

      <Text style={styles.cardTitle}>{item.caption}</Text>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
        <TouchableOpacity onPress={() => handleLike(item.id, item.likes || [])}>
          <Ionicons
            name={(item.likes || []).includes(userId) ? 'heart' : 'heart-outline'}
            size={20}
            color={(item.likes || []).includes(userId) ? 'red' : '#00796B'}
          />
        </TouchableOpacity>
        <Text>{(item.likes || []).length} likes</Text>

        <TouchableOpacity onPress={() => navigation.navigate('CommentScreen', { postId: item.id })}>
          <Ionicons name="chatbubble-outline" size={20} color="#00796B" />
        </TouchableOpacity>
        <Text>{(item.comments || []).length} comments</Text>
      </View>
    </View>
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.gridCard}
      onPress={() => navigation.navigate('ItemDetailScreen', { item })}
    >
      {item.imageUrls?.[0] && (
        <Image source={{ uri: item.imageUrls[0] }} style={styles.cardImage} />
      )}
      <Text style={styles.gridTitle} numberOfLines={1}>{item.title || item.category}</Text>
      <Text style={styles.gridPrice}>€{item.price}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6, justifyContent: 'space-between' }}>
        <Text style={{
          backgroundColor: item.condition === 'New' ? '#4CAF50' : '#FFC107',
          color: 'white',
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 6,
          fontSize: 12,
          fontWeight: '600',
        }}>{item.condition}</Text>
        <Ionicons name="heart-outline" size={18} color="#00796B" />
      </View>
      {item.sellerAvatar && (
        <Image
          source={{ uri: item.sellerAvatar }}
          style={{ width: 30, height: 30, borderRadius: 15, marginTop: 8 }}
        />
      )}
    </TouchableOpacity>
  );

  const renderTab = (label) => (
    <TouchableOpacity
      style={[styles.tab, selectedTab === label && styles.activeTab]}
      onPress={() => setSelectedTab(label)}>
      <Text style={[styles.tabText, selectedTab === label && styles.activeTabText]}>{label}</Text>
    </TouchableOpacity>
  );

  if (!userId) return <Text style={{ padding: 20 }}>Loading user...</Text>;

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ paddingTop: 20, paddingBottom: 10, backgroundColor: '#fff' }}>
        <View style={styles.tabContainer}>
          {renderTab('Posts')}
          {renderTab('Discussions')}
          {renderTab('Items')}
        </View>
      </View>

      {selectedTab === 'Posts' && (
        <FlatList
          key="posts"
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={renderPost}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.placeholderText}>No Posts yet.</Text>}
        />
      )}

      {selectedTab === 'Items' && (
        <FlatList
          key="items"
          data={items}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          renderItem={renderItem}
          contentContainerStyle={styles.gridList}
          ListEmptyComponent={<Text style={styles.placeholderText}>No Items yet.</Text>}
        />
      )}

      {selectedTab === 'Discussions' && (
        <FlatList
          key="discussions"
          data={discussions}
          keyExtractor={(item) => item.id}
          renderItem={renderDiscussion}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.placeholderText}>No Discussions yet.</Text>}
        />
      )}
    </SafeAreaView>
  );
}
