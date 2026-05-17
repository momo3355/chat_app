import apiClient from '../AxiosClient';

export interface UpdateLocationParams {
  lat: number;
  lon: number;
  sido: string;
  dong: string;
}

export interface UpdateLocationResult {
  success: boolean;
  errorMsg?: string;
}

export const updateLocation = async (params: UpdateLocationParams): Promise<UpdateLocationResult> => {
  try {
    await apiClient.put('/user/location', params);
    return { success: true };
  } catch (error: any) { // error.response is typed as any in Axios
    return {
      success: false,
      errorMsg: error.response?.data?.message || '위치 업데이트에 실패했습니다.',
    };
  }
};
