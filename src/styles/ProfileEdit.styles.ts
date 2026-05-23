import { StyleSheet } from 'react-native';

const P = '#7c3aed';

export const profileEditStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerCancel: {
    fontSize: 14,
    color: '#666',
    minWidth: 40,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  headerSave: {
    fontSize: 14,
    fontWeight: '700',
    color: P,
    minWidth: 40,
    textAlign: 'right',
  },
  headerSaveDisabled: {
    color: '#ccc',
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: '#fff',
    marginBottom: 0,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#ede9f8',
  },
  avatarEditBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: P,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  section: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 12,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  fieldRowLast: {
    borderBottomWidth: 0,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#888',
    width: 56,
  },
  fieldInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    padding: 0,
  },
  fieldDisabledText: {
    flex: 1,
    fontSize: 15,
    color: '#bbb',
  },
  fieldPlaceholder: {
    flex: 1,
    fontSize: 15,
    color: '#ccc',
  },
  ageOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ageModalBox: {
    width: '70%',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingBottom: 16,
    elevation: 6,
    shadowColor: P,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  ageModalTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: P,
    textAlign: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#ede9f8',
  },
  agePicker: {
    height: 264,
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  ageItem: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  ageItemSelected: {
    backgroundColor: P,
  },
  ageItemText: {
    fontSize: 14,
    color: '#555',
  },
  ageItemTextSelected: {
    color: '#fff',
    fontWeight: '700',
  },
  ageConfirmBtn: {
    marginHorizontal: 16,
    marginTop: 8,
    paddingVertical: 12,
    backgroundColor: P,
    borderRadius: 8,
    alignItems: 'center',
  },
  ageConfirmBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});
