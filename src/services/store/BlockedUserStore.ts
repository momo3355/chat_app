import { create } from 'zustand';
import { BlockedUserState, BlockedUserActions } from '../../types/BlockedUserTypes';
import { getBlockedList, unblockUser as unblockUserApi } from '../api/BlockedUserApi';

type BlockedUserStore = BlockedUserState & BlockedUserActions;

const useBlockedUserStore = create<BlockedUserStore>((set, get) => ({
  blockedList: [],
  isLoading: false,
  errorMsg: null,

  fetchBlockedList: async () => {
    set({ isLoading: true, errorMsg: null });
    const list = await getBlockedList();
    set({ blockedList: list, isLoading: false });
  },

  unblockUser: async (blockedId: string) => {
    const success = await unblockUserApi(blockedId);
    if (success) {
      set(state => ({
        blockedList: state.blockedList.filter(u => u.blockedId !== blockedId),
      }));
    } else {
      set({ errorMsg: '차단 해제에 실패했습니다.' });
    }
    return success;
  },

  clearError: () => set({ errorMsg: null }),
}));

export default useBlockedUserStore;
