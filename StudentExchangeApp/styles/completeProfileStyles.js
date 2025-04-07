import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    paddingHorizontal: 20,
    justifyContent: 'center', 
  },
  
  // container: {
  //   flexGrow: 1,
  //   backgroundColor: '#1e1e1e',
  //   paddingHorizontal: 20,
  //   paddingVertical: 30,
  //   justifyContent: 'flex-start',
  // },
  
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#ffffff',
  },
  label: {
    fontWeight: '600',
    marginBottom: 4,
    color: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
  },
  subHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 12,
    color: '#ffffff',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tag: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#A8E9DC',
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  tagSelected: {
    backgroundColor: '#007AFF',
  },
  tagText: {
    color: '#1e1e1e',
    fontWeight: '500',
  },
  submitButton: {
    marginTop: 30,
    backgroundColor: '#A8E9DC',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitText: {
    color: '#1e1e1e',
    fontWeight: '600',
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

  selectedLabel: {
    color: '#ffffff',  // make selected value visible
    fontWeight: '500',
  },
  
  input: {
    backgroundColor: '#2c2c2c',
    borderColor: '#A8E9DC',
    borderWidth: 1,
    color: '#ffffff',   // 🔥 this makes the typed text visible
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  
});