import React, { useCallback, useState, type FC } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StatusBar, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect, useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { feedStyles as styles } from '../styles/Feed.styles';
import useFeedStore from '../services/store/FeedStore';
import useLoginStore from '../services/store/LoginStore';
import useFCMStore from '../services/store/FCMStore';
import useAppState from '../hooks/useAppState';
import FeedItem from '../components/FeedItem';
import ProfileModal from '../components/ProfileModal';
import { chatRoomCreate } from '../services/api/ChatApi';
import { FeedItem as FeedItemType } from '../types/FeedTypes';
import { UserSearchItem } from '../types/UserInfoTypes';
import { MainStackParamList } from '../types/MainTypes';

type FeedScreenProps = { isActive?: boolean };

const FeedScreen: FC<FeedScreenProps> = React.memo(({ isActive }) => {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList, 'Main'>>();
  const user = useLoginStore(state => state.user);
  const { token } = useFCMStore();
  const isFocused = useIsFocused();
  const { feedList, isLoading, fetchFeed, loadMore, likeFeed } = useFeedStore();
  const [selectedUser, setSelectedUser] = useState<UserSearchItem | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (isActive && user?.userId) {
        fetchFeed(user.userId);
      }
    }, [isActive, user?.userId, fetchFeed]),
  );

  useAppState(
    useCallback(() => {
      if (isActive && user?.userId && isFocused) {
        fetchFeed(user.userId);
      }
    }, [isActive, user?.userId, fetchFeed, isFocused]),
  );

  const handleLoadMore = useCallback(() => {
    if (user?.userId) loadMore(user.userId);
  }, [user?.userId, loadMore]);

  const handleLike = useCallback((feedId: string) => {
    if (user?.userId) likeFeed(feedId, user.userId);
  }, [user?.userId, likeFeed]);

  const handleUserPress = useCallback((item: FeedItemType) => {
    if (!user || item.userId === user.userId) return;
    setSelectedUser({
      userId: item.userId,
      userName: item.userName,
      gender: item.gender,
      age: item.age,
      area: null,
      sido: item.sido,
      dong: null,
      distance: null,
    });
  }, [user]);

  const handleCreateRoom = useCallback(() => {
    if (!selectedUser || !user) return;
    Alert.alert(
      '채팅방 만들기',
      '채팅방을 만드시겠습니까?',
      [
        { text: '아니오', style: 'cancel' },
        {
          text: '예',
          onPress: async () => {
            const { roomId } = await chatRoomCreate({
              userId: user.userId,
              userName: user.userName ?? '',
              otherUserId: selectedUser.userId,
              roomName: selectedUser.userName,
            });
            setSelectedUser(null);
            navigation.navigate('ChatScreen', {
              userId: user.userId,
              userName: user.userName ?? '',
              roomId,
              roomName: selectedUser.userName,
              token: token ?? '',
            });
          },
        },
      ],
    );
  }, [selectedUser, user, token, navigation]);

  const renderItem = useCallback(({ item }: { item: FeedItemType }) => (
    <FeedItem item={item} onLike={handleLike} onUserPress={handleUserPress} />
  ), [handleLike, handleUserPress]);

  const renderFooter = useCallback(() =>
    isLoading ? <ActivityIndicator color="#7c3aed" style={{ padding: 16 }} /> : null,
  [isLoading]);

  const renderEmpty = useCallback(() =>
    isLoading ? null : (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>아직 게시글이 없습니다</Text>
      </View>
    ),
  [isLoading]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>소식</Text>
      </View>

      <FlatList
        data={feedList}
        keyExtractor={item => item.feedId}
        renderItem={renderItem}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        style={styles.list}
        contentContainerStyle={feedList.length === 0 ? { flex: 1 } : styles.listContent}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('FeedWriteScreen' as keyof MainStackParamList)}
        activeOpacity={0.8}
      >
        <Icon name="add" size={28} color="#fff" />
      </TouchableOpacity>

      <ProfileModal
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
        onCreateRoom={handleCreateRoom}
      />
    </SafeAreaView>
  );
});

FeedScreen.displayName = 'FeedScreen';
export default FeedScreen;
