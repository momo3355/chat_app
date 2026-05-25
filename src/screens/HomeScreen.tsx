import React, { useState, useEffect, useCallback, useRef, type FC } from 'react';
import {
  View, Text, TouchableOpacity,
  FlatList, StatusBar, Alert, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { homeStyles as styles } from '../styles/Home.styles';
import { filterBarStyles as filterStyles } from '../styles/FilterBar.styles';
import useLoginStore from '../services/store/LoginStore';
import useFCMStore from '../services/store/FCMStore';
import { chatRoomCreate } from '../services/api/ChatApi';
import { MainStackParamList } from '../types/MainTypes';
import { UserSearchItem } from '../types/UserInfoTypes';
import { useUserSearch } from '../hooks/useUserSearch';
import { useHomeFilter } from '../hooks/useHomeFilter';
import { useDistanceSlider } from '../hooks/useDistanceSlider';
import UserListItem from '../components/UserListItem';
import ProfileModal from '../components/ProfileModal';
import SearchFilterBar, { SearchFilterBarHandle } from '../components/SearchFilterBar';

const HOME_AGES = Array.from({ length: 42 }, (_, i) => i + 19); // 19~60

type HomeScreenProps = { isActive?: boolean };

const HomeScreen: FC<HomeScreenProps> = React.memo(({ isActive }) => {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList, 'Main'>>();
  const user = useLoginStore(state => state.user);
  const { token } = useFCMStore();

  const {
    filterArea, filterGender, filterAgeFrom, filterAgeTo, filterDistance,
    activeFilter, setActiveFilter,
    distanceLabel,
    confirmDistanceFilter, resetDistance,
    setFilterArea, setFilterGender, setFilterAge,
    isInitialized,
  } = useHomeFilter();

  const { sliderTempValue, hasInteracted, distanceSliderPR, thumbLeft, fillWidth, onLayout, confirmDistance } =
    useDistanceSlider(filterDistance, confirmDistanceFilter);

  const { userList, isLoading, fetchUsers, loadMore, refreshKey } = useUserSearch(isActive);

  const [selectedUser, setSelectedUser] = useState<UserSearchItem | null>(null);
  const filterBarRef = useRef<SearchFilterBarHandle>(null);

  useEffect(() => {
    if (!isInitialized) return;
    fetchUsers(filterArea, filterGender, filterAgeFrom, filterAgeTo, filterDistance, 0, true);
  }, [filterArea, filterGender, filterAgeFrom, filterAgeTo, filterDistance, fetchUsers, refreshKey, isInitialized]);

  const handleLoadMore = useCallback(() => {
    loadMore(filterArea, filterGender, filterAgeFrom, filterAgeTo, filterDistance);
  }, [loadMore, filterArea, filterGender, filterAgeFrom, filterAgeTo, filterDistance]);

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
      ]
    );
  }, [selectedUser, user, token, navigation]);

  const renderUserItem = useCallback(({ item }: { item: UserSearchItem }) => (
    <TouchableOpacity onPress={() => setSelectedUser(item)} activeOpacity={0.7}>
      <UserListItem item={item} />
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

  const distanceActive = filterDistance !== null || activeFilter === 'distance';

  const distancePill = (
    <TouchableOpacity
      style={[filterStyles.filterPill, distanceActive && filterStyles.filterPillActive]}
      onPress={() => {
        if (activeFilter !== 'distance') filterBarRef.current?.close();
        setActiveFilter(prev => prev === 'distance' ? null : 'distance');
      }}
    >
      <Text style={[filterStyles.filterText, distanceActive && filterStyles.filterTextActive]}>
        {distanceLabel}
      </Text>
    </TouchableOpacity>
  );

  const distanceDropdown = activeFilter === 'distance' ? (
    <View style={filterStyles.dropdownOverlay}>
      <View style={styles.sliderHeader}>
        <Text style={styles.sliderValueText}>
          {filterDistance === null && !hasInteracted ? '전체' : `최대 ${sliderTempValue}km`}
        </Text>
        <TouchableOpacity onPress={resetDistance}>
          <Text style={[styles.sliderResetBtn, filterDistance === null && styles.sliderResetBtnActive]}>
            전체
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={styles.sliderTrackWrapper}
        onLayout={e => onLayout(e.nativeEvent.layout.width)}
        {...distanceSliderPR.panHandlers}
      >
        <View pointerEvents="none" style={styles.sliderTrackBg} />
        <View pointerEvents="none" style={[styles.sliderTrackFill, { width: fillWidth }]} />
        <View pointerEvents="none" style={[styles.sliderThumb, { left: thumbLeft }]} />
      </View>
      <View style={styles.sliderRangeRow}>
        <Text style={styles.sliderRangeText}>1km</Text>
        <Text style={styles.sliderRangeText}>80km</Text>
      </View>
      <TouchableOpacity style={styles.distanceConfirmBtn} onPress={confirmDistance}>
        <Text style={styles.distanceConfirmBtnText}>확인</Text>
      </TouchableOpacity>
    </View>
  ) : null;

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <SearchFilterBar
        ref={filterBarRef}
        filterArea={filterArea}
        filterGender={filterGender}
        filterAgeFrom={filterAgeFrom}
        filterAgeTo={filterAgeTo}
        onAreaChange={setFilterArea}
        onGenderChange={setFilterGender}
        onAgeChange={(from, to) => setFilterAge(from, to)}
        ages={HOME_AGES}
        suffixSlot={distancePill}
        extraDropdown={distanceDropdown}
        onAnyOpen={() => setActiveFilter(null)}
      >
        <FlatList
          data={userList}
          keyExtractor={item => item.userId}
          renderItem={renderUserItem}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          style={styles.userList}
          contentContainerStyle={userList.length === 0 ? { flex: 1 } : styles.userListContent}
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

HomeScreen.displayName = 'HomeScreen';

export default HomeScreen;
