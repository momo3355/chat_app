import React, { useState, useEffect, useCallback, type FC } from 'react';
import {
  View, Text, TouchableOpacity,
  FlatList, StatusBar, Alert, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { homeStyles as styles } from '../styles/Home.styles';
import useLoginStore from '../services/store/LoginStore';
import useFCMStore from '../services/store/FCMStore';
import { REGION_ITEMS, GENDER_ITEMS } from '../utils/Utils';
import { chatRoomCreate } from '../services/api/ChatApi';
import { MainStackParamList } from '../types/MainTypes';
import { UserSearchItem } from '../types/UserInfoTypes';
import { useUserSearch } from '../hooks/useUserSearch';
import { useHomeFilter } from '../hooks/useHomeFilter';
import { useDistanceSlider } from '../hooks/useDistanceSlider';
import UserListItem from '../components/UserListItem';
import AgeRangeModal from '../components/AgeRangeModal';
import ProfileModal from '../components/ProfileModal';

type HomeScreenProps = { isActive?: boolean };

const HomeScreen: FC<HomeScreenProps> = React.memo(({ isActive }) => {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList, 'Main'>>();
  const user = useLoginStore(state => state.user);
  const { token } = useFCMStore();

  const {
    filterArea, filterGender, filterAgeFrom, filterAgeTo, filterDistance,
    activeFilter, setActiveFilter,
    tempAgeFrom, setTempAgeFrom, tempAgeTo, setTempAgeTo,
    areaLabel, genderLabel, ageLabel, distanceLabel,
    toggleFilter, openAgeModal, confirmAge,
    confirmDistanceFilter, resetDistance,
    setFilterArea, setFilterGender,
    isInitialized,
  } = useHomeFilter();

  const { sliderTempValue, distanceSliderPR, thumbLeft, fillWidth, onLayout, confirmDistance } =
    useDistanceSlider(filterDistance, confirmDistanceFilter);

  const { userList, isLoading, fetchUsers, loadMore, refreshKey } = useUserSearch(isActive);

  const [selectedUser, setSelectedUser] = useState<UserSearchItem | null>(null);

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
        <TouchableOpacity
          style={[styles.filterPill, filterDistance !== null && styles.filterPillActive]}
          onPress={() => setActiveFilter(prev => prev === 'distance' ? null : 'distance')}
        >
          <Text style={[styles.filterText, filterDistance !== null && styles.filterTextActive]}>{distanceLabel}</Text>
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

      {/* 거리 슬라이더 드롭다운 */}
      {activeFilter === 'distance' && (
        <View style={styles.inlineDropdown}>
          <View style={styles.sliderHeader}>
            <Text style={styles.sliderValueText}>
              {filterDistance === null ? '전체' : `최대 ${sliderTempValue}km`}
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
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        style={styles.userList}
        contentContainerStyle={userList.length === 0 ? { flex: 1 } : styles.userListContent}
      />

      <AgeRangeModal
        visible={activeFilter === 'age'}
        tempAgeFrom={tempAgeFrom}
        tempAgeTo={tempAgeTo}
        setTempAgeFrom={setTempAgeFrom}
        setTempAgeTo={setTempAgeTo}
        onConfirm={confirmAge}
        onClose={() => setActiveFilter(null)}
      />

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
