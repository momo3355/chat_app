import apiClient from '../AxiosClient';
import { BlockedUser } from '../../types/BlockedUserTypes';

export const getBlockedList = async (): Promise<BlockedUser[]> => {
  try {
    const res = await apiClient.post('/user/blockList');
    return res.data?.blockList || [];
  } catch (error: any) {
    console.error('❌ getBlockedList API 오류:', error);
    return [];
  }
};

export const unblockUser = async (blockedId: string): Promise<boolean> => {
  try {
    const res = await apiClient.post('/user/unblock', { blockedId });
    return res.data?.success === true;
  } catch (error: any) {
    console.error('❌ unblockUser API 오류:', error);
    return false;
  }
};
