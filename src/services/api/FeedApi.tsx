import apiClient from '../AxiosClient';
import RNFS from 'react-native-fs';
import { FeedListResponse, FeedUploadResponse, CreateFeedParams } from '../../types/FeedTypes';

export interface LocalImageFile {
  uri: string;
  name: string;
  type: string;
}

export const getFeedList = async (
  userId: string,
  page: number,
  size: number = 20,
): Promise<FeedListResponse> => {
  try {
    const res = await apiClient.get(`/feed/list?userId=${userId}&page=${page}&size=${size}`);
    return {
      success: true,
      feedList: res.data.feedList ?? [],
      hasMore: res.data.hasMore ?? false,
    };
  } catch (error: any) {
    return {
      success: false,
      feedList: [],
      hasMore: false,
      errorMsg: error.response?.data?.message || '네트워크 오류가 발생했습니다.',
    };
  }
};

export const createFeed = async (
  params: CreateFeedParams,
): Promise<{ success: boolean; errorMsg?: string }> => {
  try {
    await apiClient.post('/feed/create', params);
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      errorMsg: error.response?.data?.message || '네트워크 오류가 발생했습니다.',
    };
  }
};

export const toggleFeedLike = async (
  feedId: number,
  userId: string,
): Promise<{ success: boolean; errorMsg?: string }> => {
  try {
    await apiClient.post('/feed/like', { feedId, userId });
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      errorMsg: error.response?.data?.message || '네트워크 오류가 발생했습니다.',
    };
  }
};

export const feedFileUpload = async (
  userId: string,
  images: LocalImageFile[],
): Promise<FeedUploadResponse> => {
  try {
    const jsonFiles: Array<{ name: string; type: string; data: string }> = [];
    for (const image of images) {
      let filepath: string;
      if (image.uri.startsWith('content://')) {
        filepath = `${RNFS.CachesDirectoryPath}/${image.name}`;
        await RNFS.copyFile(image.uri, filepath);
      } else {
        filepath = image.uri.startsWith('file://') ? image.uri.slice(7) : image.uri;
      }
      const base64Data = await RNFS.readFile(filepath, 'base64');
      jsonFiles.push({ name: image.name, type: image.type, data: base64Data });
    }
    const res = await apiClient.post(
      '/feed/fileUpload',
      JSON.stringify({ userId, files: jsonFiles }),
      { headers: { 'Content-Type': 'application/json' } },
    );
    return { success: true, imageUrls: res.data.imageUrls ?? [] };
  } catch (error: any) {
    return {
      success: false,
      imageUrls: [],
      errorMsg: error.message || '업로드에 실패했습니다.',
    };
  }
};
