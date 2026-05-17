import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FCMService from '../FCMService';

interface FCMState {
  token: string | null;
}

interface FCMActions {
  initToken: () => Promise<string | null>;
  clearToken: () => void;
}

type FCMStore = FCMState & FCMActions;

const useFCMStore = create<FCMStore>()(
  persist(
    (set, get) => ({
      token: null,

      // FCM 토큰 초기화 (권한 요청 → 토큰 발급 → 저장)
      initToken: async () => {
        const existing = get().token;
        if (existing) return existing;

        const token = await FCMService.getToken();
        if (token) {
          set({ token: token });
        }
        return token;
      },

      clearToken: () => {
        set({ token: null });
      },
    }),
    {
      name: 'fcm-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export default useFCMStore;
