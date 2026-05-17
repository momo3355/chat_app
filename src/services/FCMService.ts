import {
  getMessaging,
  getToken,
  onMessage,
  setBackgroundMessageHandler,
  onTokenRefresh,
  onNotificationOpenedApp,
  getInitialNotification,
} from '@react-native-firebase/messaging';
import PermissionService from './PermissionService';

class FCMService {
  // FCM 토큰 가져오기
  async getToken(): Promise<string | null> {
    const hasPermission = await PermissionService.requestNotification();
    if (!hasPermission) return null;

    const token = await getToken(getMessaging());
    console.log('FCM Token:', token);
    return token;
  }

  // 포그라운드 메시지 리스너
  onForegroundMessage(callback: (message: any) => void) {
    return onMessage(getMessaging(), callback);
  }

  // 백그라운드 메시지 핸들러
  setBackgroundHandler(handler: (message: any) => Promise<void>) {
    setBackgroundMessageHandler(getMessaging(), handler);
  }

  // 토큰 갱신 리스너
  onTokenRefresh(callback: (token: string) => void) {
    return onTokenRefresh(getMessaging(), callback);
  }

  // 백그라운드 상태에서 알림 클릭 시
  onNotificationOpenedApp(callback: (message: any) => void) {
    return onNotificationOpenedApp(getMessaging(), callback);
  }

  // 앱 완전 종료 상태에서 알림 클릭으로 실행 시
  getInitialNotification(): Promise<any> {
    return getInitialNotification(getMessaging());
  }
}

export default new FCMService();
