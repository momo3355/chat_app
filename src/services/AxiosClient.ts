import axios from 'axios';
import { navigationRef } from '../navigation/navigationRef';
import useLoginStore from './store/LoginStore';

let isHandling401 = false;

const BASE_URL = 'http://132.226.225.178:8888';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 인터셉터 없는 순수 인스턴스 — 재로그인 전용
const rawAxios = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ [apiClient] 응답 성공:', {
      status: response.status,
      url: response.config.url,
      dataSize: JSON.stringify(response.data).length,
    });
    return response;
  },
  async (error) => {
    console.error('❌ [apiClient] 응답 오류:', {
      message: error.message,
      status: error.response?.status,
      url: error.config?.url,
      responseData: error.response?.data,
    });

    const originalRequest = error.config as typeof error.config & { _retry?: boolean };

    if (error.response?.status === 401 && !isHandling401 && !originalRequest._retry) {
      isHandling401 = true;
      originalRequest._retry = true;

      const { credentials } = useLoginStore.getState();

      if (credentials) {
        try {
          const body = `userId=${encodeURIComponent(credentials.userId)}&passwd=${encodeURIComponent(credentials.password)}`;
          const res = await rawAxios.post('/auth/login', body, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          });

          if (res.data?.status === 'success') {
            console.log('[apiClient] 세션 만료 → 자동 재로그인 성공, 요청 재시도');
            isHandling401 = false;
            return apiClient(originalRequest);
          }
        } catch (reLoginError) {
          console.warn('[apiClient] 자동 재로그인 실패:', reLoginError);
        }
      }

      // 재로그인 실패 또는 자격증명 없음 → 로그아웃
      useLoginStore.getState().logout();
      if (navigationRef.isReady()) {
        navigationRef.reset({ index: 0, routes: [{ name: 'Login' }] });
        console.log('[apiClient] 재로그인 실패 → Login 화면으로 이동');
      }
      isHandling401 = false;
    }

    return Promise.reject(error);
  }
);

export default apiClient;
