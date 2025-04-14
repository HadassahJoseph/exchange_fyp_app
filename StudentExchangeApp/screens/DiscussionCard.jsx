// components/DiscussionCard.js
import React from 'react';
import { View, Text, TouchableOpacity, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/HomeStyles';

export default function DiscussionCard({
  item,
  userId,
  expanded,
  onToggleExpand,
  onLike,
  onComment,
  onVote,
  newComment,
  setNewComment
}) {
  const renderComment = (comment, index) => {
    const score = (comment.votes?.up?.length || 0) - (comment.votes?.down?.length || 0);
    return (
      <View key={index} style={styles.commentRow}>
        {comment.avatarUrl ? (
          <Image source={{ uri: comment.avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={styles.commentAvatarPlaceholder} />
        )}
        <View>
          <Text style={styles.commentUsername}>{comment.username || 'Anonymous'}</Text>
          <Text style={styles.commentItem}>{comment.text}</Text>
          <Text style={styles.likeText}>👍 {comment.votes?.up?.length || 0} | 👎 {comment.votes?.down?.length || 0} | Total: {score}</Text>
          <View style={{ flexDirection: 'row', marginTop: 4 }}>
            <TouchableOpacity onPress={() => onVote(item.id, index, true)}>
              <Ionicons name="arrow-up" size={16} color={(comment.votes?.up || []).includes(userId) ? '#A8E9DC' : '#888'} style={{ marginRight: 6 }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onVote(item.id, index, false)}>
              <Ionicons name="arrow-down" size={16} color={(comment.votes?.down || []).includes(userId) ? '#FF6E6E' : '#888'} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.category}</Text>
      <Text style={styles.discussionUsername}>Asked by {item.username}</Text>
      <Text style={styles.discussionText} numberOfLines={expanded ? undefined : 3}>{item.description}</Text>

      <TouchableOpacity onPress={() => onToggleExpand(item.id)}>
        <Text style={styles.readMore}>{expanded ? 'Show less' : 'Read more'}</Text>
      </TouchableOpacity>

      <View style={styles.likeRow}>
        <TouchableOpacity onPress={() => onLike(item.id, item.likes || [])}>
          <Ionicons
            name={(item.likes || []).includes(userId) ? 'heart' : 'heart-outline'}
            size={20}
            color={(item.likes || []).includes(userId) ? 'red' : '#A8E9DC'}
            style={styles.postIcon}
          />
        </TouchableOpacity>
        <Text style={styles.likeText}>{(item.likes || []).length} likes</Text>
      </View>

      {(item.comments || []).sort((a, b) => {
        const scoreA = (a.votes?.up?.length || 0) - (a.votes?.down?.length || 0);
        const scoreB = (b.votes?.up?.length || 0) - (b.votes?.down?.length || 0);
        return scoreB - scoreA;
      }).map(renderComment)}

      <View style={styles.commentInputContainer}>
        <TextInput
          placeholder="Add a comment..."
          placeholderTextColor="#888"
          value={newComment}
          onChangeText={setNewComment}
          style={styles.commentInput}
        />
        <TouchableOpacity onPress={() => onComment(item.id)}>
          <Text style={styles.postComment}>Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
