import { StyleSheet } from 'react-native';

export const Colors = {
  primary: '#7c3aed',
  background: '#FFFFFF',
  white: '#FFFFFF',
  textPrimary: '#1a1a1a',
  textSecondary: '#9e9e9e',
  divider: '#F3F3F3',
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingTop: 4,
  },
  roomItem: {
    backgroundColor: Colors.white,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  roomIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#ede9f8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    overflow: 'hidden',
  },
  roomIconImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 14,
  },
  roomIconText: {
    color: Colors.primary,
    fontSize: 20,
    fontWeight: '700',
  },
  roomInfo: {
    flex: 1,
  },
  roomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  roomNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    overflow: 'hidden',
  },
  roomName: {
    fontSize: 15,
    fontWeight: '700',
    flexShrink: 1,
  },
  roomDate: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginLeft: 8,
    minWidth: 50,
    textAlign: 'right',
  },
  roomActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginLeft: 8,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  lastMessage: {
    flex: 1,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  unreadBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginLeft: 4,
    marginRight: 4,
  },
  unreadBadgeText: {
    fontSize: 11,
    color: Colors.white,
    fontWeight: '700',
  },
  roomId: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 15,
    color: Colors.textSecondary,
  },
  errorText: {
    fontSize: 14,
    color: '#FF5252',
    textAlign: 'center',
    marginTop: 20,
  },
});
