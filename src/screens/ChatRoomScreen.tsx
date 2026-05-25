import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useFocusEffect, useNavigation, useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import useChatStore from '../services/store/ChatStore';
import useLoginStore from '../services/store/LoginStore.tsx';
import useFCMStore from '../services/store/FCMStore';
import { styles } from '../styles/ChatRoomList.styles';
import { ChatRoomPostsValue } from '../types/ChatRoomTypes';
import { MainStackParamList } from '../types/MainTypes.ts';
import { formatTime, parseLocalDate, getProfileUrl } from '../utils/Utils';
import useAppState from '../hooks/useAppState';

type NavigationProp = NativeStackNavigationProp<MainStackParamList, 'Main'>;

const RoomIcon = ({ userId, name }: { userId?: string; name?: string }) => {
  const [imgError, setImgError] = useState(false);
  const profileUrl = getProfileUrl(userId);

  if (!imgError && profileUrl) {
    return (
      <Image
        source={{ uri: profileUrl }}
        style={styles.roomIconImage}
        onError={() => setImgError(true)}
      />
    );
  }
  return (
    <View style={styles.roomIcon}>
      <Text style={styles.roomIconText}>
        {(name ?? '?').charAt(0).toUpperCase()}
      </Text>
    </View>
  );
};

const ChatRoomScreen = React.memo(({ isActive }: { isActive?: boolean }) => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useLoginStore();
  const { token } = useFCMStore();
  const { roomList, isLoading, errorMsg, fetchRoomList, resetUnreadCount, leaveFromList, toggleFavorite } = useChatStore();
  const isFocused = useIsFocused();

  useFocusEffect(useCallback(() => {
    if (isActive && user?.userId) {
      fetchRoomList({ userId: user.userId });
    }
  }, [isActive, user?.userId, fetchRoomList]));

  useAppState(useCallback(() => {
    if (isActive && user?.userId && isFocused) {
      fetchRoomList({ userId: user.userId });
    }
  }, [isActive, user?.userId, fetchRoomList, isFocused]));

  const formatDate = (dateString?: string) => {
    if (!dateString || typeof dateString !== 'string') return '';

    const date = parseLocalDate(dateString);
    if (isNaN(date.getTime())) { return ''; }
    const today = new Date();

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const isToday = date.toDateString() === today.toDateString();
    const isThisYear = year === today.getFullYear();

    if (isToday) {
      return formatTime(dateString);
    } else if (isThisYear) {
      return `${month}월 ${day}일`;
    } else {
      return `${year}년 ${month}월 ${day}일`;
    }
  };

  const handleLike = useCallback((roomId: string) => {
    if (user?.userId) toggleFavorite(user.userId, roomId);
  }, [user?.userId, toggleFavorite]);

  const handleLeave = useCallback((roomId: string, roomName: string) => {
    Alert.alert('대화방 나가기', `'${roomName}' 대화방을 나가시겠습니까?`, [
      { text: '취소', style: 'cancel' },
      {
        text: '나가기',
        style: 'destructive',
        onPress: async () => {
          await leaveFromList(user?.userId ?? '', roomId, user?.userName ?? '');
        },
      },
    ]);
  }, [leaveFromList, user?.userId, user?.userName]);

  const renderRoomItem = ({ item }: { item: ChatRoomPostsValue }) => (
    <TouchableOpacity
      style={styles.roomItem}
      activeOpacity={0.7}
      onPress={() => {
        resetUnreadCount(item.roomId ?? '');
        navigation.navigate('ChatScreen', {
          userId: user?.userId ?? '',
          userName: user?.userName ?? '',
          roomId: item.roomId ?? '',
          roomName: item.roomName ?? '',
          token: token ?? '',
          otherUserId: item.otherUserId ?? '',
        });
      }}
    >
      <RoomIcon userId={item.otherUserId} name={item.roomName} />
      <View style={styles.roomInfo}>
        <View style={styles.roomHeader}>
          <View style={styles.roomNameRow}>
            <Text style={[styles.roomName, { color: item.gender === 'W' ? '#db2777' : '#3DBFA8' }]} numberOfLines={1}>
              {item.roomName ?? '이름 없음'}
            </Text>
            {(item.unreadCount ?? 0) > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>
                  {(item.unreadCount ?? 0) > 99 ? '99+' : item.unreadCount}
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.roomDate}>{formatDate(item.lastMessageTime)}</Text>
        </View>
        <View style={styles.messageRow}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastType === 'IMAGE' ? '이미지를 보냈습니다.' : (item.lastMessage ?? '메시지가 없습니다')}
          </Text>
          <View style={styles.roomActions}>
            <TouchableOpacity
              onPress={() => handleLike(item.roomId ?? '')}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
              <Icon
                name={item.favoriteYn === 'Y' ? 'favorite' : 'favorite-border'}
                size={20}
                color={item.favoriteYn === 'Y' ? '#e11d48' : '#ccc'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleLeave(item.roomId ?? '', item.roomName ?? '')}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
              <Icon name="delete" size={20} color="#ccc" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7c3aed" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}

      {roomList.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>채팅방이 없습니다</Text>
        </View>
      ) : (
        <FlatList
          data={roomList}
          keyExtractor={(item, index) => item.roomId ?? `room-${index}`}
          renderItem={renderRoomItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
});

ChatRoomScreen.displayName = 'ChatRoomScreen';

export default ChatRoomScreen;
