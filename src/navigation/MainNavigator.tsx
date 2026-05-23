import React, { useState, useCallback } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import ChatRoomScreen from '../screens/ChatRoomScreen';
import FeedScreen from '../screens/FeedScreen';
import FeedWriteScreen from '../screens/FeedWriteScreen';
import ChatScreen from '../screens/ChatScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ProfileEditScreen from '../screens/ProfileEditScreen';
import TopHeader from '../components/TopHeader';

import { styles } from '../styles/MainNavigator.styles';
import { MainStackParamList } from '../types/MainTypes.ts';

const Stack = createNativeStackNavigator<MainStackParamList>();

const menuList = [
  { key: 'Home',    iconName: 'search',        label: '친구찾기' },
  { key: 'Room',    iconName: 'chat',          label: '대화방' },
  { key: 'Feed',    iconName: 'dynamic-feed',  label: '소식' },
  { key: 'Setting', iconName: 'settings',      label: '설정' },
];

type BottomTabBarProps = {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
};

const BottomTabBar = ({ selectedTab, setSelectedTab }: BottomTabBarProps) => {
  return (
    <View style={styles.tabContainer}>
      {menuList.map((tab, index) => (
        <TouchableOpacity
          key={tab.key}
          style={[
            styles.tab,
            selectedTab === tab.key && styles.tabActive,
            index !== menuList.length - 1 && styles.tabBorder,
          ]}
          onPress={() => setSelectedTab(tab.key)}
        >
          {selectedTab === tab.key ? (
            <LinearGradient
              colors={['#6d28d9', '#9333ea', '#c026d3']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.tabIconWrapper}
            >
              <Icon name={tab.iconName} size={22} color="#fff" />
            </LinearGradient>
          ) : (
            <View style={styles.tabIconWrapper}>
              <Icon name={tab.iconName} size={22} color="#888" />
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const writeBtnStyle = {
  paddingHorizontal: 10,
  alignSelf: 'stretch' as const,
  borderRadius: 20,
  backgroundColor: 'rgba(255,255,255,0.2)',
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
};

const MainScreen = () => {
  const [selectedTab, setSelectedTab] = useState('Home');
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList, 'Main'>>();

  const currentLabel = menuList.find(m => m.key === selectedTab)?.label ?? '';

  const handleWrite = useCallback(() => {
    navigation.navigate('FeedWriteScreen', {});
  }, [navigation]);

  const writeButton = selectedTab === 'Feed' ? (
    <TouchableOpacity style={writeBtnStyle} onPress={handleWrite} activeOpacity={0.7}>
      <Icon name="edit" size={18} color="#fff" />
    </TouchableOpacity>
  ) : null;

  return (
    <View style={{ flex: 1 }}>
      <TopHeader label={currentLabel} actionSlot={writeButton} />
      <BottomTabBar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <View style={[{ flex: 1 }, selectedTab !== 'Home' && { display: 'none' }]}>
        <HomeScreen isActive={selectedTab === 'Home'} />
      </View>
      <View style={[{ flex: 1 }, selectedTab !== 'Room' && { display: 'none' }]}>
        <ChatRoomScreen isActive={selectedTab === 'Room'} />
      </View>
      <View style={[{ flex: 1 }, selectedTab !== 'Feed' && { display: 'none' }]}>
        <FeedScreen isActive={selectedTab === 'Feed'} />
      </View>
      <View style={[{ flex: 1 }, selectedTab !== 'Setting' && { display: 'none' }]}>
        <SettingsScreen />
      </View>
    </View>
  );
};

const MainAppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Main"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Main" component={MainScreen} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      <Stack.Screen name="FeedWriteScreen" component={FeedWriteScreen} />
      <Stack.Screen name="ProfileEditScreen" component={ProfileEditScreen} />
    </Stack.Navigator>
  );
};

export default MainAppNavigator;
