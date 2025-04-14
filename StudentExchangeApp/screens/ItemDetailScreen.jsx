// ItemDetailScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { getAuth } from 'firebase/auth';
import styles from '../styles/ItemDetailStyles';

export default function ItemDetailScreen({ route, navigation }) {
  const { item } = route.params;
  const [sellerName, setSellerName] = useState('');
  const [likes, setLikes] = useState(item.likes || []);
  const userId = getAuth().currentUser?.uid;

  useEffect(() => {
    const fetchSellerInfo = async () => {
      if (item.userId) {
        try {
          const docRef = doc(db, 'users', item.userId);
          const userDoc = await getDoc(docRef);
          if (userDoc.exists()) {
            setSellerName(userDoc.data().username || 'Unknown');
          }
        } catch (error) {
          console.error('Failed to fetch seller name:', error);
        }
      }
    };
    fetchSellerInfo();
  }, [item.userId]);

  const handleLike = async () => {
    if (!userId) return;
    const ref = doc(db, 'marketplace', item.id);
    const updatedLikes = likes.includes(userId)
      ? likes.filter(id => id !== userId)
      : [...likes, userId];
    setLikes(updatedLikes);
    await updateDoc(ref, { likes: updatedLikes });
  };

  const screenWidth = Dimensions.get('window').width;

  return (
    <ScrollView style={[styles.container, { paddingTop: 20 }]}>
      {/* Back Button */}
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
            <Text style={{ color: '#777', fontSize: 12 }}>{likes.length} like{likes.length === 1 ? '' : 's'}</Text>
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

        {/* Buttons */}
        <View style={{ marginTop: 24, flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('ChatScreen', { sellerId: item.userId })}
            style={{ flex: 1, backgroundColor: '#A8E9DC', padding: 14, borderRadius: 8, alignItems: 'center' }}>
            <Text style={{ color: '#1e1e1e', fontWeight: '600' }}>Message Seller</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ flex: 1, backgroundColor: '#00796B', padding: 14, borderRadius: 8, alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontWeight: '600' }}>Buy / Offer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
