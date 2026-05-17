import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import ChatRoomScreen from '../screens/ChatRoomScreen';
import ChatScreen from '../screens/ChatScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { styles } from '../styles/MainNavigator.styles';
import { MainStackParamList } from '../types/MainTypes.ts';

const Stack = createNativeStackNavigator<MainStackParamList>();

const menuList = [
  { key: 'Home',    iconName: 'search',    label: '친구찾기' },
  { key: 'Room',    iconName: 'chat',      label: '대화방' },
  { key: 'Chat',    iconName: 'favorite',  label: '매칭' },
  { key: 'Setting', iconName: 'settings',  label: '설정' },
];

type BottomTabBarProps = {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
};

const BottomTabBar = ({ selectedTab, setSelectedTab }: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.tabContainer, { paddingTop: insets.top }]}>
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
          <Icon name={tab.iconName} size={20} color={selectedTab === tab.key ? '#fff' : '#999'} />
          <Text style={[styles.tabText, selectedTab === tab.key && styles.tabTextActive]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const MainScreen = () => {
  const [selectedTab, setSelectedTab] = useState('Home');

  return (
    <View style={{ flex: 1 }}>
      <BottomTabBar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <View style={[{ flex: 1 }, selectedTab !== 'Home' && { display: 'none' }]}>
        <HomeScreen isActive={selectedTab === 'Home'} />
      </View>
      <View style={[{ flex: 1 }, selectedTab !== 'Room' && { display: 'none' }]}>
        <ChatRoomScreen isActive={selectedTab === 'Room'} />
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
    </Stack.Navigator>
  );
};

export default MainAppNavigator;
