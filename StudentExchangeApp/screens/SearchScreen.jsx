import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, Image, StyleSheet,
  TextInput, Modal, Linking, Dimensions, ActivityIndicator, RefreshControl
} from 'react-native';
import { getAuth } from 'firebase/auth';
import { collection, getDocs, doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import MapView, { Marker, Callout } from 'react-native-maps';

const { width } = Dimensions.get('window');

export default function SearchScreen() {
  const user = getAuth().currentUser;
  const [tab, setTab] = useState('connections');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [currentUserData, setCurrentUserData] = useState({});
  const [houses, setHouses] = useState([]);
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [university, setUniversity] = useState('');
  const [favouritePlaces, setFavouritePlaces] = useState([]);
  const [mapUsers, setMapUsers] = useState({});
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchUsers = async () => {
    try {
      const usersCollection = await getDocs(collection(db, 'users'));
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.exists() ? userDoc.data() : {};

      const connected = userData.connections || [];
      const requested = userData.connectionRequests || [];

      const usersList = usersCollection.docs
        .map(doc => {
          const userInfo = doc.data();
          let status = 'Not Connected';
          const theirRequests = doc.data().connectionRequests || [];

          if (connected.includes(doc.id)) {
            status = 'Connected';
          } else if (requested.includes(doc.id)) {
            status = 'Requested'; // I sent request to them
          } else if (theirRequests.includes(user.uid)) {
            status = 'Pending'; // They sent request to me
          }
          return {
            id: doc.id,
            ...userInfo,
            connectionStatus: status
          };
        })
        .filter(u => u.id !== user.uid);

      const pendingUsers = usersCollection.docs
        .filter(doc =>
          (doc.data().connectionRequests || []).includes(user.uid) &&
          !(userData.connections || []).includes(doc.id)
        )
        .map(doc => ({ id: doc.id, ...doc.data() }));

      setUsers(usersList);
      setRequests(pendingUsers);
      setCurrentUserData(userData);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchUsers();
  }, []);

  const fetchFavouritesForMap = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'favourites'));
      const allFavs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
      // Load user info
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

  useEffect(() => {
    if (tab === 'map') {
      fetchFavouritesForMap();
    }
  }, [tab]);

 

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUsers();
    setRefreshing(false);
  }, []);

  const handleConnect = async (otherUserId) => {
    const userId = user.uid;

    const userRef = doc(db, 'users', userId);
    const otherRef = doc(db, 'users', otherUserId);

    await updateDoc(userRef, {
      connectionRequests: arrayUnion(otherUserId)
    });

    await updateDoc(otherRef, {
      connectionRequests: arrayUnion(userId)
    });

    fetchUsers();
  };

  const handleCancelRequest = async (otherUserId) => {
    const userId = user.uid;
    const userRef = doc(db, 'users', userId);
    const otherRef = doc(db, 'users', otherUserId);

    await updateDoc(userRef, {
      connectionRequests: arrayRemove(otherUserId)
    });
    await updateDoc(otherRef, {
      connectionRequests: arrayRemove(userId)
    });

    fetchUsers();
  };

  const acceptConnection = async (otherId) => {
    const userId = user.uid;
    const userRef = doc(db, 'users', userId);
    const otherRef = doc(db, 'users', otherId);

    await updateDoc(userRef, {
      connections: arrayUnion(otherId),
      connectionRequests: arrayRemove(otherId)
    });

    await updateDoc(otherRef, {
      connections: arrayUnion(userId),
      connectionRequests: arrayRemove(userId)
    });

    fetchUsers();
  };

  const filteredUsers = users.filter(u => {
    const match = u.username.toLowerCase().includes(searchQuery.toLowerCase());
    const norm = s => (s || '').toLowerCase().trim();

    if (!filter) return match;
    if (filter === 'Home Country') return match && norm(u.homeCountry) === norm(currentUserData.homeCountry);
    if (filter === 'Host Country') return match && norm(u.hostCountry) === norm(currentUserData.hostCountry);
    if (filter === 'Same Study') return match && norm(u.studyField) === norm(currentUserData.studyField);
    if (filter === 'Same Hobbies') return match && u.hobbies?.some(h => currentUserData.hobbies?.includes(h));
    return match;
  });

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
    <View style={{ flex: 1 }}>
      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          onPress={() => setTab('connections')}
          style={[styles.tabBtn, tab === 'connections' && styles.tabActive]}>
          <Text style={styles.tabText}>Connections</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setTab('accommodation')}
          style={[styles.tabBtn, tab === 'accommodation' && styles.tabActive]}>
          <Text style={styles.tabText}>Accommodation</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setTab('map')}
          style={[styles.tabBtn, tab === 'map' && styles.tabActive]}>
          <Text style={styles.tabText}>Explore Map</Text>
        </TouchableOpacity>
      </View>
  
      {/* Explore Map Tab */}
      {tab === 'map' && (
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
      )}
  
      {/* Connections Tab */}
      {tab === 'connections' && (
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder="Search users..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.filterBtn} onPress={() => setModalVisible(true)}>
            <Text style={{ color: '#00796B' }}>{filter || 'Select Filter'}</Text>
          </TouchableOpacity>
  
          {requests.length > 0 && (
            <View style={{ marginBottom: 15 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 5 }}>Pending Requests</Text>
              {requests.map(item => (
                <View key={item.id} style={styles.card}>
                  <Image source={{ uri: item.avatarUrl || 'https://via.placeholder.com/100' }} style={styles.avatar} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: 'bold' }}>{item.username}</Text>
                    <Text style={{ color: '#777' }}>{item.studyField}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => acceptConnection(item.id)}
                    style={[styles.connectBtn, { backgroundColor: '#4CAF50' }]}>
                    <Text style={{ color: 'white' }}>Accept</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
  
          <FlatList
            data={filteredUsers}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            keyExtractor={u => u.id}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Image source={{ uri: item.avatarUrl || 'https://via.placeholder.com/100' }} style={styles.avatar} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: 'bold' }}>{item.username}</Text>
                  <Text style={{ color: '#777' }}>{item.studyField}</Text>
                </View>
                {item.connectionStatus === 'Requested' ? (
                  <TouchableOpacity
                    onPress={() => handleCancelRequest(item.id)}
                    style={[styles.connectBtn, { backgroundColor: '#FFA500' }]}>
                    <Text style={{ color: '#fff' }}>Cancel</Text>
                  </TouchableOpacity>
                ) : item.connectionStatus === 'Connected' ? (
                  <View style={[styles.connectBtn, { backgroundColor: '#4CAF50' }]}>
                    <Text style={{ color: '#fff' }}>Connected</Text>
                  </View>
                ) : item.connectionStatus === 'Pending' ? (
                  <TouchableOpacity
                    onPress={() => acceptConnection(item.id)}
                    style={[styles.connectBtn, { backgroundColor: '#4CAF50' }]}>
                    <Text style={{ color: '#fff' }}>Accept</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => handleConnect(item.id)}
                    style={styles.connectBtn}>
                    <Text style={{ color: '#fff' }}>Connect</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          />
  
          <Modal visible={isModalVisible} transparent animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={styles.modalBox}>
                {['Home Country', 'Host Country', 'Same Study', 'Same Hobbies'].map((option, idx) => (
                  <TouchableOpacity key={idx} onPress={() => { setFilter(option); setModalVisible(false); }}>
                    <Text style={styles.modalOption}>{option}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text style={{ color: 'red', marginTop: 10 }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      )}
  
      {/* Accommodation Tab */}
      {tab === 'accommodation' && (
        <View style={styles.container}>
          <View style={styles.searchGroup}>
            <TextInput
              style={styles.input}
              placeholder="Country (e.g., IE)"
              value={country}
              onChangeText={setCountry}
            />
            <TextInput
              style={styles.input}
              placeholder="City (e.g., Dublin)"
              value={city}
              onChangeText={setCity}
            />
            <TextInput
              style={styles.input}
              placeholder="University (optional)"
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
              ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>No listings found.</Text>}
            />
          )}
        </View>
      )}
    </View>
  );
  
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 15 },
  tabRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
  tabBtn: { padding: 10, borderRadius: 20, backgroundColor: '#eee' },
  tabActive: { backgroundColor: '#00796B' },
  tabText: { color: '#fff', fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginVertical: 6 },
  filterBtn: { padding: 10, backgroundColor: '#eee', alignItems: 'center', borderRadius: 10 },
  card: { flexDirection: 'row', backgroundColor: '#f9f9f9', padding: 10, borderRadius: 10, marginBottom: 10, alignItems: 'center' },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  connectBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: '#00796B', alignItems: 'center' },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalBox: { backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' },
  modalOption: { fontSize: 16, paddingVertical: 8 },
  searchGroup: { marginVertical: 10 },
  searchBtn: { backgroundColor: '#00796B', padding: 12, borderRadius: 8, alignItems: 'center' },
  houseCard: { flexDirection: 'row', backgroundColor: '#f2f2f2', borderRadius: 10, marginBottom: 10, padding: 10 },
  houseImage: { width: 80, height: 80, borderRadius: 10, marginRight: 10 },

  // calloutBox: {
  //   backgroundColor: 'white',
  //   padding: 10,
  //   borderRadius: 10,
  //   width: 220,
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.3,
  //   shadowRadius: 4,
  //   elevation: 5,
  // },
  
  // calloutTitle: {
  //   fontWeight: 'bold',
  //   fontSize: 16,
  //   marginBottom: 4,
  // },
  
  // calloutNote: {
  //   fontStyle: 'italic',
  //   color: '#666',
  //   marginTop: 4,
  // },
  
  // calloutUser: {
  //   marginTop: 6,
  //   color: '#888',
  //   fontSize: 12,
  // },
  
  
});
