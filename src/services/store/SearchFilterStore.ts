import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SearchFilterState {
  filterArea: number | null;
  filterGender: string | null;
  filterAgeFrom: number | null;
  filterAgeTo: number | null;
  savedUserId: string | null;
}

interface SearchFilterActions {
  setFilterArea: (area: number | null) => void;
  setFilterGender: (gender: string | null) => void;
  setFilterAge: (from: number | null, to: number | null) => void;
  resetToUserDefaults: (userId: string, area: number | null, gender: string | null) => void;
}

type SearchFilterStore = SearchFilterState & SearchFilterActions;

const useSearchFilterStore = create<SearchFilterStore>()(
  persist(
    (set) => ({
      filterArea: null,
      filterGender: null,
      filterAgeFrom: null,
      filterAgeTo: null,
      savedUserId: null,

      setFilterArea: (area) => set({ filterArea: area }),
      setFilterGender: (gender) => set({ filterGender: gender }),
      setFilterAge: (from, to) => set({ filterAgeFrom: from, filterAgeTo: to }),

      // 다른 유저로 로그인할 때만 호출
      resetToUserDefaults: (userId, area, gender) =>
        set({ filterArea: area, filterGender: gender, filterAgeFrom: null, filterAgeTo: null, savedUserId: userId }),
    }),
    {
      name: 'search-filter-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export default useSearchFilterStore;
