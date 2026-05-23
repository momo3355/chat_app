// types/LoginTypes.ts

export interface LoginFormData {
  userId: string;
  password: string;
}

export interface LoginScreenProps {
  navigation: any;
}

export interface InputFieldProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}


export interface User {
  userId: string;
  userName?: string;
  gender?: string | null;  // 'M' | 'W'
  age?: number | null;
  area?: number | null;     // 1=서울 ~ 17=제주
  greetings?: string | null;
  profileTs?: number;
}


export interface AuthResponse {
  success: boolean;
  user?: User;
  errorMsg?: string;
}

// 서버 실제 응답 형식
export interface ServerAuthResponse {
  message: string;
  status: string; // "success" | "error"
  user?: {
    userId: string;
    userName?: string;
    gender?: string;
    age?: number;
    area?: number;
    greetings?: string | null;
  };
  token?: string;
}

// LoginStore 상태 타입
export interface LoginState {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  errorMsg: string | null;
}

// LoginStore 액션 타입
export interface LoginActions {
  login: (formData: LoginFormData) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  updateUser: (partial: Partial<User>) => void;
}


export interface TokenUpdateRequest {
  userId: string;
  token: string;
}

// 🔥 토큰 업데이트 응답 타입
export interface TokenUpdateResponse {
  success: boolean;
  message?: string;
}

