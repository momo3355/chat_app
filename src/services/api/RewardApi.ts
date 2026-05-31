import apiClient from '../AxiosClient';

export const claimAdReward = async (): Promise<boolean> => {
  try {
    const res = await apiClient.post('/user/rewardPoint');
    return res.data?.success === true;
  } catch {
    return false;
  }
};
