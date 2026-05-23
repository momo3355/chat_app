import { StyleSheet } from 'react-native';

const CARD_H_PADDING = 14;
const CARD_H_MARGIN = 12;

export const feedItemStyles = StyleSheet.create({
  card: {
    backgroundColor: '#fffbfe',
    marginHorizontal: CARD_H_MARGIN,
    marginVertical: 6,
    borderRadius: 16,
    padding: CARD_H_PADDING,
    borderWidth: 1,
    shadowColor: '#00000020',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fdf2f8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    overflow: 'hidden',
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  metaText: {
    fontSize: 12,
    color: '#999',
  },
  timeText: {
    fontSize: 12,
    color: '#bbb',
    marginTop: 2,
  },
  imageThumbnailWrap: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  imageThumbnail: {
    width: 90,
    height: 90,
    borderRadius: 10,
  },
  imageCountBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    gap: 3,
  },
  imageCountText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  content: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
    marginTop: 16,
    marginBottom: 8,
    marginLeft: -50,
    marginRight: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
    paddingTop: 10,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  likeCount: {
    fontSize: 13,
    color: '#888',
  },
  chatBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  chatBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  ownBtns: {
    flexDirection: 'row',
    gap: 8,
  },
  editBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  editBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
  deleteBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  deleteBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888',
  },
});
