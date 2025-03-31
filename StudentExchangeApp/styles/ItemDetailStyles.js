import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    mainImage: { width: '100%', height: 250 },
    content: { padding: 16 },
    title: { fontSize: 22, fontWeight: 'bold', flex: 1 },
    price: { fontSize: 18, color: '#00796B', marginVertical: 8 },
    condition: {
      alignSelf: 'flex-start',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 6,
      fontWeight: '600',
      marginBottom: 12,
      color: 'white'
    },
    new: { backgroundColor: '#4CAF50' },
    used: { backgroundColor: '#FFC107' },
    description: { fontSize: 16, color: '#444', lineHeight: 22 },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    sellerSection: {
      marginTop: 24,
      paddingTop: 12,
      borderTopWidth: 1,
      borderColor: '#eee',
    },
    sellerHeading: { fontWeight: 'bold', marginBottom: 8, fontSize: 16 },
    avatar: { width: 40, height: 40, borderRadius: 20, marginBottom: 6 },
    sellerId: { fontSize: 14, color: '#777' }
});