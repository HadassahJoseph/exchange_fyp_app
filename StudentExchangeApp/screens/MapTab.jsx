// components/MapTab.js
import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import styles from '../styles/SearchStyles';

export default function MapTab() {
  const [favouritePlaces, setFavouritePlaces] = useState([]);
  const [mapUsers, setMapUsers] = useState({});
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchFavouritesForMap = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'favourites'));
        const allFavs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const userIds = [...new Set(allFavs.map(f => f.createdBy))];
        const usersMap = {};
        for (const uid of userIds) {
          const userDoc = await getDoc(doc(db, 'users', uid));
          if (userDoc.exists()) {
            usersMap[uid] = userDoc.data().username || 'Anonymous';
          }
        }

        setMapUsers(usersMap);
        setFavouritePlaces(allFavs);
      } catch (err) {
        console.error('🔥 Error loading map favourites:', err);
      }
    };

    fetchFavouritesForMap();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        showsUserLocation
        initialRegion={{
          latitude: 53.3498,
          longitude: -6.2603,
          latitudeDelta: 20,
          longitudeDelta: 20,
        }}
      >
        {favouritePlaces.map((fav) => (
          <Marker
            key={fav.id}
            coordinate={fav.location}
            onPress={() => {
              setSelectedPlace(fav);
              setShowModal(true);
            }}
            pinColor="#00796B"
          />
        ))}
      </MapView>

      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.calloutTitle}>{selectedPlace?.name}</Text>
            <Text>⭐ {selectedPlace?.rating} — {selectedPlace?.category}</Text>
            <Text style={styles.calloutNote}>{selectedPlace?.note}</Text>
            <Text style={styles.calloutUser}>by: {mapUsers[selectedPlace?.createdBy] || 'Unknown'}</Text>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Text style={{ color: 'red', marginTop: 10 }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
