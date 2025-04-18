// components/PostCard.js
import React from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import styles from '../styles/HomeStyles';

const { width } = Dimensions.get('window');

export default function PostCard({ item, onPress, previewMode = false }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={previewMode ? styles.previewCard : styles.card}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          {item.authorAvatar && (
            <Image
              source={{ uri: item.authorAvatar }}
              style={{ width: 24, height: 24, borderRadius: 12, marginRight: 8 }}
            />
          )}
          <Text style={{ fontWeight: '600', color: '#fff', fontSize: previewMode ? 12 : 14 }}>
            {item.username}
          </Text>
        </View>

        {/* Image */}
        {item.imageUrls?.length > 0 && (
        <FlatList
          data={item.imageUrls}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(uri, index) => `${item.id}_${index}`}
          renderItem={({ item: uri }) =>
            uri ? (
              <Image
                source={{ uri }}
                style={previewMode ? styles.previewImage : {
                  width: width - 32,
                  height: 200,
                  borderRadius: 10,
                  marginRight: 8,
                }}
              />
            ) : null
          }
        />
      )}

        {item.imageUrl && !item.imageUrls && (
          <Image
            source={{ uri: item.imageUrl }}
            style={previewMode ? styles.previewImage : styles.cardImage}
          />
        )}

        {/* Caption */}
        <Text
          style={[styles.cardTitle, previewMode && { fontSize: 13 }]}
          numberOfLines={previewMode ? 2 : 5}
        >
          {item.caption}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
