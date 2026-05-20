import { StyleSheet } from 'react-native';

export const feedStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 8,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#7c3aed',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
  },
  writeContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  writeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  writeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  writeCancel: {
    fontSize: 14,
    color: '#666',
    minWidth: 32,
  },
  writeSubmit: {
    fontSize: 14,
    fontWeight: '700',
    color: '#7c3aed',
    minWidth: 32,
    textAlign: 'right',
  },
  writeSubmitDisabled: {
    color: '#ccc',
  },
  textInput: {
    flex: 1,
    minHeight: 120,
    padding: 16,
    fontSize: 15,
    color: '#333',
    textAlignVertical: 'top',
  },
  writeFooter: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    padding: 12,
  },
  photoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  photoBtnText: {
    fontSize: 14,
    color: '#7c3aed',
    fontWeight: '600',
  },
  selectedImagesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  thumbWrapper: {
    position: 'relative',
  },
  selectedThumb: {
    width: 72,
    height: 72,
    borderRadius: 8,
  },
  removeThumbBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#333',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
