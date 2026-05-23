import { create } from 'zustand';
import { FeedState, FeedActions, FeedFilter, UpdateFeedParams } from '../../types/FeedTypes';
import { getFeedList, createFeed, toggleFeedLike, incrementFeedView, deleteFeed as deleteFeedApi, updateFeed as updateFeedApi } from '../api/FeedApi';

type FeedStore = FeedState & FeedActions;

const PAGE_SIZE = 20;

const useFeedStore = create<FeedStore>((set, get) => ({
  feedList: [],
  isLoading: false,
  hasMore: true,
  page: 0,
  errorMsg: null,

  fetchFeed: async (userId: string, filter?: FeedFilter) => {
    set({ isLoading: true, errorMsg: null });
    const res = await getFeedList(userId, 0, PAGE_SIZE, filter);
    if (res.success) {
      set({ feedList: res.feedList, hasMore: res.hasMore, page: 0, isLoading: false });
    } else {
      set({ isLoading: false, errorMsg: res.errorMsg ?? '오류가 발생했습니다.' });
    }
  },

  loadMore: async (userId: string, filter?: FeedFilter) => {
    const { isLoading, hasMore, page, feedList } = get();
    if (isLoading || !hasMore) return;
    set({ isLoading: true });
    const nextPage = page + 1;
    const res = await getFeedList(userId, nextPage, PAGE_SIZE, filter);
    if (res.success) {
      set({
        feedList: [...feedList, ...res.feedList],
        hasMore: res.hasMore,
        page: nextPage,
        isLoading: false,
      });
    } else {
      set({ isLoading: false });
    }
  },

  likeFeed: async (feedId: number, userId: string) => {
    // optimistic update
    set(state => ({
      feedList: state.feedList.map(item =>
        item.feedId === feedId
          ? {
              ...item,
              isLiked: !item.isLiked,
              likeCount: item.isLiked ? item.likeCount - 1 : item.likeCount + 1,
            }
          : item,
      ),
    }));
    const res = await toggleFeedLike(feedId, userId);
    if (!res.success) {
      // rollback on failure
      set(state => ({
        feedList: state.feedList.map(item =>
          item.feedId === feedId
            ? {
                ...item,
                isLiked: !item.isLiked,
                likeCount: item.isLiked ? item.likeCount - 1 : item.likeCount + 1,
              }
            : item,
        ),
      }));
    }
  },

  incrementView: async (feedId: number, userId: string) => {
    set(state => ({
      feedList: state.feedList.map(item =>
        item.feedId === feedId
          ? { ...item, viewCount: (item.viewCount ?? 0) + 1 }
          : item,
      ),
    }));
    await incrementFeedView(feedId, userId);
  },

  createFeed: async (params) => {
    const res = await createFeed(params);
    if (!res.success) {
      set({ errorMsg: res.errorMsg ?? '게시글 등록에 실패했습니다.' });
    }
    return res.success;
  },

  deleteFeed: async (feedId: number, userId: string) => {
    const prev = get().feedList;
    set(state => ({ feedList: state.feedList.filter(item => item.feedId !== feedId) }));
    const res = await deleteFeedApi(feedId, userId);
    if (!res.success) {
      set({ feedList: prev });
    }
    return res.success;
  },

  updateFeed: async (params: UpdateFeedParams) => {
    const res = await updateFeedApi(params);
    if (!res.success) {
      set({ errorMsg: res.errorMsg ?? '게시글 수정에 실패했습니다.' });
    }
    return res.success;
  },

  clearError: () => set({ errorMsg: null }),
}));

export default useFeedStore;
