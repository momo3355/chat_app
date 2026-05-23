export interface FeedItem {
  feedId: number;
  userId: string;
  userName: string;
  gender: string | null;
  age: number | null;
  sido: string | null;
  content: string;
  images: string[];
  likeCount: number;
  isLiked: boolean;
  viewCount: number;
  createdAt: string;
}

export interface FeedState {
  feedList: FeedItem[];
  isLoading: boolean;
  hasMore: boolean;
  page: number;
  errorMsg: string | null;
}

export interface FeedActions {
  fetchFeed: (userId: string, filter?: FeedFilter) => Promise<void>;
  loadMore: (userId: string, filter?: FeedFilter) => Promise<void>;
  likeFeed: (feedId: number, userId: string) => Promise<void>;
  incrementView: (feedId: number, userId: string) => Promise<void>;
  createFeed: (params: CreateFeedParams) => Promise<boolean>;
  deleteFeed: (feedId: number, userId: string) => Promise<boolean>;
  updateFeed: (params: UpdateFeedParams) => Promise<boolean>;
  clearError: () => void;
}

export interface CreateFeedParams {
  userId: string;
  content: string;
  imageUrls: string[];
}

export interface UpdateFeedParams {
  feedId: number;
  userId: string;
  content: string;
  imageUrls: string[];
}

export interface FeedListResponse {
  success: boolean;
  feedList: FeedItem[];
  hasMore: boolean;
  errorMsg?: string;
}

export interface FeedUploadResponse {
  success: boolean;
  imageUrls: string[];
  errorMsg?: string;
}

export interface FeedFilter {
  owner?: 'ALL' | 'MY';
  area?: number | null;
  gender?: string | null;
  ageFrom?: number | null;
  ageTo?: number | null;
}
