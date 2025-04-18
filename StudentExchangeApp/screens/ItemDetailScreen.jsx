import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { getAuth } from 'firebase/auth';
import styles from '../styles/ItemDetailStyles';

export default function ItemDetailScreen({ route, navigation }) {
  const { item } = route.params;
  const [likes, setLikes] = useState(item.likes || []);
  const [sellerName, setSellerName] = useState('');
  const [sellerInfo, setSellerInfo] = useState(null);
  const userId = getAuth().currentUser?.uid;
  const screenWidth = Dimensions.get('window').width;

  const sellerId = item.userId || item.sellerId || item.createdBy || null;

  useEffect(() => {
    const fetchSellerInfo = async () => {
      if (!sellerId) {
        console.warn(" No seller ID found on this item");
        return;
      }

      try {
        const docRef = doc(db, 'users', sellerId);
        const userDoc = await getDoc(docRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          const info = {
            id: sellerId,
            username: data.username || 'Unknown',
            profilePic: data.profilePic || ''
          };

          setSellerInfo(info);
          setSellerName(info.username);
        } else {
          console.warn(" User doc not found for:", sellerId);
        }
      } catch (error) {
        console.error("Error fetching seller info:", error);
      }
    };

    fetchSellerInfo();
  }, [sellerId]);

  const handleLike = async () => {
    if (!userId) return;

    const ref = doc(db, 'marketplace', item.id);
    const updatedLikes = likes.includes(userId)
      ? likes.filter(id => id !== userId)
      : [...likes, userId];

    setLikes(updatedLikes);
    await updateDoc(ref, { likes: updatedLikes });
  };

  const startChatWithSeller = async () => {
    if (!userId || !sellerInfo?.id) {
      Alert.alert("Error", "Seller info is missing. Try again.");
      return;
    }

    if (userId === sellerInfo.id) {
      Alert.alert("Notice", "You can't message yourself.");
      return;
    }

    const chatId = [userId, sellerInfo.id].sort().join('_');
    const chatRef = doc(db, 'chats', chatId);
    const chatDoc = await getDoc(chatRef);

    if (!chatDoc.exists()) {
      await setDoc(chatRef, {
        participants: [userId, sellerInfo.id],
        createdAt: new Date().toISOString(),
      });
    }

    navigation.navigate('ChatRoom', {
      chatId,
      otherUser: sellerInfo,
    });
  };

  return (
    <ScrollView style={[styles.container, { paddingTop: 20 }]}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingHorizontal: 16, paddingBottom: 4 }}>
        <Ionicons name="arrow-back" size={26} color="#00796B" />
      </TouchableOpacity>

      {item.imageUrls?.length > 0 && (
        <FlatList
          horizontal
          pagingEnabled
          data={item.imageUrls}
          keyExtractor={(uri, index) => index.toString()}
          renderItem={({ item }) => (
            <Image source={{ uri: item }} style={{ width: screenWidth, height: 250, resizeMode: 'cover' }} />
          )}
          showsHorizontalScrollIndicator={false}
        />
      )}

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{item.title || 'Item for Sale'}</Text>
          <TouchableOpacity onPress={handleLike} style={{ alignItems: 'center' }}>
            <Ionicons
              name={likes.includes(userId) ? 'heart' : 'heart-outline'}
              size={24}
              color={likes.includes(userId) ? 'red' : '#00796B'}
            />
            <Text style={{ color: '#777', fontSize: 12 }}>
              {likes.length} like{likes.length === 1 ? '' : 's'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.price}>€{item.price}</Text>

        {item.condition && (
          <Text style={[
            styles.condition,
            item.condition === 'New' ? styles.new : styles.used
          ]}>
            {item.condition}
          </Text>
        )}

        <View style={{ marginTop: 12 }}>
          <Text style={{
            backgroundColor: item.isSold ? '#b71c1c' : '#2e7d32',
            color: 'white',
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 8,
            fontWeight: '600',
            alignSelf: 'flex-start',
            fontSize: 14,
          }}>
            {item.isSold ? 'Sold' : 'Available'}
          </Text>
        </View>

        {item.description && (
          <Text style={styles.description}>{item.description}</Text>
        )}

        <View style={styles.sellerSection}>
          <Text style={styles.sellerHeading}>Seller Info</Text>
          {item.sellerAvatar && (
            <Image source={{ uri: item.sellerAvatar }} style={styles.avatar} />
          )}
          <Text style={styles.sellerId}>Username: {sellerName}</Text>
        </View>

        <View style={{ marginTop: 24 }}>
          <TouchableOpacity
            onPress={startChatWithSeller}
            style={{
              backgroundColor: '#A8E9DC',
              padding: 14,
              borderRadius: 8,
              alignItems: 'center'
            }}
          >
            <Text style={{ color: '#1e1e1e', fontWeight: '600' }}>Message Seller</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
