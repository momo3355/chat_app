import apiClient from './AxiosClient';
import { UserSearchResponse } from '../types/UserInfoTypes';

export interface UserSearchParams {
  area?: number | null;
  gender?: string | null;
  ageFrom?: number | null;
  ageTo?: number | null;
  maxDistance?: number | null;
  page?: number;
  size?: number;
}

export const updateProfile = async (params: { userName: string; greetings: string; age?: number | null }): Promise<boolean> => {
  const response = await apiClient.post<{ success?: boolean; status?: string }>('/user/update', params);
  return response.data.success === true || response.data.status === 'success';
};

export const getUserPoint = async (): Promise<number> => {
  const response = await apiClient.get<{ point: number }>('/user/point');
  return response.data.point;
};

export const getMyProfile = async (): Promise<{ userName: string; greetings: string | null; area?: number | null }> => {
  const response = await apiClient.get<{ userName: string; greetings: string | null; area?: number | null }>('/user/profile');
  return response.data;
};

export const searchUsers = async (params: UserSearchParams): Promise<UserSearchResponse> => {
  const queryParams: Record<string, string> = {
    page: String(params.page ?? 0),
    size: String(params.size ?? 15),
  };
  if (params.area != null) queryParams.area = String(params.area);
  if (params.gender != null) queryParams.gender = params.gender;
  if (params.ageFrom != null) queryParams.ageFrom = String(params.ageFrom);
  if (params.ageTo != null) queryParams.ageTo = String(params.ageTo);
  if (params.maxDistance != null) queryParams.maxDistance = String(params.maxDistance);

  const response = await apiClient.get<UserSearchResponse>('/user/search', { params: queryParams });
  return response.data;
};
