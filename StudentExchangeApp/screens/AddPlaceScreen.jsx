import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  ScrollView
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from '../firebase/firebaseConfig'; // make sure this is your Firebase init

const db = getFirestore(app);
const auth = getAuth(app);

const GOOGLE_API_KEY = 'AIzaSyBA5EWbNtneaQSUXXH-OKQSbWyXFSzHmGg';

const categories = [
  'Food', 'Café', 'Study Spot', 'Library',
  'Bank', 'SIM Shop', 'Health', 'Accommodation'
];

export default function AddPlaceScreen() {
  const [region, setRegion] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [markerLocation, setMarkerLocation] = useState(null);
  const [rating, setRating] = useState('');
  const [note, setNote] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [category, setCategory] = useState('');
  const [hostCity, setHostCity] = useState('');
  const userCountry = 'Nigeria'; // or fetch this from profile if dynamic
  const mapRef = useRef();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Location permission denied');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      };
      setUserLocation(coords);
      setRegion({ ...coords, latitudeDelta: 0.01, longitudeDelta: 0.01 });
      setMarkerLocation(coords);
      fetchCity(coords.latitude, coords.longitude);
    })();
  }, []);

  const fetchCity = async (lat, lng) => {
    try {
      const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`);
      const data = await res.json();
      const cityComponent = data.results[0]?.address_components.find(c => c.types.includes('locality'));
      setHostCity(cityComponent?.long_name || 'Unknown');
    } catch (err) {
      console.error('City fetch error:', err);
    }
  };

  const searchPlaces = async () => {
    if (!searchQuery) return;
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${searchQuery}&key=${GOOGLE_API_KEY}`
      );
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const handlePlaceSelect = async (place) => {
    const { lat, lng } = place.geometry.location;
    const coords = { latitude: lat, longitude: lng };
    setMarkerLocation(coords);
    setRegion({ ...coords, latitudeDelta: 0.01, longitudeDelta: 0.01 });
    mapRef.current.animateToRegion({ ...coords, latitudeDelta: 0.01, longitudeDelta: 0.01 }, 1000);
    fetchCity(lat, lng);
    setSearchResults([]);
    setSearchQuery(place.name);
  };

  const handleSave = async () => {
    if (!category || !rating || !markerLocation) {
      alert('Please select a category, rating, and location.');
      return;
    }

    const data = {
      name: searchQuery || 'Unnamed Place',
      location: markerLocation,
      rating: parseInt(rating),
      note,
      category,
      userCountry,
      hostCity,
      createdBy: auth.currentUser?.uid || 'anonymous',
      timestamp: new Date().toISOString()
    };

    try {
      await addDoc(collection(db, 'favourites'), data);
      alert('✅ Place saved!');
      // reset inputs if you like
    } catch (error) {
      console.error('🔥 Firebase save error:', error);
      alert('❌ Failed to save place');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search for a place..."
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={searchPlaces}
        />
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.place_id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.searchResult}
              onPress={() => handlePlaceSelect(item)}
            >
              <Text>{item.name}</Text>
              <Text style={{ fontSize: 12, color: '#666' }}>{item.formatted_address}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <MapView
        ref={mapRef}
        style={styles.map}
        region={region}
        showsUserLocation
        onPress={(e) => {
          const coords = e.nativeEvent.coordinate;
          setMarkerLocation(coords);
          fetchCity(coords.latitude, coords.longitude);
        }}
      >
        {markerLocation && (
          <Marker
            coordinate={markerLocation}
            title="Selected Location"
          />
        )}
      </MapView>

      <ScrollView style={styles.inputSection}>
        <View style={styles.categoryContainer}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setCategory(cat)}
              style={[
                styles.categoryButton,
                category === cat && styles.categoryButtonSelected
              ]}
            >
              <Text style={category === cat ? { color: 'white' } : {}}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          style={styles.input}
          placeholder="Rating (1-5)"
          keyboardType="numeric"
          value={rating}
          onChangeText={setRating}
        />
        <TextInput
          style={styles.input}
          placeholder="Add a note..."
          multiline
          value={note}
          onChangeText={setNote}
        />
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save to Favourites</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1, zIndex: 0 },
  searchContainer: {
    position: 'absolute',
    top: 50,
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    zIndex: 10,
    borderRadius: 8,
    padding: 8,
  },
  searchInput: {
    height: 44,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
  },
  searchResult: {
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  inputSection: {
    backgroundColor: '#fff',
    padding: 15,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginVertical: 8,
  },
  button: {
    backgroundColor: '#00796B',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  categoryButton: {
    borderWidth: 1,
    borderColor: '#00796B',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 4,
  },
  categoryButtonSelected: {
    backgroundColor: '#00796B',
  },
});
