import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00796B',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    justifyContent: 'center',
    backgroundColor: '#E0F2F1',
  },
  imageButtonText: {
    color: '#00796B',
    fontWeight: '600',
    marginLeft: 8,
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 6,
    marginRight: 10,
  },
  uploadButton: {
    backgroundColor: '#00796B',
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 10,
  },
  uploadText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
