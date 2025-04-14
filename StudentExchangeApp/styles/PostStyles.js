// styles/PostStyles.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#1e1e1e',
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 40,
  },

  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },

  input: {
    backgroundColor: '#2c2c2c',
    borderColor: '#A8E9DC',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    color: 'white',
  },

  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#A8E9DC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    justifyContent: 'center',
    backgroundColor: '#262626',
  },

  imageButtonText: {
    color: '#A8E9DC',
    fontWeight: '600',
    fontSize: 15,
    marginLeft: 8,
  },

  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 6,
    marginRight: 10,
  },

  uploadButton: {
    backgroundColor: '#A8E9DC',
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 20,
  },

  uploadText: {
    color: '#1e1e1e',
    fontWeight: 'bold',
    fontSize: 16,
  },

  dropdown: {
    backgroundColor: '#2c2c2c',
    borderColor: '#A8E9DC',
    borderWidth: 1,
    marginBottom: 15,
    zIndex: 10,
  },

  dropdownContainer: {
    backgroundColor: '#2c2c2c',
    borderColor: '#A8E9DC',
    zIndex: 1000,
  },

  dropdownTextStyle: {
    color: '#ffffff',
    fontWeight: '500',
  },

  dropdownPlaceholderStyle: {
    color: '#aaa',
    fontStyle: 'italic',
  },

  emojiPicker: {
    flexDirection: 'row',
    marginBottom: 12,
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },

  emojiText: {
    fontSize: 26,
  },
});
