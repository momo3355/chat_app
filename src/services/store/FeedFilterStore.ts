import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type FeedOwner = 'ALL' | 'MY';

interface FeedFilterState {
  _hasHydrated: boolean;
  owner: FeedOwner;
  filterArea: number | null;
  filterGender: string | null;
  filterAgeFrom: number | null;
  filterAgeTo: number | null;
}

interface FeedFilterActions {
  setOwner: (owner: FeedOwner) => void;
  setFilterArea: (area: number | null) => void;
  setFilterGender: (gender: string | null) => void;
  setFilterAge: (from: number | null, to: number | null) => void;
  resetFilters: () => void;
}

type FeedFilterStore = FeedFilterState & FeedFilterActions;

const useFeedFilterStore = create<FeedFilterStore>()(
  persist(
    (set) => ({
      _hasHydrated: false,
      owner: 'ALL',
      filterArea: null,
      filterGender: null,
      filterAgeFrom: null,
      filterAgeTo: null,

      setOwner: (owner) => set({ owner }),
      setFilterArea: (area) => set({ filterArea: area }),
      setFilterGender: (gender) => set({ filterGender: gender }),
      setFilterAge: (from, to) => set({ filterAgeFrom: from, filterAgeTo: to }),
      resetFilters: () => set({ filterArea: null, filterGender: null, filterAgeFrom: null, filterAgeTo: null }),
    }),
    {
      name: 'feed-filter-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        owner: state.owner,
        filterArea: state.filterArea,
        filterGender: state.filterGender,
        filterAgeFrom: state.filterAgeFrom,
        filterAgeTo: state.filterAgeTo,
      }),
      onRehydrateStorage: () => (_state, error) => {
        if (!error) {
          useFeedFilterStore.setState({ _hasHydrated: true });
        }
      },
    },
  ),
);

export default useFeedFilterStore;
