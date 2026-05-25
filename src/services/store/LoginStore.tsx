import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authLogin, tokenUpdate } from '../api/LoginApi';
import { LoginFormData, LoginState, LoginActions } from '../../types/LoginTypes';
import useFCMStore from './FCMStore';

type LoginStore = LoginState & LoginActions;

const useLoginStore = create<LoginStore>()(
  persist(
    (set) => ({
      // 상태
      user: null,
      isLoading: false,
      isLoggedIn: false,
      errorMsg: null,
      credentials: null,

      // 로그인 액션
      login: async (formData: LoginFormData): Promise<boolean> => {
        set({ isLoading: true, errorMsg: null });

        try {
          const res = await authLogin(formData);

          if (res.success && res.user) {
            set({
              user: res.user,
              isLoggedIn: true,
              isLoading: false,
              errorMsg: null,
              credentials: formData,
            });
            // 로그인 성공 후 FCM 토큰 초기화 (토큰 발급 완료까지 대기)
            const token = await useFCMStore.getState().initToken();
            if (!token) {
              set({  
                isLoading: false, 
                errorMsg: 'FCM 토큰 발급에 실패했습니다.' });
              return false;
            }
            await tokenUpdate({ userId: res.user.userId, token });
            return true;
          } else {
            set({
              isLoading: false,
              errorMsg: res.errorMsg || '로그인에 실패했습니다.',
            });
            return false;
          }
        } catch (error) {
          set({
            isLoading: false,
            errorMsg: '네트워크 오류가 발생했습니다.',
          });
          return false;
        }
      },

      // 로그아웃 액션
      logout: () => {
        set({
          user: null,
          isLoggedIn: false,
          errorMsg: null,
          credentials: null,
        });
      },

      // 에러 클리어 액션
      clearError: () => {
        set({ errorMsg: null });
      },

      // 유저 정보 부분 업데이트
      updateUser: (partial) => {
        set(state => ({
          user: state.user ? { ...state.user, ...partial } : state.user,
        }));
      },
    }),
    {
      name: 'login-storage', // AsyncStorage에 저장될 키 이름
      storage: createJSONStorage(() => AsyncStorage),
      // 저장할 상태만 선택 (isLoading, errorMsg는 저장 안 함)
      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
        credentials: state.credentials,
      }),
    }
  )
);

export default useLoginStore;
