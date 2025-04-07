import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    backgroundColor: '#1e1e1e',
    padding: 20,
    paddingBottom: 100,
    minHeight: '100%',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 40,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  link: {
    color: '#A8E9DC',
    fontSize: 16,
    marginTop: 6,
  },
  section: {
    backgroundColor: '#2c2c2c',
    padding: 16,
    borderRadius: 12,
    marginVertical: 6,
    marginHorizontal: 20,
  },
  sectionText: {
    color: '#fff',
    fontSize: 16,
  },
  requestCard: {
    flexDirection: 'row',
    backgroundColor: '#2c2c2c',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 20,
    marginTop: 10,
    alignItems: 'center',
  },
  acceptBtn: {
    marginTop: 6,
    backgroundColor: '#A8E9DC',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  
});
