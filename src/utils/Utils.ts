export const matchRegionFromSido = (sido: string): number | null => {
  for (let i = 0; i < REGIONS.length; i++) {
    if (sido.includes(REGIONS[i])) { return i + 1; }
  }
  // "전북특별자치도"는 "전라북도"를 포함하지 않으므로 별도 처리
  if (sido.includes('전북')) { return REGIONS.indexOf('전라북도') + 1; }
  return null;
};

// 공통 상수
export const REGIONS = [
  '서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종',
  '경기', '강원', '충청북도', '충청남도', '전라북도', '전라남도',
  '경상북도', '경상남도', '제주',
];

export const REGION_ITEMS = [
  { id: 0, label: '전체' },
  ...REGIONS.map((r, i) => ({ id: i + 1, label: r })),
];

export const GENDER_ITEMS: { value: string | null; label: string }[] = [
  { value: null, label: '전체' },
  { value: 'M', label: '남' },
  { value: 'W', label: '여' },
];

export const AGES = Array.from({ length: 81 }, (_, i) => i + 19);

const SERVER_BASE_URL = 'http://132.226.225.178:8888';
const WEBSOCKET_URL = `${SERVER_BASE_URL}/ws-stomp`;

// 안전한 URL 반환 함수
export const getWebSocketUrl = () => {
  return WEBSOCKET_URL;
};

export const getProfileUrl = (sender?: string): string => {
  if (!sender) { return ''; }
  return `${SERVER_BASE_URL}/uploads/profile/${sender}/${sender}_thumbnail.jpg`;
};

export const getThumbnailUrl = (imageInfo?: string, userId?: string): string => {
  if (!imageInfo) { return ''; }
  // imageInfo에 이미 userId가 포함된 경우 (userId/filename) 그대로 사용
  // 아닌 경우 userId를 앞에 붙임
  const path = imageInfo.includes('/') ? imageInfo : `${userId}/${imageInfo}`;
  const lastDot = path.lastIndexOf('.');
  if (lastDot === -1) {
    return `${SERVER_BASE_URL}/uploads/${path}_thumbnail`;
  }
  const baseName = path.substring(0, lastDot);
  const ext = path.substring(lastDot);
  return `${SERVER_BASE_URL}/uploads/${baseName}_thumbnail${ext}`;
};

export const getDateKey = (dateStr?: string): string => {
  if (!dateStr) { return ''; }
  return dateStr.substring(0, 10); // "YYYY-MM-DD"
};

export const getDateLabel = (dateStr?: string): string => {
  if (!dateStr) { return ''; }
  const date = new Date(dateStr.replace(' ', 'T'));
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayOfWeek = days[date.getDay()];
  return `${year}년 ${month}월 ${day}일 ${dayOfWeek}요일`;
};

export const buildImageFiles = (uris: string[]) =>
  uris.map(uri => {
    const lastSegment = uri.split('/').pop() || 'image';
    const name = /^\d+$/.test(lastSegment)
      ? `image_${lastSegment}.jpg`
      : lastSegment.includes('.') ? lastSegment : `${lastSegment}.jpg`;
    const ext = name.split('.').pop()?.toLowerCase() || 'jpg';
    const type = ext === 'png' ? 'image/png' : ext === 'gif' ? 'image/gif' : 'image/jpeg';
    return { uri, type, name, size: '0' };
  });

// Hermes 엔진은 new Date(string) 파싱이 불안정하므로 컴포넌트를 직접 분리해서 생성
// "2026-05-08 17:37:28.0", "2026-05-08T17:37:28+09:00" 등 다양한 형식 지원
export const parseLocalDate = (dateStr: string): Date => {
  const m = dateStr.match(/(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2}):(\d{2})/);
  if (!m) { return new Date(NaN); }
  const [, y, mo, d, h, mi, s] = m.map(Number);
  return new Date(y, mo - 1, d, h, mi, s);
};

export const formatTime = (dateStr?: string): string => {
  if (!dateStr || typeof dateStr !== 'string') {return '';}
  const date = parseLocalDate(dateStr);
  if (isNaN(date.getTime())) {return '';}
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours < 12 ? '오전' : '오후';
  const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  return `${period} ${displayHour}:${String(minutes).padStart(2, '0')}`;
};
