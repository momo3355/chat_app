import 'fast-text-encoding';
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import MainAppNavigator from './src/navigation/MainNavigator';
import LocationMapScreen from './src/screens/LocationMapScreen';
import LocationTermsScreen from './src/screens/LocationTermsScreen';
import LocationPickerScreen from './src/screens/LocationPickerScreen';
import useLoginStore from './src/services/store/LoginStore';
import FCMService from './src/services/FCMService';
import useChatStore from './src/services/store/ChatStore';
import useFCMStore from './src/services/store/FCMStore';
import { navigationRef } from './src/navigation/navigationRef';

const Stack = createNativeStackNavigator();

const navigateToChatFromNotification = (data: Record<string, string>) => {
  const { user } = useLoginStore.getState();
  const { token } = useFCMStore.getState();
  if (!user?.userId || !data.roomId) { return; }

  const roomList = useChatStore.getState().roomList;
  const room = roomList.find(r => r.roomId === data.roomId);
  const roomName = data.roomName ?? room?.roomName ?? data.roomId;

  navigationRef.navigate('Home', {
    screen: 'ChatScreen',
    params: {
      userId: user.userId,
      userName: user.userName ?? '',
      roomId: data.roomId,
      roomName,
      token: token ?? '',
    },
  });
};

const App = () => {
  const { isLoggedIn } = useLoginStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    FCMService.getToken();

    const unsubForeground = FCMService.onForegroundMessage(remoteMessage => {
      const data = remoteMessage.data ?? {};
      const roomId = data.roomId;
      if (roomId) {
        const { updateLastMessage, updateUnreadCount } = useChatStore.getState();
        const now = new Date().toISOString();
        updateLastMessage(roomId, data.message ?? '', now, data.type);
        updateUnreadCount(roomId, 1);
      }
    });

    // 백그라운드 상태에서 알림 클릭 시
    const unsubOpened = FCMService.onNotificationOpenedApp(remoteMessage => {
      if (remoteMessage?.data) {
        navigateToChatFromNotification(remoteMessage.data as Record<string, string>);
      }
    });

    return () => {
      unsubForeground();
      unsubOpened();
    };
  }, []);

  useEffect(() => {
    // AsyncStorage에서 데이터 불러오기 완료 대기
    const checkHydration = async () => {
      // persist가 데이터를 불러올 시간을 줌
      await new Promise<void>(resolve => setTimeout(() => resolve(), 10));
      setIsReady(true);
    };
    checkHydration();
  }, []);

  // 로딩 중일 때
  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const handleNavigationReady = () => {
    // 앱 완전 종료 상태에서 알림 클릭으로 실행된 경우
    FCMService.getInitialNotification().then(remoteMessage => {
      if (remoteMessage?.data) {
        navigateToChatFromNotification(remoteMessage.data as Record<string, string>);
      }
    });
  };

  return (
    <NavigationContainer ref={navigationRef} onReady={handleNavigationReady}>
      <Stack.Navigator
        initialRouteName={isLoggedIn ? 'Home' : 'Login'}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Home" component={MainAppNavigator} />
        <Stack.Screen name="LocationMapScreen" component={LocationMapScreen} />
        <Stack.Screen name="LocationTerms" component={LocationTermsScreen} />
        <Stack.Screen name="LocationPicker" component={LocationPickerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
