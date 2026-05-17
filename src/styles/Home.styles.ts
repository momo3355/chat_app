import { StyleSheet } from 'react-native';

const P = '#7c3aed';       // 메인 퍼플
const P_LIGHT = '#ede9f8'; // 연한 퍼플 배경
const P_BORDER = '#c4b5fd'; // 퍼플 테두리

export const homeStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },

  // 필터 바
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
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
    borderColor: P,
    backgroundColor: P_LIGHT,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888',
  },
  filterTextActive: {
    color: P,
    fontWeight: '700',
  },
  arrow: {
    fontSize: 9,
    color: P,
  },

  // 인라인 드롭다운 공통
  inlineDropdown: {
    backgroundColor: '#f8f5ff',
    borderBottomWidth: 1,
    borderBottomColor: P_BORDER,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  // 지역 그리드
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
    borderColor: P_BORDER,
    backgroundColor: '#fff',
  },
  regionItemSelected: {
    borderColor: P,
    backgroundColor: P,
  },
  regionItemText: {
    fontSize: 13,
    color: '#555',
  },
  regionItemTextSelected: {
    color: '#fff',
    fontWeight: '700',
  },

  // 성별 인라인
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
    borderColor: P_BORDER,
    backgroundColor: '#fff',
    alignItems: 'center',
    maxWidth: 100,
  },
  genderItemSelected: {
    borderColor: P,
    backgroundColor: P,
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

  // 콘텐츠
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
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
    shadowColor: P,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: P,
    textAlign: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: P_LIGHT,
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
    color: P,
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
  confirmBtn: {
    marginHorizontal: 16,
    marginTop: 12,
    paddingVertical: 12,
    backgroundColor: P,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
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
    alignItems: 'center',
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
  userName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 4,
  },
  userMeta: {
    fontSize: 13,
    color: '#888',
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
