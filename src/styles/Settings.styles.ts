import { StyleSheet } from 'react-native';

export const Colors = {
  white: '#FFFFFF',
  background: '#F5F5F5',
  textPrimary: '#333333',
  textSecondary: '#666666',
  border: '#E0E0E0',
};

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
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
  menuText: { flex: 1, fontSize: 15, color: Colors.textPrimary },
});
