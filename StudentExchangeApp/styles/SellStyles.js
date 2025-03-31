import { StyleSheet } from 'react-native';

export default StyleSheet.create({

    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        backgroundColor: '#fff',
        paddingVertical: 40,
      },
      container: {
        padding: 20,
        backgroundColor: '#fff',
        alignItems: 'stretch',
      },
      header: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      subtext: {
        color: '#555',
        marginBottom: 10,
      },
      link: {
        color: '#00796B',
        textDecorationLine: 'underline',
      },
      photoButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#00796B',
        borderWidth: 1,
        borderRadius: 6,
        padding: 10,
        marginBottom: 15,
        justifyContent: 'center',
      },
      photoText: {
        marginLeft: 10,
        color: '#00796B',
      },
      imagePreview: {
        width: 80,
        height: 80,
        borderRadius: 6,
        marginRight: 10,
      },
      input: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 6,
        padding: 10,
        marginBottom: 15,
      },
      uploadButton: {
        backgroundColor: '#00796B',
        paddingVertical: 14,
        alignItems: 'center',
        borderRadius: 6,
        marginTop: 10,
      },
      uploadText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
      },
});