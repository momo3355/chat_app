import { useState, useCallback, useEffect, useRef } from 'react';
import useLoginStore from '../services/store/LoginStore';
import useSearchFilterStore from '../services/store/SearchFilterStore';

export const useHomeFilter = () => {
  const user = useLoginStore(state => state.user);
  const {
    filterArea, filterGender, filterAgeFrom, filterAgeTo, filterDistance, savedUserId,
    setFilterArea, setFilterGender, setFilterAge, setFilterDistance, resetToUserDefaults,
  } = useSearchFilterStore();

  const [activeFilter, setActiveFilter] = useState<'distance' | null>(null);

  const initializedUserRef = useRef<string | null>(null);

  useEffect(() => {
    if (!user) return;
    if (initializedUserRef.current === user.userId) return;
    initializedUserRef.current = user.userId;

    if (user.userId !== savedUserId) {
      const opp = user.gender === 'M' ? 'W' : user.gender === 'W' ? 'M' : null;
      resetToUserDefaults(user.userId, user.area ?? null, opp);
    }
  }, [user]);

  const confirmDistanceFilter = useCallback((val: number) => {
    setFilterDistance(val);
    setActiveFilter(null);
  }, [setFilterDistance]);

  const resetDistance = useCallback(() => {
    setFilterDistance(null);
    setActiveFilter(null);
  }, [setFilterDistance]);

  const isInitialized = !!user && savedUserId !== null;
  const distanceLabel = filterDistance !== null ? `${filterDistance}km` : '거리';

  return {
    filterArea, filterGender, filterAgeFrom, filterAgeTo, filterDistance,
    activeFilter, setActiveFilter,
    distanceLabel,
    confirmDistanceFilter, resetDistance,
    setFilterArea, setFilterGender, setFilterAge,
    isInitialized,
  };
};
