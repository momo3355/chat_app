import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e8e0f5',
    elevation: 3,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ede9f8',
  },
  tabActive: {
    backgroundColor: '#7c3aed',
  },
  tabBorder: {
    borderRightWidth: 1,
    borderRightColor: '#e8e0f5',
  },
  tabText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#999',
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
});
