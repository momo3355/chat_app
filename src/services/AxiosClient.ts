import axios from 'axios';
import { navigationRef } from '../navigation/navigationRef';
import useLoginStore from './store/LoginStore';

const apiClient = axios.create({
  baseURL: 'http://132.226.225.178:8888',
  timeout: 60000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
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
  (error) => {
    console.error('❌ [apiClient] 응답 오류:', {
      message: error.message,
      status: error.response?.status,
      url: error.config?.url,
      responseData: error.response?.data,
    });

    if (error.response?.status === 401) {
      useLoginStore.getState().logout();
      if (navigationRef.isReady()) {
        navigationRef.reset({ index: 0, routes: [{ name: 'Login' }] });
        console.log('[apiClient] 세션 만료 → Login 화면으로 이동');
      } else {
        console.warn('[apiClient] 세션 만료 → navigationRef 미준비');
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
