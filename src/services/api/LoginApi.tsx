import apiClient from '../AxiosClient';

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