
export interface MessgeInfoValue {
  id? : number;
  message : string;
  sender? : string;
  isRead? : string;
  cretDate? : string;
  userList? : string[];
  type? : string;
  imageInfo? : string;
  reUserId? : string;
}

// 검색 파라미터 타입 정의 (확장)
export interface SearchMessgeInfoParams {
  id:number;
  roomId? : string;
  sender? : string;
  imageFiles?: {
    uri: string;
    type: string;
    name: string;
    size: string;
  }[];
}

// 검색 파라미터 타입 정의
export interface MessgeInfoResponse {
  success: boolean;
  chatMessageLoadCount : number;
  messageInfoList: MessgeInfoValue[];  
  errorMsg?: string;
}