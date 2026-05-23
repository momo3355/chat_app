import { StyleSheet } from 'react-native';

const P = '#7c3aed';       // 메인 퍼플
const P_LIGHT = '#ede9f8'; // 연한 퍼플 배경

export const homeStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },

  // 거리 슬라이더
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sliderValueText: {
    fontSize: 14,
    fontWeight: '700',
    color: P,
  },
  sliderResetBtn: {
    fontSize: 13,
    fontWeight: '600',
    color: '#aaa',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
  },
  sliderResetBtnActive: {
    color: P,
    borderColor: P,
    backgroundColor: P_LIGHT,
  },
  sliderTrackWrapper: {
    height: 36,
    justifyContent: 'center',
  },
  sliderTrackBg: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#E0D9F8',
    borderRadius: 2,
  },
  sliderTrackFill: {
    position: 'absolute',
    left: 0,
    height: 4,
    backgroundColor: P,
    borderRadius: 2,
  },
  sliderThumb: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: P,
    borderWidth: 3,
    borderColor: '#fff',
    elevation: 4,
    shadowColor: P,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 3,
    top: 7,
  },
  sliderRangeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  sliderRangeText: {
    fontSize: 11,
    color: '#aaa',
  },
  distanceConfirmBtn: {
    marginTop: 10,
    paddingVertical: 10,
    backgroundColor: P,
    borderRadius: 8,
    alignItems: 'center',
  },
  distanceConfirmBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  // 모달 오버레이 (ProfileModal)
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // 유저 목록
  userList: {
    flex: 1,
  },
  userListContent: {
    paddingVertical: 4,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0ecff',
    backgroundColor: '#fff',
  },
  userAvatarContainer: {
    marginRight: 14,
  },
  userAvatarImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  userAvatarDefault: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: P_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatarText: {
    fontSize: 24,
  },
  userInfoContainer: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  userName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  userMeta: {
    fontSize: 12,
    color: '#aaa',
  },
  userGreeting: {
    fontSize: 13,
    color: '#888',
    marginTop: 3,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 15,
    color: '#aaa',
  },

  // 프로필 팝업
  profileModalBox: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: P,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  profileImageSection: {
    width: '100%',
  },
  profileModalImage: {
    width: '100%',
    resizeMode: 'cover',
  },
  profileModalDefault: {
    width: '100%',
    height: 240,
    backgroundColor: P_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileModalDefaultText: {
    fontSize: 56,
  },
  profileInfoSection: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    gap: 10,
  },
  profileInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileInfoLabel: {
    fontSize: 13,
    color: '#aaa',
    width: 40,
  },
  profileInfoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a2e',
  },
  createRoomBtn: {
    marginHorizontal: 24,
    marginBottom: 24,
    marginTop: 8,
    paddingVertical: 13,
    backgroundColor: P,
    borderRadius: 10,
    alignItems: 'center',
  },
  createRoomBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});
