// styles/TabStyles.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
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
  }
});
