import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  tabBar: {
    backgroundColor: '#1e1e1e',
    borderTopColor: '#333',
    height: 70,
    paddingBottom: 10,
  },
  ffabContainer: {
    top: -30, // slight elevation to blend with tab bar
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  fabButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#A8E9DC',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  
  fabMenuWrapper: {
    position: 'absolute',
    alignItems: 'center',
    bottom: 30,
    left: 0,
    right: 0,
  },
  
  fabMenuOptions: {
    position: 'absolute',
    bottom: 70,
    alignItems: 'center',
  },
  
  fabOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#A8E9DC',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 10,
  },
  
  fabOptionText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '500',
  },
});
