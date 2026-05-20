export interface FeedItem {
  feedId: string;
  userId: string;
  userName: string;
  gender: string | null;
  age: number | null;
  sido: string | null;
  content: string;
  images: string[];
  likeCount: number;
  isLiked: boolean;
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
  fetchFeed: (userId: string) => Promise<void>;
  loadMore: (userId: string) => Promise<void>;
  likeFeed: (feedId: string, userId: string) => Promise<void>;
  createFeed: (params: CreateFeedParams) => Promise<boolean>;
  clearError: () => void;
}

export interface CreateFeedParams {
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
