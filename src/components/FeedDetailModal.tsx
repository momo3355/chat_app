import React, { useState, useRef, useEffect } from 'react';
import {
  Modal, View, Text, TouchableOpacity, Image,
  FlatList, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { FeedItem as FeedItemType } from '../types/FeedTypes';
import { getFeedImageUrl, getProfileUrl, formatRelativeTime } from '../utils/Utils';
import { feedDetailStyles as styles } from '../styles/FeedDetailModal.styles';

interface Props {
  visible: boolean;
  item: FeedItemType;
  onClose: () => void;
  accentColor: string;
  onLike?: () => void;
  onView?: () => void;
}

const FeedDetailModal: React.FC<Props> = ({ visible, item, onClose, accentColor, onLike, onView }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [avatarFailed, setAvatarFailed] = useState(false);

  useEffect(() => {
    if (visible && onView) {
      onView();
    }
  }, [visible]);

  const metaText = [
    item.age != null ? `${item.age}세` : null,
    item.sido ?? null,
  ].filter(Boolean).join(' · ');

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index ?? 0);
    }
  }).current;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>

        {/* 성별 색상 바 - 맨 위 */}
        <View style={[styles.genderBar, { backgroundColor: accentColor }]} />

        {/* 헤더 */}
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
            <Icon name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>게시글</Text>
          <View style={styles.headerRight} />
        </View>

        {/* 스크롤 영역: 내용 + 이미지 */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {!!item.content && (
            <Text style={styles.contentText}>{item.content}</Text>
          )}

          {item.images.length > 0 && (
            <>
              <View style={styles.divider} />
              <View style={styles.galleryWrap}>
                <FlatList
                  data={item.images}
                  keyExtractor={(_, i) => String(i)}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  onViewableItemsChanged={onViewableItemsChanged}
                  viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
                  renderItem={({ item: url }) => (
                    <Image
                      source={{ uri: getFeedImageUrl(url) }}
                      style={styles.galleryImage}
                      resizeMode="cover"
                    />
                  )}
                />
                {item.images.length > 1 && (
                  <View style={[styles.galleryIndicator, { backgroundColor: `${accentColor}AA` }]}>
                    <Icon name="photo-library" size={13} color="#fff" />
                    <Text style={styles.galleryIndicatorText}>
                      {currentIndex + 1} / {item.images.length}
                    </Text>
                  </View>
                )}
              </View>
            </>
          )}
        </ScrollView>

        {/* 하단 고정: 프로필 | 조회수 | 좋아요 */}
        <View style={styles.footer}>
          <View style={styles.profileArea}>
            <View style={styles.profileAvatar}>
              {!avatarFailed ? (
                <Image
                  source={{ uri: getProfileUrl(item.userId) }}
                  style={styles.profileAvatarImage}
                  onError={() => setAvatarFailed(true)}
                />
              ) : (
                <Icon name="person" size={24} color={accentColor} />
              )}
            </View>
            <View style={styles.profileInfo}>
              <View style={styles.profileNameRow}>
                <Text style={[styles.profileName, { color: accentColor }]}>
                  {item.userName}
                </Text>
                {metaText ? <Text style={styles.profileMeta}>{metaText}</Text> : null}
              </View>
              <Text style={styles.timeText}>{formatRelativeTime(item.createdAt)}</Text>
            </View>
          </View>

          {/* 조회수 */}
          <View style={styles.viewBtn}>
            <Icon name="visibility" size={18} color="#bbb" />
            <Text style={styles.viewCount}>{item.viewCount ?? 0}</Text>
          </View>

          {/* 좋아요 */}
          <TouchableOpacity style={styles.likeBtn} onPress={onLike} activeOpacity={0.7}>
            <Icon
              name={item.isLiked ? 'favorite' : 'favorite-border'}
              size={22}
              color={item.isLiked ? accentColor : '#ccc'}
            />
            <Text style={styles.likeCount}>{item.likeCount ?? 0}</Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </Modal>
  );
};

export default FeedDetailModal;
