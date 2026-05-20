import { StyleSheet, Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_H_PADDING = 14;
const CARD_H_MARGIN = 12;
const IMAGE_GAP = 4;

export const feedItemStyles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginHorizontal: CARD_H_MARGIN,
    marginVertical: 6,
    borderRadius: 12,
    padding: CARD_H_PADDING,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e8e0f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  timeText: {
    fontSize: 12,
    color: '#999',
    marginTop: 1,
  },
  content: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 10,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: IMAGE_GAP,
    marginBottom: 10,
  },
  imageSingle: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  imageMulti: {
    width: (SCREEN_WIDTH - CARD_H_MARGIN * 2 - CARD_H_PADDING * 2 - IMAGE_GAP) / 2,
    height: 120,
    borderRadius: 6,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
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
    color: '#666',
  },
  chatBtn: {
    backgroundColor: '#7c3aed',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  chatBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
});
