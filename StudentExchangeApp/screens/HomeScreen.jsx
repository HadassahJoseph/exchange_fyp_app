// // screens/HomeScreen.js
// import React, { useState, useEffect } from 'react';
// import {
//   View, Text, FlatList, SafeAreaView, Platform, StatusBar, TouchableOpacity
// } from 'react-native';
// import { collection, onSnapshot, doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth';
// import { db } from '../firebase/firebaseConfig';
// import { useNavigation } from '@react-navigation/native';
// import styles from '../styles/HomeStyles';
// import PostCard from './PostCard';
// import ItemCard from './ItemCard';
// import DiscussionCard from './DiscussionCard';

// export default function HomeScreen() {
//   const [selectedTab, setSelectedTab] = useState('Items');
//   const [items, setItems] = useState([]);
//   const [posts, setPosts] = useState([]);
//   const [discussions, setDiscussions] = useState([]);
//   const [expandedDiscussionIds, setExpandedDiscussionIds] = useState([]);
//   const [newDiscussionComments, setNewDiscussionComments] = useState({});
//   const [userId, setUserId] = useState(null);
//   const navigation = useNavigation();

//   useEffect(() => {
//     const auth = getAuth();
//     const currentUser = auth.currentUser;
//     if (!currentUser) return;
//     setUserId(currentUser.uid);

//     const fetchData = async (snapshot, userField = 'userId') => {
//       return await Promise.all(snapshot.docs.map(async (docSnap) => {
//         const data = docSnap.data();
//         const uid = data[userField];
//         let username = 'Unknown';
//         let avatarUrl = null;
//         if (uid) {
//           const userDoc = await getDoc(doc(db, 'users', uid));
//           if (userDoc.exists()) {
//             const userData = userDoc.data();
//             username = userData.username || 'Unknown';
//             avatarUrl = userData.avatarUrl || null;
//           }
//         }
//         return { id: docSnap.id, ...data, username, avatarUrl };
//       }));
//     };

//     const unsubscribeItems = onSnapshot(collection(db, 'marketplace'), async (snapshot) => {
//       const data = await fetchData(snapshot);
//       setItems(data.map(item => ({ ...item, sellerAvatar: item.avatarUrl })));
//     });

//     const unsubscribePosts = onSnapshot(collection(db, 'posts'), async (snapshot) => {
//       const data = await fetchData(snapshot);
//       setPosts(data.map(post => ({ ...post, authorAvatar: post.avatarUrl })));
//     });

//     const unsubscribeDiscussions = onSnapshot(collection(db, 'questions'), async (snapshot) => {
//       const allQuestions = await Promise.all(snapshot.docs.map(async (docSnap) => {
//         const data = docSnap.data();
//         let username = 'Unknown';
//         if (data.userId) {
//           const userDoc = await getDoc(doc(db, 'users', data.userId));
//           if (userDoc.exists()) {
//             username = userDoc.data().username || 'Unknown';
//           }
//         }

//         const commentsWithInfo = await Promise.all((data.comments || []).map(async (comment) => {
//           let commentUsername = 'Anonymous';
//           let commentAvatarUrl = null;
//           if (comment.userId) {
//             const commentUserDoc = await getDoc(doc(db, 'users', comment.userId));
//             if (commentUserDoc.exists()) {
//               const commentUserData = commentUserDoc.data();
//               commentUsername = commentUserData.username || 'Anonymous';
//               commentAvatarUrl = commentUserData.avatarUrl || null;
//             }
//           }
//           return { ...comment, username: commentUsername, avatarUrl: commentAvatarUrl };
//         }));

//         return { id: docSnap.id, ...data, username, comments: commentsWithInfo };
//       }));
//       setDiscussions(allQuestions);
//     });

//     return () => {
//       unsubscribeItems();
//       unsubscribePosts();
//       unsubscribeDiscussions();
//     };
//   }, []);

//   const handleDiscussionComment = async (id) => {
//     if (!userId || !newDiscussionComments[id]) return;
//     const ref = doc(db, 'questions', id);
//     await updateDoc(ref, {
//       comments: arrayUnion({
//         text: newDiscussionComments[id],
//         userId,
//         votes: { up: [], down: [] }
//       })
//     });
//     setNewDiscussionComments(prev => ({ ...prev, [id]: '' }));
//   };

//   const toggleExpand = (id) => {
//     setExpandedDiscussionIds(prev =>
//       prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
//     );
//   };

