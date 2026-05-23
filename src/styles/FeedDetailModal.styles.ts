import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const feedDetailStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffbfe',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  closeBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  headerRight: {
    width: 40,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  genderBar: {
    height: 4,
    width: '100%',
  },
  contentText: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#eeeeee',
  },
  galleryWrap: {
    position: 'relative',
  },
  galleryImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
  },
  galleryIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  galleryIndicatorText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
  },
  viewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  viewCount: {
    fontSize: 13,
    color: '#bbb',
  },
  likeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 4,
  },
  likeCount: {
    fontSize: 14,
    color: '#888',
  },
  profileArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  profileAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profileAvatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  profileInfo: {
    flex: 1,
  },
  profileNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  profileName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
  },
  timeText: {
    fontSize: 12,
    color: '#bbb',
    marginTop: 2,
  },
  profileMeta: {
    fontSize: 12,
    color: '#999',
    marginTop: 1,
  },
});
