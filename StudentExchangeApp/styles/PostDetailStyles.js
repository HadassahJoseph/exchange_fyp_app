import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    padding: 16,
  },

  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#444',
  },

  authorName: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#fff',
  },

  image: {
    width: 300,
    height: 200,
    borderRadius: 12,
    marginRight: 10,
    backgroundColor: '#333',
  },

  caption: {
    marginTop: 12,
    fontSize: 16,
    color: '#eee',
  },

  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },

  heartIcon: {
    marginRight: 6,
  },

  likesText: {
    fontSize: 14,
    color: '#bbb',
  },

  commentText: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 6,
  },

  input: {
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    color: '#fff',
  },

  commentButton: {
    color: '#A8E9DC',
    marginTop: 6,
    fontWeight: '600',
  },

  commentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },

  commentAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#444',
  },

  commentMeta: {
    flexDirection: 'column',
    justifyContent: 'center',
  },

  commentUsername: {
    fontSize: 13,
    color: '#A8E9DC',
    fontWeight: '600',
  },

  commentBody: {
    color: '#ddd',
    fontSize: 14,
  },
});
