import RNFS from 'react-native-fs';
import { Platform } from 'react-native';
import apiClient from '../AxiosClient';

export interface IdCheckResult {
  available: boolean;
}

export interface SignUpParams {
  userId: string;
  password: string;
  userName: string;
  phone: string;
  gender: string;
  age: number;
  area: number;
  profileImg?: string;
  lat: number;
  lon: number;
  sido: string;
  dong: string;
}

export interface SignUpResult {
  success: boolean;
  errorMsg?: string;
}

export const idCheck = async (userId: string): Promise<IdCheckResult> => {
  try {
    const res = await apiClient.post('/auth/idCheck', { userId });
    // status: true = 이미 존재(중복), false = 사용 가능
    return { available: !res.data.status };
  } catch (error: any) {
    console.error('❌ 아이디 중복확인 오류:', error);
    throw new Error(error.response?.data?.message || '중복 확인 중 오류가 발생했습니다.');
  }
};

// 프로필 이미지를 /auth/profileFileUpload로 업로드하고 savedName 반환
export const uploadProfileImage = async (userId: string, uri: string): Promise<string> => {
  let filepath: string;

  if (Platform.OS === 'android' && uri.startsWith('content://')) {
    const tmpName = `profile_${Date.now()}.jpg`;
    filepath = `${RNFS.CachesDirectoryPath}/${tmpName}`;
    await RNFS.copyFile(uri, filepath);
  } else {
    filepath = uri.startsWith('file://') ? uri.slice(7) : uri;
  }

  const filename = filepath.split('/').pop() || `profile_${Date.now()}.jpg`;
  const base64Data = await RNFS.readFile(filepath, 'base64');

  const payload = {
    userId,
    files: [{ name: filename, type: 'image/jpeg', data: base64Data }],
  };

  const res = await apiClient.post('/auth/profileFileUpload', JSON.stringify(payload), {
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.data?.success) {
    throw new Error(res.data?.errorMsg || '프로필 이미지 업로드에 실패했습니다.');
  }
  return res.data.savedName as string;
};

export const signUp = async (params: SignUpParams): Promise<SignUpResult> => {
  try {
    const fields: Record<string, string> = {
      userId: params.userId,
      passwd: params.password,
      userName: params.userName,
      gender: params.gender === '남' ? 'M' : 'W',
      age: String(params.age),
      area: String(params.area),
      phone: params.phone,
      lat: String(params.lat),
      lon: String(params.lon),
      sido: params.sido,
      dong: params.dong,
    };
    if (params.profileImg) { fields.profileImg = params.profileImg; }

    const body = new URLSearchParams(fields).toString();

    await apiClient.post('/auth/signup', body, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    return { success: true };
  } catch (error: any) {
    console.error('❌ 회원가입 API 오류:', error);
    return {
      success: false,
      errorMsg: error.response?.data?.message || '회원가입 중 오류가 발생했습니다.',
    };
  }
};
