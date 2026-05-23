import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e8e0f5',
    elevation: 4,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  tabActive: {},
  tabBorder: {
    borderRightWidth: 1,
    borderRightColor: '#f0ecff',
  },
  tabIconWrapper: {
    width: 48,
    height: 34,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
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
