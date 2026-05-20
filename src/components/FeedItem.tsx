import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { feedItemStyles as styles } from '../styles/FeedItem.styles';
import { FeedItem as FeedItemType } from '../types/FeedTypes';
import { getProfileUrl, formatRelativeTime } from '../utils/Utils';

interface Props {
  item: FeedItemType;
  onLike: (feedId: number) => void;
  onUserPress: (item: FeedItemType) => void;
}

const FeedItem: React.FC<Props> = React.memo(({ item, onLike, onUserPress }) => {
  const [avatarFailed, setAvatarFailed] = useState(false);

  const handleLike = useCallback(() => onLike(item.feedId), [item.feedId, onLike]);
  const handleUserPress = useCallback(() => onUserPress(item), [item, onUserPress]);

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.header} onPress={handleUserPress} activeOpacity={0.7}>
        <View style={styles.avatar}>
          {!avatarFailed ? (
            <Image
              source={{ uri: getProfileUrl(item.userId) }}
              style={styles.avatarImage}
              onError={() => setAvatarFailed(true)}
            />
          ) : (
            <Icon name="person" size={22} color="#7c3aed" />
          )}
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.userName}>{item.userName}</Text>
          <Text style={styles.timeText}>{formatRelativeTime(item.createdAt)}</Text>
        </View>
      </TouchableOpacity>

      {!!item.content && <Text style={styles.content}>{item.content}</Text>}

      {item.images.length > 0 && (
        <View style={styles.imageGrid}>
          {item.images.map((url, index) => (
            <Image
              key={index}
              source={{ uri: url }}
              style={item.images.length === 1 ? styles.imageSingle : styles.imageMulti}
              resizeMode="cover"
            />
          ))}
        </View>
      )}

      <View style={styles.footer}>
        <TouchableOpacity style={styles.likeBtn} onPress={handleLike} activeOpacity={0.7}>
          <Icon
            name={item.isLiked ? 'favorite' : 'favorite-border'}
            size={20}
            color={item.isLiked ? '#e53e3e' : '#999'}
          />
          <Text style={styles.likeCount}>{item.likeCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.chatBtn} onPress={handleUserPress} activeOpacity={0.8}>
          <Text style={styles.chatBtnText}>채팅하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

FeedItem.displayName = 'FeedItem';
export default FeedItem;
