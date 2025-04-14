// components/ItemCard.js
import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/HomeStyles';

export default function ItemCard({ item, onPress, onLike, userId }) {
  return (
    <View style={styles.gridCard}>
      <TouchableOpacity activeOpacity={0.9} onPress={() => onPress(item)}>
        {item.imageUrls?.[0] && (
          <Image source={{ uri: item.imageUrls[0] }} style={styles.gridImage} />
        )}
        <Text style={styles.gridTitle} numberOfLines={1}>{item.title || item.category}</Text>
        <Text style={styles.gridPrice}>€{item.price}</Text>
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
        <Text style={{
            backgroundColor: item.condition === 'New' ? '#4CAF50' : '#FFC107',
            color: 'white',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 6,
            fontSize: 12,
            fontWeight: '600',
        }}>{item.condition}</Text>

        <View style={{ alignItems: 'center' }}>
            <TouchableOpacity onPress={() => onLike(item.id, item.likes || [])}>
            <Ionicons
                name={(item.likes || []).includes(userId) ? 'heart' : 'heart-outline'}
                size={18}
                color={(item.likes || []).includes(userId) ? 'red' : '#00796B'}
            />
            </TouchableOpacity>
            <Text style={{ color: '#bbb', fontSize: 12 }}>
            {item.likes?.length || 0} like{item.likes?.length === 1 ? '' : 's'}
            </Text>
        </View>
        </View>
      {item.sellerAvatar && (
        <Image source={{ uri: item.sellerAvatar }} style={styles.avatar} />
      )}
    </View>
  );
}

