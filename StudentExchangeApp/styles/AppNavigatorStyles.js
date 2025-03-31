import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  fabWrapper: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 30,
    left: '50%',
    transform: [{ translateX: -30 }],
  },
  fabMain: {
    backgroundColor: '#4CAF50',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    zIndex: 20,
  },
  fabMenu: {
    position: 'absolute',
    bottom: 80,
    alignItems: 'center',
  },
  fabOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00796B',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginVertical: 6,
    elevation: 3,
  },
  fabOptionText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
});
