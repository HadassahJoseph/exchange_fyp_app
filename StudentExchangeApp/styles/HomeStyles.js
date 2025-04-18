
// HomeStyles.js
import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#1e1e1e',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#333',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 10,
  },
  tabText: {
    color: '#aaa',
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  activeTabUnderline: {
    height: 3,
    backgroundColor: '#A8E9DC',
    width: '60%',
    borderRadius: 2,
    marginTop: 4,
  },
  list: {
    padding: 14,
    paddingBottom: 80
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 14,
  },
  card: {
    backgroundColor: '#2a2a2a',
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  cardImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 10,
    resizeMode: 'cover',
    backgroundColor: '#333',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  postUsername: {
    fontWeight: '600',
    color: '#fff',
    fontSize: 14,
  },
  postFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  postIcon: {
    marginRight: 10,
  },
  postMeta: {
    fontSize: 13,
    color: '#bbb',
  },
  discussionUsername: {
    color: '#A8E9DC',
    marginBottom: 6,
    fontSize: 13,
    fontWeight: '500',
  },
  discussionText: {
    color: '#ddd',
    fontSize: 14,
    marginBottom: 6,
    lineHeight: 20,
  },
  readMore: {
    color: '#A8E9DC',
    marginTop: 6,
    fontSize: 13,
    fontWeight: '600',
  },
  likeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 6,
  },
  likeText: {
    color: '#bbb',
    fontSize: 13,
  },
  commentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 12,
  },
  commentUsername: {
    color: '#A8E9DC',
    fontWeight: '600',
    fontSize: 13,
    marginBottom: 2,
  },
  commentItem: {
    color: '#ddd',
    fontSize: 14,
    lineHeight: 20,
  },
  commentAvatarPlaceholder: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#555',
    marginRight: 6,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 6,
    backgroundColor: '#444',
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 8,
    padding: 8,
    color: '#fff',
    marginTop: 10,
    fontSize: 14,
  },
  postComment: {
    color: '#A8E9DC',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 6,
  },
  gridList: {
    paddingHorizontal: 12,
    paddingTop: 14,
    paddingBottom: 20,
  },
  gridCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    width: '48%',
    marginBottom: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#333',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  gridImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    marginBottom: 8,
    resizeMode: 'cover',
  },
  gridTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#eee',
  },
  gridPrice: {
    fontSize: 13,
    color: '#A8E9DC',
    fontWeight: 'bold',
  },
  placeholderText: {
    fontSize: 15,
    color: '#777',
    textAlign: 'center',
    marginTop: 40,
  },

  previewCard: {
    backgroundColor: '#2a2a2a',
    padding: 10,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },

  previewImage: {
    width: width * 0.42,
    height: 140,
    borderRadius: 8,
    marginBottom: 6,
    resizeMode: 'cover',
    backgroundColor: '#333',
  },

  
});