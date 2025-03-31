import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import styles from '../styles/ItemDetailStyles';

export default function ItemDetailScreen({ route, navigation }) {
  const { item } = route.params;
  const [sellerName, setSellerName] = useState('');

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

  const screenWidth = Dimensions.get('window').width;

  return (
    <ScrollView style={styles.container}>
      {item.imageUrls?.length > 0 && (
        <FlatList
          horizontal
          pagingEnabled
          data={item.imageUrls}
          keyExtractor={(uri, index) => index.toString()}
          renderItem={({ item }) => (
            <Image source={{ uri: item }} style={{ width: screenWidth, height: 250 }} />
          )}
          showsHorizontalScrollIndicator={false}
        />
      )}

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{item.title || 'Item for Sale'}</Text>
          <TouchableOpacity>
            <Ionicons name="heart-outline" size={24} color="#00796B" />
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
      </View>
    </ScrollView>
  );
}
