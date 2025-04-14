// styles/SearchStyles.js
import { StyleSheet } from 'react-native';

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
      },
    
    // Input and Filter
    input: {
        borderWidth: 1,
        borderColor: '#555',
        backgroundColor: '#2a2a2a',
        borderRadius: 10,
        padding: 10,
        marginBottom: 8,
        fontSize: 14,
        color: '#fff',
    },
    filterBtn: {
        padding: 12,
        backgroundColor: '#2a2a2a',
        alignItems: 'center',
        borderRadius: 10,
        marginBottom: 12,
    },

    // Card
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2a2a2a',
        padding: 12,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#333',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    avatar: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        marginRight: 10,
        backgroundColor: '#444',
    },
    connectBtn: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 10,
        backgroundColor: '#00796B',
        alignItems: 'center',
    },

    // Modal
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalBox: {
        backgroundColor: '#2a2a2a',
        padding: 20,
        borderRadius: 12,
        width: '80%',
        alignItems: 'center',
    },
    modalOption: {
        fontSize: 16,
        paddingVertical: 10,
        width: '100%',
        textAlign: 'center',
        color: '#A8E9DC',
    },

    userNameText: {
        fontWeight: 'bold',
        color: '#ffffff',
      },
      
      studyFieldText: {
        color: '#ffffff',
      },
      

    // Accommodation
    searchGroup: {
        marginVertical: 10,
    },
    searchBtn: {
        backgroundColor: '#00796B',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 8,
    },
    houseCard: {
        flexDirection: 'row',
        backgroundColor: '#2a2a2a',
        borderRadius: 12,
        marginBottom: 10,
        padding: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
    },
    houseImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginRight: 10,
        backgroundColor: '#444',
    },

    // Map Callout
    calloutTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 4,
        color: '#fff',
    },
    calloutNote: {
        fontStyle: 'italic',
        color: '#ccc',
        marginTop: 4,
    },
    calloutUser: {
        marginTop: 6,
        color: '#999',
        fontSize: 12,
    },
});