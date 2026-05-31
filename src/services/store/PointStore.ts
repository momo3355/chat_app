import { create } from 'zustand';
import { getUserPoint } from '../UserInfoApi';

interface PointState {
  point: number;
  fetchPoint: () => Promise<void>;
}

const usePointStore = create<PointState>((set) => ({
  point: 0,
  fetchPoint: async () => {
    try {
      const p = await getUserPoint();
      set({ point: p });
    } catch {}
  },
}));

export default usePointStore;
