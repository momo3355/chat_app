export interface BlockedUser {
  blockedId: string;
  blockedName: string;
  gender?: string | null;
}

export interface BlockedUserState {
  blockedList: BlockedUser[];
  isLoading: boolean;
  errorMsg: string | null;
}

export interface BlockedUserActions {
  fetchBlockedList: () => Promise<void>;
  unblockUser: (blockedId: string) => Promise<boolean>;
  clearError: () => void;
}
