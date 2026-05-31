import { StyleSheet } from 'react-native';

export const Colors = {
  primary: '#7c3aed',
  white: '#FFFFFF',
  background: '#F5F5F5',
  textPrimary: '#333333',
  textSecondary: '#666666',
  border: '#E0E0E0',
  danger: '#E53935',
};

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  adContainer: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginTop: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  section: {
    backgroundColor: Colors.white,
    marginTop: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  menuItemBorder: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  menuIcon: { marginRight: 12 },
  menuText: { flex: 1, fontSize: 15, color: Colors.textPrimary },
  versionText: { fontSize: 14, color: Colors.textSecondary },
  dangerText: { color: Colors.danger },
  deleteText: { color: Colors.textSecondary },
  rewardText: { fontSize: 13, color: Colors.primary, fontWeight: '600' },
});
