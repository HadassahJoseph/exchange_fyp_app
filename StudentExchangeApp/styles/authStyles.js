import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1e1e1e',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 24,
        color: '#ffffff',
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#2c2c2c',
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        color: '#ffffff',
        borderWidth: 1,
        borderColor: '#A8E9DC',
    },
    button: {
        width: '100%',
        backgroundColor: '#A8E9DC',
        padding: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#1e1e1e',
        fontWeight: '600',
        fontSize: 16,
    },
    linkText: {
        marginTop: 10,
        color: '#A8E9DC',
        fontSize: 16,
        textAlign: 'center',
    },
});
