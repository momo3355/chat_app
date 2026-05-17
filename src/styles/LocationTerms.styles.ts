import { StyleSheet } from 'react-native';

export const Colors = {
  primary: '#6B4EFF',
  primaryLight: '#EDE9FE',
  white: '#FFFFFF',
  background: '#F5F5F5',
  textPrimary: '#333333',
  textSecondary: '#666666',
  border: '#E0E0E0',
  disabled: '#BBBBBB',
};

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  statusBar: { backgroundColor: Colors.primaryLight },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: { marginRight: 12 },
  headerTitle: { color: Colors.white, fontSize: 18, fontWeight: '600' },
  scrollContent: { padding: 20, paddingBottom: 8 },
  allAgreeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  allAgreeText: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary },
  divider: { height: 1, backgroundColor: Colors.border, marginBottom: 8 },
  termBlock: { marginTop: 16 },
  termTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 4,
  },
  termTitle: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary, flex: 1 },
  termContent: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 14,
    marginTop: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  termContentText: { fontSize: 13, color: Colors.textSecondary, lineHeight: 22 },
  footer: {
    backgroundColor: Colors.white,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  nextButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  nextButtonDisabled: { backgroundColor: Colors.disabled },
  nextButtonText: { color: Colors.white, fontSize: 16, fontWeight: '600' },
});
