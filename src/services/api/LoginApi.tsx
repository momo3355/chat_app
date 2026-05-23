import apiClient from '../AxiosClient';
import RNFS from 'react-native-fs';

import { LoginFormData, AuthResponse, ServerAuthResponse, TokenUpdateRequest, TokenUpdateResponse } from '../../types/LoginTypes';

export const authLogin = async (params: LoginFormData): Promise<AuthResponse> => {
    try {
        console.log('🔐 로그인 API 요청:', params.userId);

        const body = `userId=${encodeURIComponent(params.userId)}&passwd=${encodeURIComponent(params.password)}`;
        const res = await apiClient.post('/auth/login', body, {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
        
        const serverResponse: ServerAuthResponse = res.data;
        console.log('📝 서버 응답:', serverResponse);
        
        if (serverResponse.status === 'success' && serverResponse.user) {
            // 서버 응답을 앱 내부 형식으로 변환
            return {
                success: true,
                user: {
                    userId: serverResponse.user.userId,
                    userName: serverResponse.user.userName,
                    gender: serverResponse.user.gender ?? null,
                    age: serverResponse.user.age ?? null,
                    area: serverResponse.user.area ?? null,
                    greetings: serverResponse.user.greetings ?? null,
                },
            };
        } else {
            return {
                success: false,
                errorMsg: serverResponse.message || '로그인에 실패했습니다.',
            };
        }
    } catch (error: any) {
        console.error('❌ 로그인 API 오류:', error);
        return {
            success: false,            
            errorMsg: error.response?.data?.message || '네트워크 오류가 발생했습니다.',
        };
    }
};


export const profilePhotoUpload = async (userId: string, uri: string, name: string): Promise<boolean> => {
  const filepath = uri.startsWith('content://')
    ? `${RNFS.CachesDirectoryPath}/${name}`
    : uri.startsWith('file://') ? uri.slice(7) : uri;
  if (uri.startsWith('content://')) {
    await RNFS.copyFile(uri, filepath);
  }
  const base64Data = await RNFS.readFile(filepath, 'base64');
  const ext = name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const type = ext === 'png' ? 'image/png' : 'image/jpeg';
  const res = await apiClient.post('/auth/profileFileUpload', {
    userId,
    files: [{ name, type, data: base64Data }],
  });
  const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
  return data.success === true;
};

// 🔥 토큰 업데이트 API
export const tokenUpdate = async (params: TokenUpdateRequest): Promise<TokenUpdateResponse> => {
    try {
        console.log('🔄 토큰 업데이트 API 요청:', params.userId);
        
        const res = await apiClient.post("/auth/tokenUpdate", params);
        const response = res.data;
        
        console.log('📝 토큰 업데이트 응답:', response);
        
        return {
            success: response.success || response.status === 'success' || true,
            message: response.message || '토큰이 업데이트되었습니다.'
        };
    } catch (error: any) {
        console.error('❌ 토큰 업데이트 API 오류:', error);
        return {
            success: false,
            message: error.response?.data?.message || '토큰 업데이트 중 오류가 발생했습니다.'
        };
    }
};