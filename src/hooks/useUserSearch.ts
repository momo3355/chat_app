import { useState, useCallback, useRef, useEffect } from 'react';
import { searchUsers } from '../services/UserInfoApi';
import { UserSearchItem } from '../types/UserInfoTypes';

export const useUserSearch = (isActive?: boolean) => {
  const [userList, setUserList] = useState<UserSearchItem[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const isLoadingRef = useRef(false);
  const searchGenRef = useRef(0);
  const [refreshKey, setRefreshKey] = useState(0);

  const prevIsActiveRef = useRef<boolean | undefined>(undefined);
  useEffect(() => {
    if (prevIsActiveRef.current === false && isActive === true) {
      setRefreshKey(k => k + 1);
    }
    prevIsActiveRef.current = isActive;
  }, [isActive]);

  const fetchUsers = useCallback(async (
    area: number | null,
    gender: string | null,
    ageFrom: number | null,
    ageTo: number | null,
    maxDistance: number | null,
    pageNum: number,
    reset: boolean,
  ) => {
    // 무한스크롤(reset=false)은 이미 로딩 중이면 스킵
    // 새 검색(reset=true)은 이전 결과를 버리고 항상 실행
    if (!reset && isLoadingRef.current) return;

    const gen = ++searchGenRef.current;
    isLoadingRef.current = true;
    setIsLoading(true);

    try {
      const data = await searchUsers({ area, gender, ageFrom, ageTo, maxDistance, page: pageNum, size: 15 });
      // 이 결과가 최신 요청 결과인지 확인 (빠른 조건 변경 시 이전 응답 무시)
      if (gen !== searchGenRef.current) return;
      setUserList(prev => reset ? data.content : [...prev, ...data.content]);
      setHasMore(data.hasMore);
      setPage(pageNum);
    } catch (err) {
      if (gen === searchGenRef.current) console.error('검색 오류', err);
    } finally {
      if (gen === searchGenRef.current) {
        isLoadingRef.current = false;
        setIsLoading(false);
      }
    }
  }, []);

  const loadMore = useCallback((
    area: number | null,
    gender: string | null,
    ageFrom: number | null,
    ageTo: number | null,
    maxDistance: number | null,
  ) => {
    if (!hasMore || isLoadingRef.current) return;
    fetchUsers(area, gender, ageFrom, ageTo, maxDistance, page + 1, false);
  }, [hasMore, page, fetchUsers]);

  return { userList, isLoading, fetchUsers, loadMore, refreshKey };
};
