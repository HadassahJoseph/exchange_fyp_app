// components/ConnectionsTab.js
import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity, Image, RefreshControl, Modal
} from 'react-native';
import { getAuth } from 'firebase/auth';
import { collection, getDocs, doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import styles from '../styles/SearchStyles';

export default function ConnectionsTab() {
  const user = getAuth().currentUser;
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUserData, setCurrentUserData] = useState({});
  const [connectionTab, setConnectionTab] = useState('Connected');

  const fetchUsers = async () => {
    try {
      const usersCollection = await getDocs(collection(db, 'users'));
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.exists() ? userDoc.data() : {};

      const connected = userData.connections || [];

      const usersList = usersCollection.docs
        .map(doc => {
          const userInfo = doc.data();
          const status = connected.includes(doc.id) ? 'Connected' : 'Unconnected';

          return {
            id: doc.id,
            ...userInfo,
            connectionStatus: status
          };
        })
        .filter(u => u.id !== user.uid);

      setUsers(usersList);
      setCurrentUserData(userData);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  useEffect(() => {
    if (user) fetchUsers();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUsers();
    setRefreshing(false);
  }, []);

  const handleConnect = async (otherId) => {
    const refA = doc(db, 'users', user.uid);
    const refB = doc(db, 'users', otherId);

    await updateDoc(refA, { connections: arrayUnion(otherId) });
    await updateDoc(refB, { connections: arrayUnion(user.uid) });
    fetchUsers();
  };

  const handleUnconnect = async (otherId) => {
    const refA = doc(db, 'users', user.uid);
    const refB = doc(db, 'users', otherId);

    await updateDoc(refA, { connections: arrayRemove(otherId) });
    await updateDoc(refB, { connections: arrayRemove(user.uid) });
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
    if (filter === 'Incoming') return match && u.exchangeStage === 'incoming';
    if (filter === 'Currently Abroad') return match && u.exchangeStage === 'current';
    if (filter === 'Returned') return match && u.exchangeStage === 'returned';

    return match;
  });

  const finalUsers = filteredUsers.filter(u =>
    connectionTab === 'Connected'
      ? u.connectionStatus === 'Connected'
      : u.connectionStatus === 'Unconnected'
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search users..."
        placeholderTextColor="#ccc"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <View style={styles.tabContainer}>
        <TouchableOpacity onPress={() => setConnectionTab('Connected')}>
          <Text style={[styles.tabText, connectionTab === 'Connected' && styles.activeTabText]}>Connected</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setConnectionTab('Unconnected')}>
          <Text style={[styles.tabText, connectionTab === 'Unconnected' && styles.activeTabText]}>Unconnected</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.filterBtn} onPress={() => setModalVisible(true)}>
        <Text style={{ color: '#00796B' }}>{filter || 'Select Filter'}</Text>
      </TouchableOpacity>

      <FlatList
        data={finalUsers}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.avatarUrl || 'https://via.placeholder.com/100' }} style={styles.avatar} />
            <View style={{ flex: 1 }}>
              <Text style={styles.userNameText}>{item.username}</Text>
              <Text style={styles.studyFieldText}>{item.studyField}</Text>
            </View>
            {item.connectionStatus === 'Connected' ? (
              <TouchableOpacity onPress={() => handleUnconnect(item.id)} style={[styles.connectBtn, { backgroundColor: '#FF5252' }]}>
                <Text style={{ color: '#fff' }}>Unconnect</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => handleConnect(item.id)} style={styles.connectBtn}>
                <Text style={{ color: '#fff' }}>Connect</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />

      <Modal visible={isModalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            {['No Filter', 'Home Country', 'Host Country', 'Same Study', 'Same Hobbies', 'Incoming', 'Currently Abroad', 'Returned'].map((option, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => {
                    setFilter(option === 'No Filter' ? '' : option);
                    setModalVisible(false);
                  }}
                >
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
  );
}
