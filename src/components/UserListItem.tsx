import React, { useState } from 'react';
import { View, Text, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { homeStyles as styles } from '../styles/Home.styles';
import { getProfileUrl } from '../utils/Utils';
import { UserSearchItem } from '../types/UserInfoTypes';

const formatDistance = (km: number | null): string => {
  if (km == null) return '';
  if (km < 1) return `${Math.round(km * 1000)}m`;
  return `${km.toFixed(1)}km`;
};

const UserListItem = React.memo(({ item }: { item: UserSearchItem }) => {
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

UserListItem.displayName = 'UserListItem';

export default UserListItem;
