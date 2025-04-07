// ChatRoom.jsx (with dynamic DeepL language support)
import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet
} from 'react-native';
import { getAuth } from 'firebase/auth';
import {
  collection, addDoc, query, orderBy, onSnapshot, getDoc, doc
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { serverTimestamp } from 'firebase/firestore';
import translateMessage from '../utils/translateMessage';
import { getDeepLCodeFromName } from '../utils/fetchSupportedLanguages';

export default function ChatRoom({ route }) {
  const { chatId, otherUser } = route.params;
  const auth = getAuth();
  const user = auth.currentUser;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [recipientLang, setRecipientLang] = useState("en");

  useEffect(() => {
    const fetchRecipientLanguage = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", otherUser.id));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const languageCode = await getDeepLCodeFromName(userData.preferredLanguage || 'English');
          setRecipientLang(languageCode);
          console.log(`🌎 Recipient prefers: ${languageCode}`);
        }
      } catch (error) {
        console.error("❌ Error fetching language:", error);
      }
    };

    fetchRecipientLanguage();
  }, [otherUser.id]);

  useEffect(() => {
    if (!chatId) return;
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(messagesList);
    });

    return () => unsubscribe();
  }, [chatId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      const { translatedText } = await translateMessage(newMessage, recipientLang);
      const messagesRef = collection(db, "chats", chatId, "messages");
      await addDoc(messagesRef, {
        senderId: user.uid,
        text: newMessage,
        translatedText: translatedText || "Translation failed",
        createdAt: serverTimestamp(),
      });
      setNewMessage("");
    } catch (error) {
      console.error("❌ Sending message failed:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.chatTitle}>Chat with {otherUser.username}</Text>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[styles.messageBubble, item.senderId === user.uid ? styles.myMessage : styles.otherMessage]}
          >
            <Text>{item.text}</Text>
            {item.translatedText && item.translatedText !== item.text && (
              <Text style={styles.translatedText}>({item.translatedText})</Text>
            )}
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 10 },
  chatTitle: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  messageBubble: { padding: 10, borderRadius: 10, marginBottom: 5, maxWidth: '80%' },
  myMessage: { alignSelf: 'flex-end', backgroundColor: '#DCF8C6' },
  otherMessage: { alignSelf: 'flex-start', backgroundColor: '#F0F0F0' },
  translatedText: { fontSize: 12, color: 'gray', fontStyle: 'italic', marginTop: 3 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 10, borderTopWidth: 1, borderTopColor: '#ddd' },
  input: { flex: 1, padding: 10, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginRight: 10 },
  sendButton: { padding: 10, backgroundColor: '#4CAF50', borderRadius: 8 },
  sendText: { color: '#fff', fontWeight: 'bold' },
});
