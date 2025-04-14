// components/PostCard.js
import React from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import styles from '../styles/HomeStyles';

const { width } = Dimensions.get('window');

export default function PostCard({ item, onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.card}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          {item.authorAvatar && (
            <Image source={{ uri: item.authorAvatar }} style={{ width: 30, height: 30, borderRadius: 15, marginRight: 8 }} />
          )}
          <Text style={{ fontWeight: '600', color: '#fff' }}>{item.username}</Text>
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
      </View>
    </TouchableOpacity>
  );
}
