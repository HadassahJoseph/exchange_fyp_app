import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  FlatList
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';

const GOOGLE_API_KEY = 'AIzaSyBA5EWbNtneaQSUXXH-OKQSbWyXFSzHmGg';

export default function AddPlaceScreen() {
  const [region, setRegion] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [markerLocation, setMarkerLocation] = useState(null);
  const [rating, setRating] = useState('');
  const [note, setNote] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
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
    })();
  }, []);

  const searchPlaces = async () => {
    if (!searchQuery) return;
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${searchQuery}&key=${GOOGLE_API_KEY}`
      );
      const data = await response.json();
      console.log('Places fetch:', data);
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
    setSearchResults([]);
    setSearchQuery(place.name);
  };

  const handleSave = () => {
    console.log('📍 Saved to favourites:', {
      location: markerLocation,
      rating,
      note,
    });
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
        onPress={(e) => setMarkerLocation(e.nativeEvent.coordinate)}
      >
        {markerLocation && (
          <Marker
            coordinate={markerLocation}
            title="Selected Location"
          />
        )}
      </MapView>

      <View style={styles.inputSection}>
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
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: {
    flex: 1,
    zIndex: 0,
  },
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
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#00796B',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
