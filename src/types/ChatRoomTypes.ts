import { SearchMessgeInfoParams, MessgeInfoResponse } from './MessgeTypes';

export interface ChatRoomFormData {
  userId: string;  
}

export interface ChatRoomPostsValue{
  roomId: string;
  roomName: string;
  otherUserId?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  lastType?: string;
}

export interface ChatRoomPostResponse {
  success: boolean;
  roomList: ChatRoomPostsValue[];
  errorMsg?: string;
}

// ChatStore 상태 타입
export interface ChatRoomState {
  roomList: ChatRoomPostsValue[];
  isLoading: boolean;
  errorMsg: string | null;
}

// ChatStore 액션 타입
export interface ChatRoomActions {
  fetchRoomList: (params: ChatRoomFormData) => Promise<boolean>;
  loadMessgeInfoPosts: (params: SearchMessgeInfoParams) => Promise<MessgeInfoResponse>;
  chatFileUpload: (params: SearchMessgeInfoParams) => Promise<MessgeInfoResponse>;
  clearError: () => void;
  updateLastMessage: (roomId: string, message: string, time?: string, type?: string) => void;
  updateUnreadCount: (roomId: string, delta: number) => void;
  resetUnreadCount: (roomId: string) => void;
  chatRoomOut: (userId: string, roomId: string) => Promise<boolean>;
}