//   const voteComment = (discussionId, commentIndex, isUpvote) => {
//     setDiscussions(prev =>
//       prev.map(disc => {
//         if (disc.id !== discussionId) return disc;
  
//         const updatedComments = [...disc.comments];
//         const comment = { ...updatedComments[commentIndex] };
  
//         if (!comment.votes) comment.votes = { up: [], down: [] };
  
//         if (isUpvote) {
//           comment.votes.up = comment.votes.up.includes(userId)
//             ? comment.votes.up.filter(id => id !== userId)
//             : [...comment.votes.up, userId];
//           comment.votes.down = comment.votes.down.filter(id => id !== userId);
//         } else {
//           comment.votes.down = comment.votes.down.includes(userId)
//             ? comment.votes.down.filter(id => id !== userId)
//             : [...comment.votes.down, userId];
//           comment.votes.up = comment.votes.up.filter(id => id !== userId);
//         }
  
//         updatedComments[commentIndex] = comment;
  
//         // Firestore sync in background
//         const ref = doc(db, 'questions', discussionId);
//         updateDoc(ref, { comments: updatedComments });
  
//         return { ...disc, comments: updatedComments };
//       })
//     );
//   };
  

//   const handleLike = async (postId, currentLikes = []) => {
//     if (!userId) return;
//     const postRef = doc(db, 'posts', postId);
//     const updatedLikes = currentLikes.includes(userId)
//       ? currentLikes.filter(id => id !== userId)
//       : [...currentLikes, userId];
//     await updateDoc(postRef, { likes: updatedLikes });
//   };

//   const handleItemLike = async (itemId, currentLikes = []) => {
//     if (!userId) return;
//     const ref = doc(db, 'marketplace', itemId);
//     const updatedLikes = currentLikes.includes(userId)
//       ? currentLikes.filter(id => id !== userId)
//       : [...currentLikes, userId];
//     await updateDoc(ref, { likes: updatedLikes });
//   };
  
//   const renderTab = (label) => (
//     <TouchableOpacity style={styles.tab} onPress={() => setSelectedTab(label)}>
//       <Text style={[styles.tabText, selectedTab === label && styles.activeTabText]}>{label}</Text>
//       {selectedTab === label && <View style={styles.activeTabUnderline} />}
//     </TouchableOpacity>
//   );

//   if (!userId) return <Text style={{ padding: 20 }}>Loading user...</Text>;

//   return (
//     <SafeAreaView style={[styles.container, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>      
//       <View style={styles.tabContainer}>
//         {renderTab('Posts')}
//         {renderTab('Discussions')}
//         {renderTab('Items')}
//       </View>

//       {selectedTab === 'Posts' && (
//         <FlatList
//           data={posts}
//           keyExtractor={(item) => item.id}
//           renderItem={({ item }) => (
//             <PostCard item={item} onPress={() => navigation.navigate('PostDetailScreen', { post: item })} />
//           )}
//           contentContainerStyle={styles.list}
//           ListEmptyComponent={<Text style={styles.placeholderText}>No Posts yet.</Text>}
//         />
//       )}

//       {selectedTab === 'Discussions' && (
//         <FlatList
//           data={discussions}
//           keyExtractor={(item) => item.id}
//           renderItem={({ item }) => (
//             <DiscussionCard
//               item={item}
//               userId={userId}
//               expanded={expandedDiscussionIds.includes(item.id)}
//               onToggleExpand={toggleExpand}
//               onLike={handleLike}
//               onComment={handleDiscussionComment}
//               onVote={voteComment}
//               newComment={newDiscussionComments[item.id] || ''}
//               setNewComment={(text) => setNewDiscussionComments(prev => ({ ...prev, [item.id]: text }))}
//             />
//           )}
//           contentContainerStyle={styles.list}
//           ListEmptyComponent={<Text style={styles.placeholderText}>No Discussions yet.</Text>}
//         />
//       )}

//       {selectedTab === 'Items' && (
//         <FlatList
//           data={items}
//           keyExtractor={(item) => item.id}
//           numColumns={2}
//           columnWrapperStyle={{ justifyContent: 'space-between' }}
//           renderItem={({ item }) => (
//             <ItemCard
//               item={item}
//               onPress={() => navigation.navigate('ItemDetailScreen', { item })}
//               onLike={handleItemLike}
//               userId={userId}
//             />
//           )}
//           contentContainerStyle={styles.gridList}
//           ListEmptyComponent={<Text style={styles.placeholderText}>No Items yet.</Text>}
//         />
//       )}
//     </SafeAreaView>
//   );
// }



