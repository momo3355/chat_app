import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { feedItemStyles as styles } from '../styles/FeedItem.styles';
import { FeedItem as FeedItemType } from '../types/FeedTypes';
import { getProfileUrl, getFeedImageUrl, getFeedThumbnailUrl, formatRelativeTime } from '../utils/Utils';
import FeedDetailModal from './FeedDetailModal';

interface Props {
  item: FeedItemType;
  currentUserId: string;
  currentUserProfileTs?: number;
  onLike: (feedId: number) => void;
  onView: (feedId: number, userId: string) => void;
  onUserPress: (item: FeedItemType) => void;
  onChat?: (item: FeedItemType) => void;
  onEdit?: (item: FeedItemType) => void;
  onDelete?: (feedId: number) => void;
}

const FeedItem: React.FC<Props> = React.memo(({ item, currentUserId, currentUserProfileTs, onLike, onView, onUserPress, onChat, onEdit, onDelete }) => {
  const [avatarFailed, setAvatarFailed] = useState(false);
  const [thumbnailFailed, setThumbnailFailed] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  const accentColor = item.gender === 'W' ? '#db2777' : '#3DBFA8';

  const handleLike = useCallback(() => onLike(item.feedId), [item.feedId, onLike]);
  const handleUserPress = useCallback(() => onUserPress(item), [item, onUserPress]);
  const handleView = useCallback(() => onView(item.feedId, item.userId), [item.feedId, item.userId, onView]);

  const metaText = [
    item.age != null ? `${item.age}세` : null,
    item.sido ?? null,
  ].filter(Boolean).join(' · ');

  return (
    <View style={[styles.card, { borderColor: `${accentColor}40` }]}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={handleUserPress} activeOpacity={0.7}>
          <View style={styles.avatar}>
            {!avatarFailed ? (
              <Image
                source={{ uri: getProfileUrl(item.userId, item.userId === currentUserId ? currentUserProfileTs : undefined) }}
                style={styles.avatarImage}
                onError={() => setAvatarFailed(true)}
              />
            ) : (
              <Icon name="person" size={22} color={accentColor} />
            )}
          </View>
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <TouchableOpacity onPress={handleUserPress} activeOpacity={0.7}>
            <View style={styles.nameRow}>
              <Text style={[styles.userName, { color: accentColor }]}>
                {item.userName}
              </Text>
              {metaText ? <Text style={styles.metaText}>{metaText}</Text> : null}
            </View>
            <Text style={styles.timeText}>{formatRelativeTime(item.createdAt)}</Text>
          </TouchableOpacity>
          {!!item.content && (
            <TouchableOpacity onPress={() => setShowDetail(true)} activeOpacity={0.7}>
              <Text style={styles.content} numberOfLines={1} ellipsizeMode="tail">
                {item.content}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {item.images.length > 0 && (
          <TouchableOpacity
            style={styles.imageThumbnailWrap}
            onPress={() => setShowDetail(true)}
            activeOpacity={0.85}
          >
            <Image
              source={{
                uri: thumbnailFailed
                  ? getFeedImageUrl(item.images[0])
                  : getFeedThumbnailUrl(item.images[0]),
              }}
              style={styles.imageThumbnail}
              resizeMode="cover"
              onError={() => setThumbnailFailed(true)}
            />
            <View style={[styles.imageCountBadge, { backgroundColor: `${accentColor}AA` }]}>
              <Icon name="photo-library" size={12} color="#fff" />
              <Text style={styles.imageCountText}>{item.images.length}</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.footer}>
        <View style={styles.statsRow}>
          <View style={styles.viewBtn}>
            <Icon name="visibility" size={16} color="#bbb" />
            <Text style={styles.viewCount}>{item.viewCount ?? 0}</Text>
          </View>
          <TouchableOpacity style={styles.likeBtn} onPress={handleLike} activeOpacity={0.7}>
            <Icon
              name={item.isLiked ? 'favorite' : 'favorite-border'}
              size={20}
              color={item.isLiked ? accentColor : '#ccc'}
            />
            <Text style={styles.likeCount}>{item.likeCount ?? 0}</Text>
          </TouchableOpacity>
        </View>
        {item.userId === currentUserId ? (
          <View style={styles.ownBtns}>
            <TouchableOpacity
              style={[styles.editBtn, { borderColor: accentColor }]}
              onPress={() => onEdit?.(item)}
              activeOpacity={0.8}
            >
              <Text style={[styles.editBtnText, { color: accentColor }]}>수정하기</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => onDelete?.(item.feedId)}
              activeOpacity={0.8}
            >
              <Text style={styles.deleteBtnText}>삭제하기</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.chatBtn, { backgroundColor: accentColor }]}
            onPress={() => onChat?.(item)}
            activeOpacity={0.8}
          >
            <Text style={styles.chatBtnText}>채팅하기</Text>
          </TouchableOpacity>
        )}
      </View>

      <FeedDetailModal
        visible={showDetail}
        item={item}
        onClose={() => setShowDetail(false)}
        accentColor={accentColor}
        onLike={handleLike}
        onView={handleView}
      />
    </View>
  );
});

FeedItem.displayName = 'FeedItem';
export default FeedItem;
