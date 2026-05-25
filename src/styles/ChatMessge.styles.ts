// styles/ChatRoom.styles.ts
import { StyleSheet } from 'react-native';

// 색상 상수 정의 - Purple Theme
const Colors = {
  // Main Colors
  chatBackground: '#E8E3F3',      // 연한 라벤더
  headerBackground: '#8B5CF6',    // 진한 퍼플
  messageBubble: '#A78BFA',       // 중간 퍼플
  inputBackground: '#FFFFFF',     // 흰색

  // Text Colors
  primaryText: '#FFFFFF',         // 헤더 텍스트 (흰색)
  messageText: '#FFFFFF',         // 메시지 텍스트 (흰색)

  // Button Colors
  sendButtonActive: '#8B5CF6',    // 전송 버튼 활성
  sendButtonInactive: '#E0E0E0',  // 전송 버튼 비활성

  // Border Colors
  border: '#D1C4E9',              // 연한 퍼플 보더
  lightBorder: '#E0E0E0',         // 연한 그레이 보더
};

// 공통 치수 상수
const Sizes = {
  headerHeight: 56,
  inputHeight: 40,

  spacing: {
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 20,
  },

  borderRadius: {
    round: 20,
  },
};

export const styles = StyleSheet.create({
  // ===================
  // 헤더 스타일
  // ===================
  header: {
    height: Sizes.headerHeight,
    backgroundColor: Colors.headerBackground,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Sizes.spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: Sizes.spacing.md,
  },
  backButtonText: {
    fontSize: 24,
    color: Colors.primaryText,
  },
  headerTitleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primaryText,
  },

  // ===================
  // 메인 영역
  // ===================
  container: {
    flex: 1,
    backgroundColor: Colors.chatBackground,
  },
  messagesList: {
    flex: 1,
  },
  messagesContentContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginVertical: 4,
  },
  messageRowOther: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    marginVertical: 4,
  },
  messageInfo: {
    alignItems: 'flex-start',
    marginLeft: 2,
    marginRight: 6,
    marginBottom: 2,
    flexShrink: 0,
  },
  messageInfoMine: {
    alignItems: 'flex-end',
    marginLeft: 4,
    marginRight: 4,
    marginBottom: 2,
    flexShrink: 0,
  },
  readCount: {
    fontSize: 11,
    color: '#8B5CF6',
    fontWeight: 'bold',
  },
  messageTime: {
    fontSize: 10,
    color: '#999999',
    marginTop: 2,
    minWidth: 62,
  },
  messageTimeMine: {
    fontSize: 10,
    color: '#999999',
    marginTop: 2,
    minWidth: 62,
    textAlign: 'right',
  },
  messageBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexShrink: 1,
    maxWidth: '75%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageBubbleOther: {
    backgroundColor: Colors.messageBubble,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginVertical: 4,
    alignSelf: 'flex-start',
    flexShrink: 1,
    maxWidth: '75%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageText: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#333333',
    lineHeight: 22,
  },
  messageTextOther: {
    fontSize: 16,
    fontWeight: 'normal',
    color: Colors.messageText,
    lineHeight: 22,
  },

  // ===================
  // 프로필 이미지
  // ===================
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 22,
    marginRight: 8,
    alignSelf: 'flex-end',
    backgroundColor: '#D1C4E9',
  },

  // ===================
  // 이미지 메시지
  // ===================
  imageThumbnail: {
    borderRadius: 12,
  },

  // ===================
  // 시스템 메시지 (QUIT 등)
  // ===================
  systemMessageContainer: {
    alignSelf: 'stretch' as const,
    alignItems: 'center' as const,
    marginTop: 20,
    marginBottom: 8,
  },
  systemMessageText: {
    color: '#999999',
    fontSize: 12,
  },

  // ===================
  // 날짜 구분선
  // ===================
  dateSeparatorContainer: {
    alignItems: 'center',
    marginVertical: 12,
  },
  dateSeparatorBadge: {
    backgroundColor: '#D1C4E9',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  dateSeparatorText: {
    fontSize: 12,
    color: '#5B3B8C',
    fontWeight: '500',
  },

  // ===================
  // 입력 영역 스타일
  // ===================
  footer: {
    backgroundColor: Colors.inputBackground,
    paddingHorizontal: Sizes.spacing.lg,
    paddingVertical: Sizes.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.lightBorder,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.lightBorder,
    borderRadius: Sizes.borderRadius.round,
    paddingHorizontal: Sizes.spacing.xl,
    paddingVertical: 10,
    fontSize: 16,
    fontWeight: 'normal',
    marginRight: Sizes.spacing.md,
    backgroundColor: '#FFFFFF',
    textAlignVertical: 'top',
    lineHeight: 20,
    height: Sizes.inputHeight,
  },
  sendButton: {
    borderRadius: Sizes.borderRadius.round,
    paddingHorizontal: Sizes.spacing.xxl,
    height: Sizes.inputHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#D1C4E9',
    overflow: 'hidden',
    zIndex: 999,
  },
  loadingBarIndicator: {
    width: '50%',
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 2,
  },
  imageButton: {
    width: Sizes.inputHeight,
    height: Sizes.inputHeight,
    borderRadius: Sizes.borderRadius.round,
    backgroundColor: Colors.chatBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Sizes.spacing.md,
  },
  imageButtonText: {
    fontSize: 22,
  },
  imageBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  pickerModeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#8B5CF6',
    borderRadius: Sizes.borderRadius.round,
    paddingHorizontal: Sizes.spacing.xl,
    height: Sizes.inputHeight,
    backgroundColor: '#F3EEFF',
    justifyContent: 'center',
    marginRight: Sizes.spacing.md,
  },
  pickerModeText: {
    color: '#8B5CF6',
    fontSize: 15,
    fontWeight: '600',
  },
});

export const viewerStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center' },
  closeBtn: { position: 'absolute', top: 16, right: 16, zIndex: 10, padding: 8 },
  imageArea: { flex: 1, justifyContent: 'center' },
  image: { width: '100%', height: '100%' },
});

export const uploadOverlayStyles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 28,
    paddingHorizontal: 40,
    alignItems: 'center',
    gap: 14,
  },
  text: {
    fontSize: 14,
    color: '#555',
    marginTop: 8,
  },
});
