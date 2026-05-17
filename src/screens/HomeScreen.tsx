import React, { useEffect, useState, useCallback, useRef, type FC } from 'react';
import {
  View, Text, TouchableOpacity,
  Modal, FlatList, StatusBar, Image, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { homeStyles as styles } from '../styles/Home.styles';
import useLoginStore from '../services/store/LoginStore';
import useFCMStore from '../services/store/FCMStore';
import useSearchFilterStore from '../services/store/SearchFilterStore';
import { REGIONS, REGION_ITEMS, GENDER_ITEMS, AGES, getProfileUrl } from '../utils/Utils';

const formatDistance = (km: number | null): string => {
  if (km == null) return '';
  if (km < 1) return `${Math.round(km * 1000)}m`;
  return `${km.toFixed(1)}km`;
};
import { searchUsers } from '../services/UserInfoApi';
import { UserSearchItem } from '../types/UserInfoTypes';
import { chatRoomCreate } from '../services/api/ChatApi';
import { MainStackParamList } from '../types/MainTypes';

const AGE_ITEM_HEIGHT = 44;

type ActiveFilter = 'area' | 'gender' | 'age' | null;

const UserItem = React.memo(({ item }: { item: UserSearchItem }) => {
  const [imgFailed, setImgFailed] = useState(false);
  const profileUri = getProfileUrl(item.userId);
  const metaParts = [
    item.age ? `${item.age}세` : null,
    item.sido || null,
    item.distance != null ? formatDistance(item.distance) : null,
  ].filter(Boolean).join(' · ');

  return (
    <View style={styles.userItem}>
      <View style={styles.userAvatarContainer}>
        {!imgFailed ? (
          <Image
            source={{ uri: profileUri }}
            style={styles.userAvatarImage}
            onError={() => setImgFailed(true)}
          />
        ) : (
          <View style={styles.userAvatarDefault}>
            <Icon name="person" size={28} color="#7c3aed" />
          </View>
        )}
      </View>
      <View style={styles.userInfoContainer}>
        <Text style={styles.userName}>{item.userName}</Text>
        <Text style={styles.userMeta}>{metaParts}</Text>
      </View>
    </View>
  );
});

type HomeScreenProps = { isActive?: boolean };

const HomeScreen: FC<HomeScreenProps> = React.memo(({ isActive }) => {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList, 'Main'>>();
  const user = useLoginStore(state => state.user);
  const { token } = useFCMStore();

  const [activeFilter, setActiveFilter] = useState<ActiveFilter>(null);
  const {
    filterArea, filterGender, filterAgeFrom, filterAgeTo, savedUserId,
    setFilterArea, setFilterGender, setFilterAge, resetToUserDefaults,
  } = useSearchFilterStore();
  const [tempAgeFrom, setTempAgeFrom] = useState<number>(19);
  const [tempAgeTo, setTempAgeTo] = useState<number>(99);

  const [userList, setUserList] = useState<UserSearchItem[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const isLoadingRef = useRef(false);
  const [selectedUser, setSelectedUser] = useState<UserSearchItem | null>(null);
  const [modalImgFailed, setModalImgFailed] = useState(false);
  const [modalImgRatio, setModalImgRatio] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;
    if (user.userId !== savedUserId) {
      const opp = user.gender === 'M' ? 'W' : user.gender === 'W' ? 'M' : null;
      resetToUserDefaults(user.userId, user.area ?? null, opp);
    }
  }, [user, savedUserId, resetToUserDefaults]);

  useEffect(() => {
    setModalImgFailed(false);
    setModalImgRatio(null);
  }, [selectedUser?.userId]);

  const fetchUsers = useCallback(async (
    area: number | null, gender: string | null,
    ageFrom: number | null, ageTo: number | null,
    pageNum: number, reset: boolean
  ) => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    setIsLoading(true);
    try {
      const data = await searchUsers({ area, gender, ageFrom, ageTo, page: pageNum, size: 15 });
      setUserList(prev => reset ? data.content : [...prev, ...data.content]);
      setHasMore(data.hasMore);
      setPage(pageNum);
    } catch (err) {
      console.error('검색 오류', err);
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, []);

  const [refreshKey, setRefreshKey] = useState(0);

  // ChatScreen 등 Stack 화면에서 돌아올 때
  useFocusEffect(
    useCallback(() => {
      setRefreshKey(k => k + 1);
    }, [])
  );

  // 탭 전환으로 이 화면이 다시 활성화될 때 (false → true)
  const prevIsActiveRef = useRef<boolean | undefined>(undefined);
  useEffect(() => {
    if (prevIsActiveRef.current === false && isActive === true) {
      setRefreshKey(k => k + 1);
    }
    prevIsActiveRef.current = isActive;
  }, [isActive]);

  useEffect(() => {
    fetchUsers(filterArea, filterGender, filterAgeFrom, filterAgeTo, 0, true);
  }, [filterArea, filterGender, filterAgeFrom, filterAgeTo, fetchUsers, refreshKey]);

  const loadMore = useCallback(() => {
    if (!hasMore || isLoadingRef.current) return;
    fetchUsers(filterArea, filterGender, filterAgeFrom, filterAgeTo, page + 1, false);
  }, [hasMore, page, filterArea, filterGender, filterAgeFrom, filterAgeTo, fetchUsers]);

  const toggleFilter = useCallback((filter: 'area' | 'gender') => {
    setActiveFilter(prev => prev === filter ? null : filter);
  }, []);

  const openAgeModal = useCallback(() => {
    setTempAgeFrom(filterAgeFrom ?? 19);
    setTempAgeTo(filterAgeTo ?? 99);
    setActiveFilter('age');
  }, [filterAgeFrom, filterAgeTo]);

  const confirmAge = useCallback(() => {
    const from = Math.min(tempAgeFrom, tempAgeTo);
    const to = Math.max(tempAgeFrom, tempAgeTo);
    const isDefault = from === 19 && to === 99;
    setFilterAge(isDefault ? null : from, isDefault ? null : to);
    setActiveFilter(null);
  }, [tempAgeFrom, tempAgeTo, setFilterAge]);

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
      ]
    );
  }, [selectedUser, user, token, navigation]);

  const areaLabel = filterArea ? REGIONS[filterArea - 1] : '지역';
  const genderLabel = filterGender === 'M' ? '남' : filterGender === 'W' ? '여' : '성별';
  const ageLabel = filterAgeFrom !== null ? `${filterAgeFrom}~${filterAgeTo ?? 99}세` : '나이';

  const fromIndex = Math.max(0, AGES.indexOf(tempAgeFrom));
  const toIndex = Math.max(0, AGES.indexOf(tempAgeTo));

  const renderUserItem = useCallback(({ item }: { item: UserSearchItem }) => (
    <TouchableOpacity onPress={() => setSelectedUser(item)} activeOpacity={0.7}>
      <UserItem item={item} />
    </TouchableOpacity>
  ), []);

  const renderFooter = useCallback(() => {
    if (!isLoading) return null;
    return <ActivityIndicator color="#7c3aed" style={{ padding: 16 }} />;
  }, [isLoading]);

  const renderEmpty = useCallback(() => {
    if (isLoading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>검색 결과가 없습니다</Text>
      </View>
    );
  }, [isLoading]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* 필터 바 */}
      <View style={styles.filterBar}>
        <TouchableOpacity
          style={[styles.filterPill, filterArea !== null && styles.filterPillActive]}
          onPress={() => toggleFilter('area')}
        >
          <Text style={[styles.filterText, filterArea !== null && styles.filterTextActive]}>{areaLabel}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterPill, filterGender !== null && styles.filterPillActive]}
          onPress={() => toggleFilter('gender')}
        >
          <Text style={[styles.filterText, filterGender !== null && styles.filterTextActive]}>{genderLabel}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterPill, filterAgeFrom !== null && styles.filterPillActive]}
          onPress={openAgeModal}
        >
          <Text style={[styles.filterText, filterAgeFrom !== null && styles.filterTextActive]}>{ageLabel}</Text>
        </TouchableOpacity>
      </View>

      {/* 지역 인라인 드롭다운 */}
      {activeFilter === 'area' && (
        <View style={styles.inlineDropdown}>
          <View style={styles.regionGrid}>
            {REGION_ITEMS.map(item => {
              const isSelected = filterArea === (item.id === 0 ? null : item.id);
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.regionItem, isSelected && styles.regionItemSelected]}
                  onPress={() => { setFilterArea(item.id === 0 ? null : item.id); setActiveFilter(null); }}
                >
                  <Text style={[styles.regionItemText, isSelected && styles.regionItemTextSelected]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* 성별 인라인 드롭다운 */}
      {activeFilter === 'gender' && (
        <View style={[styles.inlineDropdown, styles.genderRow]}>
          {GENDER_ITEMS.map(item => {
            const isSelected = filterGender === item.value;
            return (
              <TouchableOpacity
                key={item.label}
                style={[styles.genderItem, isSelected && styles.genderItemSelected]}
                onPress={() => { setFilterGender(item.value); setActiveFilter(null); }}
              >
                <Text style={[styles.genderItemText, isSelected && styles.genderItemTextSelected]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* 유저 목록 */}
      <FlatList
        data={userList}
        keyExtractor={item => item.userId}
        renderItem={renderUserItem}
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        style={styles.userList}
        contentContainerStyle={userList.length === 0 ? { flex: 1 } : styles.userListContent}
      />

      {/* 나이 범위 모달 */}
      <Modal
        visible={activeFilter === 'age'}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveFilter(null)}
      >
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setActiveFilter(null)}>
          <TouchableOpacity style={styles.ageModalBox} activeOpacity={1}>
            <Text style={styles.modalTitle}>나이 선택</Text>
            <View style={styles.agePickerRow}>
              <FlatList
                data={AGES}
                keyExtractor={item => `from-${item}`}
                style={styles.agePicker}
                showsVerticalScrollIndicator={false}
                getItemLayout={(_, index) => ({ length: AGE_ITEM_HEIGHT, offset: AGE_ITEM_HEIGHT * index, index })}
                initialScrollIndex={fromIndex}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.ageItem, tempAgeFrom === item && styles.ageItemSelected]}
                    onPress={() => setTempAgeFrom(item)}
                  >
                    <Text style={[styles.ageItemText, tempAgeFrom === item && styles.ageItemTextSelected]}>
                      {item}세
                    </Text>
                  </TouchableOpacity>
                )}
              />
              <Text style={styles.ageSeparator}>~</Text>
              <FlatList
                data={AGES}
                keyExtractor={item => `to-${item}`}
                style={styles.agePicker}
                showsVerticalScrollIndicator={false}
                getItemLayout={(_, index) => ({ length: AGE_ITEM_HEIGHT, offset: AGE_ITEM_HEIGHT * index, index })}
                initialScrollIndex={toIndex}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.ageItem, tempAgeTo === item && styles.ageItemSelected]}
                    onPress={() => setTempAgeTo(item)}
                  >
                    <Text style={[styles.ageItemText, tempAgeTo === item && styles.ageItemTextSelected]}>
                      {item}세
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
            <TouchableOpacity style={styles.confirmBtn} onPress={confirmAge}>
              <Text style={styles.confirmBtnText}>확인</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
      {/* 프로필 팝업 */}
      <Modal
        visible={selectedUser !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedUser(null)}
      >
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setSelectedUser(null)}>
          <TouchableOpacity style={styles.profileModalBox} activeOpacity={1}>
            <View style={styles.profileImageSection}>
              {!modalImgFailed && selectedUser ? (
                <Image
                  source={{ uri: getProfileUrl(selectedUser.userId) }}
                  style={[
                    styles.profileModalImage,
                    modalImgRatio ? { aspectRatio: modalImgRatio } : { height: 240 },
                  ]}
                  onLoad={e => {
                    const { width, height } = e.nativeEvent.source;
                    if (width && height) setModalImgRatio(width / height);
                  }}
                  onError={() => setModalImgFailed(true)}
                />
              ) : (
                <View style={styles.profileModalDefault}>
                  <Icon name="person" size={64} color="#7c3aed" />
                </View>
              )}
            </View>
            {selectedUser && (
              <>
                <View style={styles.profileInfoSection}>
                  <View style={styles.profileInfoRow}>
                    <Text style={styles.profileInfoLabel}>이름</Text>
                    <Text style={styles.profileInfoValue}>{selectedUser.userName}</Text>
                  </View>
                  <View style={styles.profileInfoRow}>
                    <Text style={styles.profileInfoLabel}>나이</Text>
                    <Text style={styles.profileInfoValue}>{selectedUser.age}세</Text>
                  </View>
                  <View style={styles.profileInfoRow}>
                    <Text style={styles.profileInfoLabel}>지역</Text>
                    <Text style={styles.profileInfoValue}>{selectedUser.sido ?? '-'}</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.createRoomBtn} onPress={handleCreateRoom}>
                  <Text style={styles.createRoomBtnText}>채팅방 만들기</Text>
                </TouchableOpacity>
              </>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
});

HomeScreen.displayName = 'HomeScreen';

export default HomeScreen;
