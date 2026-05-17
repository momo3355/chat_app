import { useState, useCallback, useEffect, useRef } from 'react';
import useLoginStore from '../services/store/LoginStore';
import useSearchFilterStore from '../services/store/SearchFilterStore';
import { REGIONS } from '../utils/Utils';

export type ActiveFilter = 'area' | 'gender' | 'age' | 'distance' | null;

export const useHomeFilter = () => {
  const user = useLoginStore(state => state.user);
  const {
    filterArea, filterGender, filterAgeFrom, filterAgeTo, filterDistance, savedUserId,
    setFilterArea, setFilterGender, setFilterAge, setFilterDistance, resetToUserDefaults,
  } = useSearchFilterStore();

  const [activeFilter, setActiveFilter] = useState<ActiveFilter>(null);
  const [tempAgeFrom, setTempAgeFrom] = useState(19);
  const [tempAgeTo, setTempAgeTo] = useState(99);

  const initializedUserRef = useRef<string | null>(null);

  useEffect(() => {
    if (!user) return;
    // 이미 이 유저로 초기화한 경우 스킵
    if (initializedUserRef.current === user.userId) return;
    initializedUserRef.current = user.userId;

    // 스토리지에 이 유저 데이터가 없으면 유저정보로 초기화
    if (user.userId !== savedUserId) {
      const opp = user.gender === 'M' ? 'W' : user.gender === 'W' ? 'M' : null;
      resetToUserDefaults(user.userId, user.area ?? null, opp);
    }
    // 스토리지에 값이 있으면(savedUserId === user.userId) 그 값 그대로 사용
  }, [user]);

  const toggleFilter = useCallback((filter: 'area' | 'gender') => {
    setActiveFilter(prev => prev === filter ? null : filter);
  }, []);

  const openAgeModal = useCallback(() => {
    setTempAgeFrom(filterAgeFrom ?? 19);
    setTempAgeTo(filterAgeTo ?? 99);
    setActiveFilter('age');
  }, [filterAgeFrom, filterAgeTo]);

  const confirmAge = useCallback(() => {
    const from = Math.min(tempAgeFrom, tempAgeTo);
    const to = Math.max(tempAgeFrom, tempAgeTo);
    const isDefault = from === 19 && to === 99;
    setFilterAge(isDefault ? null : from, isDefault ? null : to);
    setActiveFilter(null);
  }, [tempAgeFrom, tempAgeTo, setFilterAge]);

  const confirmDistanceFilter = useCallback((val: number) => {
    setFilterDistance(val);
    setActiveFilter(null);
  }, [setFilterDistance]);

  const resetDistance = useCallback(() => {
    setFilterDistance(null);
    setActiveFilter(null);
  }, [setFilterDistance]);

  // savedUserId가 세팅된 시점 = 스토리지 복원 완료 or 유저정보 초기화 완료
  // 이 이후부터 검색 가능
  const isInitialized = !!user && savedUserId !== null;

  const areaLabel = filterArea ? REGIONS[filterArea - 1] : '지역';
  const genderLabel = filterGender === 'M' ? '남' : filterGender === 'W' ? '여' : '성별';
  const ageLabel = filterAgeFrom !== null ? `${filterAgeFrom}~${filterAgeTo ?? 99}세` : '나이';
  const distanceLabel = filterDistance !== null ? `${filterDistance}km` : '거리';

  return {
    filterArea, filterGender, filterAgeFrom, filterAgeTo, filterDistance,
    activeFilter, setActiveFilter,
    tempAgeFrom, setTempAgeFrom, tempAgeTo, setTempAgeTo,
    areaLabel, genderLabel, ageLabel, distanceLabel,
    toggleFilter, openAgeModal, confirmAge,
    confirmDistanceFilter, resetDistance,
    setFilterArea, setFilterGender,
    isInitialized,
  };
};
