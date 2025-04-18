import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, Image, View, StyleSheet } from 'react-native';


export default function OffersTab() {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    // Add your real offer logic here
    setOffers([
      { id: '1', username: 'Offer Tester', profilePic: 'https://via.placeholder.com/100' }
    ]);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#1e1e1e' }}>
    <FlatList
      key={`flatlist-${Math.random()}`}
      data={offers}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.userContainer}>
          <Image source={{ uri: item.profilePic || 'https://via.placeholder.com/100' }} style={styles.profileImage} />
          <Text style={styles.username}>{item.username}</Text>
        </TouchableOpacity>
      )}
      ListEmptyComponent={<Text style={styles.emptyText}>No offers yet.</Text>}
      contentContainerStyle={offers.length === 0 && { flex: 1, justifyContent: 'center' }}
    />
</View>
  );
}

const styles = StyleSheet.create({
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomColor: '#444',
    borderBottomWidth: 1,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  username: {
    fontSize: 16,
    color: 'white',
  },
  emptyText: {
    textAlign: 'center',
    color: 'gray',
    fontSize: 16,
    marginTop: 40,
  },
});
