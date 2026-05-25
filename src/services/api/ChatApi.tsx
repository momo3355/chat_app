import apiClient from '../AxiosClient';
import { ChatRoomFormData, ChatRoomPostResponse, ChatRoomPostsValue } from '../../types/ChatRoomTypes';
import { SearchMessgeInfoParams, MessgeInfoResponse } from '../../types/MessgeTypes.ts';
import RNFS from 'react-native-fs';

const pad = (n: number) => String(n).padStart(2, '0');

const toDateString = (val: any): string | undefined => {
  if (val == null) return undefined;
  if (typeof val === 'string') return val;
  if (Array.isArray(val)) {
    // Spring Boot LocalDateTime 기본 직렬화: [year, month, day, hour, minute, second, nano]
    const [y, m, d, h = 0, min = 0, s = 0] = val as number[];
    return `${y}-${pad(m)}-${pad(d)} ${pad(h)}:${pad(min)}:${pad(s)}`;
  }
  if (typeof val === 'number') {
    return new Date(val > 1e10 ? val : val * 1000).toISOString().replace('T', ' ').slice(0, 19);
  }
  // Java Date/Timestamp 객체 직렬화: year은 1900 기준, month는 0-indexed
  if (typeof val === 'object' && typeof val.year === 'number') {
    const y = val.year + 1900;
    const mo = val.month + 1;
    return `${y}-${pad(mo)}-${pad(val.date)} ${pad(val.hours)}:${pad(val.minutes)}:${pad(val.seconds)}`;
  }
  return undefined;
};

export const chatRoomList = async (params: ChatRoomFormData): Promise<ChatRoomPostResponse> => {
    try {
        const res = await apiClient.post("/chat/chatRoomList", params);

        const rawList = res.data.roomList || res.data || [];
        // [roomId, userId, roomName, senderUserId, sendUserName, gender, unreadCount, lastMessage, lastType, cretDate]
        const roomList: ChatRoomPostsValue[] = rawList.map((item: any[]) => ({
            roomId: item[0],
            otherUserId: item[3],
            roomName: item[4],
            gender: item[5] ?? null,
            unreadCount: item[6],
            lastMessage: item[7],
            lastType: item[8],
            lastMessageTime: toDateString(item[9]),
            favoriteYn: item[10] ?? 'N',
        }));

        return {
            success: true,
            roomList,
        };
    } catch (error: any) {
        console.error('❌ 채팅룸불러오기 API 오류:', error);
        return {
            success: false,
            roomList: [],
            errorMsg: error.response?.data?.message || '네트워크 오류가 발생했습니다.',
        };
    }
};

export const loadMessgeInfoPosts = async (params:SearchMessgeInfoParams): Promise<MessgeInfoResponse> => {
    const res = await apiClient.post("/chat/chatMessgeLoadList", params);
    return res.data;
 };

export interface ChatRoomCreateParams {
  userId: string;
  userName: string;
  otherUserId: string;
  roomName: string;
}

export const chatRoomCreate = async (params: ChatRoomCreateParams): Promise<{ roomId: string }> => {
  const res = await apiClient.post<{ roomId: string }>('/chat/chatRoomCreate', params);
  return res.data;
};

export const chatRoomFavorite = async (userId: string, roomId: string): Promise<string> => {
    try {
        const res = await apiClient.post('/chat/favorite', { userId, roomId });
        return res.data?.favoriteYn ?? 'N';
    } catch (error) {
        console.error('❌ chatRoomFavorite API 오류:', error);
        return 'N';
    }
};

export const chatRoomOut = async (userId: string, roomId: string): Promise<boolean> => {
    try {
        const res = await apiClient.post('/chat/out', { userId, roomId });
        return res.data?.success === true;
    } catch (error) {
        console.error('❌ chatRoomOut API 오류:', error);
        return false;
    }
};

export const chatRoomOutFromList = async (userId: string, roomId: string, userName: string): Promise<boolean> => {
    try {
        const res = await apiClient.post('/chat/outFromList', { userId, roomId, userName });
        return res.data?.success === true;
    } catch (error) {
        console.error('❌ chatRoomOutFromList API 오류:', error);
        return false;
    }
};

export const reportUser = async (reportedId: string, reason: string): Promise<boolean> => {
    try {
        const res = await apiClient.post('/user/report', { reportedId, reason });
        return res.data?.success === true;
    } catch (error) {
        console.error('❌ reportUser API 오류:', error);
        return false;
    }
};

export const blockUser = async (blockedId: string): Promise<boolean> => {
    try {
        const res = await apiClient.post('/user/block', { blockedId });
        return res.data?.success === true;
    } catch (error) {
        console.error('❌ blockUser API 오류:', error);
        return false;
    }
};

export const chatFileUpload = async (params: SearchMessgeInfoParams): Promise<MessgeInfoResponse> => {
    try {
        console.log('📤 [chatFileUpload] 업로드 시작:', {
            roomId: params.roomId,
            userId: params.sender,
            파일개수: params.imageFiles?.length || 0
        });

        const uploadFiles: Array<{ name: string; filename: string; filepath: string; filetype: string }> = [];

        if (params.imageFiles && params.imageFiles.length > 0) {
            for (let index = 0; index < params.imageFiles.length; index++) {
                const file = params.imageFiles[index];
                let filepath: string;

                if (file.uri.startsWith('content://')) {
                    filepath = `${RNFS.CachesDirectoryPath}/${file.name}`;
                    await RNFS.copyFile(file.uri, filepath);
                } else {
                    filepath = file.uri.startsWith('file://') ? file.uri.slice(7) : file.uri;
                }
                console.log(`📸 [chatFileUpload] 파일 ${index + 1}: ${filepath}`);

                uploadFiles.push({
                    name: 'files',
                    filename: file.name,
                    filepath,
                    filetype: file.type || 'image/jpeg',
                });
            }
        }

        // 파일을 base64로 변환하여 JSON payload 구성 (서버 DTO: FileBase64.name, .type, .data)
        const jsonFiles: Array<{ name: string; type: string; data: string }> = [];
        for (const uf of uploadFiles) {
            const base64Data = await RNFS.readFile(uf.filepath, 'base64');
            jsonFiles.push({
                name: uf.filename,
                type: uf.filetype,
                data: base64Data,
            });
        }

        const payload = {
            roomId: params.roomId,
            userId: params.sender,
            files: jsonFiles,
        };

        console.log('🌐 [chatFileUpload] apiClient.post 시작...');

        const res = await apiClient.post('/chat/fileUpload', JSON.stringify(payload), {
            headers: { 'Content-Type': 'application/json' },
        });
        const raw = res.data;
        console.log('✅ [chatFileUpload] API 성공:', raw);

        // 서버 응답: { success, files: [{ fileUrl, thumbnailUrl, ... }] }
        // MessgeInfoResponse 형태로 변환
        const messageInfoList = (raw.files || []).map((f: any) => {
            const imageInfo = f.fileUrl ? (f.fileUrl as string).replace('/uploads/', '') : f.savedName;
            console.log('[chatFileUpload] fileUrl:', f.fileUrl, 'savedName:', f.savedName, '→ imageInfo:', imageInfo);
            return { message: '', imageInfo };
        });

        return {
            success: raw.success === true,
            chatMessageLoadCount: 0,
            messageInfoList,
            errorMsg: raw.errorMsg,
        };

    } catch (error: any) {
        console.error('❌ [chatFileUpload] 오류:', error.name, error.message);
        throw new Error(`업로드 실패: ${error.message}`);
    }
};
