import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    tabContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: '#1e1e1e',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderColor: '#333',
    },
    
    tab: {
      flex: 1,
      alignItems: 'center',
      paddingBottom: 10,
    },
    
    activeTabUnderline: {
      height: 3,
      backgroundColor: '#A8E9DC',
      width: '60%',
      borderRadius: 2,
      marginTop: 4,
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
    
  list: {
    padding: 12,
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    marginBottom: 10,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  placeholderBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#aaa',
  },

  gridList: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  
  gridCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '48%',
    marginBottom: 16,
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  
  gridImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  
  gridTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  
  gridPrice: {
    fontSize: 13,
    color: '#00796B',
    fontWeight: 'bold',
  },

  avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 12 },
  requestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f2f2f2',
    marginBottom: 10,
    borderRadius: 10
  },
  acceptBtn: {
    backgroundColor: '#4CAF50',
    padding: 6,
    borderRadius: 8,
    marginTop: 5,
    alignItems: 'center'
  }
  

});