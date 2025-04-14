// // components/MapTab.js
// import React, { useEffect, useState } from 'react';
// import { View, Text, Modal, TouchableOpacity } from 'react-native';
// import MapView, { Marker } from 'react-native-maps';
// import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
// import { db } from '../firebase/firebaseConfig';
// import styles from '../styles/SearchStyles';

// export default function MapTab() {
//   const [favouritePlaces, setFavouritePlaces] = useState([]);
//   const [mapUsers, setMapUsers] = useState({});
//   const [selectedPlace, setSelectedPlace] = useState(null);
//   const [showModal, setShowModal] = useState(false);

//   useEffect(() => {
//     const fetchFavouritesForMap = async () => {
//       try {
//         const snapshot = await getDocs(collection(db, 'favourites'));
//         const allFavs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

//         const userIds = [...new Set(allFavs.map(f => f.createdBy))];
//         const usersMap = {};
//         for (const uid of userIds) {
//           const userDoc = await getDoc(doc(db, 'users', uid));
//           if (userDoc.exists()) {
//             usersMap[uid] = userDoc.data().username || 'Anonymous';
//           }
//         }

//         setMapUsers(usersMap);
//         setFavouritePlaces(allFavs);
//       } catch (err) {
//         console.error('🔥 Error loading map favourites:', err);
//       }
//     };

//     fetchFavouritesForMap();
//   }, []);

//   return (
//     <View style={{ flex: 1 }}>
//       <MapView
//         style={{ flex: 1 }}
//         showsUserLocation
//         initialRegion={{
//           latitude: 53.3498,
//           longitude: -6.2603,
//           latitudeDelta: 20,
//           longitudeDelta: 20,
//         }}
//       >
//         {favouritePlaces.map((fav) => (
//           <Marker
//             key={fav.id}
//             coordinate={fav.location}
//             onPress={() => {
//               setSelectedPlace(fav);
//               setShowModal(true);
//             }}
//             pinColor="#00796B"
//           />
//         ))}
//       </MapView>

//       <Modal visible={showModal} transparent animationType="slide">
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalBox}>
//             <Text style={styles.calloutTitle}>{selectedPlace?.name}</Text>
//             <Text>⭐ {selectedPlace?.rating} — {selectedPlace?.category}</Text>
//             <Text style={styles.calloutNote}>{selectedPlace?.note}</Text>
//             <Text style={styles.calloutUser}>by: {mapUsers[selectedPlace?.createdBy] || 'Unknown'}</Text>
//             <TouchableOpacity onPress={() => setShowModal(false)}>
//               <Text style={{ color: 'red', marginTop: 10 }}>Close</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }

import React, { useEffect, useState } from 'react';
import {
  View, Text, Modal, TouchableOpacity, StyleSheet, Linking, ScrollView
} from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { Picker } from '@react-native-picker/picker';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';

export default function MapTab() {
  const [places, setPlaces] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [studentType, setStudentType] = useState('all');
  const [category, setCategory] = useState('all');
  const [userData, setUserData] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchUserData();
    fetchPlaces();
  }, []);

  useEffect(() => {
    filterPlaces();
  }, [studentType, category, places, userData]);

  const fetchUserData = async () => {
    const userRef = await getDocs(collection(db, 'users'));
    const currentUser = userRef.docs.find(doc => doc.id === auth.currentUser.uid);
    setUserData(currentUser?.data());
  };

  const fetchPlaces = async () => {
    const snapshot = await getDocs(collection(db, 'favourites'));
    const all = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const grouped = {};
    for (let place of all) {
      const key = `${place.name}_${place.location.latitude}_${place.location.longitude}`;
      if (!grouped[key]) {
        grouped[key] = {
          ...place,
          count: 1,
          creators: [place.createdBy],
          notes: [place.note],
          ratings: [place.rating],
        };
      } else {
        grouped[key].count++;
        grouped[key].creators.push(place.createdBy);
        grouped[key].notes.push(place.note);
        grouped[key].ratings.push(place.rating);
      }
    }
    setPlaces(Object.values(grouped));
  };

  const filterPlaces = () => {
    if (!userData) return;
    let data = [...places];
    if (studentType === 'host') {
      data = data.filter(p => p.userCountry === userData.hostCountry);
    } else if (studentType === 'home') {
      data = data.filter(p => p.userCountry === userData.homeCountry);
    }
    if (category !== 'all') {
      data = data.filter(p => p.category === category);
    }
    setFiltered(data);
  };

  const extractCoords = (loc) => {
    return {
      latitude: loc?.latitude ?? loc?._lat ?? 0,
      longitude: loc?.longitude ?? loc?._long ?? 0
    };
  };

  const openInMaps = (lat, lng) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    Linking.openURL(url);
  };

  const getPinColor = (type) => {
    const colors = {
      'Café': '#A8E9DC',
      'Food': '#FF8A65',
      'Study Spot': '#64B5F6',
      'Library': '#9575CD',
      'Bank': '#FFD54F',
      'SIM Shop': '#4DB6AC',
      'Health': '#E57373',
      'Accommodation': '#81C784'
    };
    return colors[type] || '#00796B';
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.filterRow}>
        <Picker selectedValue={studentType} style={styles.picker} onValueChange={setStudentType}>
          <Picker.Item label="All Students" value="all" />
          <Picker.Item label="Host Students" value="host" />
          <Picker.Item label="Home Students" value="home" />
        </Picker>
        <Picker selectedValue={category} style={styles.picker} onValueChange={setCategory}>
          <Picker.Item label="All Categories" value="all" />
          <Picker.Item label="Food" value="Food" />
          <Picker.Item label="Café" value="Café" />
          <Picker.Item label="Study Spot" value="Study Spot" />
          <Picker.Item label="Library" value="Library" />
          <Picker.Item label="Bank" value="Bank" />
          <Picker.Item label="SIM Shop" value="SIM Shop" />
          <Picker.Item label="Health" value="Health" />
          <Picker.Item label="Accommodation" value="Accommodation" />
        </Picker>
      </View>

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
        {filtered.map((place, idx) => (
          <Marker
            key={idx}
            coordinate={extractCoords(place.location)}
            pinColor={getPinColor(place.category)}
            onPress={() => {
              setSelectedPlace(place);
              setShowModal(true);
            }}
          />
        ))}
      </MapView>

      {/* Modal for Marker */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.calloutTitle}>{selectedPlace?.name}</Text>
            <Text>👍 {selectedPlace?.count} students liked this</Text>
            <Text>⭐ Avg: {(
              selectedPlace?.ratings.reduce((a, b) => a + b, 0) / selectedPlace?.ratings.length
            ).toFixed(1)}</Text>

            <ScrollView style={{ maxHeight: 200 }}>
              {selectedPlace?.notes.map((note, i) => (
                <View key={i} style={{ marginBottom: 8 }}>
                  <Text style={{ fontStyle: 'italic' }}>
                    "{note}" — ⭐ {selectedPlace.ratings[i]}
                  </Text>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.mapBtn}
              onPress={() => openInMaps(selectedPlace?.location.latitude, selectedPlace?.location.longitude)}
            >
              <Ionicons name="navigate" size={20} color="#fff" />
              <Text style={{ color: '#fff', marginLeft: 6 }}>Get Directions</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Text style={{ color: 'red', marginTop: 10, textAlign: 'center' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#1e1e1e',
  },
  picker: {
    flex: 1,
    color: '#fff',
    backgroundColor: '#333',
    marginHorizontal: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 6,
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
  },
  mapBtn: {
    backgroundColor: '#00796B',
    marginTop: 12,
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
});
