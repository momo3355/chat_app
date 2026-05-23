import { StyleSheet } from 'react-native';

const C = '#7c3aed';
const C_LIGHT = '#ede9f8';
const C_BORDER = '#c4b5fd';

export const filterBarStyles = StyleSheet.create({
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#efefef',
    backgroundColor: '#fff',
  },
  filterPill: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#ddd',
    backgroundColor: '#fafafa',
  },
  filterPillActive: {
    borderColor: C,
    backgroundColor: C_LIGHT,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888',
  },
  filterTextActive: {
    color: C,
    fontWeight: '700',
  },

  dropdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    elevation: 8,
    backgroundColor: '#f5f3ff',
    borderBottomWidth: 1,
    borderBottomColor: C_BORDER,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  regionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  regionItem: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C_BORDER,
    backgroundColor: '#fff',
  },
  regionItemSelected: {
    borderColor: C,
    backgroundColor: C,
  },
  regionItemText: {
    fontSize: 13,
    color: '#555',
  },
  regionItemTextSelected: {
    color: '#fff',
    fontWeight: '700',
  },

  genderRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  genderItem: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C_BORDER,
    backgroundColor: '#fff',
    alignItems: 'center',
    maxWidth: 100,
  },
  genderItemSelected: {
    borderColor: C,
    backgroundColor: C,
  },
  genderItemText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
  },
  genderItemTextSelected: {
    color: '#fff',
    fontWeight: '700',
  },

  // 나이 모달
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ageModalBox: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingBottom: 16,
    elevation: 6,
    shadowColor: C,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: C,
    textAlign: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: C_LIGHT,
  },
  agePickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 8,
    height: 220,
  },
  agePicker: {
    flex: 1,
  },
  ageSeparator: {
    fontSize: 20,
    fontWeight: '700',
    color: C,
    marginHorizontal: 8,
    alignSelf: 'center',
  },
  ageItem: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  ageItemSelected: {
    backgroundColor: C,
  },
  ageItemText: {
    fontSize: 14,
    color: '#555',
  },
  ageItemTextSelected: {
    color: '#fff',
    fontWeight: '700',
  },
  ageBtnRow: {
    flexDirection: 'row',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 12,
  },
  resetBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: C,
    alignItems: 'center',
  },
  resetBtnText: {
    color: C,
    fontSize: 15,
    fontWeight: '700',
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: C,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});
