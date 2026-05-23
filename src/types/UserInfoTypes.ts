export interface UserSearchItem {
  userId: string;
  userName: string;
  gender: string | null;
  age: number | null;
  area: number | null;
  sido: string | null;
  dong: string | null;
  distance: number | null;
  greetings: string | null;
}

export interface UserSearchResponse {
  content: UserSearchItem[];
  totalCount: number;
  hasMore: boolean;
  page: number;
}
