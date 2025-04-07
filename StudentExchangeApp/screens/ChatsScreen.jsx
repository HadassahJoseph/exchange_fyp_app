import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection, addDoc, query, where, getDocs, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

export default function ChatsScreen({ navigation }) {
    const auth = getAuth();
    const user = auth.currentUser;
    const [connections, setConnections] = useState([]);

    useEffect(() => {
        const fetchConnections = async () => {
            if (!user) {
                console.log("❌ No user logged in.");
                return;
            }

            console.log("🔍 Fetching connections for user:", user.uid);
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                const userConnections = userData.connections || [];

                console.log("✅ Connections found:", userConnections);

                if (userConnections.length === 0) {
                    console.log("⚠️ No connections available.");
                    return;
                }

                // Fetch connected users' details
                const usersCollection = collection(db, "users");
                const q = query(usersCollection, where("__name__", "in", userConnections));
                const querySnapshot = await getDocs(q);

                const usersList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                console.log("✅ Connected users' details fetched:", usersList);
                setConnections(usersList);
            } else {
                console.log("❌ User document does not exist.");
            }
        };

        fetchConnections();
    }, [user]);

    const openChat = async (otherUser) => {
        if (!user) {
            console.log("❌ No user logged in.");
            return;
        }
    
        const chatId = [user.uid, otherUser.id].sort().join("_");
        console.log(`📩 Attempting to open chat: ${chatId}`);
    
        try {
            const chatRef = doc(db, "chats", chatId);
            const chatDoc = await getDoc(chatRef);
    
            if (!chatDoc.exists()) {
                console.log("💬 Chat does not exist, forcing creation...");
                await setDoc(chatRef, {
                    participants: [user.uid, otherUser.id],
                    createdAt: new Date().toISOString()
                });
                console.log("✅ Chat created successfully!");
            }
    
            console.log("📲 Navigating to ChatRoom...");
            navigation.navigate("ChatRoom", { chatId, otherUser });
        } catch (error) {
            console.error("❌ Firestore Error:", error);
        }
    };
    
    
    
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Chats</Text>
            <FlatList
                data={connections}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.userContainer} onPress={() => openChat(item)}>
                        <Image source={{ uri: item.profilePic || 'https://via.placeholder.com/100' }} style={styles.profileImage} />
                        <Text style={styles.username}>{item.username}</Text>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>No connections available.</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    userContainer: { flexDirection: 'row', alignItems: 'center', padding: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' },
    profileImage: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
    username: { fontSize: 18, flex: 1 },
    emptyText: { textAlign: 'center', marginTop: 20, fontSize: 16, color: 'gray' },
});
