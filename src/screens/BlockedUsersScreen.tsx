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
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import useBlockedUserStore from '../services/store/BlockedUserStore';
import { BlockedUser } from '../types/BlockedUserTypes';
import { styles, Colors } from '../styles/BlockedUsers.styles';
import { getProfileUrl } from '../utils/Utils';

const UserAvatar = ({ userId, name }: { userId: string; name: string }) => {
  const [imgError, setImgError] = useState(false);
  const profileUrl = getProfileUrl(userId);

  if (!imgError && profileUrl) {
    return (
      <Image
        source={{ uri: profileUrl }}
        style={styles.avatarImage}
        onError={() => setImgError(true)}
      />
    );
  }
  return (
    <View style={styles.avatar}>
      <Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text>
    </View>
  );
};

const BlockedUsersScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { blockedList, isLoading, errorMsg, fetchBlockedList, unblockUser, clearError } =
    useBlockedUserStore();

  useFocusEffect(
    useCallback(() => {
      fetchBlockedList();
      return () => clearError();
    }, [fetchBlockedList, clearError]),
  );

  const handleUnblock = useCallback(
    (user: BlockedUser) => {
      Alert.alert(
        '차단 해제',
        `'${user.blockedName}' 님의 차단을 해제하시겠습니까?`,
        [
          { text: '취소', style: 'cancel' },
          {
            text: '해제',
            onPress: () => unblockUser(user.blockedId),
          },
        ],
      );
    },
    [unblockUser],
  );

  const renderItem = ({ item }: { item: BlockedUser }) => (
    <View style={styles.userItem}>
      <UserAvatar userId={item.blockedId} name={item.blockedName} />
      <Text
        style={[
          styles.userName,
          { color: item.gender === 'W' ? '#db2777' : '#3DBFA8' },
        ]}
        numberOfLines={1}
      >
        {item.blockedName}
      </Text>
      <TouchableOpacity
        style={styles.unblockButton}
        onPress={() => handleUnblock(item)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        activeOpacity={0.7}
      >
        <Icon name="lock-open" size={22} color={Colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Icon name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>차단한 회원</Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <>
          {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
          {blockedList.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>차단한 회원이 없습니다</Text>
            </View>
          ) : (
            <FlatList
              data={blockedList}
              keyExtractor={item => item.blockedId}
              renderItem={renderItem}
              contentContainerStyle={styles.listContainer}
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
};

const BlockedUsersScreenMemo = React.memo(BlockedUsersScreen);
BlockedUsersScreenMemo.displayName = 'BlockedUsersScreen';
export default BlockedUsersScreenMemo;
