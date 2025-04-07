import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import {
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';

export default function FavouritesScreen() {
  const [activeTab, setActiveTab] = useState('places');
  const [favourites, setFavourites] = useState([]);
  const [items, setItems] = useState([]);
  const [posts, setPosts] = useState([]);
  const mapRef = useRef();

  // Center map on selected place
  const focusMapOnLocation = (location) => {
    if (mapRef.current && location) {
      mapRef.current.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  useEffect(() => {
    if (activeTab === 'places') {
      fetchFavourites();
    } else if (activeTab === 'items') {
      fetchItems();
    } else if (activeTab === 'posts') {
      fetchPosts();
    }
  }, [activeTab]);

  const fetchFavourites = async () => {
    const userId = auth.currentUser?.uid;
    const q = query(collection(db, 'favourites'), where('createdBy', '==', userId));
    const snapshot = await getDocs(q);
    const favs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setFavourites(favs);

    if (favs.length) {
      focusMapOnLocation(favs[0].location);
    }
  };

  const fetchItems = async () => {
    const userId = auth.currentUser?.uid;
    const q = query(collection(db, 'marketplace'), where('likedBy', 'array-contains', userId));
    const snapshot = await getDocs(q);
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setItems(items);
  };

  const fetchPosts = async () => {
    const userId = auth.currentUser?.uid;
    const q = query(collection(db, 'posts'), where('likes', 'array-contains', userId));
    const snapshot = await getDocs(q);
    const posts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setPosts(posts);
  };
  
  const renderTabButton = (tab, label) => (
    <TouchableOpacity
      key={tab}
      style={[styles.tabButton, activeTab === tab && styles.activeTab]}
      onPress={() => setActiveTab(tab)}
    >
      <Text style={activeTab === tab ? styles.activeText : styles.inactiveText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabs}>
        {renderTabButton('places', 'Places')}
        {renderTabButton('items', 'Items')}
        {renderTabButton('posts', 'Posts')}
      </View>

      {/* Places Tab */}
      {activeTab === 'places' && (
        <>
          <MapView
            ref={mapRef}
            style={styles.map}
            showsUserLocation
          >
            {favourites.map((fav) => (
              <Marker
                key={fav.id}
                coordinate={fav.location}
                title={fav.name}
                description={fav.note}
              />
            ))}
          </MapView>

          <FlatList
            data={favourites}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() => focusMapOnLocation(item.location)}
              >
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.info}>⭐ {item.rating} — {item.category}</Text>
                <Text style={styles.note}>{item.note}</Text>
                <Text style={styles.city}>{item.hostCity}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={<Text style={styles.empty}>No places saved.</Text>}
          />
        </>
      )}

      {/* Items Tab */}
      {activeTab === 'items' && (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.title}</Text>
              <Text style={styles.info}>€{item.price}</Text>
              <Text style={styles.note}>{item.description}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.empty}>No items liked.</Text>}
        />
      )}

      {/* Posts Tab */}
      {activeTab === 'posts' && (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.title}</Text>
              <Text style={styles.note}>{item.caption}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.empty}>No posts liked.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#eee',
    paddingVertical: 10,
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#00796B',
  },
  activeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  inactiveText: {
    color: '#333',
  },
  map: { height: 250 },
  list: { padding: 10 },
  card: {
    backgroundColor: '#fff',
    marginBottom: 10,
    padding: 12,
    borderRadius: 10,
    elevation: 2,
  },
  name: { fontWeight: 'bold', fontSize: 16 },
  info: { color: '#444', marginTop: 4 },
  note: { color: '#666', marginTop: 4 },
  city: { marginTop: 6, fontStyle: 'italic', color: '#888' },
  empty: { textAlign: 'center', marginTop: 20, color: '#888' },
});
