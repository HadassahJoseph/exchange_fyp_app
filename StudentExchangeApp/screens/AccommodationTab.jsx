// components/AccommodationTab.js
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList, Image, Linking, ActivityIndicator
} from 'react-native';
import styles from '../styles/SearchStyles';

export default function AccommodationTab() {
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [university, setUniversity] = useState('');
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchHouses = async () => {
    if (!country || !city) return;
    setLoading(true);
    const url = `http://10.156.38.133:5000/scrape?country=${country}&city=${city}${university ? `&university=${university}` : ''}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      setHouses(data.houses || []);
    } catch (err) {
      console.error('Error fetching houses:', err);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchGroup}>
        <TextInput
          style={styles.input}
          placeholder="Country (e.g., IE)"
          placeholderTextColor="#ccc"
          value={country}
          onChangeText={setCountry}
        />
        <TextInput
          style={styles.input}
          placeholder="City (e.g., Dublin)"
          placeholderTextColor="#ccc"
          value={city}
          onChangeText={setCity}
        />
        <TextInput
          style={styles.input}
          placeholder="University (optional)"
          placeholderTextColor="#ccc"
          value={university}
          onChangeText={setUniversity}
        />
        <TouchableOpacity onPress={fetchHouses} style={styles.searchBtn}>
          <Text style={{ color: 'white' }}>Search</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#00796B" />
      ) : (
        <FlatList
          data={houses}
          keyExtractor={(h) => h.id || Math.random().toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.houseCard} onPress={() => Linking.openURL(item.link)}>
              <Image source={{ uri: item.imageUrl }} style={styles.houseImage} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
                <Text style={{ color: '#777' }}>{item.location}</Text>
                <Text style={{ color: '#1E90FF' }}>View Listing</Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20, color: 'white' }}>No listings found.</Text>}
        />
      )}
    </View>
  );
}
