import React, { useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DiscussionCard from './DiscussionCard';
import styles from '../styles/HomeStyles';

const categories = [
  { label: 'All', value: 'all' },
  { label: 'Accommodation', value: 'accommodation' },
  { label: 'Culture', value: 'culture' },
  { label: 'Visa', value: 'visa' },
  { label: 'Language', value: 'language' },
  { label: 'General', value: 'general' },
];

export default function DiscussionList({
  discussions,
  userId,
  expandedDiscussionIds,
  toggleExpand,
  handleLike,
  handleDiscussionComment,
  voteComment,
  newDiscussionComments,
  setNewDiscussionComments,
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filtered = selectedCategory === 'all'
    ? discussions
    : discussions.filter(d => d.category?.toLowerCase() === selectedCategory);

  return (
    <View style={{ flex: 1 }}>
      <Picker
        selectedValue={selectedCategory}
        onValueChange={(val) => setSelectedCategory(val)}
        style={{ marginHorizontal: 14, marginTop: 8, color: 'white', backgroundColor: '#1e1e1e' }}
        dropdownIconColor="#A8E9DC"
      >
        {categories.map(c => (
          <Picker.Item key={c.value} label={c.label} value={c.value} />
        ))}
      </Picker>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DiscussionCard
            item={item}
            userId={userId}
            expanded={expandedDiscussionIds.includes(item.id)}
            onToggleExpand={toggleExpand}
            onLike={handleLike}
            onComment={handleDiscussionComment}
            onVote={voteComment}
            newComment={newDiscussionComments[item.id] || ''}
            setNewComment={(text) =>
              setNewDiscussionComments(prev => ({ ...prev, [item.id]: text }))
            }
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.placeholderText}>No Discussions for this category.</Text>
        }
      />
    </View>
  );
}
