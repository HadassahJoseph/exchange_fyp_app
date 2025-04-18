import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, Image, View, StyleSheet } from 'react-native';
import { getAuth } from 'firebase/auth';
import { collection, getDoc, getDocs, doc, query, where, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

export default function ConnectedTab({ navigation }) {
  const [connections, setConnections] = useState([]);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchConnections = async () => {
      if (!user) return;

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userConnections = userData.connections || [];

        if (userConnections.length > 0) {
          const q = query(collection(db, "users"), where("__name__", "in", userConnections));
          const snapshot = await getDocs(q);
          const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setConnections(results);
        }
      }
    };

    fetchConnections();
  }, [user]);

  const openChat = async (otherUser) => {
    const chatId = [user.uid, otherUser.id].sort().join("_");
    const chatRef = doc(db, "chats", chatId);
    const chatDoc = await getDoc(chatRef);

    if (!chatDoc.exists()) {
      await setDoc(chatRef, {
        participants: [user.uid, otherUser.id],
        createdAt: new Date().toISOString()
      });
    }

    navigation.navigate("ChatRoom", { chatId, otherUser });
  };

  const renderUser = ({ item }) => (
    <TouchableOpacity style={styles.userContainer} onPress={() => openChat(item)}>
      <Image source={{ uri: item.profilePic || 'https://via.placeholder.com/100' }} style={styles.profileImage} />
      <Text style={styles.username}>{item.username}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#1e1e1e' }}>
    <FlatList
      key={`flatlist-${Math.random()}`}
      data={connections}
      keyExtractor={(item) => item.id}
      renderItem={renderUser}
      ListEmptyComponent={<Text style={styles.emptyText}>No connections available.</Text>}
      contentContainerStyle={connections.length === 0 && { flex: 1, justifyContent: 'center' }}
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
