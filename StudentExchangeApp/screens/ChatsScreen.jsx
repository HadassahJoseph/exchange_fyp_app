import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Image, StyleSheet
} from 'react-native';
import { getAuth } from 'firebase/auth';
import { collection, getDoc, getDocs, doc, query, where, setDoc } from 'firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../firebase/firebaseConfig';

export default function ChatsScreen({ navigation }) {
  const [connections, setConnections] = useState([]);
  // const [offers, setOffers] = useState([]);
  const auth = getAuth();
  const user = auth.currentUser;

  const scrollRef = useRef();
  // const [offersY, setOffersY] = useState(0); // y-position of offers section

  useEffect(() => {
    const fetchConnections = async () => {
      if (!user) return;
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const connectionIDs = userData.connections || [];

        if (connectionIDs.length > 0) {
          const q = query(collection(db, 'users'), where('__name__', 'in', connectionIDs));
          const snapshot = await getDocs(q);
          const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setConnections(results);
        }
      }
    };

    fetchConnections();

    // Replace this with your real logic
    // setOffers([
    //   { id: '1', username: 'Offer Tester', profilePic: 'https://via.placeholder.com/100' },
    // ]);
  }, [user]);

  const openChat = async (otherUser) => {
    const chatId = [user.uid, otherUser.id].sort().join('_');
    const chatRef = doc(db, 'chats', chatId);
    const chatDoc = await getDoc(chatRef);

    if (!chatDoc.exists()) {
      await setDoc(chatRef, {
        participants: [user.uid, otherUser.id],
        createdAt: new Date().toISOString(),
      });
    }

    navigation.navigate('ChatRoom', { chatId, otherUser });
  };

  // const scrollToOffers = () => {
  //   scrollRef.current?.scrollTo({ y: offersY, animated: true });
  // };

  const renderUserCard = (user, label = 'Connected') => (
    <TouchableOpacity key={user.id} style={styles.chatCard} onPress={() => openChat(user)} activeOpacity={0.8}>
      <Image source={{ uri: user.profilePic || 'https://via.placeholder.com/100' }} style={styles.avatar} />
      <View>
        <Text style={styles.username}>{user.username}</Text>
        <Text style={styles.subtext}>{label}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} ref={scrollRef}>
        {/* Connected Users */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Connected Users</Text>
          {/* <TouchableOpacity onPress={scrollToOffers}>
            <Text style={styles.jumpLink}>Jump to Offers ↓</Text>
          </TouchableOpacity> */}
          {connections.length === 0 ? (
            <Text style={styles.emptyText}>No connections available.</Text>
          ) : (
            connections.map((user) => renderUserCard(user, 'Connected'))
          )}
        </View>

        {/* Offers */}
        {/* <View
          style={styles.sectionContainer}
          onLayout={(event) => {
            const { y } = event.nativeEvent.layout;
            setOffersY(y);
          }}
        >
          <Text style={styles.sectionTitle}>Offers</Text>
          {offers.length === 0 ? (
            <Text style={styles.emptyText}>No offers yet.</Text>
          ) : (
            offers.map((user) => renderUserCard(user, 'Offer'))
          )}
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  sectionContainer: {
    marginTop: 20,
    marginHorizontal: 16,
  },
  sectionTitle: {
    color: '#A8E9DC',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  jumpLink: {
    color: '#A8E9DC',
    fontSize: 14,
    textDecorationLine: 'underline',
    marginBottom: 10,
  },
  chatCard: {
    backgroundColor: '#2a2a2a',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#A8E9DC',
  },
  username: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  subtext: {
    color: '#aaa',
    fontSize: 13,
  },
  emptyText: {
    color: 'gray',
    textAlign: 'center',
    marginVertical: 10,
  },
});
