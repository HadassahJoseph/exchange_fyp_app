import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import {
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function FavouritesScreen() {
  const [activeTab, setActiveTab] = useState('places');
  const [favourites, setFavourites] = useState([]);
  const [items, setItems] = useState([]);
  const [posts, setPosts] = useState([]);
  const mapRef = useRef();
  const navigation = useNavigation();

  const userId = auth.currentUser?.uid;

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
    if (!userId) return;
    if (activeTab === 'places') fetchFavourites();
    else if (activeTab === 'items') fetchItems();
    else if (activeTab === 'posts') fetchPosts();
  }, [activeTab]);

  const fetchFavourites = async () => {
    const q = query(collection(db, 'favourites'), where('createdBy', '==', userId));
    const snapshot = await getDocs(q);
    const favs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setFavourites(favs);
    if (favs.length) focusMapOnLocation(favs[0].location);
  };

  const fetchItems = async () => {
    const q = query(collection(db, 'marketplace'), where('likedBy', 'array-contains', userId));
    const snapshot = await getDocs(q);
    setItems(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const fetchPosts = async () => {
    const q = query(collection(db, 'posts'), where('likes', 'array-contains', userId));
    const snapshot = await getDocs(q);
    setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#A8E9DC" />
        </TouchableOpacity>
        <Text style={styles.title}>My Favourites</Text>
      </View>

      <View style={styles.tabs}>
        {renderTabButton('places', 'Places')}
        {renderTabButton('items', 'Items')}
        {renderTabButton('posts', 'Posts')}
      </View>

      {/* PLACES */}
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
                <Text style={styles.info}> {item.rating} — {item.category}</Text>
                <Text style={styles.note}>{item.note}</Text>
                <Text style={styles.city}>{item.hostCity}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={<Text style={styles.empty}>No places saved.</Text>}
          />
        </>
      )}

      {/* ITEMS */}
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

      {/* POSTS */}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 20,
    color: '#fff',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#2b2b2b',
    paddingVertical: 10,
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#A8E9DC',
  },
  activeText: {
    color: '#1e1e1e',
    fontWeight: 'bold',
  },
  inactiveText: {
    color: '#ccc',
  },
  map: {
    height: 250,
  },
  list: {
    padding: 14,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#2b2b2b',
    marginBottom: 10,
    padding: 14,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  name: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  info: {
    color: '#ccc',
    marginTop: 4,
  },
  note: {
    color: '#aaa',
    marginTop: 4,
  },
  city: {
    marginTop: 6,
    fontStyle: 'italic',
    color: '#888',
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    color: '#777',
  },
});
