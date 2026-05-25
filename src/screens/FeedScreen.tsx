import React, { useCallback, useEffect, useRef, useState, type FC } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StatusBar, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { feedStyles as styles } from '../styles/Feed.styles';
import useFeedStore from '../services/store/FeedStore';
import useFeedFilterStore, { FeedOwner } from '../services/store/FeedFilterStore';
import useLoginStore from '../services/store/LoginStore';
import useFCMStore from '../services/store/FCMStore';
import FeedItem from '../components/FeedItem';
import ProfileModal from '../components/ProfileModal';
import SearchFilterBar from '../components/SearchFilterBar';
import { chatRoomCreate } from '../services/api/ChatApi';
import { FeedItem as FeedItemType } from '../types/FeedTypes';
import { UserSearchItem } from '../types/UserInfoTypes';
import { MainStackParamList } from '../types/MainTypes';

const FEED_AGES = Array.from({ length: 42 }, (_, i) => i + 19); // 19~60

type FeedScreenProps = { isActive?: boolean };

const FeedScreen: FC<FeedScreenProps> = React.memo(({ isActive }) => {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList, 'Main'>>();
  const user = useLoginStore(state => state.user);
  const { token } = useFCMStore();
  const { feedList, isLoading, fetchFeed, loadMore, likeFeed, incrementView, deleteFeed } = useFeedStore();
  const {
    _hasHydrated,
    owner, filterArea, filterGender, filterAgeFrom, filterAgeTo,
    setOwner, setFilterArea, setFilterGender, setFilterAge, resetFilters,
  } = useFeedFilterStore();
  const [selectedUser, setSelectedUser] = useState<UserSearchItem | null>(null);

  const lastFetchKey = useRef<string | null>(null);

  useEffect(() => {
    if (!isActive || !user?.userId || !_hasHydrated) return;
    const key = `${user.userId}|${user.area ?? ''}|${owner}|${filterArea}|${filterGender}|${filterAgeFrom}|${filterAgeTo}`;
    if (key === lastFetchKey.current) return;
    lastFetchKey.current = key;
    fetchFeed(user.userId, { owner, area: filterArea, gender: filterGender, ageFrom: filterAgeFrom, ageTo: filterAgeTo });
  }, [isActive, user?.userId, user?.area, _hasHydrated, owner, filterArea, filterGender, filterAgeFrom, filterAgeTo, fetchFeed]);

  const handleLoadMore = useCallback(() => {
    if (user?.userId) {
      loadMore(user.userId, { owner, area: filterArea, gender: filterGender, ageFrom: filterAgeFrom, ageTo: filterAgeTo });
    }
  }, [user?.userId, loadMore, owner, filterArea, filterGender, filterAgeFrom, filterAgeTo]);

  const handleSetOwner = useCallback((next: FeedOwner) => {
    if (next === 'MY') resetFilters();
    setOwner(next);
  }, [setOwner, resetFilters]);

  const handleLike = useCallback((feedId: number) => {
    if (user?.userId) likeFeed(feedId, user.userId);
  }, [user?.userId, likeFeed]);

  const handleView = useCallback((feedId: number, userId: string) => {
    if (userId === user?.userId) return;
    incrementView(feedId, userId);
  }, [incrementView, user?.userId]);

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

  const handleEdit = useCallback((item: FeedItemType) => {
    navigation.navigate('FeedWriteScreen', {
      editFeedId: item.feedId,
      initialContent: item.content,
      initialImages: item.images,
    });
  }, [navigation]);

  const handleDelete = useCallback((feedId: number) => {
    if (!user?.userId) return;
    Alert.alert('삭제', '게시글을 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => deleteFeed(feedId, user.userId),
      },
    ]);
  }, [user?.userId, deleteFeed]);

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
              otherUserId: selectedUser.userId,
            });
          },
        },
      ],
    );
  }, [selectedUser, user, token, navigation]);

  const handleChat = useCallback((feedItem: FeedItemType) => {
    if (!user) return;
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
              otherUserId: feedItem.userId,
              roomName: feedItem.userName,
            });
            navigation.navigate('ChatScreen', {
              userId: user.userId,
              userName: user.userName ?? '',
              roomId,
              roomName: feedItem.userName,
              token: token ?? '',
              otherUserId: feedItem.userId,
            });
          },
        },
      ],
    );
  }, [user, token, navigation]);

  const renderItem = useCallback(({ item }: { item: FeedItemType }) => (
    <FeedItem
      item={item}
      currentUserId={user?.userId ?? ''}
      currentUserProfileTs={user?.profileTs}
      onLike={handleLike}
      onView={handleView}
      onUserPress={handleUserPress}
      onChat={handleChat}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  ), [user?.userId, user?.profileTs, handleLike, handleView, handleUserPress, handleChat, handleEdit, handleDelete]);

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

  const ownerToggle = (
    <View style={styles.ownerToggle}>
      <TouchableOpacity
        style={[styles.ownerBtn, owner === 'ALL' && styles.ownerBtnActive]}
        onPress={() => handleSetOwner('ALL')}
      >
        <Text style={[styles.ownerBtnText, owner === 'ALL' && styles.ownerBtnTextActive]}>ALL</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.ownerBtn, styles.ownerBtnRight, owner === 'MY' && styles.ownerBtnActive]}
        onPress={() => handleSetOwner('MY')}
      >
        <Text style={[styles.ownerBtnText, owner === 'MY' && styles.ownerBtnTextActive]}>MY</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <SearchFilterBar
        filterArea={filterArea}
        filterGender={filterGender}
        filterAgeFrom={filterAgeFrom}
        filterAgeTo={filterAgeTo}
        onAreaChange={setFilterArea}
        onGenderChange={setFilterGender}
        onAgeChange={setFilterAge}
        prefixSlot={ownerToggle}
        ages={FEED_AGES}
      >
        <FlatList
          data={feedList}
          keyExtractor={item => String(item.feedId)}
          renderItem={renderItem}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          style={styles.list}
          contentContainerStyle={feedList.length === 0 ? { flex: 1 } : styles.listContent}
        />
      </SearchFilterBar>

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
