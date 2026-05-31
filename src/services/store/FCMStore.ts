import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FCMService from '../FCMService';
import { tokenUpdate } from '../api/LoginApi';

interface FCMState {
  token: string | null;
  pushEnabled: boolean;
}

interface FCMActions {
  initToken: () => Promise<string | null>;
  clearToken: () => void;
  setPushEnabled: (enabled: boolean, userId: string) => Promise<void>;
}

type FCMStore = FCMState & FCMActions;

const useFCMStore = create<FCMStore>()(
  persist(
    (set, get) => ({
      token: null,
      pushEnabled: true,

      initToken: async () => {
        const existing = get().token;
        if (existing) return existing;

        const token = await FCMService.getToken();
        if (token) {
          set({ token });
        }
        return token;
      },

      clearToken: () => {
        set({ token: null });
      },

      setPushEnabled: async (enabled: boolean, userId: string) => {
        if (enabled) {
          let token = get().token;
          if (!token) {
            token = await FCMService.getToken();
            if (token) set({ token });
          }
          if (token) {
            await tokenUpdate({ userId, token });
          }
          set({ pushEnabled: true });
        } else {
          await tokenUpdate({ userId, token: '' });
          set({ pushEnabled: false });
        }
      },
    }),
    {
      name: 'fcm-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ token: state.token, pushEnabled: state.pushEnabled }),
    },
  ),
);

export default useFCMStore;
