// ChatRoom.jsx 
import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Image
} from 'react-native';
import { getAuth } from 'firebase/auth';
import {
  collection, addDoc, query, orderBy, onSnapshot, getDoc, doc
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { serverTimestamp } from 'firebase/firestore';
import translateMessage from '../utils/translateMessage';
import { getDeepLCodeFromName } from '../utils/fetchSupportedLanguages';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function ChatRoom({ route, navigation }) {
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
          console.log(` Recipient prefers: ${languageCode}`);
        }
      } catch (error) {
        console.error(" Error fetching language:", error);
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
      console.error(" Sending message failed:", error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#A8E9DC" />
        </TouchableOpacity>
        <Text style={styles.chatTitle}>{otherUser.username}</Text>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[styles.messageBubble, item.senderId === user.uid ? styles.myMessage : styles.otherMessage]}
          >
            <Text style={styles.messageText}>{item.text}</Text>
            {item.translatedText && item.translatedText !== item.text && (
              <Text style={styles.translatedText}>({item.translatedText})</Text>
            )}
          </View>
        )}
        contentContainerStyle={{ padding: 10 }}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomColor: '#333',
    borderBottomWidth: 1,
  },
  backButton: {
    marginRight: 10,
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#A8E9DC',
  },
  messageBubble: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: '80%',
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#2a2a2a',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#333',
  },
  messageText: {
    color: 'white',
  },
  translatedText: {
    fontSize: 12,
    color: 'gray',
    fontStyle: 'italic',
    marginTop: 3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#333',
    backgroundColor: '#1e1e1e',
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 8,
    color: 'white',
    marginRight: 10,
  },
  sendButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#A8E9DC',
    borderRadius: 8,
  },
  sendText: {
    color: '#1e1e1e',
    fontWeight: 'bold',
  },
});
