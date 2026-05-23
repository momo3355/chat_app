import { Platform, PermissionsAndroid } from 'react-native';
import {
  getMessaging,
  requestPermission,
  AuthorizationStatus,
} from '@react-native-firebase/messaging';

class PermissionService {
  // 알림 권한 요청
  async requestNotification(): Promise<boolean> {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }

    const authStatus = await requestPermission(getMessaging());
    return (
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL
    );
  }

  // 사진 라이브러리 권한 요청
  async requestPhotoLibrary(): Promise<boolean> {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }

    // iOS는 react-native-image-picker 등 라이브러리에서 자동 처리
    return true;
  }

  // 카메라 권한 요청
  async requestCamera(): Promise<boolean> {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }

    // iOS는 Info.plist의 NSCameraUsageDescription 설정 후 시스템이 자동 처리
    return true;
  }

  // 위치 권한 요청 — 'granted' | 'denied' | 'blocked' 반환
  async requestLocation(): Promise<'granted' | 'denied' | 'blocked'> {
    if (Platform.OS === 'android') {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: '위치 권한 요청',
          message: '동네 인증을 위해 위치 권한이 필요합니다.',
          buttonPositive: '허용',
          buttonNegative: '거부',
        },
      );
      if (result === PermissionsAndroid.RESULTS.GRANTED) return 'granted';
      if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) return 'blocked';
      return 'denied';
    }
    return 'granted'; // iOS는 Geolocation.requestAuthorization()이 처리
  }
}

export default new PermissionService();
