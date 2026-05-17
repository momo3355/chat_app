import apiClient from './AxiosClient';
import { UserSearchResponse } from '../types/UserInfoTypes';

export interface UserSearchParams {
  area?: number | null;
  gender?: string | null;
  ageFrom?: number | null;
  ageTo?: number | null;
  page?: number;
  size?: number;
}

export const searchUsers = async (params: UserSearchParams): Promise<UserSearchResponse> => {
  const queryParams: Record<string, string> = {
    page: String(params.page ?? 0),
    size: String(params.size ?? 15),
  };
  if (params.area != null) queryParams.area = String(params.area);
  if (params.gender != null) queryParams.gender = params.gender;
  if (params.ageFrom != null) queryParams.ageFrom = String(params.ageFrom);
  if (params.ageTo != null) queryParams.ageTo = String(params.ageTo);

  const response = await apiClient.get<UserSearchResponse>('/user/search', { params: queryParams });
  return response.data;
};