// HomeScreen.js with 'For You' Redesign Layout (Sectioned)
import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, SafeAreaView, Platform, StatusBar, TouchableOpacity, ScrollView
} from 'react-native';
import { collection, onSnapshot, doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase/firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/HomeStyles';
import PostCard from './PostCard';
import ItemCard from './ItemCard';
import DiscussionCard from './DiscussionCard';
import DiscussionList from './DiscussionList';


export default function HomeScreen() {
  const [selectedTab, setSelectedTab] = useState('For You');
  const [items, setItems] = useState([]);
  const [posts, setPosts] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [expandedDiscussionIds, setExpandedDiscussionIds] = useState([]);
  const [newDiscussionComments, setNewDiscussionComments] = useState({});
  const [userId, setUserId] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    setUserId(currentUser.uid);

    const fetchData = async (snapshot, userField = 'userId') => {
      return await Promise.all(snapshot.docs.map(async (docSnap) => {
        const data = docSnap.data();
        const uid = data[userField];
        let username = 'Unknown';
        let avatarUrl = null;
        if (uid) {
          const userDoc = await getDoc(doc(db, 'users', uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            username = userData.username || 'Unknown';
            avatarUrl = userData.avatarUrl || null;
          }
        }
        return { id: docSnap.id, ...data, username, avatarUrl };
      }));
    };

    const unsubscribeItems = onSnapshot(collection(db, 'marketplace'), async (snapshot) => {
      const data = await fetchData(snapshot);
      setItems(data.map(item => ({ ...item, sellerAvatar: item.avatarUrl })));
    });

    const unsubscribePosts = onSnapshot(collection(db, 'posts'), async (snapshot) => {
      const data = await fetchData(snapshot);
      setPosts(data.map(post => ({ ...post, authorAvatar: post.avatarUrl })));
    });

    const unsubscribeDiscussions = onSnapshot(collection(db, 'questions'), async (snapshot) => {
      const allQuestions = await Promise.all(snapshot.docs.map(async (docSnap) => {
        const data = docSnap.data();
        let username = 'Unknown';
        if (data.userId) {
          const userDoc = await getDoc(doc(db, 'users', data.userId));
          if (userDoc.exists()) {
            username = userDoc.data().username || 'Unknown';
          }
        }

        const commentsWithInfo = await Promise.all((data.comments || []).map(async (comment) => {
          let commentUsername = 'Anonymous';
          let commentAvatarUrl = null;
          if (comment.userId) {
            const commentUserDoc = await getDoc(doc(db, 'users', comment.userId));
            if (commentUserDoc.exists()) {
              const commentUserData = commentUserDoc.data();
              commentUsername = commentUserData.username || 'Anonymous';
              commentAvatarUrl = commentUserData.avatarUrl || null;
            }
          }
          return { ...comment, username: commentUsername, avatarUrl: commentAvatarUrl };
        }));

        return { id: docSnap.id, ...data, username, comments: commentsWithInfo };
      }));
      setDiscussions(allQuestions);
    });

    return () => {
      unsubscribeItems();
      unsubscribePosts();
      unsubscribeDiscussions();
    };
  }, []);

  const handleDiscussionComment = async (id) => {
    if (!userId || !newDiscussionComments[id]) return;
    const ref = doc(db, 'questions', id);
    await updateDoc(ref, {
      comments: arrayUnion({
        text: newDiscussionComments[id],
        userId,
        votes: { up: [], down: [] }
      })
    });
    setNewDiscussionComments(prev => ({ ...prev, [id]: '' }));
  };

  const toggleExpand = (id) => {
    setExpandedDiscussionIds(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const voteComment = (discussionId, commentIndex, isUpvote) => {
    setDiscussions(prev =>
      prev.map(disc => {
        if (disc.id !== discussionId) return disc;

        const updatedComments = [...disc.comments];
        const comment = { ...updatedComments[commentIndex] };

        if (!comment.votes) comment.votes = { up: [], down: [] };

        if (isUpvote) {
          comment.votes.up = comment.votes.up.includes(userId)
            ? comment.votes.up.filter(id => id !== userId)
            : [...comment.votes.up, userId];
          comment.votes.down = comment.votes.down.filter(id => id !== userId);
        } else {
          comment.votes.down = comment.votes.down.includes(userId)
            ? comment.votes.down.filter(id => id !== userId)
            : [...comment.votes.down, userId];
          comment.votes.up = comment.votes.up.filter(id => id !== userId);
        }

        updatedComments[commentIndex] = comment;
        updateDoc(doc(db, 'questions', discussionId), { comments: updatedComments });

        return { ...disc, comments: updatedComments };
      })
    );
  };

  const handleLike = async (postId, currentLikes = []) => {
    if (!userId) return;
    const postRef = doc(db, 'posts', postId);
    const updatedLikes = currentLikes.includes(userId)
      ? currentLikes.filter(id => id !== userId)
      : [...currentLikes, userId];
    await updateDoc(postRef, { likes: updatedLikes });
  };

  const handleItemLike = async (itemId, currentLikes = []) => {
    if (!userId) return;
    const ref = doc(db, 'marketplace', itemId);
    const updatedLikes = currentLikes.includes(userId)
      ? currentLikes.filter(id => id !== userId)
      : [...currentLikes, userId];
    await updateDoc(ref, { likes: updatedLikes });
  };

  const renderTab = (label) => (
    <TouchableOpacity style={styles.tab} onPress={() => setSelectedTab(label)}>
      <Text style={[styles.tabText, selectedTab === label && styles.activeTabText]}>{label}</Text>
      {selectedTab === label && <View style={styles.activeTabUnderline} />}
    </TouchableOpacity>
  );

  if (!userId) return <Text style={{ padding: 20 }}>Loading user...</Text>;

  return (
    <SafeAreaView style={[styles.container, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>      
      <View style={styles.tabContainer}>
        {renderTab('For You')}
        {renderTab('Posts')}
        {renderTab('Discussions')}
        {renderTab('Items')}
      </View>

      {selectedTab === 'For You' && (
  <ScrollView contentContainerStyle={{ padding: 14, paddingBottom: 100 }}>
    {/* TOP POSTS */}
    <Text style={styles.sectionHeader}>Top Posts Today</Text>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
      {posts.slice(0, 2).map((item) => (
        <View key={item.id} style={{ width: '48%' }}>
          <PostCard
            key={item.id}
            item={item}
            previewMode={true} //  MUST include this for For you screen
            onPress={() => navigation.navigate('PostDetailScreen', { post: item })}
          />
        </View>
      ))}
    </View>

    {/* TRENDING DISCUSSIONS */}
    <Text style={styles.sectionHeader}>Trending Discussions</Text>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
      {discussions.slice(0, 2).map((item) => (
        <View key={item.id} style={{ width: '48%' }}>
          <DiscussionCard
            item={item}
            userId={userId}
            previewMode={true}
            expanded={false}  // You can disable expanding for the preview
            onToggleExpand={toggleExpand}
            onLike={handleLike}
            onComment={handleDiscussionComment}
            onVote={voteComment}
            newComment=""
            setNewComment={() => {}}
            onPress={() => navigation.navigate('DiscussionCard', { discussion: item })}
          />
        </View>
      ))}
    </View>

    {/* RECENTLY LISTED ITEMS */}
    <Text style={styles.sectionHeader}>Recently Listed Items</Text>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
      {items.slice(0, 2).map((item) => (
        <View key={item.id} style={{ width: '48%' }}>
          <ItemCard
            item={item}
            onPress={() => navigation.navigate('ItemDetailScreen', { item })}
            onLike={handleItemLike}
            userId={userId}
            previewMode={true}
          />
        </View>
      ))}
    </View>
  </ScrollView>
)}


      {selectedTab === 'Posts' && (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PostCard item={item} onPress={() => navigation.navigate('PostDetailScreen', { post: item })} />
          )}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.placeholderText}>No Posts yet.</Text>}
        />
      )}

      {selectedTab === 'Discussions' && (
        <DiscussionList
          discussions={discussions}
          userId={userId}
          expandedDiscussionIds={expandedDiscussionIds}
          toggleExpand={toggleExpand}
          handleLike={handleLike}
          handleDiscussionComment={handleDiscussionComment}
          voteComment={voteComment}
          newDiscussionComments={newDiscussionComments}
          setNewDiscussionComments={setNewDiscussionComments}
        />
      )}


      {selectedTab === 'Items' && (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          renderItem={({ item }) => (
            <ItemCard
              item={item}
              onPress={() => navigation.navigate('ItemDetailScreen', { item })}
              onLike={handleItemLike}
              userId={userId}
            />
          )}
          contentContainerStyle={styles.gridList}
          ListEmptyComponent={<Text style={styles.placeholderText}>No Items yet.</Text>}
        />
      )}
    </SafeAreaView>
  );
}
