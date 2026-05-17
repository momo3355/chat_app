import { Animated } from 'react-native';

export type CustomHeaderProps = {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  indicatorAnim: Animated.Value;
};

export type MainStackParamList = {
  Main: undefined;
  ChatScreen: { userId: string; userName: string; roomId: string; roomName: string; token: string };
};
