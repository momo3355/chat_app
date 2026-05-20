import { create } from 'zustand';
import { chatRoomList, loadMessgeInfoPosts, chatFileUpload, chatRoomOut as chatRoomOutApi } from '../api/ChatApi';
import { ChatRoomFormData, ChatRoomState, ChatRoomActions } from '../../types/ChatRoomTypes';
import { SearchMessgeInfoParams, MessgeInfoResponse } from '../../types/MessgeTypes.ts';

type ChatStore = ChatRoomState & ChatRoomActions;

const useChatStore = create<ChatStore>((set) => ({
  // 상태
  roomList: [],
  isLoading: false,
  errorMsg: null,  

  // 채팅방 목록 가져오기
  fetchRoomList: async (params: ChatRoomFormData): Promise<boolean> => {
    set({ isLoading: true, errorMsg: null });

    try {
      const res = await chatRoomList(params);      
      set({
        roomList: res.roomList,
        isLoading: false,
        errorMsg: null,
      });
      return true;
    } catch (error) {
      set({
        isLoading: false,
        errorMsg: '네트워크 오류가 발생했습니다.',
      });
      return false;
    }
  },

  // 에러 클리어 액션
  clearError: () => {
    set({ errorMsg: null });
  },

  // FCM 수신 시 특정 채팅방의 마지막 메시지 갱신
  updateLastMessage: (roomId, message, time, type) => {
    set(state => ({
      roomList: state.roomList.map(room =>
        room.roomId === roomId
          ? { ...room, lastMessage: message, lastMessageTime: time, lastType: type }
          : room
      ),
    }));
  },

  // FCM 수신 시 특정 채팅방의 미읽음 수 증가
  updateUnreadCount: (roomId, delta) => {
    set(state => ({
      roomList: state.roomList.map(room =>
        room.roomId === roomId
          ? { ...room, unreadCount: (room.unreadCount ?? 0) + delta }
          : room
      ),
    }));
  },

  // 채팅방 입장 시 미읽음 수 초기화
  resetUnreadCount: (roomId) => {
    set(state => ({
      roomList: state.roomList.map(room =>
        room.roomId === roomId ? { ...room, unreadCount: 0 } : room
      ),
    }));
  },

  chatRoomOut: async (userId: string, roomId: string): Promise<boolean> => {
    const success = await chatRoomOutApi(userId, roomId);
    if (success) {
      set(state => ({
        roomList: state.roomList.filter(room => room.roomId !== roomId),
      }));
    }
    return success;
  },

  loadMessgeInfoPosts:async (params: SearchMessgeInfoParams): Promise<MessgeInfoResponse> => {
    try {
      const data = await loadMessgeInfoPosts(params);
      if (data.success) {
        // reUserId가 현재 사용자 ID와 정확히 일치하는 경우, 내가 방에 재입장해 읽은 것이므로
        // 읽지 않은 인원 수(isRead)에서 1 차감 (예: 2명 미읽음 → 내가 읽음 → 1명 미읽음)
        const messageInfoList = (data.messageInfoList ?? []).map(msg => {
          const unreadCount = parseInt(msg.isRead || '0', 10);
          if (
            msg.reUserId &&
            params.sender &&
            msg.reUserId === params.sender &&
            unreadCount > 0
          ) {
            return { ...msg, isRead: String(unreadCount - 1) };
          }
          return msg;
        });
        return {
          success: true,
          chatMessageLoadCount: data.chatMessageLoadCount,
          messageInfoList,
        };
      } else {
        return {
          success: false,
          chatMessageLoadCount: 0,
          messageInfoList: [],
          errorMsg: data.errorMsg || '메시지를 불러오는 데 실패했습니다.',
        };
      }
    } catch (e) {
      console.error('loadMessgeInfoPosts error:', e);
      return {
        success: false,
        chatMessageLoadCount: 0,
        messageInfoList: [],
        errorMsg: '메시지를 불러오는 데 실패했습니다.',
      };
    }
  },

  // 데이터 삽입 함수 수정
  chatFileUpload: async (params: SearchMessgeInfoParams): Promise<MessgeInfoResponse> => {
    set({ isLoading: true, errorMsg: null });
    try {
      const data = await chatFileUpload(params); // 이 부분에서 실제 API 호출
      
      if (data.success) {
        set({ isLoading: false, errorMsg: null });
        return data; // 응답 데이터 반환
      } else {
        set({ isLoading: false, errorMsg: data.errorMsg || '등록에 실패했습니다.' });
        return data; // 실패한 응답도 반환
      }
    } catch (e) {
      console.error('데이터 삽입 실패:', e);
      const errorResponse: MessgeInfoResponse = {
        success: false,
        chatMessageLoadCount: 0,
        messageInfoList: [],
        errorMsg: `등록중에 ${e} 오류가 발생되었습니다.`
      };
      set({ isLoading: false, errorMsg: errorResponse.errorMsg ?? null });
      return errorResponse; // 에러 응답 반환
    } finally {
      set({ isLoading: false });
    }
  },

}));

export default useChatStore;
